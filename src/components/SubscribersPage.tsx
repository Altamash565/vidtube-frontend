import React, { useState, useEffect } from 'react'
import { Users, Search, Bell, BellOff } from 'lucide-react'
import subscriptionService from '../services/subscriptionService'
import { formatCount } from '../types'

interface SubscribersPageProps {
  userId: string
  onSelectChannel?: (channel: { name: string; avatar: string; username?: string }) => void
}

interface SubscribedChannel {
  id: string
  name: string
  avatar: string
  username: string
  subscribersCount: number
  isSubscribed: boolean
}

interface Subscriber {
  id: string
  name: string
  avatar: string
  username: string
  subscribersCount: number
}

export const SubscribersPage: React.FC<SubscribersPageProps> = ({
  userId,
  onSelectChannel
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'subscribed' | 'subscribers'>('subscribed')
  const [subscribedChannels, setSubscribedChannels] = useState<SubscribedChannel[]>([])
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const fetchSubscribedChannels = () => {
    if (!userId) return
    setIsLoading(true)
    subscriptionService.getSubscribedChannels(userId)
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : []
        const mapped = data.map((item: unknown) => {
          const obj = item as { _id: string; channel?: { _id: string; username: string; fullname: string; avatar: string }; subscribersCount?: number; isSubscribed?: boolean }
          return {
            id: obj.channel?._id || obj._id || '',
            name: obj.channel?.fullname || obj.channel?.username || 'Unknown',
            avatar: obj.channel?.avatar || '',
            username: obj.channel?.username || 'unknown',
            subscribersCount: obj.subscribersCount || 0,
            isSubscribed: obj.isSubscribed ?? true
          }
        })
        setSubscribedChannels(mapped)
      })
      .catch(err => {
        console.error('Failed to get subscribed channels:', err)
        setSubscribedChannels([])
      })
      .finally(() => setIsLoading(false))
  }

  const fetchSubscribers = () => {
    if (!userId) return
    setIsLoading(true)
    subscriptionService.getChannelSubscribers(userId)
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : []
        const mapped = data.map((item: unknown) => {
          const obj = item as { _id: string; subscriber?: { _id: string; username: string; fullname: string; avatar: string }; subscribersCount?: number }
          return {
            id: obj.subscriber?._id || obj._id || '',
            name: obj.subscriber?.fullname || obj.subscriber?.username || 'Unknown',
            avatar: obj.subscriber?.avatar || '',
            username: obj.subscriber?.username || 'unknown',
            subscribersCount: obj.subscribersCount || 0
          }
        })
        setSubscribers(mapped)
      })
      .catch(err => {
        console.error('Failed to get channel subscribers:', err)
        setSubscribers([])
      })
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    if (activeSubTab === 'subscribed') {
      fetchSubscribedChannels()
    } else {
      fetchSubscribers()
    }
  }, [activeSubTab, userId])

  const handleToggleSubscribe = async (channelId: string) => {
    try {
      await subscriptionService.toggleSubscription(channelId)
      setSubscribedChannels(prev => prev.map(ch => {
        if (ch.id === channelId) {
          const nextSubscribed = !ch.isSubscribed
          return {
            ...ch,
            isSubscribed: nextSubscribed,
            subscribersCount: Math.max(0, ch.subscribersCount + (nextSubscribed ? 1 : -1))
          }
        }
        return ch
      }))
    } catch (err) {
      console.error('Failed to toggle subscription:', err)
    }
  }

  const handleChannelClick = (name: string, avatar: string, username: string) => {
    onSelectChannel?.({ name, avatar, username })
  }

  const filteredSubscribed = subscribedChannels.filter(ch => 
    ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ch.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredSubscribers = subscribers.filter(sub => 
    sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-full flex-grow overflow-y-auto bg-[#121212] px-4 py-8 lg:px-8 text-left">
      {/* Header */}
      <div className="max-w-4xl mx-auto flex flex-col gap-y-4 border-b border-neutral-900 pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-x-2.5">
            <Users className="text-[#ae7aff]" size={26} />
            Subscription Manager
          </h1>
          <p className="text-xs text-neutral-400 mt-1">Manage channels you follow and track your channel audience.</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-x-2 border-b border-neutral-800 pb-2">
          <button
            onClick={() => { setActiveSubTab('subscribed'); setSearchQuery('') }}
            className={`px-4 py-2 font-semibold text-sm rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'subscribed' 
                ? 'bg-[#ae7aff]/10 text-[#ae7aff] border border-[#ae7aff]/20' 
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
            }`}
          >
            Subscribed Channels ({subscribedChannels.length})
          </button>
          <button
            onClick={() => { setActiveSubTab('subscribers'); setSearchQuery('') }}
            className={`px-4 py-2 font-semibold text-sm rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'subscribers' 
                ? 'bg-[#ae7aff]/10 text-[#ae7aff] border border-[#ae7aff]/20' 
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
            }`}
          >
            My Subscribers ({subscribers.length})
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500">
            <Search size={18} />
          </div>
          <input 
            type="text"
            placeholder={activeSubTab === 'subscribed' ? 'Search subscribed channels...' : 'Search subscribers...'}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-850 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 outline-none focus:border-[#ae7aff] transition-colors"
          />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-2 border-[#ae7aff] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-neutral-500">Loading data...</span>
          </div>
        ) : activeSubTab === 'subscribed' ? (
          filteredSubscribed.length === 0 ? (
            <div className="border border-dashed border-neutral-850 rounded-2xl py-20 text-center flex flex-col items-center justify-center max-w-md mx-auto">
              <Users size={44} className="text-neutral-700 mb-3" />
              <h3 className="font-bold text-white text-base">No Channels Subscribed</h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed px-6">
                You haven't subscribed to any channels yet. Browse home videos and subscribe to creators you enjoy.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredSubscribed.map(channel => (
                <div 
                  key={channel.id}
                  className="flex items-center justify-between gap-4 bg-neutral-900/10 border border-neutral-900 hover:border-neutral-850 p-4 rounded-2xl transition-all duration-150"
                >
                  <div 
                    onClick={() => handleChannelClick(channel.name, channel.avatar, channel.username)}
                    className="flex items-center gap-x-4 cursor-pointer group flex-grow min-w-0"
                  >
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-neutral-800">
                      <img src={channel.avatar} alt={channel.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="text-left min-w-0">
                      <h4 className="font-bold text-sm text-white group-hover:text-[#ae7aff] transition-colors truncate">
                        {channel.name}
                      </h4>
                      <p className="text-xs text-neutral-400 truncate">@{channel.username}</p>
                      <p className="text-[10px] text-neutral-500 mt-0.5">{formatCount(channel.subscribersCount)} Subscribers</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleToggleSubscribe(channel.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      channel.isSubscribed 
                        ? 'bg-neutral-800 text-neutral-300 border border-neutral-700 hover:bg-neutral-750' 
                        : 'bg-white text-black hover:bg-neutral-200'
                    }`}
                  >
                    {channel.isSubscribed ? (
                      <>
                        <Bell size={13} fill="currentColor" />
                        <span>Subscribed</span>
                      </>
                    ) : (
                      <>
                        <BellOff size={13} />
                        <span>Subscribe</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )
        ) : (
          filteredSubscribers.length === 0 ? (
            <div className="border border-dashed border-neutral-850 rounded-2xl py-20 text-center flex flex-col items-center justify-center max-w-md mx-auto">
              <Users size={44} className="text-neutral-700 mb-3" />
              <h3 className="font-bold text-white text-base">No Subscribers Yet</h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed px-6">
                Your channel does not have any subscribers yet. Upload high quality videos to start building your audience!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredSubscribers.map(sub => (
                <div 
                  key={sub.id}
                  onClick={() => handleChannelClick(sub.name, sub.avatar, sub.username)}
                  className="flex items-center gap-x-4 bg-neutral-900/10 border border-neutral-900 hover:border-neutral-850 p-4 rounded-2xl cursor-pointer group text-left transition-all duration-150"
                >
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-neutral-800">
                    <img src={sub.avatar} alt={sub.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-white group-hover:text-[#ae7aff] transition-colors truncate">
                      {sub.name}
                    </h4>
                    <p className="text-xs text-neutral-400 truncate">@{sub.username}</p>
                    <p className="text-[10px] text-neutral-500 mt-0.5">{formatCount(sub.subscribersCount)} Subscribers</p>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}
export default SubscribersPage
