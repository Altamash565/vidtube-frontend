import React, { useState } from 'react'
import { LayoutGrid, List } from 'lucide-react'
import { VideoCard, type Video } from './VideoCard'
import { VideoRow } from './VideoRow'
import { VideoEmptyState } from './VideoEmptyState'

export interface VideoListProps {
  searchQuery?: string
  onSelectVideo?: (video: Video) => void
  onSelectChannel?: (channel: { name: string; avatar: string }) => void
}

export const MOCK_VIDEOS: Video[] = [
  {
    id: '1',
    title: 'JavaScript Fundamentals: Variables and Data Types',
    thumbnail: 'https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    duration: '20:45',
    views: '10.3k',
    uploadedAt: '44 minutes ago',
    avatar: 'https://images.pexels.com/photos/3532545/pexels-photo-3532545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    channelName: 'Code Master',
    description: 'Learn the basics of JavaScript, including variables, data types, and how to use them in your programs.'
  },
  {
    id: '2',
    title: 'Getting Started with Express.js',
    thumbnail: 'https://images.pexels.com/photos/2519817/pexels-photo-2519817.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    duration: '22:18',
    views: '11.0k',
    uploadedAt: '5 hours ago',
    avatar: 'https://images.pexels.com/photos/2519812/pexels-photo-2519812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    channelName: 'Express Learner',
    description: 'Learn the basics of building web applications with Node.js and Express.js framework.'
  },
  {
    id: '3',
    title: 'Building a RESTful API with Node.js and Express',
    thumbnail: 'https://images.pexels.com/photos/1739849/pexels-photo-1739849.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    duration: '24:33',
    views: '14.5k',
    uploadedAt: '7 hours ago',
    avatar: 'https://images.pexels.com/photos/1739942/pexels-photo-1739942.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    channelName: 'API Builder',
    description: 'Learn how to create a RESTful API using Node.js and the Express framework for building web applications.'
  },
  {
    id: '4',
    title: 'Introduction to React Native',
    thumbnail: 'https://images.pexels.com/photos/1739854/pexels-photo-1739854.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    duration: '19:58',
    views: '10.9k',
    uploadedAt: '8 hours ago',
    avatar: 'https://images.pexels.com/photos/1739856/pexels-photo-1739856.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    channelName: 'React Native Dev',
    description: 'Discover how to build mobile applications using React Native for both Android and iOS platforms.'
  },
  {
    id: '5',
    title: 'Creating Custom Hooks in React',
    thumbnail: 'https://images.pexels.com/photos/1144256/pexels-photo-1144256.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    duration: '16:37',
    views: '9.3k',
    uploadedAt: '9 hours ago',
    avatar: 'https://images.pexels.com/photos/1144257/pexels-photo-1144257.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    channelName: 'Hook Master',
    description: 'Learn how to create and use custom hooks to share logic across multiple React components.'
  },
  {
    id: '6',
    title: 'Building Scalable Web Applications with Django',
    thumbnail: 'https://images.pexels.com/photos/1144260/pexels-photo-1144260.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    duration: '32:18',
    views: '18.9M',
    uploadedAt: '12 hours ago',
    avatar: 'https://images.pexels.com/photos/1144269/pexels-photo-1144269.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    channelName: 'Django Master',
    description: 'Learn how to build robust and scalable web applications using the Django framework for Python.'
  },
  {
    id: '7',
    title: 'Creating Interactive UIs with React and D3',
    thumbnail: 'https://images.pexels.com/photos/1144276/pexels-photo-1144276.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    duration: '29:30',
    views: '20.1k',
    uploadedAt: '14 hours ago',
    avatar: 'https://images.pexels.com/photos/1144277/pexels-photo-1144277.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    channelName: 'ReactD3',
    description: 'Learn how to build dynamic and interactive user interfaces with React and the D3.js data visualization library.'
  },
  {
    id: '8',
    title: 'Node.js Authentication with Passport.js',
    thumbnail: 'https://images.pexels.com/photos/1144274/pexels-photo-1144274.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    duration: '26:58',
    views: '21.2k',
    uploadedAt: '15 hours ago',
    avatar: 'https://images.pexels.com/photos/1144270/pexels-photo-1144270.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    channelName: 'Passport Pro',
    description: 'Learn how to implement user authentication in Node.js applications using the Passport.js middleware.'
  },
  {
    id: '9',
    title: 'Data Visualization with Tableau',
    thumbnail: 'https://images.pexels.com/photos/1144231/pexels-photo-1144231.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    duration: '32:14',
    views: '24.5k',
    uploadedAt: '18 hours ago',
    avatar: 'https://images.pexels.com/photos/18264716/pexels-photo-18264716/free-photo-of-man-people-laptop-internet.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    channelName: 'Tableau Master',
    description: 'Learn how to create stunning visualizations and dashboards using Tableau for data analysis.'
  },
  {
    id: '10',
    title: 'Building Real-Time Applications with Socket.IO',
    thumbnail: 'https://images.pexels.com/photos/1144250/pexels-photo-1144250.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    duration: '27:37',
    views: '25.6k',
    uploadedAt: '19 hours ago',
    avatar: 'https://images.pexels.com/photos/18264716/pexels-photo-18264716/free-photo-of-man-people-laptop-internet.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    channelName: 'Socket.IO Expert',
    description: 'Learn how to create real-time applications using Socket.IO for seamless communication between clients and servers.'
  },
  {
    id: '11',
    title: 'Advanced CSS: Animations and Transitions',
    thumbnail: 'https://images.pexels.com/photos/1115824/pexels-photo-1115824.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    duration: '31:55',
    views: '28.9k',
    uploadedAt: '22 hours ago',
    avatar: 'https://images.pexels.com/photos/18264716/pexels-photo-18264716/free-photo-of-man-people-laptop-internet.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    channelName: 'CSS Animations',
    description: 'Learn how to create captivating animations and transitions using CSS for dynamic web experiences.'
  },
  {
    id: '12',
    title: 'Advanced React Patterns',
    thumbnail: 'https://images.pexels.com/photos/1115808/pexels-photo-1115808.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    duration: '30:25',
    views: '30.1k',
    uploadedAt: '1 day ago',
    avatar: 'https://images.pexels.com/photos/18264716/pexels-photo-18264716/free-photo-of-man-people-laptop-internet.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    channelName: 'React Patterns',
    description: 'Explore advanced patterns and techniques for building scalable and maintainable React applications.'
  }
]

