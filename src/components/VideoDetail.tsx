import React, { useState } from 'react'
import { ArrowLeft, ThumbsUp, ThumbsDown, Share2, Download, MoreHorizontal, Play } from 'lucide-react'
import type { Video } from './VideoCard'

export interface VideoDetailProps {
  video: Video
  allVideos: Video[]
  onBack: () => void
  onSelectVideo: (video: Video) => void
  onSelectChannel?: (channel: { name: string; avatar: string }) => void
}

export const VideoDetail: React.FC<VideoDetailProps> = ({ 
  video, 
  allVideos, 
  onBack, 
  onSelectVideo,
  onSelectChannel
}) => {
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isDescExpanded, setIsDescExpanded] = useState(false)

  // Get recommendations (excluding current video)
  const recommendations = allVideos.filter(v => v.id !== video.id)

  const handleLike = () => {
    setIsLiked(!isLiked)
    if (isDisliked) setIsDisliked(false)
  }

  const handleDislike = () => {
    setIsDisliked(!isDisliked)
    if (isLiked) setIsLiked(false)
  }

  const handleChannelClick = () => {
    onSelectChannel?.({ name: video.channelName, avatar: video.avatar })
  }

  return (
    <div className="w-full flex-grow overflow-y-auto bg-[#121212] px-4 py-4 lg:px-8">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-x-2 text-neutral-400 hover:text-white mb-4 transition-colors font-medium text-sm"
      >
        <ArrowLeft size={16} />
        Back to Videos
      </button>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 max-w-7xl mx-auto">
        {/* Left Column: Player & Metadata */}
        <div className="flex flex-col">
          {/* Mock Video Player */}
          <div className="relative w-full pt-[56.25%] bg-black rounded-xl overflow-hidden border border-neutral-800 group shadow-lg">
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src={video.thumbnail} 
                alt={video.title} 
                className="w-full h-full object-cover opacity-75 group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-colors" />
              {/* Giant Play Button */}
              <button className="absolute z-10 w-16 h-16 rounded-full bg-[#ae7aff] flex items-center justify-center text-black shadow-xl transform scale-95 group-hover:scale-105 hover:bg-[#b88cff] transition-all duration-200">
                <Play size={28} fill="currentColor" className="ml-1" />
              </button>
            </div>
            
            {/* Player Controls Overlay Placeholder */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-between">
              <span className="text-xs text-neutral-300 font-mono">0:00 / {video.duration}</span>
              <div className="w-24 h-1 bg-neutral-600 rounded overflow-hidden">
                <div className="w-1/3 h-full bg-[#ae7aff]" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="mt-4 text-xl lg:text-2xl font-bold text-white leading-snug">
            {video.title}
          </h1>

          {/* Meta & Action Buttons Bar */}
          <div className="mt-2 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-850 pb-4">
            <span className="text-sm text-neutral-400 font-medium">
              {video.views} Views · {video.uploadedAt}
            </span>

            {/* Actions (Like, Share, Download) */}
            <div className="flex items-center gap-x-2">
              {/* Like / Dislike Group */}
              <div className="flex items-center bg-neutral-800/80 rounded-full p-0.5 overflow-hidden">
                <button 
                  onClick={handleLike}
                  className={`flex items-center gap-x-2 px-4 py-2 hover:bg-neutral-700/60 rounded-l-full text-sm font-semibold transition-colors ${
                    isLiked ? 'text-[#ae7aff]' : 'text-white'
                  }`}
                >
                  <ThumbsUp size={16} fill={isLiked ? 'currentColor' : 'none'} />
                  <span>{isLiked ? '10.3k' : '10.2k'}</span>
                </button>
                <div className="w-[1px] h-5 bg-neutral-700" />
                <button 
                  onClick={handleDislike}
                  className={`flex items-center px-4 py-2 hover:bg-neutral-700/60 rounded-r-full text-sm font-semibold transition-colors ${
                    isDisliked ? 'text-red-400' : 'text-white'
                  }`}
                >
                  <ThumbsDown size={16} fill={isDisliked ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Other utilities */}
              <button className="flex items-center gap-x-2 px-4 py-2 bg-neutral-800/80 hover:bg-neutral-700/60 text-white rounded-full text-sm font-semibold transition-colors">
                <Share2 size={16} />
                <span className="hidden md:inline">Share</span>
              </button>

              <button className="flex items-center gap-x-2 px-4 py-2 bg-neutral-800/80 hover:bg-neutral-700/60 text-white rounded-full text-sm font-semibold transition-colors">
                <Download size={16} />
                <span className="hidden md:inline">Download</span>
              </button>

              <button className="p-2 bg-neutral-800/80 hover:bg-neutral-700/60 text-white rounded-full transition-colors">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>

          {/* Channel Info & Subscribe */}
          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-x-3">
              <div 
                onClick={handleChannelClick}
                className="w-12 h-12 rounded-full overflow-hidden border border-neutral-800 hover:border-[#ae7aff] transition-colors shrink-0 cursor-pointer"
              >
                <img 
                  src={video.avatar} 
                  alt={video.channelName} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div 
                onClick={handleChannelClick}
                className="cursor-pointer"
              >
                <h5 className="font-bold text-white text-base leading-tight hover:text-[#ae7aff] transition-colors">{video.channelName}</h5>
                <p className="text-xs text-neutral-400 mt-0.5">142k Subscribers</p>
              </div>
            </div>

            <button 
              onClick={() => setIsSubscribed(!isSubscribed)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-150 ${
                isSubscribed 
                  ? 'bg-neutral-800 text-neutral-300 border border-neutral-700 hover:bg-neutral-750' 
                  : 'bg-white text-black hover:bg-neutral-200'
              }`}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>

          {/* Expandable Description Card */}
          <div 
            onClick={() => setIsDescExpanded(!isDescExpanded)}
            className="mt-4 p-4 rounded-xl bg-neutral-800/40 hover:bg-neutral-800/60 cursor-pointer transition-colors border border-neutral-850"
          >
            <p className={`text-sm text-neutral-300 leading-relaxed font-normal ${
              isDescExpanded ? '' : 'line-clamp-3'
            }`}>
              {video.description || 'No description available for this video.'}
              {!isDescExpanded && (
                <span className="block mt-2 text-xs font-bold text-[#ae7aff] hover:underline">... Show More</span>
              )}
              {isDescExpanded && (
                <span className="block mt-4 text-xs font-bold text-[#ae7aff] hover:underline">Show Less</span>
              )}
            </p>
          </div>
        </div>

        {/* Right Column: Up Next sidebar */}
        <div className="flex flex-col">
          <h3 className="text-base font-bold text-white mb-3 tracking-wide">Up Next</h3>
          <div className="flex flex-col gap-y-3">
            {recommendations.slice(0, 6).map((rec) => (
              <div 
                key={rec.id}
                onClick={() => {
                  onSelectVideo(rec)
                  setIsLiked(false)
                  setIsDisliked(false)
                }}
                className="flex gap-x-2 group cursor-pointer border border-transparent hover:border-neutral-800 rounded-lg p-1.5 transition-all duration-150"
              >
                {/* Recommendation Thumbnail */}
                <div className="w-[140px] shrink-0 pt-[22%] relative overflow-hidden rounded bg-neutral-900">
                  <div className="absolute inset-0">
                    <img 
                      src={rec.thumbnail} 
                      alt={rec.title} 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform"
                    />
                    <span className="absolute bottom-1 right-1 bg-black/85 px-1 py-0.5 rounded text-[10px] font-semibold text-white">
                      {rec.duration}
                    </span>
                  </div>
                </div>

                {/* Recommendation Info */}
                <div className="flex flex-col justify-start">
                  <h4 className="text-sm font-semibold text-white line-clamp-2 leading-tight group-hover:text-[#ae7aff] transition-colors">
                    {rec.title}
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1 font-medium">{rec.channelName}</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">{rec.views} Views · {rec.uploadedAt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default VideoDetail
