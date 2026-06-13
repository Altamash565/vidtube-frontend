import React from 'react'

export interface VideoEmptyStateProps {
  title?: string
  message?: string
  icon?: React.ReactNode
}

export const VideoEmptyState: React.FC<VideoEmptyStateProps> = ({
  title = 'No videos available',
  message = 'There are no videos here available. Please try to search some thing else.',
  icon
}) => {
  const defaultIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"></path>
    </svg>
  )

  return (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0 flex-grow">
      <div className="flex h-full items-center justify-center min-h-[300px]">
        <div className="w-full max-w-sm text-center px-4">
          <p className="mb-3 w-full flex justify-center">
            <span className="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
              {icon || defaultIcon}
            </span>
          </p>
          <h5 className="mb-2 font-semibold text-white text-lg">{title}</h5>
          <p className="text-gray-400 text-sm">{message}</p>
        </div>
      </div>
    </section>
  )
}
