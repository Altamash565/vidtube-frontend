import React from 'react'

export interface Video {
  id: string
  title: string
  thumbnail: string
  duration: string
  views: string
  uploadedAt: string
  avatar: string
  channelName: string
  description?: string
  published?: boolean
  likes?: number
  dislikes?: number
  dateUploaded?: string
  videoFile?: string
  ownerId?: string
  ownerUsername?: string
}

export interface VideoCardProps {
  video: Video
  onClick?: (video: Video) => void
  onSelectChannel?: (channel: { name: string; avatar: string }) => void
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onClick, onSelectChannel }) => {
  const handleChannelClick = (e: React.MouseEvent) => {
    if (onSelectChannel) {
      e.stopPropagation()
      onSelectChannel({ name: video.channelName, avatar: video.avatar })
    }
  }

  return (
    <div 
      onClick={() => onClick?.(video)}
      className="w-full group cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.(video)
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

      {/* Info Area */}
      <div className="flex gap-x-2">
        {/* Channel Avatar */}
        <div 
          onClick={handleChannelClick}
          className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-neutral-800 hover:border-[#ae7aff] transition-colors"
        >
          <img 
            src={video.avatar} 
            alt={video.channelName} 
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        
        {/* Video Metadata */}
        <div className="w-full">
          <h6 className="mb-1 font-semibold text-white line-clamp-2 leading-snug group-hover:text-[#ae7aff] transition-colors duration-150">
            {video.title}
          </h6>
          <p 
            onClick={handleChannelClick}
            className="text-sm text-gray-400 font-medium hover:text-[#ae7aff] transition-colors"
          >
            {video.channelName}
          </p>
          <p className="flex text-sm text-gray-400">
            {video.views} Views · {video.uploadedAt}
          </p>
        </div>
      </div>
    </div>
  )
}
export default VideoCard
