import api from './api'
import type { ApiResponse, ChannelStats, ApiVideo } from '../types'

export const dashboardService = {
  /** Get channel analytics stats */
  getChannelStats: async (): Promise<ApiResponse<ChannelStats>> => {
    const { data } = await api.get('/dashboard/stats')
    return data
  },

  /** Get all videos uploaded by the authenticated channel owner */
  getChannelVideos: async (): Promise<ApiResponse<ApiVideo[]>> => {
    const { data } = await api.get('/dashboard/videos')
    return data
  },
}

export default dashboardService
