import api from './api'
import type { ApiResponse } from '../types'

interface LikeToggleResponse {
  isLiked: boolean
}

export const likeService = {
  /** Toggle like on a video */
  toggleVideoLike: async (videoId: string): Promise<ApiResponse<LikeToggleResponse>> => {
    const { data } = await api.post(`/likes/toggle/v/${videoId}`)
    return data
  },

  /** Toggle like on a comment */
  toggleCommentLike: async (commentId: string): Promise<ApiResponse<LikeToggleResponse>> => {
    const { data } = await api.post(`/likes/toggle/c/${commentId}`)
    return data
  },

  /** Toggle like on a tweet */
  toggleTweetLike: async (tweetId: string): Promise<ApiResponse<LikeToggleResponse>> => {
    const { data } = await api.post(`/likes/toggle/t/${tweetId}`)
    return data
  },

  /** Get all videos liked by the current user */
  getLikedVideos: async (): Promise<ApiResponse<unknown[]>> => {
    const { data } = await api.get('/likes/videos')
    return data
  },
}

export default likeService
