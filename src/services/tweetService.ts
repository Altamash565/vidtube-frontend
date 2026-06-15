import api from './api'
import type { ApiResponse, ApiTweet } from '../types'

export const tweetService = {
  /** Create a new tweet */
  createTweet: async (content: string): Promise<ApiResponse<ApiTweet>> => {
    const { data } = await api.post('/tweets', { content })
    return data
  },

  /** Get tweets by user ID */
  getUserTweets: async (userId: string): Promise<ApiResponse<ApiTweet[]>> => {
    const { data } = await api.get(`/tweets/user/${userId}`)
    return data
  },

  /** Update a tweet */
  updateTweet: async (tweetId: string, content: string): Promise<ApiResponse<ApiTweet>> => {
    const { data } = await api.patch(`/tweets/${tweetId}`, { content })
    return data
  },

  /** Delete a tweet */
  deleteTweet: async (tweetId: string): Promise<ApiResponse<null>> => {
    const { data } = await api.delete(`/tweets/${tweetId}`)
    return data
  },
}

export default tweetService
