import React, { useState, useEffect } from 'react'
import { FolderHeart, FolderPlus, Trash2, Play, ArrowLeft, X, ListVideo } from 'lucide-react'
import playlistService from '../services/playlistService'
import { mapApiVideoToVideo } from '../types'
import type { Video } from './VideoCard'
import type { ApiPlaylist } from '../types'

interface PlaylistsPageProps {
  userId: string
  onSelectVideo: (video: Video) => void
}

export const PlaylistsPage: React.FC<PlaylistsPageProps> = ({
  userId,
  onSelectVideo
}) => {
  const [playlists, setPlaylists] = useState<ApiPlaylist[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlaylist, setSelectedPlaylist] = useState<ApiPlaylist | null>(null)
  const [playlistVideos, setPlaylistVideos] = useState<Video[]>([])

  // Modal / Creation state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [playlistName, setPlaylistName] = useState('')
  const [playlistDesc, setPlaylistDesc] = useState('')
  const [error, setError] = useState('')

  const fetchPlaylists = () => {
    if (!userId) return
    setIsLoading(true)
    playlistService.getUserPlaylists(userId)
      .then(res => {
        setPlaylists(Array.isArray(res.data) ? res.data : [])
      })
      .catch(err => {
        console.error('Failed to fetch playlists:', err)
        setPlaylists([])
      })
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    fetchPlaylists()
  }, [userId])

  // Sync videos if the selected playlist is updated
  useEffect(() => {
    if (selectedPlaylist) {
      // Find the updated version in the playlist state if it has changed
      const current = playlists.find(p => p._id === selectedPlaylist._id)
      if (current && current.videos) {
        setPlaylistVideos(current.videos.map(mapApiVideoToVideo))
      } else if (selectedPlaylist.videos) {
        setPlaylistVideos(selectedPlaylist.videos.map(mapApiVideoToVideo))
      } else {
        setPlaylistVideos([])
      }
    } else {
      setPlaylistVideos([])
    }
  }, [selectedPlaylist, playlists])

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!playlistName.trim()) {
      setError('Playlist name is required')
      return
    }
    setError('')
    try {
      const res = await playlistService.createPlaylist(playlistName.trim(), playlistDesc.trim() || 'Curated playlist.')
      if (res.success) {
        fetchPlaylists()
        setShowCreateModal(false)
        setPlaylistName('')
        setPlaylistDesc('')
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      setError(axiosErr.response?.data?.message || 'Failed to create playlist. Please try again.')
    }
  }

  const handleDeletePlaylist = async (playlistId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!window.confirm('Are you sure you want to delete this playlist permanently?')) return
    try {
      await playlistService.deletePlaylist(playlistId)
      setPlaylists(prev => prev.filter(p => p._id !== playlistId))
      if (selectedPlaylist?._id === playlistId) {
        setSelectedPlaylist(null)
      }
    } catch (err) {
      console.error('Failed to delete playlist:', err)
    }
  }

  const handleRemoveVideo = async (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!selectedPlaylist) return
    try {
      await playlistService.removeVideoFromPlaylist(videoId, selectedPlaylist._id)
      // Re-fetch playlists to update cache and states
      playlistService.getUserPlaylists(userId)
        .then(res => {
          const updatedPlaylists = Array.isArray(res.data) ? res.data : []
          setPlaylists(updatedPlaylists)
          const matched = updatedPlaylists.find(p => p._id === selectedPlaylist._id)
          if (matched) {
            setSelectedPlaylist(matched)
          }
        })
    } catch (err) {
      console.error('Failed to remove video from playlist:', err)
    }
  }

  if (selectedPlaylist) {
    return (
      <div className="w-full flex-grow overflow-y-auto bg-[#121212] px-4 py-8 lg:px-8 text-left">
        {/* Back navigation */}
        <button 
          onClick={() => setSelectedPlaylist(null)}
          className="flex items-center gap-x-2 text-neutral-400 hover:text-white mb-6 transition-colors font-semibold text-sm cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to Collections
        </button>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          {/* Playlist Cover / Meta Card */}
          <div className="flex flex-col bg-neutral-900/40 border border-neutral-850 p-6 rounded-2xl h-fit">
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 mb-4 flex items-center justify-center text-neutral-500">
              {playlistVideos.length > 0 ? (
                <img 
                  src={playlistVideos[0].thumbnail} 
                  alt={selectedPlaylist.name} 
                  className="w-full h-full object-cover opacity-75"
                />
              ) : (
                <ListVideo size={40} className="text-neutral-600" />
              )}
              <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                <span className="bg-black/75 px-3 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1.5">
                  <Play size={12} fill="currentColor" /> Playlist
                </span>
              </div>
            </div>

            <h2 className="text-xl font-bold text-white truncate">{selectedPlaylist.name}</h2>
            <p className="text-xs text-neutral-400 mt-1 font-semibold">
              {playlistVideos.length} {playlistVideos.length === 1 ? 'video' : 'videos'}
            </p>
            <p className="text-sm text-neutral-300 mt-4 leading-relaxed font-normal whitespace-pre-wrap">
              {selectedPlaylist.description || 'No description provided.'}
            </p>

            <button 
              onClick={(e) => handleDeletePlaylist(selectedPlaylist._id, e)}
              className="mt-8 flex items-center justify-center gap-2 border border-red-500/30 hover:border-red-500/70 hover:bg-red-500/10 text-red-400 py-2.5 rounded-xl font-bold text-sm transition-all duration-150 cursor-pointer"
            >
              <Trash2 size={16} />
              Delete Playlist
            </button>
          </div>

          {/* Playlist Videos List */}
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-white mb-2">Videos</h3>
            {playlistVideos.length === 0 ? (
              <div className="border border-dashed border-neutral-800 rounded-2xl py-16 text-center text-neutral-500 flex flex-col items-center justify-center">
                <ListVideo size={36} className="mb-2 text-neutral-600" />
                <p className="text-sm font-semibold">This playlist has no videos yet.</p>
                <p className="text-xs text-neutral-600 mt-1">Start browsing videos and save them to this collection!</p>
              </div>
            ) : (
              playlistVideos.map((video, index) => (
                <div 
                  key={video.id}
                  onClick={() => onSelectVideo(video)}
                  className="flex items-center gap-x-4 bg-neutral-900/20 border border-neutral-900 hover:border-neutral-850 p-2.5 rounded-xl transition-all duration-150 group cursor-pointer"
                >
                  <span className="text-sm font-bold text-neutral-500 w-4 text-center shrink-0">
                    {index + 1}
                  </span>
                  
                  {/* Thumbnail */}
                  <div className="relative aspect-video w-32 shrink-0 rounded-lg overflow-hidden bg-neutral-950 border border-neutral-850">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 bg-black/85 px-1 py-0.5 rounded text-[9px] font-semibold text-white font-mono">
                      {video.duration}
                    </span>
                  </div>

                  {/* Text details */}
                  <div className="flex-grow min-w-0 text-left">
                    <h4 className="font-semibold text-sm text-white group-hover:text-[#ae7aff] transition-colors truncate">
                      {video.title}
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1 truncate">{video.channelName}</p>
                    <p className="text-[10px] text-neutral-500 mt-0.5">{video.views} Views</p>
                  </div>

                  {/* Remove Button */}
                  <button 
                    onClick={(e) => handleRemoveVideo(video.id, e)}
                    className="p-2 hover:bg-neutral-800 text-neutral-500 hover:text-red-400 rounded-lg transition-colors shrink-0 cursor-pointer"
                    title="Remove from playlist"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex-grow overflow-y-auto bg-[#121212] px-4 py-8 lg:px-8 text-left">
      {/* Header and Creator */}
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 border-b border-neutral-900 pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-x-2.5">
            <FolderHeart className="text-[#ae7aff]" size={26} />
            My Playlists
          </h1>
          <p className="text-xs text-neutral-400 mt-1">Manage and watch your curated video collections.</p>
        </div>

        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-x-2 bg-[#ae7aff] px-4 py-2 font-bold text-black hover:bg-[#b98dff] transition-all cursor-pointer shadow-md rounded-lg text-sm"
        >
          <FolderPlus size={16} />
          Create Playlist
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-2 border-[#ae7aff] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-neutral-500">Loading playlists...</span>
          </div>
        ) : playlists.length === 0 ? (
          <div className="border border-dashed border-neutral-850 rounded-2xl py-20 text-center flex flex-col items-center justify-center max-w-md mx-auto mt-6">
            <FolderHeart size={44} className="text-neutral-700 mb-3" />
            <h3 className="font-bold text-white text-base">No Collections Created</h3>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed px-6">
              Create playlists to organize tutorials, favorite songs, or interesting talks. Click "Create Playlist" to start your first one.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-2">
            {playlists.map(pl => {
              const videoCount = pl.videos?.length || 0
              const firstVideo = pl.videos?.[0]
              return (
                <div 
                  key={pl._id}
                  onClick={() => setSelectedPlaylist(pl)}
                  className="flex flex-col bg-neutral-900/20 border border-neutral-900 hover:border-neutral-850 hover:bg-neutral-900/30 rounded-2xl p-4 transition-all duration-200 cursor-pointer group shadow-sm text-left"
                >
                  {/* Playlist Card Preview */}
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-neutral-950 border border-neutral-850 mb-3 flex items-center justify-center text-neutral-500">
                    {firstVideo ? (
                      <img 
                        src={firstVideo.thumbnail} 
                        alt={pl.name} 
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" 
                      />
                    ) : (
                      <ListVideo size={36} className="text-neutral-700" />
                    )}
                    {/* Dark Overlay with counts */}
                    <div className="absolute inset-y-0 right-0 w-1/3 bg-black/80 flex flex-col items-center justify-center text-white border-l border-white/5 backdrop-blur-xs">
                      <span className="font-bold text-base">{videoCount}</span>
                      <ListVideo size={16} className="mt-1" />
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-grow min-w-0">
                      <h4 className="font-bold text-sm text-white group-hover:text-[#ae7aff] transition-colors truncate">
                        {pl.name}
                      </h4>
                      <p className="text-xs text-neutral-400 line-clamp-2 mt-1 font-normal min-h-[32px] leading-relaxed">
                        {pl.description || 'No description.'}
                      </p>
                    </div>
                    
                    <button
                      onClick={(e) => handleDeletePlaylist(pl._id, e)}
                      className="p-1 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 rounded transition-colors cursor-pointer shrink-0"
                      title="Delete playlist"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs px-4">
          <div className="relative w-full max-w-md rounded-2xl border border-neutral-850 bg-[#161616] p-6 shadow-2xl text-left">
            <button 
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-full hover:bg-neutral-800/50 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-bold text-white mb-4 pb-2 border-b border-neutral-850 flex items-center gap-2">
              <FolderPlus className="text-[#ae7aff]" size={20} />
              Create Playlist
            </h2>

            <form onSubmit={handleCreatePlaylist} className="flex flex-col gap-4">
              {error && (
                <div className="text-xs font-semibold text-red-500 bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                  Playlist Name*
                </label>
                <input 
                  type="text"
                  placeholder="Enter playlist name"
                  value={playlistName}
                  onChange={e => { setPlaylistName(e.target.value); setError('') }}
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none focus:border-[#ae7aff]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea 
                  placeholder="Enter playlist description"
                  value={playlistDesc}
                  onChange={e => setPlaylistDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none focus:border-[#ae7aff] resize-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-neutral-850 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-neutral-850 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#ae7aff] hover:bg-[#b98dff] text-black font-bold px-5 py-2 transition-colors cursor-pointer rounded text-sm shadow-md"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
export default PlaylistsPage
