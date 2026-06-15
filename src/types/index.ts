// ============================================================
// Centralized type definitions matching backend API responses
// ============================================================

/** Standard API response wrapper from backend */
export interface ApiResponse<T> {
  statusCode: number
  data: T
  message: string
  success: boolean
}

// ---- User / Auth ----

export interface ApiUser {
  _id: string
  username: string
  email: string
  fullname: string
  avatar: string
  coverImage?: string
  watchHistory?: string[]
  createdAt: string
  updatedAt: string
}

export interface LoginResponse {
  user: ApiUser
  accessToken: string
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

export interface ChannelProfile {
  _id: string
  username: string
  fullname: string
  email: string
  avatar: string
  coverImage?: string
  subscribersCount: number
  channelsSubscribedToCount: number
  isSubscribed: boolean
}

// ---- Video ----

export interface ApiVideo {
  _id: string
  videoFile: string
  thumbnail: string
  title: string
  description: string
  duration: number
  views: number
  isPublished: boolean
  owner: {
    _id: string
    username: string
    fullname: string
    avatar: string
  }
  likesCount?: number
  createdAt: string
  updatedAt: string
}

export interface PaginatedVideos {
  docs: ApiVideo[]
  totalDocs: number
  limit: number
  page: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

// ---- Tweet ----

export interface ApiTweet {
  _id: string
  content: string
  owner: {
    _id: string
    username: string
    fullname: string
    avatar: string
  }
  likesCount?: number
  isLiked?: boolean
  createdAt: string
  updatedAt: string
}

// ---- Comment ----

export interface ApiComment {
  _id: string
  content: string
  video: string
  owner: {
    _id: string
    username: string
    fullname: string
    avatar: string
  }
  likesCount?: number
  isLiked?: boolean
  createdAt: string
  updatedAt: string
}

export interface PaginatedComments {
  docs: ApiComment[]
  totalDocs: number
  limit: number
  page: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

// ---- Like ----

export interface LikedVideo {
  _id: string
  video: ApiVideo
  likedBy: string
  createdAt: string
}

// ---- Playlist ----

export interface ApiPlaylist {
  _id: string
  name: string
  description: string
  videos: ApiVideo[]
  owner: {
    _id: string
    username: string
    fullname: string
    avatar: string
  }
  createdAt: string
  updatedAt: string
}

// ---- Subscription ----

export interface SubscribedChannel {
  _id: string
  subscriber: string
  channel: {
    _id: string
    username: string
    fullname: string
    avatar: string
  }
  subscribersCount?: number
  isSubscribed?: boolean
}

export interface ChannelSubscriber {
  _id: string
  subscriber: {
    _id: string
    username: string
    fullname: string
    avatar: string
  }
  subscribersCount?: number
  isSubscribed?: boolean
}

// ---- Dashboard ----

export interface ChannelStats {
  totalVideos: number
  totalViews: number
  totalSubscribers: number
  totalLikes: number
}

// ============================================================
// Adapter functions: convert API shapes → frontend component shapes
// ============================================================

import type { Video } from '../components/VideoCard'
import type { Tweet } from '../components/ChannelPage'

/** Format a number to a human-readable string (e.g. 1200 → "1.2k") */
export function formatCount(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k'
  return String(num)
}

/** Format seconds to mm:ss or hh:mm:ss */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

/** Format ISO date to relative time (e.g. "2 hours ago") */
export function timeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)
  const diffMonth = Math.floor(diffDay / 30)
  const diffYear = Math.floor(diffMonth / 12)

  if (diffYear > 0) return `${diffYear} year${diffYear > 1 ? 's' : ''} ago`
  if (diffMonth > 0) return `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago`
  if (diffDay > 0) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`
  if (diffHr > 0) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`
  if (diffMin > 0) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`
  return 'Just now'
}

/** Format ISO date to DD/MM/YYYY */
export function formatDate(dateString: string): string {
  const d = new Date(dateString)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

/** Convert backend ApiVideo to frontend Video shape */
export function mapApiVideoToVideo(v: ApiVideo): Video {
  return {
    id: v._id,
    title: v.title,
    thumbnail: v.thumbnail,
    duration: formatDuration(v.duration),
    views: formatCount(v.views),
    uploadedAt: timeAgo(v.createdAt),
    avatar: v.owner?.avatar || '',
    channelName: v.owner?.fullname || v.owner?.username || 'Unknown',
    description: v.description,
    published: v.isPublished,
    likes: v.likesCount ?? 0,
    dislikes: 0,
    dateUploaded: formatDate(v.createdAt),
    videoFile: v.videoFile,
    ownerId: v.owner?._id,
    ownerUsername: v.owner?.username,
  }
}

/** Convert backend ApiTweet to frontend Tweet shape */
export function mapApiTweetToTweet(t: ApiTweet): Tweet {
  return {
    id: t._id,
    channelName: t.owner?.fullname || t.owner?.username || 'Unknown',
    uploadedAt: timeAgo(t.createdAt),
    content: t.content,
    likes: t.likesCount ?? 0,
    dislikes: 0,
    ownerId: t.owner?._id,
    ownerAvatar: t.owner?.avatar,
    isLiked: t.isLiked,
  }
}
