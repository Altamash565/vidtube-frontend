import api from './api'
import type { ApiResponse, ApiPlaylist } from '../types'

export const playlistService = {
  /** Create a new playlist */
  createPlaylist: async (name: string, description: string): Promise<ApiResponse<ApiPlaylist>> => {
    const { data } = await api.post('/playlist', { name, description })
    return data
  },

  /** Get a playlist by ID */
  getPlaylistById: async (playlistId: string): Promise<ApiResponse<ApiPlaylist>> => {
    const { data } = await api.get(`/playlist/${playlistId}`)
    return data
  },

  /** Update a playlist */
  updatePlaylist: async (playlistId: string, name: string, description: string): Promise<ApiResponse<ApiPlaylist>> => {
    const { data } = await api.patch(`/playlist/${playlistId}`, { name, description })
    return data
  },

  /** Delete a playlist */
  deletePlaylist: async (playlistId: string): Promise<ApiResponse<null>> => {
    const { data } = await api.delete(`/playlist/${playlistId}`)
    return data
  },

  /** Add a video to a playlist */
  addVideoToPlaylist: async (videoId: string, playlistId: string): Promise<ApiResponse<ApiPlaylist>> => {
    const { data } = await api.patch(`/playlist/add/${videoId}/${playlistId}`)
    return data
  },

  /** Remove a video from a playlist */
  removeVideoFromPlaylist: async (videoId: string, playlistId: string): Promise<ApiResponse<ApiPlaylist>> => {
    const { data } = await api.patch(`/playlist/remove/${videoId}/${playlistId}`)
    return data
  },

  /** Get all playlists by a user */
  getUserPlaylists: async (userId: string): Promise<ApiResponse<ApiPlaylist[]>> => {
    const { data } = await api.get(`/playlist/user/${userId}`)
    return data
  },
}

export default playlistService
