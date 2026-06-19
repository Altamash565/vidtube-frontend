import React, { useState, useEffect } from 'react'
import type { Video } from './VideoCard'
import type { ChannelDetails } from './SettingsPage'
import dashboardService from '../services/dashboardService'
import { mapApiVideoToVideo } from '../types'

export interface DashboardProps {
  channelDetails: ChannelDetails
  videos: Video[]
  onTogglePublish: (id: string) => void
  onDeleteVideo: (id: string) => void
  onEditVideo: (video: Video) => void
  onUploadClick: () => void
}

export const Dashboard: React.FC<DashboardProps> = ({
  channelDetails,
  videos,
  onTogglePublish,
  onDeleteVideo,
  onEditVideo,
  onUploadClick
}) => {
  const [apiStats, setApiStats] = useState<{ totalViews: number; totalLikes: number; totalSubscribers: number } | null>(null)
  const [dashboardVideos, setDashboardVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchDashboardData = () => {
    setIsLoading(true)
    dashboardService.getChannelVideos()
      .then(res => {
        const docs = Array.isArray(res.data) ? res.data : []
        setDashboardVideos(docs.map(mapApiVideoToVideo))
      })
      .catch(err => {
        console.error('Failed to fetch dashboard videos:', err)
        // Fallback to local filtering
        setDashboardVideos(
          videos.filter(
            video => video.channelName.toLowerCase() === channelDetails.name.toLowerCase()
          )
        )
      })
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    fetchDashboardData()

    dashboardService.getChannelStats()
      .then(res => {
        if (res.data) setApiStats(res.data)
      })
      .catch(() => { /* fallback to local calc */ })
  }, [videos, channelDetails.name])

  const handleTogglePublish = async (id: string) => {
    // Optimistic local state toggle
    setDashboardVideos(prev => prev.map(v => 
      v.id === id ? { ...v, published: !v.published } : v
    ))
    try {
      await onTogglePublish(id)
    } catch (err) {
      console.error('Failed to toggle publish:', err)
      // revert if failed
      setDashboardVideos(prev => prev.map(v => 
        v.id === id ? { ...v, published: !v.published } : v
      ))
    }
  }

  const handleDeleteVideo = async (id: string) => {
    const originalVideos = [...dashboardVideos]
    // Optimistic delete
    setDashboardVideos(prev => prev.filter(v => v.id !== id))
    try {
      await onDeleteVideo(id)
    } catch (err) {
      console.error('Failed to delete video:', err)
      // revert
      setDashboardVideos(originalVideos)
    }
  }


  // Use API stats if available, otherwise calculate locally
  let formattedViews: string
  let formattedLikes: string
  let subscribersCount: string

  if (apiStats) {
    formattedViews = (apiStats.totalViews || 0).toLocaleString()
    formattedLikes = (apiStats.totalLikes || 0).toLocaleString()
    subscribersCount = (apiStats.totalSubscribers || 0).toLocaleString()
  } else {
    // Calculate dynamic stats from local data
    const totalViewsVal = dashboardVideos.reduce((sum, vid) => {
      const cleanStr = vid.views.toLowerCase().replace(/,/g, '')
      let num = parseFloat(cleanStr)
      if (cleanStr.includes('k')) {
        num = num * 1000
      } else if (cleanStr.includes('m')) {
        num = num * 1000000
      }
      return sum + (isNaN(num) ? 0 : num)
    }, 0)

    formattedViews = totalViewsVal > 0 
      ? totalViewsVal.toLocaleString() 
      : '0'

    const totalLikesVal = dashboardVideos.reduce((sum, vid) => sum + (vid.likes || 0), 0)
    formattedLikes = totalLikesVal > 0 
      ? totalLikesVal.toLocaleString() 
      : '0'

    subscribersCount = channelDetails.subscribers || '0'
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-y-6 px-4 py-8 text-left bg-[#121212] min-h-[calc(100vh-82px)]">
      {/* Welcome & Upload Row */}
      <div className="flex flex-wrap justify-between gap-4">
        <div className="block">
          <h1 className="text-2xl font-bold text-white">Welcome Back, {channelDetails.name}</h1>
          <p className="text-sm text-gray-300">Seamless Video Management, Elevated Results.</p>
        </div>
        <div className="block">
          <button 
            onClick={onUploadClick}
            className="inline-flex items-center gap-x-2 bg-[#ae7aff] px-4 py-2 font-semibold text-black hover:bg-[#b98dff] transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
            </svg> 
            Upload video
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4">
        {/* Total Views Card */}
        <div className="border border-neutral-800 p-4 rounded-lg bg-neutral-900/10">
          <div className="mb-4 block">
            <span className="inline-block h-7 w-7 rounded-full bg-[#E4D3FF] p-1 text-[#ae7aff]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="h-full w-full">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </span>
          </div>
          <h6 className="text-gray-300 text-sm">Total views</h6>
          <p className="text-3xl font-semibold text-white">{formattedViews}</p>
        </div>

        {/* Total Subscribers Card */}
        <div className="border border-neutral-800 p-4 rounded-lg bg-neutral-900/10">
          <div className="mb-4 block">
            <span className="inline-block h-7 w-7 rounded-full bg-[#E4D3FF] p-1 text-[#ae7aff]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="h-full w-full">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"></path>
              </svg>
            </span>
          </div>
          <h6 className="text-gray-300 text-sm">Total subscribers</h6>
          <p className="text-3xl font-semibold text-white">{subscribersCount}</p>
        </div>

        {/* Total Likes Card */}
        <div className="border border-neutral-800 p-4 rounded-lg bg-neutral-900/10">
          <div className="mb-4 block">
            <span className="inline-block h-7 w-7 rounded-full bg-[#E4D3FF] p-1 text-[#ae7aff]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="h-full w-full">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"></path>
              </svg>
            </span>
          </div>
          <h6 className="text-gray-300 text-sm">Total likes</h6>
          <p className="text-3xl font-semibold text-white">{formattedLikes}</p>
        </div>
      </div>

      {/* Videos List Table */}
      <div className="w-full overflow-auto">
        <table className="w-full min-w-[1200px] border-collapse border text-white">
          <thead>
            <tr>
              <th className="border-collapse border-b p-4">Status</th>
              <th className="border-collapse border-b p-4">Status</th>
              <th className="border-collapse border-b p-4">Uploaded</th>
              <th className="border-collapse border-b p-4">Rating</th>
              <th className="border-collapse border-b p-4">Date uploaded</th>
              <th className="border-collapse border-b p-4"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  <div className="flex justify-center items-center gap-2">
                    <div className="w-5 h-5 border-2 border-[#ae7aff] border-t-transparent rounded-full animate-spin" />
                    <span>Loading owner videos...</span>
                  </div>
                </td>
              </tr>
            ) : dashboardVideos.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  No videos uploaded yet. Click "Upload video" to add your first content.
                </td>
              </tr>
            ) : (
              dashboardVideos.map(video => {
                const isPublished = video.published !== false
                return (
                  <tr key={video.id} className="group border">
                    {/* Toggle Switch */}
                    <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                      <div className="flex justify-center">
                        <label htmlFor={`vid-pub-${video.id}`} className="relative inline-block w-12 cursor-pointer overflow-hidden">
                          <input 
                            type="checkbox" 
                            id={`vid-pub-${video.id}`} 
                            className="peer sr-only" 
                            checked={isPublished}
                            onChange={() => handleTogglePublish(video.id)}
                          />
                          <span className="inline-block h-6 w-full rounded-2xl bg-gray-200 duration-200 after:absolute after:bottom-1 after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-black after:duration-200 peer-checked:bg-[#ae7aff] peer-checked:after:left-7"></span>
                        </label>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                      <div className="flex justify-center">
                        {isPublished ? (
                          <span className="inline-block rounded-2xl border px-1.5 py-0.5 border-green-600 text-green-600">
                            Published
                          </span>
                        ) : (
                          <span className="inline-block rounded-2xl border px-1.5 py-0.5 border-orange-600 text-orange-600">
                            Unpublished
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Video Info (Image + Title) */}
                    <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                      <div className="flex items-center gap-4">
                        <img 
                          className="h-10 w-10 rounded-full object-cover border border-neutral-800 shrink-0" 
                          src={video.thumbnail} 
                          alt={video.title} 
                        />
                        <h3 className="font-semibold text-white">
                          {video.title}
                        </h3>
                      </div>
                    </td>

                    {/* Rating Badges */}
                    <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                      <div className="flex justify-center gap-4">
                        <span className="inline-block rounded-xl bg-green-200 px-1.5 py-0.5 text-green-700">
                          {video.likes || 0} likes
                        </span>
                        <span className="inline-block rounded-xl bg-red-200 px-1.5 py-0.5 text-red-700">
                          {video.dislikes || 0} dislikes
                        </span>
                      </div>
                    </td>

                    {/* Date Uploaded */}
                    <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                      {video.dateUploaded || '22/09/2023'}
                    </td>

                    {/* Actions */}
                    <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                      <div className="flex gap-4">
                        {/* Delete Button */}
                        <button 
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${video.title}"?`)) {
                              handleDeleteVideo(video.id)
                            }
                          }}
                          className="h-5 w-5 hover:text-[#ae7aff] cursor-pointer"
                          title="Delete Video"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-full w-full">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path>
                          </svg>
                        </button>
                        {/* Edit Button */}
                        <button 
                          onClick={() => onEditVideo(video)}
                          className="h-5 w-5 hover:text-[#ae7aff] cursor-pointer"
                          title="Edit Video"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-full w-full">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
export default Dashboard
