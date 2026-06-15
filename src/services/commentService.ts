import api from './api'
import type { ApiResponse, ApiComment } from '../types'

export const commentService = {
  /** Get comments for a video (paginated) */
  getVideoComments: async (videoId: string, page = 1, limit = 10): Promise<ApiResponse<{ docs: ApiComment[]; totalDocs: number; page: number; totalPages: number; hasNextPage: boolean }>> => {
    const { data } = await api.get(`/comments/${videoId}`, { params: { page, limit } })
    return data
  },

  /** Add a comment to a video */
  addComment: async (videoId: string, content: string): Promise<ApiResponse<ApiComment>> => {
    const { data } = await api.post(`/comments/${videoId}`, { content })
    return data
  },

  /** Update a comment */
  updateComment: async (commentId: string, content: string): Promise<ApiResponse<ApiComment>> => {
    const { data } = await api.patch(`/comments/c/${commentId}`, { content })
    return data
  },

  /** Delete a comment */
  deleteComment: async (commentId: string): Promise<ApiResponse<null>> => {
    const { data } = await api.delete(`/comments/c/${commentId}`)
    return data
  },
}

export default commentService
