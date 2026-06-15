import api from './api'
import type { ApiResponse } from '../types'

export const subscriptionService = {
  /** Get channels that a user is subscribed to */
  getSubscribedChannels: async (channelId: string): Promise<ApiResponse<unknown[]>> => {
    const { data } = await api.get(`/subscriptions/c/${channelId}`)
    return data
  },

  /** Toggle subscription to a channel */
  toggleSubscription: async (channelId: string): Promise<ApiResponse<unknown>> => {
    const { data } = await api.post(`/subscriptions/c/${channelId}`)
    return data
  },

  /** Get subscribers of a channel */
  getChannelSubscribers: async (subscriberId: string): Promise<ApiResponse<unknown[]>> => {
    const { data } = await api.get(`/subscriptions/u/${subscriberId}`)
    return data
  },
}

export default subscriptionService
