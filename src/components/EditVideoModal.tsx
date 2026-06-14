import React, { useState } from 'react'
import { X, Film } from 'lucide-react'
import type { Video } from './VideoCard'

export interface EditVideoModalProps {
  video: Video
  onClose: () => void
  onSave: (updatedVideo: Video) => void
}

const PRESET_THUMBNAILS = [
  'https://images.pexels.com/photos/3532545/pexels-photo-3532545.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3532552/pexels-photo-3532552.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3532549/pexels-photo-3532549.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/2522659/pexels-photo-2522659.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/2519823/pexels-photo-2519823.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/2519812/pexels-photo-2519812.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1739942/pexels-photo-1739942.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1739856/pexels-photo-1739856.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1144257/pexels-photo-1144257.jpeg?auto=compress&cs=tinysrgb&w=600'
]

export const EditVideoModal: React.FC<EditVideoModalProps> = ({ video, onClose, onSave }) => {
  const [title, setTitle] = useState(video.title)
  const [description, setDescription] = useState(video.description || '')
  const [thumbnail, setThumbnail] = useState(video.thumbnail)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Video title is required')
      return
    }
    if (!thumbnail.trim()) {
      setError('Thumbnail URL is required')
      return
    }

    onSave({
      ...video,
      title: title.trim(),
      description: description.trim(),
      thumbnail: thumbnail.trim()
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center overflow-y-auto bg-black/85 backdrop-blur-sm text-white p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-neutral-850 bg-[#161616] p-6 sm:p-8 shadow-2xl text-left">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1.5 rounded-full hover:bg-neutral-800/50 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold mb-6 text-[#ae7aff] flex items-center gap-x-2 border-b border-neutral-850 pb-3">
          <Film size={20} />
          Edit Video Metadata
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm font-semibold text-red-500 bg-red-500/10 p-2.5 rounded-lg">
              {error}
            </div>
          )}

          {/* Title input */}
          <div>
            <label htmlFor="video-title" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Video Title*
            </label>
            <input 
              id="video-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (error) setError('')
              }}
              className="w-full rounded-lg border border-neutral-800 bg-[#0e0e0e] px-3.5 py-2.5 text-white placeholder-neutral-600 outline-none focus:border-[#ae7aff] transition-colors"
              placeholder="Enter video title"
            />
          </div>

          {/* Description input */}
          <div>
            <label htmlFor="video-desc" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea 
              id="video-desc"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-neutral-800 bg-[#0e0e0e] px-3.5 py-2.5 text-white placeholder-neutral-600 outline-none focus:border-[#ae7aff] transition-colors resize-none leading-relaxed text-sm"
              placeholder="Enter video description"
            />
          </div>

          {/* Thumbnail URL input */}
          <div>
            <label htmlFor="video-thumbnail" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Thumbnail Image URL*
            </label>
            <input 
              id="video-thumbnail"
              type="text"
              value={thumbnail}
              onChange={(e) => {
                setThumbnail(e.target.value)
                if (error) setError('')
              }}
              className="w-full rounded-lg border border-neutral-800 bg-[#0e0e0e] px-3.5 py-2.5 text-white placeholder-neutral-600 outline-none focus:border-[#ae7aff] transition-colors text-sm"
              placeholder="Enter thumbnail URL"
            />
          </div>

          {/* Preset Thumbnails */}
          <div>
            <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Select preset thumbnail
            </span>
            <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-[140px] pr-1.5 no-scrollbar">
              {PRESET_THUMBNAILS.map((thumb, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setThumbnail(thumb)}
                  className={`relative aspect-video rounded overflow-hidden border-2 transition-all cursor-pointer ${
                    thumbnail === thumb ? 'border-[#ae7aff] scale-102 shadow-lg' : 'border-transparent hover:border-neutral-700'
                  }`}
                >
                  <img src={thumb} alt={`Preset Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Buttons footer */}
          <div className="pt-3 flex justify-end gap-3 border-t border-neutral-850 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-neutral-850 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#ae7aff] hover:bg-[#b98dff] text-black font-bold px-5 py-2 transition-colors cursor-pointer shadow-md rounded text-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default EditVideoModal