export const VideoList: React.FC<VideoListProps> = ({ searchQuery = '', onSelectVideo, onSelectChannel }) => {
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid')

  const filteredVideos = MOCK_VIDEOS.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.channelName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (filteredVideos.length === 0) {
    return (
      <VideoEmptyState 
        title="No results found" 
        message={`We couldn't find any videos matching "${searchQuery}". Try a different keyword.`} 
        icon={
          <svg xmlns="http://www.w3.org/2050/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"></path>
          </svg>
        }
      />
    )
  }

  return (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0 flex flex-col flex-1 overflow-hidden">
      {/* Layout Control Bar */}
      <div className="flex items-center justify-between border-b border-neutral-800 bg-[#121212] px-4 py-2 lg:px-6">
        <span className="text-sm font-medium text-neutral-400">
          {searchQuery ? `Search results for "${searchQuery}"` : 'All Videos'} ({filteredVideos.length})
        </span>

        {/* Layout Mode Toggles */}
        <div className="flex items-center gap-x-2">
          <button
            onClick={() => setLayoutMode('grid')}
            title="Grid View"
            className={`p-1.5 rounded border transition-colors ${
              layoutMode === 'grid' 
                ? 'border-[#ae7aff] text-[#ae7aff] bg-[#ae7aff]/10' 
                : 'border-neutral-700 text-neutral-400 hover:border-neutral-600 hover:text-white'
            }`}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setLayoutMode('list')}
            title="List View"
            className={`p-1.5 rounded border transition-colors ${
              layoutMode === 'list' 
                ? 'border-[#ae7aff] text-[#ae7aff] bg-[#ae7aff]/10' 
                : 'border-neutral-700 text-neutral-400 hover:border-neutral-600 hover:text-white'
            }`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Video Content Grid/List */}
      <div className="flex-1 overflow-y-auto bg-[#121212]">
        {layoutMode === 'grid' ? (
          <div className="grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-4 p-4 lg:p-6">
            {filteredVideos.map((video) => (
              <VideoCard 
                key={video.id} 
                video={video} 
                onClick={onSelectVideo}
                onSelectChannel={onSelectChannel}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4 p-4 lg:p-6 items-start">
            {filteredVideos.map((video) => (
              <VideoRow 
                key={video.id} 
                video={video} 
                onClick={onSelectVideo}
                onSelectChannel={onSelectChannel}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
export default VideoList
