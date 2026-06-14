import React, { useState } from 'react'
import { X, Edit3 } from 'lucide-react'

export interface EditChannelModalProps {
  currentDetails: {
    name: string
    handle: string
    avatar: string
    coverImage: string
  }
  onClose: () => void
  onSave: (updatedDetails: { name: string; handle: string; avatar: string; coverImage: string }) => void
}

const PRESET_AVATARS = [
  'https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3532545/pexels-photo-3532545.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3532552/pexels-photo-3532552.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/2519812/pexels-photo-2519812.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1739856/pexels-photo-1739856.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1144257/pexels-photo-1144257.jpeg?auto=compress&cs=tinysrgb&w=600'
]

const PRESET_COVERS = [
  'https://images.pexels.com/photos/1092424/pexels-photo-1092424.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/2519817/pexels-photo-2519817.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/1739849/pexels-photo-1739849.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
]

export const EditChannelModal: React.FC<EditChannelModalProps> = ({ currentDetails, onClose, onSave }) => {
  const [name, setName] = useState(currentDetails.name)
  const [handle, setHandle] = useState(currentDetails.handle)
  const [avatar, setAvatar] = useState(currentDetails.avatar)
  const [coverImage, setCoverImage] = useState(currentDetails.coverImage)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setError('Channel name is required')
      return
    }

    const formattedHandle = handle.trim().startsWith('@') ? handle.trim() : `@${handle.trim()}`
    if (formattedHandle === '@') {
      setError('Channel handle is required')
      return
    }

    onSave({
      name: name.trim(),
      handle: formattedHandle,
      avatar: avatar.trim(),
      coverImage: coverImage.trim()
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center overflow-y-auto bg-black/80 backdrop-blur-md text-white p-4">
      {/* Main card */}
      <div className="relative w-full max-w-lg rounded-2xl border border-neutral-800 bg-[#161616] p-6 sm:p-8 shadow-2xl">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1.5 rounded-full hover:bg-neutral-800/50 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold mb-6 text-[#ae7aff] flex items-center gap-x-2">
          <Edit3 size={20} />
          Edit Channel Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm font-semibold text-red-500 bg-red-500/10 p-2.5 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="channel-name" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Channel Name*
            </label>
            <input 
              id="channel-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (error) setError('')
              }}
              className="w-full rounded-lg border border-neutral-800 bg-[#0e0e0e] px-3.5 py-2.5 text-white placeholder-neutral-600 outline-none focus:border-[#ae7aff] transition-colors"
            />
          </div>

          <div>
            <label htmlFor="channel-handle" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Handle*
            </label>
            <input 
              id="channel-handle"
              type="text"
              value={handle}
              onChange={(e) => {
                setHandle(e.target.value)
                if (error) setError('')
              }}
              className="w-full rounded-lg border border-neutral-800 bg-[#0e0e0e] px-3.5 py-2.5 text-white placeholder-neutral-600 outline-none focus:border-[#ae7aff] transition-colors"
            />
          </div>

          <div>
            <label htmlFor="channel-avatar-url" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Avatar URL
            </label>
            <input 
              id="channel-avatar-url"
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full rounded-lg border border-neutral-800 bg-[#0e0e0e] px-3.5 py-2.5 text-white placeholder-neutral-600 outline-none focus:border-[#ae7aff] transition-colors"
            />
          </div>

          {/* Preset Avatars Selector */}
          <div>
            <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Select preset avatar
            </span>
            <div className="flex gap-2.5 overflow-x-auto pb-1.5 no-scrollbar">
              {PRESET_AVATARS.map((av, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatar(av)}
                  className={`relative h-10 w-10 shrink-0 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                    avatar === av ? 'border-[#ae7aff] scale-105' : 'border-transparent hover:border-neutral-700'
                  }`}
                >
                  <img src={av} alt={`Preset Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="channel-cover-url" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Cover Image URL
            </label>
            <input 
              id="channel-cover-url"
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full rounded-lg border border-neutral-800 bg-[#0e0e0e] px-3.5 py-2.5 text-white placeholder-neutral-600 outline-none focus:border-[#ae7aff] transition-colors"
            />
          </div>

          {/* Preset Covers Selector */}
          <div>
            <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Select preset cover
            </span>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_COVERS.map((cover, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCoverImage(cover)}
                  className={`relative aspect-video rounded overflow-hidden border-2 transition-all cursor-pointer ${
                    coverImage === cover ? 'border-[#ae7aff] scale-105' : 'border-transparent hover:border-neutral-700'
                  }`}
                >
                  <img src={cover} alt={`Preset Cover ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-neutral-800 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#ae7aff] hover:bg-[#b98dff] text-black font-bold px-5 py-2 transition-colors cursor-pointer shadow-md rounded"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
