import React, { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { MOCK_VIDEOS } from './VideoList'
import { type Video } from './VideoCard'

export interface ChannelPageProps {
  channelName: string
  channelAvatar: string
  onBack: () => void
  onSelectVideo?: (video: Video) => void
}

export const ChannelPage: React.FC<ChannelPageProps> = ({ 
  channelName, 
  channelAvatar, 
  onBack,
  onSelectVideo
}) => {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [activeSubTab, setActiveSubTab] = useState<'videos' | 'playlist' | 'tweets' | 'subscribed'>('videos')

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed)
  }

  const handleTabClick = (tab: 'videos' | 'playlist' | 'tweets' | 'subscribed') => {
    setActiveSubTab(tab)
  }

  const channelHandle = `@${channelName.toLowerCase().replace(/[^a-z0-9]/g, '')}`

  const filteredVideos = MOCK_VIDEOS.filter(
    video => video.channelName.toLowerCase() === channelName.toLowerCase()
  )

  return (
    <div className="w-full flex-grow overflow-y-auto bg-[#121212] px-4 py-4 lg:px-8">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-x-2 text-neutral-400 hover:text-white mb-4 transition-colors font-medium text-sm"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="max-w-7xl mx-auto rounded-xl overflow-hidden bg-neutral-900/20 border border-neutral-900">
        {/* Cover Photo */}
        <div className="relative min-h-[150px] w-full pt-[16.28%] bg-neutral-950">
          <div className="absolute inset-0 overflow-hidden">
            <img 
              src="https://images.pexels.com/photos/1092424/pexels-photo-1092424.jpeg?auto=compress" 
              alt="cover-photo"
              className="w-full h-full object-cover opacity-85"
            />
          </div>
        </div>

        {/* Channel Details Section */}
        <div className="px-4 pb-4 bg-[#121212] lg:px-6">
          <div className="flex flex-wrap gap-4 pb-4 pt-6 items-start">
            {/* Avatar */}
            <span className="relative -mt-16 inline-block h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-white bg-neutral-900 shadow-md">
              <img 
                src={channelAvatar} 
                alt={channelName} 
                className="h-full w-full object-cover"
              />
            </span>

            {/* Metadata Text */}
            <div className="mr-auto inline-block">
              <h1 className="font-bold text-xl text-white">{channelName}</h1>
              <p className="text-sm text-neutral-400 mt-0.5">{channelHandle}</p>
              <p className="text-sm text-neutral-400 mt-1">
                {isSubscribed ? '601k' : '600k'} Subscribers · 220 Subscribed
              </p>
            </div>

            {/* Subscribe Action Button */}
            <div className="inline-block pt-2">
              <div className="inline-flex min-w-[145px] justify-end">
                <button 
                  onClick={handleSubscribe}
                  className={`flex w-full items-center justify-center gap-x-2 px-4 py-2 text-center font-bold transition-all duration-150 ease-in-out border ${
                    isSubscribed 
                      ? 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-750' 
                      : 'bg-[#ae7aff] text-black border-transparent shadow-[5px_5px_0px_0px_#4f4e4e] active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]'
                  }`}
                >
                  <span className="inline-block w-5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"></path>
                    </svg>
                  </span>
                  <span>{isSubscribed ? 'Subscribed' : 'Subscribe'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sticky/Header Nav Tabs Bar */}
          <ul className="no-scrollbar sticky top-[66px] z-[2] flex flex-row gap-x-2 overflow-auto border-b-2 border-gray-400 bg-[#121212] py-2 sm:top-[82px] md:top-[82px]">
            <li className="w-full">
              <button 
                onClick={() => handleTabClick('videos')}
                className={`w-full border-b-2 px-3 py-1.5 text-sm font-semibold transition-colors ${
                  activeSubTab === 'videos' 
                    ? 'border-[#ae7aff] bg-white text-[#ae7aff]' 
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                Videos
              </button>
            </li>
            <li className="w-full">
              <button 
                onClick={() => handleTabClick('playlist')}
                className={`w-full border-b-2 px-3 py-1.5 text-sm font-semibold transition-colors ${
                  activeSubTab === 'playlist' 
                    ? 'border-[#ae7aff] bg-white text-[#ae7aff]' 
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                Playlist
              </button>
            </li>
            <li className="w-full">
              <button 
                onClick={() => handleTabClick('tweets')}
                className={`w-full border-b-2 px-3 py-1.5 text-sm font-semibold transition-colors ${
                  activeSubTab === 'tweets' 
                    ? 'border-[#ae7aff] bg-white text-[#ae7aff]' 
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                Tweets
              </button>
            </li>
            <li className="w-full">
              <button 
                onClick={() => handleTabClick('subscribed')}
                className={`w-full border-b-2 px-3 py-1.5 text-sm font-semibold transition-colors ${
                  activeSubTab === 'subscribed' 
                    ? 'border-[#ae7aff] bg-white text-[#ae7aff]' 
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                Subscribed
              </button>
            </li>
          </ul>

          {/* Dynamic Content area */}
          <div className="py-6 min-h-[300px]">
            {activeSubTab === 'videos' && (
              filteredVideos.length === 0 ? (
                <div className="flex justify-center p-4">
                  <div className="w-full max-w-sm text-center">
                    <p className="mb-3 w-full">
                      <span className="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="w-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"></path>
                        </svg>
                      </span>
                    </p>
                    <h5 className="mb-2 font-semibold text-white text-lg">No videos uploaded</h5>
                    <p className="text-neutral-400 text-sm">This page has yet to upload a video. Search another page in order to find more videos.</p>
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 pt-2">
                    {filteredVideos.map((video) => (
                      <div 
                        key={video.id} 
                        onClick={() => onSelectVideo?.(video)}
                        className="w-full group cursor-pointer"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            onSelectVideo?.(video)
                          }
                        }}
                      >
                        {/* Thumbnail Area */}
                        <div className="relative mb-2 w-full pt-[56%] overflow-hidden rounded-lg bg-gray-900 border border-neutral-800 transition-all duration-200 group-hover:border-[#ae7aff]">
                          <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-105">
                            <img 
                              src={video.thumbnail} 
                              alt={video.title} 
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <span className="absolute bottom-1 right-1 inline-block rounded bg-black/85 px-1.5 py-0.5 text-xs font-semibold text-white">
                            {video.duration}
                          </span>
                        </div>

                        {/* Video Metadata (Omit avatar/channel name as they are already on the channel page) */}
                        <div className="w-full">
                          <h6 className="mb-1 font-semibold text-white line-clamp-2 leading-snug group-hover:text-[#ae7aff] transition-colors duration-150">
                            {video.title}
                          </h6>
                          <p className="flex text-sm text-gray-400">
                            {video.views} Views · {video.uploadedAt}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
            
            {activeSubTab === 'playlist' && (
              <div className="flex justify-center w-full">
                <div className="w-full max-w-sm text-center py-8">
                  <p className="mb-3 w-full flex justify-center">
                    <span className="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
                      <span className="inline-block w-6">
                        <svg style={{ width: '100%' }} viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 5L10.8845 2.76892C10.5634 2.1268 10.4029 1.80573 10.1634 1.57116C9.95158 1.36373 9.69632 1.20597 9.41607 1.10931C9.09916 1 8.74021 1 8.02229 1H4.2C3.0799 1 2.51984 1 2.09202 1.21799C1.71569 1.40973 1.40973 1.71569 1.21799 2.09202C1 2.51984 1 3.0799 1 4.2V5M1 5H16.2C17.8802 5 18.7202 5 19.362 5.32698C19.9265 5.6146 20.3854 6.07354 20.673 6.63803C21 7.27976 21 8.11984 21 9.8V14.2C21 15.8802 21 16.7202 20.673 17.362C20.3854 17.9265 19.9265 18.3854 19.362 18.673C18.7202 19 17.8802 19 16.2 19H5.8C4.11984 19 3.27976 19 2.63803 18.673C2.07354 18.3854 1.6146 17.9265 1.32698 17.362C1 16.7202 1 15.8802 1 14.2V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                      </span>
                    </span>
                  </p>
                  <h5 className="mb-2 font-semibold text-white text-lg">No playlist created</h5>
                  <p className="text-neutral-400 text-sm">There are no playlist created on this channel.</p>
                </div>
              </div>
            )}

            {activeSubTab === 'tweets' && (
              <div className="flex justify-center p-4">
                <div className="w-full max-w-sm text-center">
                  <p className="mb-3 w-full flex justify-center">
                    <span className="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
                      <span className="inline-block w-6">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="w-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"></path>
                        </svg>
                      </span>
                    </span>
                  </p>
                  <h5 className="mb-2 font-semibold text-white text-lg">No Tweets</h5>
                  <p className="text-neutral-400 text-sm">This channel has yet to make a <strong className="text-white">Tweet</strong>.</p>
                </div>
              </div>
            )}

            {activeSubTab === 'subscribed' && (
              <div className="flex justify-center w-full">
                <div className="w-full max-w-sm text-center py-8">
                  <h5 className="mb-2 font-semibold text-white text-lg">No subscriptions</h5>
                  <p className="text-neutral-400 text-sm">This channel hasn't subscribed to anyone yet.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default ChannelPage
