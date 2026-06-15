import React, { useState, useEffect } from 'react'
import { ArrowLeft, ThumbsUp, ThumbsDown, Share2, Download, MoreHorizontal, Play, Send } from 'lucide-react'
import type { Video } from './VideoCard'
import likeService from '../services/likeService'
import subscriptionService from '../services/subscriptionService'
import commentService from '../services/commentService'
import type { ApiComment } from '../types'

export interface VideoDetailProps {
  video: Video
  allVideos: Video[]
  onBack: () => void
  onSelectVideo: (video: Video) => void
  onSelectChannel?: (channel: { name: string; avatar: string; username?: string }) => void
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
  const [likeCount, setLikeCount] = useState(video.likes || 0)

  // Comments state
  const [comments, setComments] = useState<ApiComment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isLoadingComments, setIsLoadingComments] = useState(false)

  // Get recommendations (excluding current video)
  const recommendations = allVideos.filter(v => v.id !== video.id)

  // Reset states when video changes
  useEffect(() => {
    setIsLiked(false)
    setIsDisliked(false)
    setIsDescExpanded(false)
    setLikeCount(video.likes || 0)
  }, [video.id, video.likes])

  // Fetch comments
  useEffect(() => {
    setIsLoadingComments(true)
    commentService.getVideoComments(video.id, 1, 20)
      .then(res => {
        const docs = res.data?.docs || (Array.isArray(res.data) ? res.data as unknown as ApiComment[] : [])
        setComments(docs)
      })
      .catch(() => setComments([]))
      .finally(() => setIsLoadingComments(false))
  }, [video.id])

  const handleLike = async () => {
    try {
      await likeService.toggleVideoLike(video.id)
      if (isLiked) {
        setLikeCount(prev => prev - 1)
      } else {
        setLikeCount(prev => prev + 1)
      }
      setIsLiked(!isLiked)
      if (isDisliked) setIsDisliked(false)
    } catch {
      // fallback to local toggle
      setIsLiked(!isLiked)
      if (isDisliked) setIsDisliked(false)
    }
  }

  const handleDislike = () => {
    setIsDisliked(!isDisliked)
    if (isLiked) {
      setIsLiked(false)
      setLikeCount(prev => prev - 1)
    }
  }

  const handleSubscribe = async () => {
    if (video.ownerId) {
      try {
        await subscriptionService.toggleSubscription(video.ownerId)
      } catch { /* ignore */ }
    }
    setIsSubscribed(!isSubscribed)
  }

  const handleChannelClick = () => {
    onSelectChannel?.({ name: video.channelName, avatar: video.avatar, username: video.ownerUsername })
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    try {
      const res = await commentService.addComment(video.id, newComment.trim())
      if (res.data) {
        setComments(prev => [res.data, ...prev])
      }
      setNewComment('')
    } catch (err) {
      console.error('Failed to add comment:', err)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    try {
      await commentService.deleteComment(commentId)
      setComments(prev => prev.filter(c => c._id !== commentId))
    } catch (err) {
      console.error('Failed to delete comment:', err)
    }
  }

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMin = Math.floor(diffMs / 60000)
    const diffHr = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHr / 24)
    if (diffDay > 0) return `${diffDay}d ago`
    if (diffHr > 0) return `${diffHr}h ago`
    if (diffMin > 0) return `${diffMin}m ago`
    return 'Just now'
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
          {/* Video Player */}
          <div className="relative w-full pt-[56.25%] bg-black rounded-xl overflow-hidden border border-neutral-800 group shadow-lg">
            <div className="absolute inset-0 flex items-center justify-center">
              {video.videoFile ? (
                <video 
                  src={video.videoFile} 
                  poster={video.thumbnail}
                  controls 
                  className="w-full h-full object-contain"
                />
              ) : (
                <>
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-full object-cover opacity-75 group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-colors" />
                  <button className="absolute z-10 w-16 h-16 rounded-full bg-[#ae7aff] flex items-center justify-center text-black shadow-xl transform scale-95 group-hover:scale-105 hover:bg-[#b88cff] transition-all duration-200">
                    <Play size={28} fill="currentColor" className="ml-1" />
                  </button>
                </>
              )}
            </div>
            
            {/* Player Controls Overlay */}
            {!video.videoFile && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-between">
                <span className="text-xs text-neutral-300 font-mono">0:00 / {video.duration}</span>
                <div className="w-24 h-1 bg-neutral-600 rounded overflow-hidden">
                  <div className="w-1/3 h-full bg-[#ae7aff]" />
                </div>
              </div>
            )}
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
                  <span>{likeCount > 0 ? likeCount.toLocaleString() : '0'}</span>
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
                <p className="text-xs text-neutral-400 mt-0.5">Subscribers</p>
              </div>
            </div>

            <button 
              onClick={handleSubscribe}
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

          {/* Comments Section */}
          <div className="mt-6">
            <h3 className="text-base font-bold text-white mb-4">{comments.length} Comments</h3>
            
            {/* Add Comment Input */}
            <div className="flex gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-neutral-800 shrink-0 flex items-center justify-center text-neutral-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment() }}
                  className="flex-1 bg-transparent border-b border-neutral-700 focus:border-[#ae7aff] outline-none text-sm text-white py-2 placeholder-neutral-500 transition-colors"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="px-3 py-2 text-[#ae7aff] hover:bg-[#ae7aff]/10 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>

            {/* Comments List */}
            {isLoadingComments ? (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-[#ae7aff] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : comments.length === 0 ? (
              <p className="text-sm text-neutral-500 text-center py-4">No comments yet. Be the first to comment!</p>
            ) : (
              <div className="flex flex-col gap-4">
                {comments.map((comment) => (
                  <div key={comment._id} className="flex gap-3 group">
                    <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-neutral-800">
                      <img 
                        src={comment.owner?.avatar || ''} 
                        alt={comment.owner?.username || ''} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-semibold text-white">
                          {comment.owner?.fullname || comment.owner?.username || 'User'}
                        </span>
                        <span className="text-xs text-neutral-500">{formatTimeAgo(comment.createdAt)}</span>
                      </div>
                      <p className="text-sm text-neutral-300 leading-relaxed">{comment.content}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <button 
                          onClick={() => likeService.toggleCommentLike(comment._id)}
                          className="text-xs text-neutral-500 hover:text-[#ae7aff] transition-colors flex items-center gap-1"
                        >
                          <ThumbsUp size={12} />
                          {comment.likesCount || 0}
                        </button>
                        <button 
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-xs text-neutral-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
