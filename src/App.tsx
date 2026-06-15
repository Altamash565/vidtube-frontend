import { useState, useEffect, useCallback } from 'react'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { VideoEmptyState } from './components/VideoEmptyState'
import { VideoList } from './components/VideoList'
import { VideoDetail } from './components/VideoDetail'
import { ChannelPage, type Tweet } from './components/ChannelPage'
import { Login } from './components/Login'
import { Register } from './components/Register'
import type { Video } from './components/VideoCard'
import { UploadModal } from './components/UploadModal'
import { EditChannelModal } from './components/EditChannelModal'
import { SettingsPage, type PersonalInfo } from './components/SettingsPage'
import { Dashboard } from './components/Dashboard'
import { EditVideoModal } from './components/EditVideoModal'
import { PrivacyPolicy } from './components/PrivacyPolicy'
import { TermsAndConditions } from './components/TermsAndConditions'
import { useAuth } from './context/AuthContext'
import videoService from './services/videoService'
import tweetService from './services/tweetService'
import dashboardService from './services/dashboardService'
import authService from './services/authService'
import likeService from './services/likeService'
import { mapApiVideoToVideo, mapApiTweetToTweet, formatCount } from './types'
import type { ApiVideo } from './types'


function App() {
  const { user, isLoggedIn, isLoading: authLoading, logout, refreshUser } = useAuth()

  const [activeTab, setActiveTab] = useState('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [selectedChannel, setSelectedChannel] = useState<{ name: string; avatar: string; username?: string } | null>(null)
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  // Modals visibility state
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showEditChannelModal, setShowEditChannelModal] = useState(false)
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)

  // Data state (fetched from API)
  const [videos, setVideos] = useState<Video[]>([])
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [isLoadingVideos, setIsLoadingVideos] = useState(false)

  // Channel details derived from user
  const channelDetails = {
    name: user?.fullname || 'Guest',
    handle: `@${user?.username || 'guest'}`,
    avatar: user?.avatar || '',
    coverImage: user?.coverImage || '',
    subscribers: '0',
    subscribedCount: '0'
  }

  const personalInfo: PersonalInfo = {
    firstName: user?.fullname?.split(' ')[0] || '',
    lastName: user?.fullname?.split(' ').slice(1).join(' ') || '',
    email: user?.email || ''
  }

  // ---- Fetch videos from API ----
  const fetchVideos = useCallback(async (query?: string) => {
    setIsLoadingVideos(true)
    try {
      const res = await videoService.getAllVideos({
        page: 1,
        limit: 50,
        query: query || undefined,
        sortBy: 'createdAt',
        sortType: 'desc',
      })
      const apiVideos: ApiVideo[] = res.data?.docs || (Array.isArray(res.data) ? res.data as unknown as ApiVideo[] : [])
      setVideos(apiVideos.map(mapApiVideoToVideo))
    } catch (err) {
      console.error('Failed to fetch videos:', err)
      setVideos([])
    } finally {
      setIsLoadingVideos(false)
    }
  }, [])

  // Fetch videos on mount and when search changes
  useEffect(() => {
    fetchVideos(searchQuery || undefined)
  }, [fetchVideos, searchQuery])

  // Fetch channel stats for channel details
  useEffect(() => {
    if (isLoggedIn && user) {
      dashboardService.getChannelStats()
        .then(res => {
          if (res.data) {
            channelDetails.subscribers = formatCount(res.data.totalSubscribers || 0)
          }
        })
        .catch(() => { /* ignore */ })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, user])

  // ---- Callbacks ----

  // Callback to add a new video (via upload modal)
  const handleAddVideo = async (videoData: Omit<Video, 'id' | 'views' | 'uploadedAt' | 'avatar' | 'channelName' | 'videoFile'> & { videoFile?: File; thumbnailFile?: File }) => {
    // If we have actual file data, upload to API
    if (videoData.videoFile && videoData.thumbnailFile) {
      try {
        const formData = new FormData()
        formData.append('videoFile', videoData.videoFile)
        formData.append('thumbnail', videoData.thumbnailFile)
        formData.append('title', videoData.title)
        formData.append('description', videoData.description || '')
        await videoService.publishVideo(formData)
        await fetchVideos() // Refresh video list
      } catch (err) {
        console.error('Upload failed:', err)
      }
    } else {
      // Fallback: refresh from API
      await fetchVideos()
    }
    setShowUploadModal(false)
  }

  // Callback to add a new tweet
  const handleAddTweet = async (content: string) => {
    try {
      await tweetService.createTweet(content)
      // Refresh tweets if viewing channel
      if (user?._id) {
        const res = await tweetService.getUserTweets(user._id)
        const apiTweets = Array.isArray(res.data) ? res.data : []
        setTweets(apiTweets.map(mapApiTweetToTweet))
      }
    } catch (err) {
      console.error('Failed to create tweet:', err)
    }
  }

  // Callback to update channel details
  const handleEditChannel = async (updatedDetails: { name: string; handle: string; avatar: string; coverImage: string }) => {
    try {
      // Update account details (fullname)
      await authService.updateAccountDetails(updatedDetails.name, user?.email || '')
      await refreshUser()
    } catch (err) {
      console.error('Failed to update channel:', err)
    }
    setShowEditChannelModal(false)
  }

  // Callback to save personal info details
  const handleSavePersonalInfo = async (updatedInfo: PersonalInfo) => {
    try {
      const fullname = `${updatedInfo.firstName} ${updatedInfo.lastName}`.trim()
      await authService.updateAccountDetails(fullname, updatedInfo.email)
      await refreshUser()
    } catch (err) {
      console.error('Failed to update personal info:', err)
    }
  }

  // Dashboard state handlers
  const handleToggleVideoPublish = async (id: string) => {
    try {
      await videoService.togglePublishStatus(id)
      await fetchVideos() // Refresh
    } catch (err) {
      console.error('Failed to toggle publish:', err)
    }
  }

  const handleDeleteVideo = async (id: string) => {
    try {
      await videoService.deleteVideo(id)
      setVideos(prev => prev.filter(video => video.id !== id))
    } catch (err) {
      console.error('Failed to delete video:', err)
    }
  }

  const handleUpdateVideoDetails = async (updatedVideo: Video) => {
    try {
      const formData = new FormData()
      formData.append('title', updatedVideo.title)
      formData.append('description', updatedVideo.description || '')
      await videoService.updateVideo(updatedVideo.id, formData)
      await fetchVideos() // Refresh
    } catch (err) {
      console.error('Failed to update video:', err)
    }
    setEditingVideo(null)
  }

  // Handle liked videos tab
  const handleFetchLikedVideos = useCallback(async () => {
    try {
      const res = await likeService.getLikedVideos()
      const likedData = Array.isArray(res.data) ? res.data : []
      const likedVids = likedData
        .map((item: unknown) => {
          const obj = item as { video?: ApiVideo }
          return obj.video ? mapApiVideoToVideo(obj.video) : null
        })
        .filter(Boolean) as Video[]
      setVideos(likedVids)
    } catch {
      setVideos([])
    }
  }, [])

  // Handle watch history tab
  const handleFetchHistory = useCallback(async () => {
    try {
      const res = await authService.getWatchHistory()
      const histData = Array.isArray(res.data) ? res.data : []
      const histVids = histData
        .map((item: unknown) => {
          try {
            return mapApiVideoToVideo(item as ApiVideo)
          } catch {
            return null
          }
        })
        .filter(Boolean) as Video[]
      setVideos(histVids)
    } catch {
      setVideos([])
    }
  }, [])

  // Dynamic titles and messages based on which sidebar option is active
  const emptyStates: Record<string, { title: string; message: string }> = {
    home: {
      title: 'No videos available',
      message: 'There are no videos here available. Please try to search some thing else.',
    },
    liked: {
      title: 'No liked videos',
      message: 'You haven\'t liked any videos yet. Start exploring and like some videos!',
    },
    history: {
      title: 'No history found',
      message: 'Videos you watch will appear here. Start watching!',
    },
    content: {
      title: 'No content uploaded',
      message: 'You have not uploaded any videos yet. Start creating and share your first video!',
    },
    collections: {
      title: 'No collections available',
      message: 'Create collections to group and organize your favorite videos.',
    },
    subscribers: {
      title: 'No subscribers',
      message: 'You don\'t have any subscribers yet. Keep creating great content to attract viewers!',
    },
  }

  const currentEmptyState = emptyStates[activeTab] || emptyStates.home

  const handleTabSelect = (tabId: string) => {
    const newTab = tabId === 'support' ? 'privacy' : tabId
    setActiveTab(newTab)
    setSelectedVideo(null)
    setSelectedChannel(null)

    // Fetch appropriate data based on tab
    if (newTab === 'home') {
      fetchVideos(searchQuery || undefined)
    } else if (newTab === 'liked' && isLoggedIn) {
      handleFetchLikedVideos()
    } else if (newTab === 'history' && isLoggedIn) {
      handleFetchHistory()
    }
  }

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#121212] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#ae7aff] border-t-transparent rounded-full animate-spin" />
          <span className="text-neutral-400 text-sm font-medium">Loading...</span>
        </div>
      </div>
    )
  }

  if (activeTab === 'privacy') {
    return (
      <PrivacyPolicy 
        onBackToHome={() => handleTabSelect('home')}
        onLoginClick={() => setShowLogin(true)}
        onSignupClick={() => setShowRegister(true)}
      />
    )
  }

  if (activeTab === 'terms') {
    return (
      <TermsAndConditions 
        onBackToHome={() => handleTabSelect('home')}
        onLoginClick={() => setShowLogin(true)}
        onSignupClick={() => setShowRegister(true)}
      />
    )
  }

  return (
    <div className="h-screen overflow-y-auto bg-[#121212] text-white flex flex-col font-sans select-none">
      <Header 
        onSearch={setSearchQuery} 
        isLoggedIn={isLoggedIn}
        userEmail={user?.email || null}
        userChannel={isLoggedIn ? {
          name: channelDetails.name,
          handle: channelDetails.handle,
          avatar: channelDetails.avatar
        } : null}
        onLoginClick={() => setShowLogin(true)}
        onSignupClick={() => setShowRegister(true)}
        onLogout={async () => {
          await logout()
          setActiveTab('home')
          fetchVideos()
        }}
        onMyChannelClick={() => handleTabSelect('content')}
        onSettingsClick={() => handleTabSelect('settings')}
        onDashboardClick={() => handleTabSelect('dashboard')}
        onPrivacyClick={() => handleTabSelect('privacy')}
        onTermsClick={() => handleTabSelect('terms')}
      />

      {/* Main Layout Area */}
      <div className="flex flex-1 min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)] relative">
        {/* Sidebar component */}
        <Sidebar activeId={(activeTab === 'privacy' || activeTab === 'terms') ? 'support' : activeTab} onSelect={handleTabSelect} />

        {/* Content area */}
        <main className="flex-grow flex flex-col bg-[#121212] overflow-hidden">
          {selectedChannel ? (
            selectedChannel.name.toLowerCase() === channelDetails.name.toLowerCase() ? (
              <ChannelPage 
                channelName={channelDetails.name}
                channelAvatar={channelDetails.avatar}
                channelCover={channelDetails.coverImage}
                channelHandle={channelDetails.handle}
                subscribers={channelDetails.subscribers}
                subscribedCount={channelDetails.subscribedCount}
                isOwner={true}
                videos={videos}
                tweets={tweets}
                onBack={() => setSelectedChannel(null)}
                onSelectVideo={setSelectedVideo}
                onSelectChannel={setSelectedChannel}
                onEditClick={() => setShowEditChannelModal(true)}
                onNewVideoClick={() => setShowUploadModal(true)}
                onAddTweet={handleAddTweet}
                userId={user?._id}
              />
            ) : (
              <ChannelPage 
                channelName={selectedChannel.name}
                channelAvatar={selectedChannel.avatar}
                channelUsername={selectedChannel.username}
                videos={videos}
                tweets={tweets}
                onBack={() => setSelectedChannel(null)}
                onSelectVideo={setSelectedVideo}
                onSelectChannel={setSelectedChannel}
              />
            )
          ) : selectedVideo ? (
            <VideoDetail 
              video={selectedVideo}
              allVideos={videos}
              onBack={() => setSelectedVideo(null)}
              onSelectVideo={setSelectedVideo}
              onSelectChannel={setSelectedChannel}
            />
          ) : activeTab === 'home' ? (
            isLoadingVideos ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-2 border-[#ae7aff] border-t-transparent rounded-full animate-spin" />
                  <span className="text-neutral-400 text-sm">Loading videos...</span>
                </div>
              </div>
            ) : (
              <VideoList 
                searchQuery={searchQuery} 
                videos={videos}
                onSelectVideo={setSelectedVideo} 
                onSelectChannel={setSelectedChannel}
              />
            )
          ) : activeTab === 'liked' ? (
            videos.length === 0 ? (
              <VideoEmptyState 
                title={currentEmptyState.title} 
                message={currentEmptyState.message} 
              />
            ) : (
              <VideoList 
                searchQuery="" 
                videos={videos}
                onSelectVideo={setSelectedVideo} 
                onSelectChannel={setSelectedChannel}
              />
            )
          ) : activeTab === 'history' ? (
            videos.length === 0 ? (
              <VideoEmptyState 
                title={emptyStates.history.title} 
                message={emptyStates.history.message} 
              />
            ) : (
              <VideoList 
                searchQuery="" 
                videos={videos}
                onSelectVideo={setSelectedVideo} 
                onSelectChannel={setSelectedChannel}
              />
            )
          ) : activeTab === 'content' ? (
            <ChannelPage 
              channelName={channelDetails.name}
              channelAvatar={channelDetails.avatar}
              channelCover={channelDetails.coverImage}
              channelHandle={channelDetails.handle}
              subscribers={channelDetails.subscribers}
              subscribedCount={channelDetails.subscribedCount}
              isOwner={true}
              videos={videos}
              tweets={tweets}
              onBack={() => handleTabSelect('home')}
              onSelectVideo={setSelectedVideo}
              onSelectChannel={setSelectedChannel}
              onEditClick={() => setShowEditChannelModal(true)}
              onNewVideoClick={() => setShowUploadModal(true)}
              onAddTweet={handleAddTweet}
              userId={user?._id}
            />
          ) : activeTab === 'settings' ? (
            <SettingsPage 
              personalInfo={personalInfo}
              channelDetails={channelDetails}
              onSavePersonalInfo={handleSavePersonalInfo}
              onSaveChannelDetails={handleEditChannel}
              onViewChannelClick={() => handleTabSelect('content')}
            />
          ) : activeTab === 'dashboard' ? (
            <Dashboard 
              channelDetails={channelDetails}
              videos={videos}
              onTogglePublish={handleToggleVideoPublish}
              onDeleteVideo={handleDeleteVideo}
              onEditVideo={setEditingVideo}
              onUploadClick={() => setShowUploadModal(true)}
            />
          ) : (
            <VideoEmptyState 
              title={currentEmptyState.title} 
              message={currentEmptyState.message} 
            />
          )}
        </main>
      </div>

      {/* Login Overlay */}
      {showLogin && (
        <Login 
          onClose={() => setShowLogin(false)}
          onLoginSuccess={() => {
            setShowLogin(false)
            fetchVideos()
          }}
        />
      )}

      {/* Register Overlay */}
      {showRegister && (
        <Register 
          onClose={() => setShowRegister(false)}
          onRegisterSuccess={() => {
            setShowRegister(false)
            fetchVideos()
          }}
        />
      )}

      {/* Upload Video Modal */}
      {showUploadModal && (
        <UploadModal 
          onClose={() => setShowUploadModal(false)}
          onUploadSuccess={handleAddVideo}
        />
      )}

      {/* Edit Channel Details Modal */}
      {showEditChannelModal && (
        <EditChannelModal 
          currentDetails={channelDetails}
          onClose={() => setShowEditChannelModal(false)}
          onSave={handleEditChannel}
        />
      )}

      {/* Edit Video Metadata Modal */}
      {editingVideo && (
        <EditVideoModal 
          video={editingVideo}
          onClose={() => setEditingVideo(null)}
          onSave={handleUpdateVideoDetails}
        />
      )}
    </div>
  )
}

export default App
