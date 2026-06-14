import { useState } from 'react'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { VideoEmptyState } from './components/VideoEmptyState'
import { VideoList, MOCK_VIDEOS } from './components/VideoList'
import { VideoDetail } from './components/VideoDetail'
import { ChannelPage, type Tweet, MOCK_TWEETS } from './components/ChannelPage'
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



function App() {
  const [activeTab, setActiveTab] = useState('content')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [selectedChannel, setSelectedChannel] = useState<{ name: string; avatar: string } | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [userEmail, setUserEmail] = useState<string | null>('reactpatterns@gmail.com')
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  // Modals visibility state
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showEditChannelModal, setShowEditChannelModal] = useState(false)
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)

  // Stateful channel details of the owner
  const [channelDetails, setChannelDetails] = useState({
    name: 'React Patterns',
    handle: '@reactpatterns',
    avatar: 'https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    coverImage: 'https://images.pexels.com/photos/1092424/pexels-photo-1092424.jpeg?auto=compress',
    subscribers: '600k',
    subscribedCount: '220'
  })

  // Stateful personal information of the user
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: 'React',
    lastName: 'Patterns',
    email: 'patternsreact@gmail.com'
  })

  // Stateful videos list, initialized with owner's 10 mockup videos (published/unpublished status)
  // and other mock videos.
  const [videos, setVideos] = useState<Video[]>(() => {
    const initialVideos: Video[] = [
      {
        id: '1',
        title: 'JavaScript Fundamentals: Variables and Data Types',
        thumbnail: 'https://images.pexels.com/photos/3532545/pexels-photo-3532545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        duration: '20:45',
        views: '10.3k',
        uploadedAt: '44 minutes ago',
        avatar: 'https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        channelName: 'React Patterns',
        description: 'Learn the basics of JavaScript, including variables, data types, and how to use them in your programs.',
        published: true,
        likes: 921,
        dislikes: 49,
        dateUploaded: '22/09/2023'
      },
      {
        id: '2',
        title: 'React Hooks Explained: useState and useEffect',
        thumbnail: 'https://images.pexels.com/photos/3532552/pexels-photo-3532552.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        duration: '22:18',
        views: '11.0k',
        uploadedAt: '5 hours ago',
        avatar: 'https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        channelName: 'React Patterns',
        description: 'Learn the basics of building web applications with React Hooks useState and useEffect.',
        published: false,
        likes: 2520,
        dislikes: 279,
        dateUploaded: '21/09/2023'
      },
      {
        id: '3',
        title: 'Mastering Async Await in JavaScript',
        thumbnail: 'https://images.pexels.com/photos/3532549/pexels-photo-3532549.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        duration: '24:33',
        views: '14.5k',
        uploadedAt: '7 hours ago',
        avatar: 'https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        channelName: 'React Patterns',
        description: 'Learn how to master async/await flow in JavaScript programs.',
        published: false,
        likes: 943,
        dislikes: 244,
        dateUploaded: '20/09/2023'
      },
      {
        id: '4',
        title: 'Building a ToDo App with React and Context API',
        thumbnail: 'https://images.pexels.com/photos/2522659/pexels-photo-2522659.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        duration: '19:58',
        views: '10.9k',
        uploadedAt: '8 hours ago',
        avatar: 'https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        channelName: 'React Patterns',
        description: 'Learn how to build a stateful ToDo list app using React Context API.',
        published: false,
        likes: 760,
        dislikes: 302,
        dateUploaded: '19/09/2023'
      },
      {
        id: '5',
        title: 'Responsive Web Design with Tailwind CSS',
        thumbnail: 'https://images.pexels.com/photos/2519823/pexels-photo-2519823.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        duration: '16:37',
        views: '9.3k',
        uploadedAt: '9 hours ago',
        avatar: 'https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        channelName: 'React Patterns',
        description: 'Learn how to construct responsive landing pages with Tailwind CSS utility classes.',
        published: false,
        likes: 2630,
        dislikes: 317,
        dateUploaded: '18/09/2023'
      },
      {
        id: '6',
        title: 'Getting Started with Express.js',
        thumbnail: 'https://images.pexels.com/photos/2519812/pexels-photo-2519812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        duration: '32:18',
        views: '18.9M',
        uploadedAt: '12 hours ago',
        avatar: 'https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        channelName: 'React Patterns',
        description: 'Learn the basics of setting up RESTful Express.js route handlers.',
        published: true,
        likes: 137,
        dislikes: 107,
        dateUploaded: '17/09/2023'
      },
      {
        id: '7',
        title: 'State Management with Redux',
        thumbnail: 'https://images.pexels.com/photos/18264716/pexels-photo-18264716/free-photo-of-man-people-laptop-internet.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        duration: '29:30',
        views: '20.1k',
        uploadedAt: '14 hours ago',
        avatar: 'https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        channelName: 'React Patterns',
        description: 'Learn how to integrate Redux store slices and action creators.',
        published: false,
        likes: 1250,
        dislikes: 386,
        dateUploaded: '16/09/2023'
      },
      {
        id: '8',
        title: 'Building a RESTful API with Node.js and Express',
        thumbnail: 'https://images.pexels.com/photos/1739942/pexels-photo-1739942.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        duration: '26:58',
        views: '21.2k',
        uploadedAt: '15 hours ago',
        avatar: 'https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        channelName: 'React Patterns',
        description: 'Learn how to construct endpoints using Express routing controller handlers.',
        published: true,
        likes: 2773,
        dislikes: 50,
        dateUploaded: '15/09/2023'
      },
      {
        id: '9',
        title: 'Introduction to React Native',
        thumbnail: 'https://images.pexels.com/photos/1739856/pexels-photo-1739856.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        duration: '32:14',
        views: '24.5k',
        uploadedAt: '18 hours ago',
        avatar: 'https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        channelName: 'React Patterns',
        description: 'Learn how to create stunning visualizations.',
        published: true,
        likes: 1346,
        dislikes: 353,
        dateUploaded: '14/09/2023'
      },
      {
        id: '10',
        title: 'Creating Custom Hooks in React',
        thumbnail: 'https://images.pexels.com/photos/1144257/pexels-photo-1144257.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        duration: '27:37',
        views: '25.6k',
        uploadedAt: '19 hours ago',
        avatar: 'https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        channelName: 'React Patterns',
        description: 'Learn how to write custom React hook functions to decouple presentation state from logic.',
        published: true,
        likes: 1578,
        dislikes: 294,
        dateUploaded: '13/09/2023'
      }
    ]

    const nonOwnerVideos = MOCK_VIDEOS.filter(
      video => video.channelName.toLowerCase() !== 'react patterns'
    )

    return [...initialVideos, ...nonOwnerVideos]
  })

  // Stateful tweets list
  const [tweets, setTweets] = useState<Tweet[]>(() => {
    return MOCK_TWEETS
  })

  // Callback to add a new video
  const handleAddVideo = (videoData: Omit<Video, 'id' | 'views' | 'uploadedAt' | 'avatar' | 'channelName'>) => {
    const newVideo: Video = {
      ...videoData,
      id: String(Date.now()),
      views: '0',
      uploadedAt: 'Just now',
      avatar: channelDetails.avatar,
      channelName: channelDetails.name
    }
    setVideos(prev => [newVideo, ...prev])
    setShowUploadModal(false)
  }

  // Callback to add a new tweet
  const handleAddTweet = (content: string) => {
    const newTweet: Tweet = {
      id: String(Date.now()),
      channelName: channelDetails.name,
      uploadedAt: 'Just now',
      content,
      likes: 0,
      dislikes: 0
    }
    setTweets(prev => [newTweet, ...prev])
  }

  // Callback to update channel details
  const handleEditChannel = (updatedDetails: { name: string; handle: string; avatar: string; coverImage: string }) => {
    setChannelDetails(prev => ({
      ...prev,
      ...updatedDetails
    }))
    
    // Update existing videos avatar and channel name to match the edited channel details
    setVideos(prev => prev.map(video => {
      // If this video was created by the owner (matches the old name or is owner created)
      if (video.channelName.toLowerCase() === channelDetails.name.toLowerCase() || video.avatar === channelDetails.avatar) {
        return {
          ...video,
          channelName: updatedDetails.name,
          avatar: updatedDetails.avatar
        }
      }
      return video
    }))

    // Also update existing tweets channel name to match the edited channel details
    setTweets(prev => prev.map(tweet => {
      if (tweet.channelName.toLowerCase() === channelDetails.name.toLowerCase()) {
        return {
          ...tweet,
          channelName: updatedDetails.name
        }
      }
      return tweet
    }))

    setShowEditChannelModal(false)
  }

  // Callback to save personal info details
  const handleSavePersonalInfo = (updatedInfo: PersonalInfo) => {
    setPersonalInfo(updatedInfo)
    setUserEmail(updatedInfo.email)
  }

  // Dashboard state handlers
  const handleToggleVideoPublish = (id: string) => {
    setVideos(prev => prev.map(video => {
      if (video.id === id) {
        return {
          ...video,
          published: video.published === false ? true : false
        }
      }
      return video
    }))
  }

  const handleDeleteVideo = (id: string) => {
    setVideos(prev => prev.filter(video => video.id !== id))
  }

  const handleUpdateVideoDetails = (updatedVideo: Video) => {
    setVideos(prev => prev.map(video => {
      if (video.id === updatedVideo.id) {
        return updatedVideo
      }
      return video
    }))
    setEditingVideo(null)
  }

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
    setActiveTab(tabId === 'support' ? 'privacy' : tabId)
    setSelectedVideo(null) // Reset active video when navigating to other tabs
    setSelectedChannel(null) // Reset active channel when navigating to other tabs
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
        userEmail={userEmail}
        userChannel={channelDetails}
        onLoginClick={() => setShowLogin(true)}
        onSignupClick={() => setShowRegister(true)}
        onLogout={() => {
          setIsLoggedIn(false)
          setUserEmail(null)
          setActiveTab('home')
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
              />
            ) : (
              <ChannelPage 
                channelName={selectedChannel.name}
                channelAvatar={selectedChannel.avatar}
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
            <VideoList 
              searchQuery={searchQuery} 
              videos={videos}
              onSelectVideo={setSelectedVideo} 
              onSelectChannel={setSelectedChannel}
            />
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
          onLoginSuccess={(email) => {
            setIsLoggedIn(true)
            setUserEmail(email)
            setShowLogin(false)
          }}
        />
      )}

      {/* Register Overlay */}
      {showRegister && (
        <Register 
          onClose={() => setShowRegister(false)}
          onRegisterSuccess={(email) => {
            setIsLoggedIn(true)
            setUserEmail(email)
            setShowRegister(false)
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
