import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import type { Video } from './VideoCard'
import videoService from '../services/videoService'

export interface UploadModalProps {
  onClose: () => void
  onUploadSuccess: (videoData: Omit<Video, 'id' | 'views' | 'uploadedAt' | 'avatar' | 'channelName' | 'videoFile'> & { videoFile?: File; thumbnailFile?: File }) => void
}

const PRESET_THUMBNAILS = [
  'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/2519817/pexels-photo-2519817.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1181359/pexels-photo-1181359.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=600'
]

export const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUploadSuccess }) => {
  const [uploadStep, setUploadStep] = useState<'fill' | 'uploading'>('fill')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [videoFileName, setVideoFileName] = useState('')
  const [videoFileSize, setVideoFileSize] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')
  const [actualVideoFile, setActualVideoFile] = useState<File | null>(null)
  const [actualThumbnailFile, setActualThumbnailFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Upload progress tracking
  const [isCompleted, setIsCompleted] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      setVideoFileName(file.name)
      setActualVideoFile(file)
      const sizeInMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB'
      setVideoFileSize(sizeInMb)
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, "")) // strip extension
      }
    }
  }

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setVideoFileName(file.name)
      setActualVideoFile(file)
      const sizeInMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB'
      setVideoFileSize(sizeInMb)
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ""))
      }
    }
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setActualThumbnailFile(file)
      const objectUrl = URL.createObjectURL(file)
      setThumbnailUrl(objectUrl)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!videoFileName) {
      setError('Please select or drag a video file first')
      return
    }
    if (!actualThumbnailFile) {
      setError('Thumbnail is required')
      return
    }
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    if (!description.trim()) {
      setError('Description is required')
      return
    }

    setUploadStep('uploading')
    setIsCompleted(false)
  }

  // Real upload process when step becomes 'uploading'
  useEffect(() => {
    if (uploadStep === 'uploading' && actualVideoFile) {
      const formData = new FormData()
      formData.append('videoFile', actualVideoFile)
      if (actualThumbnailFile) {
        formData.append('thumbnail', actualThumbnailFile)
      }
      formData.append('title', title.trim())
      formData.append('description', description.trim())

      videoService.publishVideo(formData, (percent) => {
        setUploadProgress(percent)
      })
        .then(() => {
          setIsCompleted(true)
          setUploadProgress(100)
        })
        .catch((err: unknown) => {
          console.error('Upload failed:', err)
          const axiosErr = err as { response?: { data?: { message?: string } } }
          const errMsg = axiosErr.response?.data?.message || 'Upload failed. Please try again.'
          setError(errMsg)
          setUploadStep('fill')
        })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadStep])

  const handleFinish = () => {
    const finalThumbnail = thumbnailUrl || PRESET_THUMBNAILS[Math.floor(Math.random() * PRESET_THUMBNAILS.length)]
    onUploadSuccess({
      title: title.trim(),
      description: description.trim(),
      thumbnail: finalThumbnail,
      duration: '14:22',
      videoFile: actualVideoFile || undefined,
      thumbnailFile: actualThumbnailFile || undefined,
    })
  }

  // If we are in the uploading process
  if (uploadStep === 'uploading') {
    return (
      <div className="fixed inset-0 z-[60] bg-black/60 px-4 pb-[86px] pt-4 sm:px-14 sm:py-8 flex items-center justify-center backdrop-blur-sm text-white">
        <div className="w-full max-w-lg overflow-auto rounded-lg border border-gray-700 bg-[#121212] p-4 text-white shadow-2xl">
          {/* Header */}
          <div className="mb-4 flex items-start justify-between">
            <h2 className="text-xl font-semibold text-white">
              {isCompleted ? 'Uploaded Video' : 'Uploading Video...'}
              <span className="block text-sm text-gray-300 font-normal mt-0.5">Track your video uploading process.</span>
            </h2>
            <button 
              onClick={onClose}
              className="h-6 w-6 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close upload menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {/* Progress Display */}
          <div className="mb-6 flex gap-x-2 border border-neutral-800 p-3 bg-neutral-900/30 rounded-lg">
            <div className="w-8 shrink-0">
              <span className="inline-block w-full rounded-full bg-[#E4D3FF] p-1.5 text-[#AE7AFF]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0118 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 016 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5"></path>
                </svg>
              </span>
            </div>
            <div className="flex flex-col text-left w-full">
              <h6 className="font-semibold text-white truncate max-w-[350px]">{videoFileName || 'Dashboard prototype recording.mp4'}</h6>
              <p className="text-sm text-neutral-400">{videoFileSize || '16 MB'}</p>
              
              <div className="mt-2 flex items-center text-sm font-semibold text-neutral-200">
                {!isCompleted ? (
                  <>
                    <svg aria-hidden="true" role="status" className="mr-2 inline-block h-5 w-5 animate-spin text-gray-200" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"></path>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#AE7AFF"></path>
                    </svg>
                    Uploading ({uploadProgress}%)
                  </>
                ) : (
                  <>
                    <span className="mr-2 inline-block w-6 text-[#ae7aff]">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="w-5 h-5">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"></path>
                      </svg>
                    </span>
                    Uploaded Successfully
                  </>
                )}
              </div>

              {/* Premium Progress Bar */}
              <div className="w-full bg-neutral-800 rounded-full h-1.5 mt-3 overflow-hidden">
                <div 
                  className="bg-[#ae7aff] h-1.5 rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button"
              onClick={() => setUploadStep('fill')}
              className="border border-neutral-700 px-4 py-3 rounded hover:bg-neutral-800 hover:border-neutral-600 transition-colors font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={handleFinish}
              disabled={!isCompleted}
              className="bg-[#ae7aff] px-4 py-3 text-black font-semibold rounded disabled:bg-[#E4D3FF] transition-colors cursor-pointer"
            >
              Finish
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 px-4 pb-[86px] pt-4 sm:px-14 sm:py-8 flex items-center justify-center backdrop-blur-sm text-white">
      <div className="h-full w-full max-w-4xl overflow-auto border border-neutral-800 bg-[#121212] rounded-xl shadow-2xl flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-800 p-4">
            <div className="flex items-center gap-x-3">
              <button 
                type="button" 
                onClick={onClose}
                className="text-neutral-400 hover:text-white p-1 rounded-full hover:bg-neutral-800/50 transition-colors cursor-pointer"
                aria-label="Close upload modal"
              >
                <X size={22} />
              </button>
              <h2 className="text-xl font-semibold">Upload Videos</h2>
            </div>
            
            <button 
              type="submit"
              className="group/btn mr-1 flex w-auto items-center gap-x-2 bg-[#ae7aff] px-4 py-2 text-center font-bold text-black border-none shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e] cursor-pointer"
            >
              Save
            </button>
          </div>

          {/* Form Content Area */}
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-y-4 p-4 overflow-y-auto">
            {error && (
              <div className="text-sm font-semibold text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                {error}
              </div>
            )}

            {/* Video File Dropper */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`w-full border-2 border-dashed rounded-xl px-4 py-12 text-center transition-colors ${
                dragActive ? 'border-[#ae7aff] bg-[#ae7aff]/5' : 'border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <span className="mb-4 inline-block w-24 rounded-full bg-[#E4D3FF] p-4 text-[#AE7AFF]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="w-16 h-16">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"></path>
                </svg>
              </span>
              
              <h6 className="mb-1 font-semibold text-lg">
                {videoFileName ? `Selected: ${videoFileName}` : 'Drag and drop video files to upload'}
              </h6>
              <p className="text-gray-400 text-sm mb-4">
                Your videos will be private until you publish them.
              </p>
              
              <label 
                htmlFor="upload-video" 
                className="group/btn inline-flex w-auto cursor-pointer items-center gap-x-2 bg-[#ae7aff] px-4 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]"
              >
                <input 
                  type="file" 
                  id="upload-video" 
                  accept="video/*"
                  onChange={handleVideoFileChange}
                  className="sr-only"
                />
                Select Files
              </label>
            </div>

            {/* Thumbnail Select */}
            <div className="w-full">
              <label htmlFor="thumbnail" className="mb-1 inline-block text-sm font-semibold text-neutral-300">
                Thumbnail<sup className="text-[#ae7aff] ml-0.5">*</sup>
              </label>
              
              <div className="flex gap-4 items-center">
                <input 
                  id="thumbnail" 
                  type="file" 
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="w-full border border-neutral-800 p-1.5 file:mr-4 file:border-none file:bg-[#ae7aff] file:px-3 file:py-1.5 file:font-semibold file:text-black hover:border-neutral-700 transition-colors"
                />
                
                {thumbnailUrl && (
                  <div className="h-14 w-24 shrink-0 rounded overflow-hidden border border-neutral-800">
                    <img src={thumbnailUrl} alt="Thumbnail Preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* Title */}
            <div className="w-full">
              <label htmlFor="title" className="mb-1 inline-block text-sm font-semibold text-neutral-300">
                Title<sup className="text-[#ae7aff] ml-0.5">*</sup>
              </label>
              <input 
                id="title" 
                type="text" 
                placeholder="Enter video title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (error) setError('')
                }}
                className="w-full border border-neutral-800 bg-transparent px-3 py-2 outline-none rounded-lg focus:border-[#ae7aff] transition-colors"
              />
            </div>

            {/* Description */}
            <div className="w-full">
              <label htmlFor="desc" className="mb-1 inline-block text-sm font-semibold text-neutral-300">
                Description<sup className="text-[#ae7aff] ml-0.5">*</sup>
              </label>
              <textarea 
                id="desc" 
                placeholder="Tell viewers about your video"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  if (error) setError('')
                }}
                className="h-40 w-full resize-none border border-neutral-800 bg-transparent px-3 py-2 outline-none rounded-lg focus:border-[#ae7aff] transition-colors"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
