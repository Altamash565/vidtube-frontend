import api from './api'
import type { ApiResponse, ApiUser, LoginResponse, RefreshTokenResponse, ChannelProfile } from '../types'

export const authService = {
  /** Register a new user (multipart/form-data) */
  register: async (formData: FormData): Promise<ApiResponse<ApiUser>> => {
    const { data } = await api.post('/users/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  /** Login with username/email + password */
  login: async (credentials: { username?: string; email?: string; password: string }): Promise<ApiResponse<LoginResponse>> => {
    const { data } = await api.post('/users/login', credentials)
    // Store tokens
    if (data.data?.accessToken) {
      localStorage.setItem('accessToken', data.data.accessToken)
    }
    if (data.data?.refreshToken) {
      localStorage.setItem('refreshToken', data.data.refreshToken)
    }
    return data
  },

  /** Logout current user */
  logout: async (): Promise<ApiResponse<null>> => {
    const { data } = await api.post('/users/logout')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    return data
  },

  /** Refresh access token */
  refreshToken: async (): Promise<ApiResponse<RefreshTokenResponse>> => {
    const refreshToken = localStorage.getItem('refreshToken')
    const { data } = await api.post('/users/refresh-token', { refreshToken })
    if (data.data?.accessToken) {
      localStorage.setItem('accessToken', data.data.accessToken)
    }
    if (data.data?.refreshToken) {
      localStorage.setItem('refreshToken', data.data.refreshToken)
    }
    return data
  },

  /** Get currently logged-in user */
  getCurrentUser: async (): Promise<ApiResponse<ApiUser>> => {
    const { data } = await api.get('/users/current-user')
    return data
  },

  /** Change password */
  changePassword: async (oldPassword: string, newPassword: string): Promise<ApiResponse<null>> => {
    const { data } = await api.post('/users/change-password', { oldPassword, newPassword })
    return data
  },

  /** Update account text details (fullname, email) */
  updateAccountDetails: async (fullname: string, email: string): Promise<ApiResponse<ApiUser>> => {
    const { data } = await api.patch('/users/update-account', { fullname, email })
    return data
  },

  /** Update user avatar */
  updateAvatar: async (formData: FormData): Promise<ApiResponse<ApiUser>> => {
    const { data } = await api.patch('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  /** Update user cover image */
  updateCoverImage: async (formData: FormData): Promise<ApiResponse<ApiUser>> => {
    const { data } = await api.patch('/users/cover-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  /** Get channel profile by username */
  getChannelProfile: async (username: string): Promise<ApiResponse<ChannelProfile>> => {
    const { data } = await api.get(`/users/c/${username}`)
    return data
  },

  /** Get watch history */
  getWatchHistory: async (): Promise<ApiResponse<unknown[]>> => {
    const { data } = await api.get('/users/history')
    return data
  },
}

export default authService
