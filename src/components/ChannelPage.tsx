import React, { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { MOCK_VIDEOS } from './VideoList'
import { type Video } from './VideoCard'
import tweetService from '../services/tweetService'
import playlistService from '../services/playlistService'
import subscriptionService from '../services/subscriptionService'
import authService from '../services/authService'
import likeService from '../services/likeService'
import { mapApiTweetToTweet, mapApiVideoToVideo, formatCount } from '../types'
import type { ApiPlaylist } from '../types'

export interface ChannelPageProps {
  channelName: string
  channelAvatar: string
  channelCover?: string
  channelHandle?: string
  subscribers?: string
  subscribedCount?: string
  isOwner?: boolean
  videos?: Video[]
  tweets?: Tweet[]
  onBack: () => void
  onSelectVideo?: (video: Video) => void
  onSelectChannel?: (channel: { name: string; avatar: string; username?: string }) => void
  onEditClick?: () => void
  onNewVideoClick?: () => void
  onAddTweet?: (content: string) => void
  userId?: string
  channelUsername?: string
}

export interface Tweet {
  id: string
  channelName: string
  uploadedAt: string
  content: string
  likes: number
  dislikes: number
  ownerId?: string
  ownerAvatar?: string
  isLiked?: boolean
}

export const MOCK_TWEETS: Tweet[] = [
  // React Patterns
  {
    id: 'rp-1',
    channelName: 'React Patterns',
    uploadedAt: '5 hours ago',
    content: 'Exploring the latest features in JavaScript ES11! The language keeps evolving. 💡 #JavaScript #ES11',
    likes: 425,
    dislikes: 87
  },
  {
    id: 'rp-2',
    channelName: 'React Patterns',
    uploadedAt: '6 hours ago',
    content: 'Embracing the benefits of TypeScript for stronger, more reliable code. 🚀 #TypeScript #Programming',
    likes: 425,
    dislikes: 87
  },
  {
    id: 'rp-3',
    channelName: 'React Patterns',
    uploadedAt: '7 hours ago',
    content: 'Styling made easy with Tailwind CSS! Rapidly build beautiful, responsive interfaces. 🎨 #TailwindCSS #WebDev',
    likes: 425,
    dislikes: 87
  },
  {
    id: 'rp-4',
    channelName: 'React Patterns',
    uploadedAt: '8 hours ago',
    content: 'Building dynamic user interfaces with React! The go-to library for modern web development. 🚀 #React #WebDev',
    likes: 425,
    dislikes: 87
  },
  {
    id: 'rp-5',
    channelName: 'React Patterns',
    uploadedAt: '9 hours ago',
    content: 'Next.js makes server-side rendering a breeze! Boost your React app\'s performance with ease. 🚀 #Nextjs #React',
    likes: 425,
    dislikes: 87
  },
  {
    id: 'rp-6',
    channelName: 'React Patterns',
    uploadedAt: '10 hours ago',
    content: 'Dive into advanced JavaScript concepts like closures and prototypes. Level up your coding skills! 🔍 #AdvancedJS #CodingTips',
    likes: 425,
    dislikes: 87
  },
  // Code Master
  {
    id: 'cm-1',
    channelName: 'Code Master',
    uploadedAt: '3 hours ago',
    content: 'Mastering clean code in Javascript. Remember: write code for humans to read, not just machines! 💻 #CleanCode #JS',
    likes: 150,
    dislikes: 12
  },
  {
    id: 'cm-2',
    channelName: 'Code Master',
    uploadedAt: '1 day ago',
    content: 'Don\'t repeat yourself (DRY) is a golden rule, but sometimes a little duplication is better than the wrong abstraction! 🧠 #SoftwareDesign #Coding',
    likes: 240,
    dislikes: 18
  },
  // Django Master
  {
    id: 'dm-1',
    channelName: 'Django Master',
    uploadedAt: '2 hours ago',
    content: 'Django ORM optimization: always use select_related and prefetch_related to solve the N+1 query problem! ⚡ #Django #Python',
    likes: 98,
    dislikes: 4
  },
  {
    id: 'dm-2',
    channelName: 'Django Master',
    uploadedAt: '5 hours ago',
    content: 'Keep your Django views thin and your models fat. Better yet, move business logic to services! 🏗️ #Backend #Architecture',
    likes: 120,
    dislikes: 6
  },
  // Express Learner
  {
    id: 'el-1',
    channelName: 'Express Learner',
    uploadedAt: '4 hours ago',
    content: 'Designing clean RESTful APIs: always use plural nouns for resources (e.g. /api/v1/users) and proper HTTP status codes. 🌐 #API #Express',
    likes: 85,
    dislikes: 5
  },
  // API Builder
  {
    id: 'ab-1',
    channelName: 'API Builder',
    uploadedAt: '1 day ago',
    content: 'Rate limiting is crucial for API security. Don\'t let a simple script bring down your server! 🛡️ #ExpressJS #WebSecurity',
    likes: 110,
    dislikes: 8
  },
  // React Native Dev
  {
    id: 'rnd-1',
    channelName: 'React Native Dev',
    uploadedAt: '12 hours ago',
    content: 'Fast refresh in React Native is a superpower. Build once, deploy to both iOS and Android seamlessly! 📱 #ReactNative #MobileDev',
    likes: 95,
    dislikes: 7
  },
  // Hook Master
  {
    id: 'hm-1',
    channelName: 'Hook Master',
    uploadedAt: '8 hours ago',
    content: 'Custom hooks are the ultimate way to share stateful logic in React. Keep your components clean! 🪝 #ReactJS #Hooks',
    likes: 130,
    dislikes: 10
  },
  // ReactD3
  {
    id: 'rd3-1',
    channelName: 'ReactD3',
    uploadedAt: '16 hours ago',
    content: 'Data visualization is an art. Combining React\'s state management with D3\'s math is a developer\'s dream. 📊 #D3JS #ReactJS',
    likes: 75,
    dislikes: 3
  },
  // Passport Pro
  {
    id: 'pp-1',
    channelName: 'Passport Pro',
    uploadedAt: '10 hours ago',
    content: 'Never store plain text passwords! Always hash them with bcrypt or argon2 before saving. 🔒 #PassportJS #Security',
    likes: 145,
    dislikes: 9
  },
  // Tableau Master
  {
    id: 'tm-1',
    channelName: 'Tableau Master',
    uploadedAt: '1 day ago',
    content: 'Transforming raw numbers into visual stories. A good dashboard speaks louder than a million rows. 📈 #DataScience #Tableau',
    likes: 60,
    dislikes: 2
  },
  // Socket.IO Expert
  {
    id: 'sie-1',
    channelName: 'Socket.IO Expert',
    uploadedAt: '18 hours ago',
    content: 'Real-time web is the future. Socket.io makes websockets robust, offering auto-reconnections out of the box! 🔌 #SocketIO #Websockets',
    likes: 80,
    dislikes: 4
  },
  // CSS Animations
  {
    id: 'ca-1',
    channelName: 'CSS Animations',
    uploadedAt: '14 hours ago',
    content: 'Smooth 60fps animations: always animate \'transform\' and \'opacity\' to trigger GPU hardware acceleration! 🎨 #CSS #Animations',
    likes: 195,
    dislikes: 11
  }
]

export const TweetItem: React.FC<{ tweet: Tweet; channelAvatar: string }> = ({ tweet, channelAvatar }) => {
  const [isLiked, setIsLiked] = useState(tweet.isLiked ?? false)
  const [likesCount, setLikesCount] = useState(tweet.likes || 0)
  const [isDisliked, setIsDisliked] = useState(false)

  // Sync props change
  useEffect(() => {
    setIsLiked(tweet.isLiked ?? false)
    setLikesCount(tweet.likes || 0)
  }, [tweet.id, tweet.isLiked, tweet.likes])

  const handleLike = async () => {
    try {
      const res = await likeService.toggleTweetLike(tweet.id)
      const isLikedNow = (res.data as { isLiked?: boolean })?.isLiked ?? false
      setIsLiked(isLikedNow)
      setLikesCount(prev => Math.max(0, prev + (isLikedNow ? 1 : -1)))
      if (isDisliked) setIsDisliked(false)
    } catch (err) {
      console.error('Failed to toggle tweet like:', err)
      setIsLiked(!isLiked)
      setLikesCount(prev => prev + (isLiked ? -1 : 1))
    }
  }

  const handleDislike = () => {
    setIsDisliked(!isDisliked)
    if (isLiked) {
      setIsLiked(false)
      setLikesCount(prev => Math.max(0, prev - 1))
    }
  }

  return (
    <div className="flex gap-3 border-b border-neutral-800 py-4 last:border-b-transparent">
      <div className="h-14 w-14 shrink-0">
        <img 
          src={channelAvatar || 'https://images.pexels.com/photos/3532545/pexels-photo-3532545.jpeg?auto=compress'} 
          alt={tweet.channelName} 
          className="h-full w-full rounded-full object-cover"
        />
      </div>
      <div className="w-full text-left">
        <h4 className="mb-1 flex items-center gap-x-2">
          <span className="font-semibold text-white">{tweet.channelName}</span>
          <span className="inline-block text-sm text-neutral-400">{tweet.uploadedAt}</span>
        </h4>
        <p className="mb-2 text-neutral-200 text-sm whitespace-pre-line leading-relaxed">{tweet.content}</p>
        <div className="flex gap-4">
          <button 
            onClick={handleLike}
            className={`inline-flex items-center gap-x-1 outline-none text-sm font-medium transition-colors hover:text-[#ae7aff] cursor-pointer ${
              isLiked ? 'text-[#ae7aff]' : 'text-neutral-400'
            }`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill={isLiked ? 'currentColor' : 'none'} 
              viewBox="0 0 24 24" 
              strokeWidth="1.5" 
              stroke="currentColor" 
              className="h-5 w-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
            </svg>
            <span>{likesCount}</span>
          </button>
          <button 
            onClick={handleDislike}
            className={`inline-flex items-center gap-x-1 outline-none text-sm font-medium transition-colors hover:text-[#ae7aff] cursor-pointer ${
              isDisliked ? 'text-[#ae7aff]' : 'text-neutral-400'
            }`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill={isDisliked ? 'currentColor' : 'none'} 
              viewBox="0 0 24 24" 
              strokeWidth="1.5" 
              stroke="currentColor" 
              className="h-5 w-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384" />
            </svg>
            <span>{isDisliked ? 1 : 0}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export interface SubscribedChannel {
  id: string
  name: string
  avatar: string
  subscribers: string
  isSubscribed: boolean
}

export const INITIAL_SUBSCRIBED_CHANNELS: SubscribedChannel[] = [
  { id: 'sc-1', name: 'Code Master', avatar: 'https://images.pexels.com/photos/3532545/pexels-photo-3532545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', subscribers: '20K', isSubscribed: true },
  { id: 'sc-2', name: 'React Ninja', avatar: 'https://images.pexels.com/photos/3532552/pexels-photo-3532552.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', subscribers: '40K', isSubscribed: false },
  { id: 'sc-3', name: 'Async Masters', avatar: 'https://images.pexels.com/photos/3532549/pexels-photo-3532549.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', subscribers: '60K', isSubscribed: true },
  { id: 'sc-4', name: 'Code Crafters', avatar: 'https://images.pexels.com/photos/2522659/pexels-photo-2522659.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', subscribers: '80K', isSubscribed: false },
  { id: 'sc-5', name: 'Tailwind Pro', avatar: 'https://images.pexels.com/photos/2519823/pexels-photo-2519823.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', subscribers: '100K', isSubscribed: true },
  { id: 'sc-6', name: 'Express Learner', avatar: 'https://images.pexels.com/photos/2519812/pexels-photo-2519812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', subscribers: '120K', isSubscribed: false },
  { id: 'sc-7', name: 'Redux Master', avatar: 'https://images.pexels.com/photos/18264716/pexels-photo-18264716/free-photo-of-man-people-laptop-internet.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', subscribers: '140K', isSubscribed: true },
  { id: 'sc-8', name: 'API Builder', avatar: 'https://images.pexels.com/photos/1739942/pexels-photo-1739942.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', subscribers: '160K', isSubscribed: false },
  { id: 'sc-9', name: 'React Native Dev', avatar: 'https://images.pexels.com/photos/1739856/pexels-photo-1739856.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', subscribers: '180K', isSubscribed: true },
  { id: 'sc-10', name: 'Hook Master', avatar: 'https://images.pexels.com/photos/1144257/pexels-photo-1144257.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', subscribers: '200K', isSubscribed: false },
  { id: 'sc-11', name: 'CSS Wizard', avatar: 'https://images.pexels.com/photos/1144261/pexels-photo-1144261.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', subscribers: '220K', isSubscribed: true },
  { id: 'sc-12', name: 'Pythonista', avatar: 'https://images.pexels.com/photos/1144268/pexels-photo-1144268.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', subscribers: '240K', isSubscribed: false },
  { id: 'sc-13', name: 'Django Master', avatar: 'https://images.pexels.com/photos/1144269/pexels-photo-1144269.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', subscribers: '260K', isSubscribed: true },
  { id: 'sc-14', name: 'ML Geek', avatar: 'https://images.pexels.com/photos/1144275/pexels-photo-1144275.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', subscribers: '280K', isSubscribed: false },
  { id: 'sc-15', name: 'ReactD3', avatar: 'https://images.pexels.com/photos/1144277/pexels-photo-1144277.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', subscribers: '300K', isSubscribed: true },
  { id: 'sc-16', name: 'Passport Pro', avatar: 'https://images.pexels.com/photos/1144270/pexels-photo-1144270.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', subscribers: '320K', isSubscribed: false },
  { id: 'sc-17', name: 'Django Rest API', avatar: 'https://images.pexels.com/photos/1144235/pexels-photo-1144235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', subscribers: '340K', isSubscribed: true },
  { id: 'sc-18', name: 'JS Ninja', avatar: 'https://images.pexels.com/photos/1144232/pexels-photo-1144232.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', subscribers: '360K', isSubscribed: false },
  { id: 'sc-19', name: 'Tableau Master', avatar: 'https://images.pexels.com/photos/18264716/pexels-photo-18264716/free-photo-of-man-people-laptop-internet.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', subscribers: '380K', isSubscribed: true },
  { id: 'sc-20', name: 'Socket.IO Expert', avatar: 'https://images.pexels.com/photos/18264716/pexels-photo-18264716/free-photo-of-man-people-laptop-internet.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', subscribers: '400K', isSubscribed: false },
  { id: 'sc-21', name: 'GraphQL Pro', avatar: 'https://images.pexels.com/photos/18264716/pexels-photo-18264716/free-photo-of-man-people-laptop-internet.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', subscribers: '420K', isSubscribed: true },
  { id: 'sc-22', name: 'MERN Stack', avatar: 'https://images.pexels.com/photos/1115822/pexels-photo-1115822.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', subscribers: '440K', isSubscribed: false },
  { id: 'sc-23', name: 'CSS Animations', avatar: 'https://images.pexels.com/photos/18264716/pexels-photo-18264716/free-photo-of-man-people-laptop-internet.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', subscribers: '460K', isSubscribed: true }
]

export interface Playlist {
  id: string
  title: string
  description: string
  thumbnail: string
  videoCount: number
  views: string
  uploadedAt: string
  channelName: string
}

export const MOCK_PLAYLISTS: Playlist[] = [
  {
    id: 'pl-1',
    title: 'React Mastery',
    description: 'Master the art of building dynamic user interfaces with React.',
    thumbnail: 'https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    videoCount: 12,
    views: '100K',
    uploadedAt: '2 hours ago',
    channelName: 'React Patterns'
  },
  {
    id: 'pl-2',
    title: 'JavaScript Fundamentals',
    description: 'Learn the core concepts and fundamentals of JavaScript programming language.',
    thumbnail: 'https://images.pexels.com/photos/2519817/pexels-photo-2519817.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    videoCount: 1,
    views: '120K',
    uploadedAt: '3 hours ago',
    channelName: 'React Patterns'
  },
  {
    id: 'pl-3',
    title: 'TypeScript Essentials',
    description: 'Dive into TypeScript for enhanced type safety and scalable JavaScript applications.',
    thumbnail: 'https://images.pexels.com/photos/1739849/pexels-photo-1739849.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    videoCount: 2,
    views: '90K',
    uploadedAt: '4 hours ago',
    channelName: 'React Patterns'
  },
  {
    id: 'pl-4',
    title: 'React State Management',
    description: 'Explore various state management techniques in React applications.',
    thumbnail: 'https://images.pexels.com/photos/1144256/pexels-photo-1144256.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    videoCount: 1,
    views: '80K',
    uploadedAt: '5 hours ago',
    channelName: 'React Patterns'
  },
  {
    id: 'pl-5',
    title: 'Advanced JavaScript Techniques',
    description: 'Delve into advanced JavaScript concepts and techniques for professional-level programming.',
    thumbnail: 'https://images.pexels.com/photos/1144260/pexels-photo-1144260.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    videoCount: 2,
    views: '110K',
    uploadedAt: '6 hours ago',
    channelName: 'React Patterns'
  }
]

export const PLAYLIST_VIDEOS_MAP: Record<string, string[]> = {
  'pl-1': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  'pl-2': ['1'],
  'pl-3': ['3', '7'],
  'pl-4': ['5'],
  'pl-5': ['11', '12']
}

export const ChannelPage: React.FC<ChannelPageProps> = ({ 
  channelName, 
  channelAvatar, 
  channelCover,
  channelHandle,
  subscribers,
  subscribedCount,
  isOwner = false,
  videos,
  tweets: propTweets,
  onBack,
  onSelectVideo,
  onSelectChannel,
  onEditClick,
  onNewVideoClick,
  onAddTweet,
  userId,
  channelUsername
}) => {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [activeSubTab, setActiveSubTab] = useState<'videos' | 'playlist' | 'tweets' | 'subscribed'>('videos')
  const [subscribedChannels, setSubscribedChannels] = useState<SubscribedChannel[]>(INITIAL_SUBSCRIBED_CHANNELS)
  const [channelSearchQuery, setChannelSearchQuery] = useState('')
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null)
  const [newTweetText, setNewTweetText] = useState('')
  const [fetchedTweets, setFetchedTweets] = useState<Tweet[]>([])
  const [fetchedPlaylists, setFetchedPlaylists] = useState<ApiPlaylist[]>([])
  const [apiPlaylistVideos, setApiPlaylistVideos] = useState<Video[]>([])

  // Profile data from backend
  const [profile, setProfile] = useState<{
    id?: string
    name: string
    avatar: string
    coverImage?: string
    subscribersCount?: number
    subscribedToCount?: number
    isSubscribed?: boolean
    username?: string
  } | null>(null)

  // Fetch channel profile when channelUsername changes
  useEffect(() => {
    setProfile(null)
    const targetUsername = channelUsername || (channelHandle ? channelHandle.replace(/^@/, '') : '')
    if (targetUsername) {
      authService.getChannelProfile(targetUsername)
        .then(res => {
          if (res.data) {
            setProfile({
              id: res.data._id,
              name: res.data.fullname || res.data.username || channelName,
              avatar: res.data.avatar,
              coverImage: res.data.coverImage,
              subscribersCount: res.data.subscribersCount,
              subscribedToCount: res.data.channelsSubscribedToCount,
              isSubscribed: res.data.isSubscribed,
              username: res.data.username
            })
            setIsSubscribed(res.data.isSubscribed)
          }
        })
        .catch(err => {
          console.error('Failed to fetch channel profile:', err)
        })
    }
  }, [channelUsername, channelHandle, channelName])

  const resolvedChannelId = profile?.id || userId
  const displayName = profile?.name || channelName
  const displayAvatar = profile?.avatar || channelAvatar
  const displayCover = profile?.coverImage || channelCover
  const displayHandle = profile?.username ? `@${profile.username}` : (channelHandle || `@${channelName.toLowerCase().replace(/[^a-z0-9]/g, '')}`)
  const displaySubscribers = profile?.subscribersCount !== undefined 
    ? formatCount(profile.subscribersCount) 
    : (subscribers || (isSubscribed ? '601k' : '600k'))
  const displaySubscribedTo = profile?.subscribedToCount !== undefined
    ? String(profile.subscribedToCount)
    : (subscribedCount || '220')

  // Fetch tweets from API when user switches to tweets tab
  useEffect(() => {
    setSelectedPlaylist(null)
    setActiveSubTab('videos')
    setFetchedTweets([])
    setFetchedPlaylists([])
  }, [channelName, channelUsername])

  // Fetch tweets from API
  useEffect(() => {
    const targetUserId = resolvedChannelId
    if (activeSubTab === 'tweets' && targetUserId) {
      tweetService.getUserTweets(targetUserId)
        .then(res => {
          const apiTweets = Array.isArray(res.data) ? res.data : []
          setFetchedTweets(apiTweets.map(mapApiTweetToTweet))
        })
        .catch(() => setFetchedTweets([]))
    }
  }, [activeSubTab, resolvedChannelId])

  // Fetch playlists from API
  useEffect(() => {
    const targetUserId = resolvedChannelId
    if (activeSubTab === 'playlist' && targetUserId) {
      playlistService.getUserPlaylists(targetUserId)
        .then(res => {
          const data = Array.isArray(res.data) ? res.data : []
          setFetchedPlaylists(data)
        })
        .catch(() => setFetchedPlaylists([]))
    }
  }, [activeSubTab, resolvedChannelId])

  // Fetch subscribed channels from API
  useEffect(() => {
    const targetUserId = resolvedChannelId
    if (activeSubTab === 'subscribed' && targetUserId) {
      subscriptionService.getSubscribedChannels(targetUserId)
        .then(res => {
          const data = Array.isArray(res.data) ? res.data : []
          const mapped = data.map((item: unknown) => {
            const obj = item as { _id: string; channel?: { _id: string; username: string; fullname: string; avatar: string }; subscribersCount?: number; isSubscribed?: boolean }
            return {
              id: obj.channel?._id || obj._id || '',
              name: obj.channel?.fullname || obj.channel?.username || 'Unknown',
              avatar: obj.channel?.avatar || '',
              subscribers: String(obj.subscribersCount || 0),
              isSubscribed: obj.isSubscribed ?? true
            }
          })
          setSubscribedChannels(mapped)
        })
        .catch(() => setSubscribedChannels([]))
    }
  }, [activeSubTab, resolvedChannelId])

  const handleSubscribe = async () => {
    if (resolvedChannelId) {
      try {
        await subscriptionService.toggleSubscription(resolvedChannelId)
        setIsSubscribed(!isSubscribed)
        if (profile) {
          setProfile(prev => prev ? {
            ...prev,
            subscribersCount: (prev.subscribersCount || 0) + (isSubscribed ? -1 : 1)
          } : null)
        }
      } catch {
        // fallback
        setIsSubscribed(!isSubscribed)
      }
    } else {
      setIsSubscribed(!isSubscribed)
    }
  }

  const handleTabClick = (tab: 'videos' | 'playlist' | 'tweets' | 'subscribed') => {
    setActiveSubTab(tab)
    setSelectedPlaylist(null)
  }

  const toggleChannelSubscribe = async (id: string) => {
    try {
      await subscriptionService.toggleSubscription(id)
    } catch { /* ignore */ }
    setSubscribedChannels(prev => prev.map(c => 
      c.id === id ? { ...c, isSubscribed: !c.isSubscribed } : c
    ))
  }

  const handleSendTweet = async () => {
    if (newTweetText.trim()) {
      onAddTweet?.(newTweetText.trim())
      setNewTweetText('')
      // Re-fetch tweets
      const targetUserId = resolvedChannelId
      if (targetUserId) {
        try {
          const res = await tweetService.getUserTweets(targetUserId)
          const apiTweets = Array.isArray(res.data) ? res.data : []
          setFetchedTweets(apiTweets.map(mapApiTweetToTweet))
        } catch { /* ignore */ }
      }
    }
  }

  const videosList = videos || MOCK_VIDEOS
  const filteredVideos = videosList.filter(
    video => video.channelName.toLowerCase() === displayName.toLowerCase()
  )

  // Use fetched tweets if available, otherwise fall back to props or mock
  const tweetsList = fetchedTweets.length > 0 ? fetchedTweets : (propTweets || MOCK_TWEETS)
  const filteredTweets = tweetsList.filter(
    tweet => tweet.channelName.toLowerCase() === displayName.toLowerCase()
  )

  const filteredChannels = subscribedChannels.filter(
    channel => channel.name.toLowerCase().includes(channelSearchQuery.toLowerCase())
  )

  // Use API playlists if available, otherwise fallback to mock
  const filteredPlaylists = fetchedPlaylists.length > 0 
    ? fetchedPlaylists.map(p => ({
        id: p._id,
        title: p.name,
        description: p.description,
        thumbnail: p.videos?.[0]?.thumbnail || 'https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=600',
        videoCount: p.videos?.length || 0,
        views: '',
        uploadedAt: '',
        channelName: displayName
      }))
    : MOCK_PLAYLISTS.filter(
        playlist => playlist.channelName.toLowerCase() === displayName.toLowerCase()
      )

  // For API playlists, fetch videos when a playlist is selected
  const playlistVideoIds = selectedPlaylist ? (PLAYLIST_VIDEOS_MAP[selectedPlaylist.id] || []) : []
  const playlistVideos = apiPlaylistVideos.length > 0 
    ? apiPlaylistVideos 
    : videosList.filter(video => playlistVideoIds.includes(video.id))
  
  // Fetch playlist videos from API when a playlist is selected  
  useEffect(() => {
    if (selectedPlaylist && fetchedPlaylists.length > 0) {
      const apiPl = fetchedPlaylists.find(p => p._id === selectedPlaylist.id)
      if (apiPl && apiPl.videos) {
        setApiPlaylistVideos(apiPl.videos.map(mapApiVideoToVideo))
      }
    } else {
      setApiPlaylistVideos([])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlaylist])

  return (
    <div className="w-full flex-grow overflow-y-auto bg-[#121212] px-4 py-4 lg:px-8">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-x-2 text-neutral-400 hover:text-white mb-4 transition-colors font-medium text-sm"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="max-w-7xl mx-auto rounded-xl overflow-hidden bg-neutral-900/20 border border-neutral-900">
        {/* Cover Photo */}
        <div className="relative min-h-[150px] w-full pt-[16.28%] bg-neutral-950">
          <div className="absolute inset-0 overflow-hidden">
            <img 
              src={displayCover || "https://images.pexels.com/photos/1092424/pexels-photo-1092424.jpeg?auto=compress"} 
              alt="cover-photo"
              className="w-full h-full object-cover opacity-85"
            />
          </div>
        </div>

        {/* Channel Details Section */}
        <div className="px-4 pb-4 bg-[#121212] lg:px-6">
          <div className="flex flex-wrap gap-4 pb-4 pt-6 items-start">
            {/* Avatar */}
            <span className="relative -mt-16 inline-block h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-white bg-neutral-900 shadow-md">
              <img 
                src={displayAvatar} 
                alt={displayName} 
                className="h-full w-full object-cover"
              />
            </span>

            {/* Metadata Text */}
            <div className="mr-auto inline-block text-left">
              <h1 className="font-bold text-xl text-white">{displayName}</h1>
              <p className="text-sm text-neutral-400 mt-0.5">{displayHandle}</p>
              <p className="text-sm text-neutral-400 mt-1">
                {displaySubscribers} Subscribers · {displaySubscribedTo} Subscribed
              </p>
            </div>

            {/* Action Button */}
            <div className="inline-block pt-2">
              <div className="inline-flex min-w-[145px] justify-end">
                {isOwner ? (
                  <button 
                    onClick={onEditClick}
                    className="group/btn mr-1 flex w-full items-center justify-center gap-x-2 bg-[#ae7aff] px-4 py-2 text-center font-bold text-black border border-transparent shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e] sm:w-auto"
                  >
                    <span className="inline-block w-5">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"></path>
                      </svg>
                    </span>
                    <span>Edit</span>
                  </button>
                ) : (
                  <button 
                    onClick={handleSubscribe}
                    className={`flex w-full items-center justify-center gap-x-2 px-4 py-2 text-center font-bold transition-all duration-150 ease-in-out border ${
                      isSubscribed 
                        ? 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-750' 
                        : 'bg-[#ae7aff] text-black border-transparent shadow-[5px_5px_0px_0px_#4f4e4e] active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]'
                    }`}
                  >
                    <span className="inline-block w-5">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"></path>
                      </svg>
                    </span>
                    <span>{isSubscribed ? 'Subscribed' : 'Subscribe'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sticky/Header Nav Tabs Bar */}
          <ul className="no-scrollbar sticky top-[66px] z-[2] flex flex-row gap-x-2 overflow-auto border-b-2 border-gray-400 bg-[#121212] py-2 sm:top-[82px] md:top-[82px]">
            <li className="w-full">
              <button 
                onClick={() => handleTabClick('videos')}
                className={`w-full border-b-2 px-3 py-1.5 text-sm font-semibold transition-colors ${
                  activeSubTab === 'videos' 
                    ? 'border-[#ae7aff] bg-white text-[#ae7aff]' 
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                Videos
              </button>
            </li>
            <li className="w-full">
              <button 
                onClick={() => handleTabClick('playlist')}
                className={`w-full border-b-2 px-3 py-1.5 text-sm font-semibold transition-colors ${
                  activeSubTab === 'playlist' 
                    ? 'border-[#ae7aff] bg-white text-[#ae7aff]' 
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                Playlist
              </button>
            </li>
            <li className="w-full">
              <button 
                onClick={() => handleTabClick('tweets')}
                className={`w-full border-b-2 px-3 py-1.5 text-sm font-semibold transition-colors ${
                  activeSubTab === 'tweets' 
                    ? 'border-[#ae7aff] bg-white text-[#ae7aff]' 
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                Tweets
              </button>
            </li>
            <li className="w-full">
              <button 
                onClick={() => handleTabClick('subscribed')}
                className={`w-full border-b-2 px-3 py-1.5 text-sm font-semibold transition-colors ${
                  activeSubTab === 'subscribed' 
                    ? 'border-[#ae7aff] bg-white text-[#ae7aff]' 
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                Subscribed
              </button>
            </li>
          </ul>

          {/* Dynamic Content area */}
          <div className="py-6 min-h-[300px]">
            {activeSubTab === 'videos' && (
              filteredVideos.length === 0 ? (
                <div className="flex justify-center p-4">
                  <div className="w-full max-w-sm text-center">
                    <p className="mb-3 w-full">
                      <span className="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="w-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"></path>
                        </svg>
                      </span>
                    </p>
                    <h5 className="mb-2 font-semibold text-white text-lg">No videos uploaded</h5>
                    <p className="text-neutral-400 text-sm">This page has yet to upload a video. Search another page in order to find more videos.</p>
                    {isOwner && (
                      <button 
                        onClick={onNewVideoClick}
                        className="mt-4 inline-flex items-center gap-x-2 bg-[#ae7aff] px-3 py-2 font-semibold text-black hover:bg-[#b98dff] transition-colors duration-150 cursor-pointer shadow-md"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true" className="h-5 w-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
                        </svg>
                        New video
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 pt-2">
                    {filteredVideos.map((video) => (
                      <div 
                        key={video.id} 
                        onClick={() => onSelectVideo?.(video)}
                        className="w-full group cursor-pointer"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            onSelectVideo?.(video)
                          }
                        }}
                      >
                        {/* Thumbnail Area */}
                        <div className="relative mb-2 w-full pt-[56%] overflow-hidden rounded-lg bg-gray-900 border border-neutral-800 transition-all duration-200 group-hover:border-[#ae7aff]">
                          <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-105">
                            <img 
                              src={video.thumbnail} 
                              alt={video.title} 
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <span className="absolute bottom-1 right-1 inline-block rounded bg-black/85 px-1.5 py-0.5 text-xs font-semibold text-white">
                            {video.duration}
                          </span>
                        </div>

                        {/* Video Metadata (Omit avatar/channel name as they are already on the channel page) */}
                        <div className="w-full">
                          <h6 className="mb-1 font-semibold text-white line-clamp-2 leading-snug group-hover:text-[#ae7aff] transition-colors duration-150">
                            {video.title}
                          </h6>
                          <p className="flex text-sm text-gray-400">
                            {video.views} Views · {video.uploadedAt}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
            
            {activeSubTab === 'playlist' && (
              selectedPlaylist ? (
                <div className="w-full">
                  {/* Back to Playlists Button */}
                  <div 
                    onClick={() => setSelectedPlaylist(null)}
                    className="flex items-center gap-x-2 text-neutral-400 hover:text-white mb-6 transition-colors font-medium text-sm cursor-pointer w-fit"
                  >
                    <ArrowLeft size={16} />
                    Back to Playlists
                  </div>

                  {/* Split Column Layout */}
                  <div className="flex flex-wrap gap-x-6 gap-y-10 xl:flex-nowrap">
                    {/* Left Column: Playlist Card & Creator details */}
                    <div className="w-full shrink-0 sm:max-w-md xl:max-w-sm">
                      <div className="relative mb-4 w-full pt-[56%] overflow-hidden rounded-xl bg-gray-900 border border-neutral-800">
                        <div className="absolute inset-0">
                          <img src={selectedPlaylist.thumbnail} alt={selectedPlaylist.title} className="h-full w-full object-cover"/>
                          <div className="absolute inset-x-0 bottom-0">
                            <div className="relative border-t border-white/10 bg-white/20 p-4 text-white backdrop-blur-sm before:absolute before:inset-0 before:bg-black/30">
                              <div className="relative z-[1]">
                                <p className="flex justify-between font-semibold text-sm sm:text-base">
                                  <span className="inline-block">Playlist</span>
                                  <span className="inline-block">
                                    {selectedPlaylist.videoCount} {selectedPlaylist.videoCount === 1 ? 'video' : 'videos'}
                                  </span>
                                </p>
                                <p className="text-xs sm:text-sm text-neutral-200 mt-1">
                                  {selectedPlaylist.views} Views · {selectedPlaylist.uploadedAt}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <h5 className="mb-2 font-bold text-white text-lg sm:text-xl">{selectedPlaylist.title}</h5>
                      <p className="text-sm text-neutral-300 leading-relaxed">{selectedPlaylist.description}</p>
                      
                      {/* Creator details */}
                      <div className="mt-6 flex items-center gap-x-3 border-t border-neutral-900 pt-5">
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-neutral-850">
                          <img src={displayAvatar} alt={displayName} className="h-full w-full object-cover"/>
                        </div>
                        <div className="w-full text-left">
                          <h6 
                            onClick={() => onSelectChannel?.({ name: displayName, avatar: displayAvatar })}
                            className="font-bold text-white hover:text-[#ae7aff] transition-colors cursor-pointer"
                          >
                            {displayName}
                          </h6>
                          <p className="text-xs text-neutral-400 mt-0.5">{displaySubscribers} Subscribers</p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Playlist videos list */}
                    <div className="flex w-full flex-col gap-y-4">
                      {playlistVideos.map((video) => (
                        <div 
                          key={video.id} 
                          className="w-full border border-neutral-900/50 rounded-xl overflow-hidden bg-neutral-900/10 hover:border-[#ae7aff]/50 transition-all duration-200"
                        >
                          <div className="w-full gap-x-4 sm:flex items-start">
                            {/* Thumbnail Column */}
                            <div 
                              onClick={() => onSelectVideo?.(video)}
                              className="relative w-full sm:w-5/12 shrink-0 cursor-pointer overflow-hidden aspect-video bg-neutral-950 sm:rounded-lg"
                            >
                              <img src={video.thumbnail} alt={video.title} className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"/>
                              <span className="absolute bottom-1.5 right-1.5 inline-block rounded bg-black/85 px-1.5 py-0.5 text-xs font-semibold text-white">
                                {video.duration}
                              </span>
                            </div>
                            
                            {/* Metadata Column */}
                            <div className="flex flex-col flex-grow p-4 sm:p-2.5">
                              <h6 
                                onClick={() => onSelectVideo?.(video)}
                                className="mb-1.5 font-bold text-white leading-snug hover:text-[#ae7aff] cursor-pointer text-sm sm:text-base line-clamp-2"
                              >
                                {video.title}
                              </h6>
                              <p className="text-xs text-neutral-400 mb-3 sm:mb-4">
                                {video.views} Views · {video.uploadedAt}
                              </p>
                              <div className="flex items-center gap-x-2.5">
                                <div 
                                  onClick={() => onSelectChannel?.({ name: video.channelName, avatar: video.avatar })}
                                  className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-neutral-800 cursor-pointer hover:border-[#ae7aff] transition-colors"
                                >
                                  <img src={video.avatar} alt={video.channelName} className="h-full w-full object-cover"/>
                                </div>
                                <span 
                                  onClick={() => onSelectChannel?.({ name: video.channelName, avatar: video.avatar })}
                                  className="text-xs font-medium text-neutral-300 hover:text-white cursor-pointer transition-colors"
                                >
                                  {video.channelName}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                filteredPlaylists.length === 0 ? (
                  <div className="flex justify-center w-full">
                    <div className="w-full max-w-sm text-center py-8">
                      <p className="mb-3 w-full flex justify-center">
                        <span className="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
                          <span className="inline-block w-6">
                            <svg style={{ width: '100%' }} viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 5L10.8845 2.76892C10.5634 2.1268 10.4029 1.80573 10.1634 1.57116C9.95158 1.36373 9.69632 1.20597 9.41607 1.10931C9.09916 1 8.74021 1 8.02229 1H4.2C3.0799 1 2.51984 1 2.09202 1.21799C1.71569 1.40973 1.40973 1.71569 1.21799 2.09202C1 2.51984 1 3.0799 1 4.2V5M1 5H16.2C17.8802 5 18.7202 5 19.362 5.32698C19.9265 5.6146 20.3854 6.07354 20.673 6.63803C21 7.27976 21 8.11984 21 9.8V14.2C21 15.8802 21 16.7202 20.673 17.362C20.3854 17.9265 19.9265 18.3854 19.362 18.673C18.7202 19 17.8802 19 16.2 19H5.8C4.11984 19 3.27976 19 2.63803 18.673C2.07354 18.3854 1.6146 17.9265 1.32698 17.362C1 16.7202 1 15.8802 1 14.2V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                          </span>
                        </span>
                      </p>
                      <h5 className="mb-2 font-semibold text-white text-lg">No playlist created</h5>
                      <p className="text-neutral-400 text-sm">There are no playlist created on this channel.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 pt-2 sm:grid-cols-[repeat(auto-fit,_minmax(400px,_1fr))]">
                    {filteredPlaylists.map((playlist) => (
                      <div 
                        key={playlist.id} 
                        onClick={() => setSelectedPlaylist(playlist)}
                        className="w-full group cursor-pointer"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setSelectedPlaylist(playlist)
                          }
                        }}
                      >
                        {/* Thumbnail container */}
                        <div className="relative mb-2 w-full pt-[56%] overflow-hidden rounded-lg bg-gray-900 border border-neutral-800 transition-all duration-200 group-hover:border-[#ae7aff]">
                          <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-105">
                            <img 
                              src={playlist.thumbnail} 
                              alt={playlist.title} 
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                            {/* Overlay layer */}
                            <div className="absolute inset-x-0 bottom-0">
                              <div className="relative border-t border-white/10 bg-white/20 p-4 text-white backdrop-blur-sm before:absolute before:inset-0 before:bg-black/30">
                                <div className="relative z-[1]">
                                  <p className="flex justify-between font-semibold">
                                    <span className="inline-block">Playlist</span>
                                    <span className="inline-block">{playlist.videoCount} {playlist.videoCount === 1 ? 'video' : 'videos'}</span>
                                  </p>
                                  <p className="text-xs text-gray-200 mt-1">{playlist.views} Views · {playlist.uploadedAt}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Metadata info */}
                        <h6 className="mb-1 font-semibold text-white group-hover:text-[#ae7aff] transition-colors duration-150">
                          {playlist.title}
                        </h6>
                        <p className="flex text-sm text-gray-400 font-medium">
                          {playlist.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )
              )
            )}

            {activeSubTab === 'tweets' && (
              <div className="w-full flex flex-col">
                {isOwner && (
                  <div className="mt-2 border border-neutral-800 pb-2 rounded-lg bg-neutral-900/10 focus-within:border-[#ae7aff] transition-colors duration-150 mb-6">
                    <textarea 
                      value={newTweetText}
                      onChange={(e) => setNewTweetText(e.target.value)}
                      className="mb-2 h-10 w-full resize-none border-none bg-transparent px-3 pt-2 text-white placeholder-neutral-500 outline-none text-sm" 
                      placeholder="Write a tweet"
                    />
                    <div className="flex items-center justify-end gap-x-3 px-3">
                      <button className="inline-block h-5 w-5 text-neutral-400 hover:text-[#ae7aff] transition-colors duration-150 outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"></path>
                        </svg>
                      </button>
                      <button className="inline-block h-5 w-5 text-neutral-400 hover:text-[#ae7aff] transition-colors duration-150 outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"></path>
                        </svg>
                      </button>
                      <button 
                        onClick={handleSendTweet}
                        disabled={!newTweetText.trim()}
                        className="bg-[#ae7aff] px-4 py-1.5 font-semibold text-black hover:bg-[#b98dff] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 text-sm shadow-sm"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}

                {filteredTweets.length === 0 ? (
                  <div className="flex justify-center p-4">
                    <div className="w-full max-w-sm text-center py-8">
                      <p className="mb-3 w-full flex justify-center">
                        <span className="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
                          <span className="inline-block w-6">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"></path>
                            </svg>
                          </span>
                        </span>
                      </p>
                      <h5 className="mb-2 font-semibold text-white text-lg">No Tweets</h5>
                      <p className="text-neutral-400 text-sm">This channel has yet to make a <strong className="text-white">Tweet</strong>.</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-4">
                    {filteredTweets.map(tweet => (
                      <TweetItem key={tweet.id} tweet={tweet} channelAvatar={displayAvatar} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSubTab === 'subscribed' && (
              subscribedChannels.length === 0 ? (
                <div className="flex justify-center p-4">
                  <div className="w-full max-w-sm text-center">
                    <p className="mb-3 w-full flex justify-center">
                      <span className="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
                        <span className="inline-block w-6">
                          <svg xmlns="http://www.w3.org/2050/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="w-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"></path>
                          </svg>
                        </span>
                      </span>
                    </p>
                    <h5 className="mb-2 font-semibold text-white text-lg">No people subscribers</h5>
                    <p className="text-neutral-400 text-sm">This channel has yet to <strong className="text-white">subscribe</strong> a new channel.</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-y-4 py-4">
                  {/* Search Bar */}
                  <div className="relative mb-2 rounded-lg bg-white py-2 pl-8 pr-3 text-black">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"></path>
                      </svg>
                    </span>
                    <input 
                      value={channelSearchQuery}
                      onChange={(e) => setChannelSearchQuery(e.target.value)}
                      className="w-full bg-transparent outline-none text-black placeholder-neutral-500" 
                      placeholder="Search"
                    />
                  </div>

                  {/* Channel Items */}
                  {filteredChannels.length === 0 ? (
                    <div className="text-center py-6 text-neutral-400 text-sm">
                      No matching subscribed channels found.
                    </div>
                  ) : (
                    filteredChannels.map(channel => (
                      <div key={channel.id} className="flex w-full justify-between items-center py-1.5 border-b border-neutral-900 last:border-b-transparent">
                        <div 
                          onClick={() => onSelectChannel?.({ name: channel.name, avatar: channel.avatar })}
                          className="flex items-center gap-x-2 cursor-pointer group"
                        >
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-neutral-800 group-hover:border-[#ae7aff] transition-colors">
                            <img 
                              src={channel.avatar} 
                              alt={channel.name} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="block text-left">
                            <h6 className="font-semibold text-white group-hover:text-[#ae7aff] transition-colors">{channel.name}</h6>
                            <p className="text-sm text-neutral-300">{channel.subscribers} Subscribers</p>
                          </div>
                        </div>
                        <div className="block">
                          <button 
                            onClick={() => toggleChannelSubscribe(channel.id)}
                            className={`px-3 py-2 text-black font-semibold text-sm transition-colors duration-150 ${
                              channel.isSubscribed 
                                ? 'bg-[#ae7aff] hover:bg-[#b98dff]' 
                                : 'bg-white hover:bg-neutral-200'
                            }`}
                          >
                            {channel.isSubscribed ? 'Subscribed' : 'Subscribe'}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default ChannelPage
