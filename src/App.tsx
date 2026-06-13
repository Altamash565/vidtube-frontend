import { useState } from 'react'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { VideoEmptyState } from './components/VideoEmptyState'
import { VideoList, MOCK_VIDEOS } from './components/VideoList'
import { VideoDetail } from './components/VideoDetail'
import { ChannelPage } from './components/ChannelPage'
import { Login } from './components/Login'
import { Register } from './components/Register'
import type { Video } from './components/VideoCard'

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [selectedChannel, setSelectedChannel] = useState<{ name: string; avatar: string } | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

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
    setActiveTab(tabId)
    setSelectedVideo(null) // Reset active video when navigating to other tabs
    setSelectedChannel(null) // Reset active channel when navigating to other tabs
  }

  return (
    <div className="h-screen overflow-y-auto bg-[#121212] text-white flex flex-col font-sans select-none">
      {/* Header component */}
      <Header 
        onSearch={setSearchQuery} 
        isLoggedIn={isLoggedIn}
        userEmail={userEmail}
        onLoginClick={() => setShowLogin(true)}
        onSignupClick={() => setShowRegister(true)}
        onLogout={() => {
          setIsLoggedIn(false)
          setUserEmail(null)
        }}
      />

      {/* Main Layout Area */}
      <div className="flex flex-1 min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)] relative">
        {/* Sidebar component */}
        <Sidebar activeId={activeTab} onSelect={handleTabSelect} />

        {/* Content area */}
        <main className="flex-grow flex flex-col bg-[#121212] overflow-hidden">
          {selectedChannel ? (
            <ChannelPage 
              channelName={selectedChannel.name}
              channelAvatar={selectedChannel.avatar}
              onBack={() => setSelectedChannel(null)}
              onSelectVideo={setSelectedVideo}
              onSelectChannel={setSelectedChannel}
            />
          ) : selectedVideo ? (
            <VideoDetail 
              video={selectedVideo}
              allVideos={MOCK_VIDEOS}
              onBack={() => setSelectedVideo(null)}
              onSelectVideo={setSelectedVideo}
              onSelectChannel={setSelectedChannel}
            />
          ) : activeTab === 'home' ? (
            <VideoList 
              searchQuery={searchQuery} 
              onSelectVideo={setSelectedVideo} 
              onSelectChannel={setSelectedChannel}
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
    </div>
  )
}

export default App
