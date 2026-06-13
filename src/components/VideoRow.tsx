import React from 'react'
import type { Video } from './VideoCard'

export interface VideoRowProps {
  video: Video
  onClick?: (video: Video) => void
  onSelectChannel?: (channel: { name: string; avatar: string }) => void
}

export const VideoRow: React.FC<VideoRowProps> = ({ video, onClick, onSelectChannel }) => {
  const handleChannelClick = (e: React.MouseEvent) => {
    if (onSelectChannel) {
      e.stopPropagation()
      onSelectChannel({ name: video.channelName, avatar: video.avatar })
    }
  }

  return (
    <div 
      onClick={() => onClick?.(video)}
      className="w-full max-w-3xl flex flex-col md:flex-row gap-x-4 group cursor-pointer border border-neutral-900 hover:border-neutral-800 rounded-lg p-2 transition-all duration-200"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.(video)
        }
      }}
    >
      {/* Thumbnail Area */}
      <div className="relative mb-2 w-full md:mb-0 md:w-5/12 shrink-0 overflow-hidden rounded-lg bg-gray-900 border border-neutral-800 transition-all duration-200 group-hover:border-[#ae7aff]">
        <div className="w-full pt-[56%] relative">
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
      </div>

      {/* Info Area */}
      <div className="flex gap-x-2 md:w-7/12 py-1">
        {/* Mobile Channel Avatar (Hidden on Desktop) */}
        <div 
          onClick={handleChannelClick}
          className="h-10 w-10 shrink-0 md:hidden overflow-hidden rounded-full border border-neutral-800 hover:border-[#ae7aff] transition-colors"
        >
          <img 
            src={video.avatar} 
            alt={video.channelName} 
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Text Block */}
        <div className="w-full flex flex-col justify-start">
          {/* Title */}
          <h6 className="mb-1 font-semibold text-white text-base leading-snug line-clamp-2 md:max-w-[90%] group-hover:text-[#ae7aff] transition-colors duration-150">
            {video.title}
          </h6>
          
          {/* Views & Date */}
          <p className="flex text-sm text-gray-400 sm:mt-1">
            {video.views} Views · {video.uploadedAt}
          </p>

          {/* Channel Name (Desktop Avatar Included) */}
          <div className="flex items-center gap-x-3 mt-2">
            {/* Desktop Channel Avatar (Hidden on Mobile) */}
            <div 
              onClick={handleChannelClick}
              className="hidden md:block h-7 w-7 shrink-0 overflow-hidden rounded-full border border-neutral-850 hover:border-[#ae7aff] transition-colors"
            >
              <img 
                src={video.avatar} 
                alt={video.channelName} 
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <p 
              onClick={handleChannelClick}
              className="text-sm text-gray-300 font-medium hover:text-[#ae7aff] transition-colors"
            >
              {video.channelName}
            </p>
          </div>

          {/* Description (Hidden on Mobile) */}
          {video.description && (
            <p className="mt-3 hidden text-xs text-gray-400 md:block line-clamp-2 leading-relaxed">
              {video.description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
export default VideoRow
