import api from './api'
import type { ApiResponse, ApiVideo } from '../types'

export interface GetVideosParams {
  page?: number
  limit?: number
  query?: string
  sortBy?: string
  sortType?: 'asc' | 'desc'
  userId?: string
}

export const videoService = {
  /** Get paginated list of videos */
  getAllVideos: async (params: GetVideosParams = {}): Promise<ApiResponse<{ docs: ApiVideo[]; totalDocs: number; page: number; totalPages: number; hasNextPage: boolean }>> => {
    const { data } = await api.get('/videos', { params })
    return data
  },

  /** Publish (upload) a new video - multipart form data */
  publishVideo: async (formData: FormData, onProgress?: (percent: number) => void): Promise<ApiResponse<ApiVideo>> => {
    const { data } = await api.post('/videos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(percent)
        }
      },
    })
    return data
  },

  /** Get a single video by ID */
  getVideoById: async (videoId: string): Promise<ApiResponse<ApiVideo>> => {
    const { data } = await api.get(`/videos/${videoId}`)
    return data
  },

  /** Update video details (title, description, thumbnail) */
  updateVideo: async (videoId: string, formData: FormData): Promise<ApiResponse<ApiVideo>> => {
    const { data } = await api.patch(`/videos/${videoId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  /** Delete a video */
  deleteVideo: async (videoId: string): Promise<ApiResponse<null>> => {
    const { data } = await api.delete(`/videos/${videoId}`)
    return data
  },

  /** Toggle publish status of a video */
  togglePublishStatus: async (videoId: string): Promise<ApiResponse<ApiVideo>> => {
    const { data } = await api.patch(`/videos/toggle/publish/${videoId}`)
    return data
  },
}

export default videoService
