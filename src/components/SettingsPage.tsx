import React, { useState, useEffect } from 'react'
import authService from '../services/authService'

export interface PersonalInfo {
  firstName: string
  lastName: string
  email: string
}

export interface ChannelDetails {
  name: string
  handle: string
  avatar: string
  coverImage: string
  subscribers?: string
  subscribedCount?: string
}

export interface SettingsPageProps {
  personalInfo: PersonalInfo
  channelDetails: ChannelDetails
  onSavePersonalInfo: (updated: PersonalInfo) => void
  onSaveChannelDetails: (updated: ChannelDetails) => void
  onViewChannelClick: () => void
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  personalInfo,
  channelDetails,
  onSavePersonalInfo,
  onSaveChannelDetails,
  onViewChannelClick
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'personal' | 'channel' | 'password'>('personal')

  // Personal Info Form State
  const [firstName, setFirstName] = useState(personalInfo.firstName)
  const [lastName, setLastName] = useState(personalInfo.lastName)
  const [email, setEmail] = useState(personalInfo.email)

  // Channel Info Form State
  const [channelHandle, setChannelHandle] = useState(channelDetails.handle.replace(/^@/, ''))
  const [channelDescription, setChannelDescription] = useState(
    "I'm a Product Designer based in Melbourne, Australia. I specialise in UX/UI design, brand strategy, and Webflow development."
  )
  const [timezone, setTimezone] = useState('UTC+05:30')
  const [fontWeight, setFontWeight] = useState('regular')

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  // Sync inputs with props when props change
  useEffect(() => {
    setFirstName(personalInfo.firstName)
    setLastName(personalInfo.lastName)
    setEmail(personalInfo.email)
  }, [personalInfo])

  useEffect(() => {
    setChannelHandle(channelDetails.handle.replace(/^@/, ''))
  }, [channelDetails])

  const triggerToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  // Handle file uploads (upload to API)
  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const formData = new FormData()
        formData.append('avatar', file)
        const res = await authService.updateAvatar(formData)
        if (res.data) {
          onSaveChannelDetails({ ...channelDetails, avatar: res.data.avatar })
          triggerToast('Profile picture updated successfully!')
        }
      } catch {
        // Fallback to local preview
        const url = URL.createObjectURL(file)
        onSaveChannelDetails({ ...channelDetails, avatar: url })
        triggerToast('Profile picture updated locally.')
      }
    }
  }

  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const formData = new FormData()
        formData.append('coverImage', file)
        const res = await authService.updateCoverImage(formData)
        if (res.data) {
          onSaveChannelDetails({ ...channelDetails, coverImage: res.data.coverImage || '' })
          triggerToast('Cover photo updated successfully!')
        }
      } catch {
        const url = URL.createObjectURL(file)
        onSaveChannelDetails({ ...channelDetails, coverImage: url })
        triggerToast('Cover photo updated locally.')
      }
    }
  }


  const handlePersonalSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim()) {
      triggerToast('First and last name cannot be empty.', 'error')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      triggerToast('Please enter a valid email address.', 'error')
      return
    }
    try {
      const fullname = `${firstName.trim()} ${lastName.trim()}`
      await authService.updateAccountDetails(fullname, email.trim())
      onSavePersonalInfo({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim() })
      triggerToast('Personal information saved successfully!')
    } catch {
      triggerToast('Failed to update personal info.', 'error')
    }
  }

  const handleChannelSave = (e: React.FormEvent) => {
    e.preventDefault()
    let handleVal = channelHandle.trim()
    if (!handleVal) {
      triggerToast('Username cannot be empty.', 'error')
      return
    }
    if (!handleVal.startsWith('@')) {
      handleVal = '@' + handleVal
    }
    onSaveChannelDetails({
      ...channelDetails,
      handle: handleVal
    })
    triggerToast('Channel information saved successfully!')
  }

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPassword) {
      triggerToast('Please enter your current password.', 'error')
      return
    }
    if (newPassword.length <= 8) {
      triggerToast('New password must be more than 8 characters.', 'error')
      return
    }
    if (newPassword !== confirmPassword) {
      triggerToast('New passwords do not match.', 'error')
      return
    }
    try {
      await authService.changePassword(currentPassword, newPassword)
      triggerToast('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      triggerToast(axiosErr.response?.data?.message || 'Failed to change password.', 'error')
    }
  }

  const handlePersonalCancel = () => {
    setFirstName(personalInfo.firstName)
    setLastName(personalInfo.lastName)
    setEmail(personalInfo.email)
    triggerToast('Changes discarded.')
  }

  const handleChannelCancel = () => {
    setChannelHandle(channelDetails.handle.replace(/^@/, ''))
    setChannelDescription("I'm a Product Designer based in Melbourne, Australia. I specialise in UX/UI design, brand strategy, and Webflow development.")
    setTimezone('UTC+05:30')
    setFontWeight('regular')
    triggerToast('Changes discarded.')
  }

  const handlePasswordCancel = () => {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    triggerToast('Changes discarded.')
  }

  return (
    <section className="w-full pb-[70px] sm:pb-0 bg-[#121212] min-h-screen text-white overflow-y-auto">
      {/* Cover Image container */}
      <div className="relative min-h-[150px] w-full pt-[16.28%] bg-neutral-900 border-b border-neutral-800">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src={channelDetails.coverImage} 
            alt="cover-photo" 
            className="w-full h-full object-cover opacity-85"
          />
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <input 
            type="file" 
            id="cover-image" 
            className="hidden" 
            accept="image/*"
            onChange={handleCoverImageChange}
          />
          <label 
            htmlFor="cover-image" 
            className="inline-block h-10 w-10 cursor-pointer rounded-lg bg-white/60 p-2 text-[#ae7aff] hover:bg-white hover:text-[#b98dff] transition-colors shadow-lg"
            title="Upload cover photo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"></path>
            </svg>
          </label>
        </div>
      </div>

      <div className="px-4 pb-8 max-w-7xl mx-auto">
        {/* Header Profile Section */}
        <div className="flex flex-wrap gap-4 pb-4 pt-6 items-start">
          {/* Profile Image with upload overlay */}
          <div className="relative -mt-16 inline-block h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-white bg-neutral-900 shadow-md">
            <img 
              src={channelDetails.avatar} 
              alt="Channel" 
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <input 
                type="file" 
                id="profile-image" 
                className="hidden" 
                accept="image/*"
                onChange={handleProfileImageChange}
              />
              <label 
                htmlFor="profile-image" 
                className="inline-block h-8 w-8 cursor-pointer rounded-lg bg-white/60 p-1.5 text-[#ae7aff] hover:bg-white hover:text-[#b98dff] transition-colors shadow-md"
                title="Upload avatar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="w-full h-full">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"></path>
                </svg>
              </label>
            </div>
          </div>

          {/* User metadata */}
          <div className="mr-auto inline-block text-left">
            <h1 className="font-bold text-xl text-white">{channelDetails.name}</h1>
            <p className="text-sm text-neutral-400 mt-0.5">{channelDetails.handle}</p>
          </div>

          {/* View Channel Button */}
          <div className="inline-block pt-1">
            <button 
              onClick={onViewChannelClick}
              className="group/btn mr-1 flex w-full items-center justify-center gap-x-2 bg-[#ae7aff] px-4 py-2 text-center font-bold text-black border border-transparent shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e] sm:w-auto"
            >
              View channel
            </button>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <ul className="no-scrollbar sticky top-[66px] z-[2] flex flex-row gap-x-2 overflow-auto border-b border-neutral-800 bg-[#121212] py-2 sm:top-[82px]">
          <li className="w-full">
            <button 
              onClick={() => setActiveSubTab('personal')}
              className={`w-full border-b-2 px-3 py-2 text-sm font-semibold transition-colors ${
                activeSubTab === 'personal' 
                  ? 'border-[#ae7aff] bg-white text-[#ae7aff]' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Personal Information
            </button>
          </li>
          <li className="w-full">
            <button 
              onClick={() => setActiveSubTab('channel')}
              className={`w-full border-b-2 px-3 py-2 text-sm font-semibold transition-colors ${
                activeSubTab === 'channel' 
                  ? 'border-[#ae7aff] bg-white text-[#ae7aff]' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Channel Information
            </button>
          </li>
          <li className="w-full">
            <button 
              onClick={() => setActiveSubTab('password')}
              className={`w-full border-b-2 px-3 py-2 text-sm font-semibold transition-colors ${
                activeSubTab === 'password' 
                  ? 'border-[#ae7aff] bg-white text-[#ae7aff]' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Change Password
            </button>
          </li>
        </ul>

        {/* Form area depending on activeSubTab */}
        <div className="flex flex-wrap justify-center gap-y-4 py-6 text-left">
          
          {/* TAB 1: Personal Info */}
          {activeSubTab === 'personal' && (
            <>
              <div className="w-full md:w-1/3 pr-4">
                <h5 className="font-semibold text-lg text-white">Personal Info</h5>
                <p className="text-neutral-400 text-sm mt-1">Update your photo and personal details.</p>
              </div>
              <div className="w-full md:w-2/3 mt-2 md:mt-0">
                <form onSubmit={handlePersonalSave} className="rounded-lg border border-neutral-800 bg-neutral-900/10 overflow-hidden">
                  <div className="flex flex-wrap gap-y-4 p-4 sm:p-6">
                    <div className="w-full lg:w-1/2 lg:pr-2">
                      <label htmlFor="firstname" className="mb-1 text-sm font-semibold text-neutral-300 inline-block">First name</label>
                      <input 
                        type="text" 
                        id="firstname"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white placeholder-neutral-500 outline-none focus:border-[#ae7aff] transition-colors text-sm" 
                        placeholder="Enter first name"
                      />
                    </div>
                    <div className="w-full lg:w-1/2 lg:pl-2">
                      <label htmlFor="lastname" className="mb-1 text-sm font-semibold text-neutral-300 inline-block">Last name</label>
                      <input 
                        type="text" 
                        id="lastname"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white placeholder-neutral-500 outline-none focus:border-[#ae7aff] transition-colors text-sm" 
                        placeholder="Enter last name"
                      />
                    </div>
                    <div className="w-full">
                      <label htmlFor="email" className="mb-1 text-sm font-semibold text-neutral-300 inline-block">Email address</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="w-full h-full">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"></path>
                          </svg>
                        </div>
                        <input 
                          type="email" 
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-lg border border-neutral-800 bg-neutral-950 py-2 pl-10 pr-3 text-white placeholder-neutral-500 outline-none focus:border-[#ae7aff] transition-colors text-sm" 
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>
                  </div>
                  <hr className="border-neutral-850" />
                  <div className="flex items-center justify-end gap-4 p-4 bg-neutral-900/30">
                    <button 
                      type="button"
                      onClick={handlePersonalCancel}
                      className="inline-block rounded-lg border border-neutral-850 px-4 py-2 hover:bg-neutral-800 text-neutral-300 font-semibold text-sm transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="inline-block bg-[#ae7aff] hover:bg-[#b98dff] px-4 py-2 text-black font-semibold text-sm transition-colors cursor-pointer"
                    >
                      Save changes
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}

          {/* TAB 2: Channel Info */}
          {activeSubTab === 'channel' && (
            <>
              <div className="w-full sm:w-1/2 lg:w-1/3">
                <h5 className="font-semibold text-lg text-white">Channel Info</h5>
                <p className="text-gray-300 text-sm mt-1">Update your Channel details here.</p>
              </div>
              <div className="w-full sm:w-1/2 lg:w-2/3 mt-2 md:mt-0">
                <form onSubmit={handleChannelSave} className="rounded-lg border bg-[#121212] overflow-hidden">
                  <div className="flex flex-wrap gap-y-4 p-4">
                    <div className="w-full">
                      <label className="mb-1 inline-block text-sm font-semibold text-neutral-300" htmlFor="username">Username</label>
                      <div className="flex rounded-lg border bg-transparent overflow-hidden">
                        <p className="flex shrink-0 items-center border-r border-white px-3 align-middle text-neutral-400 text-sm font-medium">vidplay.com/</p>
                        <input 
                          type="text" 
                          className="w-full bg-transparent px-2 py-1.5 text-white placeholder-neutral-500 outline-none text-sm" 
                          id="username" 
                          placeholder="@username" 
                          value={channelHandle}
                          onChange={(e) => setChannelHandle(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="w-full">
                      <label className="mb-1 inline-block text-sm font-semibold text-neutral-300" htmlFor="desc">Description</label>
                      <textarea 
                        className="w-full rounded-lg border bg-transparent px-2 py-1.5 text-white placeholder-neutral-500 outline-none text-sm resize-none leading-relaxed" 
                        rows={4} 
                        id="desc" 
                        placeholder="Channel Description"
                        maxLength={400}
                        value={channelDescription}
                        onChange={(e) => setChannelDescription(e.target.value)}
                      />
                      <p className="mt-0.5 text-sm text-gray-300 font-medium">{400 - channelDescription.length} characters left</p>
                    </div>
                    <div className="flex w-full items-center gap-3">
                      <div className="w-full max-w-xs rounded-lg border bg-transparent overflow-hidden">
                        <select 
                          className="w-full border-r-8 border-transparent bg-transparent py-1.5 pl-2 text-white text-sm outline-none cursor-pointer"
                          value={fontWeight}
                          onChange={(e) => setFontWeight(e.target.value)}
                        >
                          <option value="light">Light</option>
                          <option value="regular">Regular</option>
                          <option value="semi-bold">Semi bold</option>
                          <option value="bold">Bold</option>
                          <option value="bolder">Bolder</option>
                        </select>
                      </div>
                      <button 
                        type="button" 
                        className="h-6 w-6 text-neutral-400 hover:text-[#ae7aff] focus:text-[#ae7aff] transition-colors outline-none cursor-pointer" 
                        title="Bold"
                        onClick={() => setFontWeight('bold')}
                      >
                        <svg width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8.6 6.79C9.57 6.12 10.25 5.02 10.25 4C10.25 1.74 8.5 0 6.25 0H0V14H7.04C9.13 14 10.75 12.3 10.75 10.21C10.75 8.69 9.89 7.39 8.6 6.79ZM3 2.5H6C6.83 2.5 7.5 3.17 7.5 4C7.5 4.83 6.83 5.5 6 5.5H3V2.5ZM6.5 11.5H3V8.5H6.5C7.33 8.5 8 9.17 8 10C8 10.83 7.33 11.5 6.5 11.5Z" fill="currentColor"></path>
                        </svg>
                      </button>
                      <button 
                        type="button" 
                        className="h-6 w-6 text-neutral-400 hover:text-[#ae7aff] focus:text-[#ae7aff] transition-colors outline-none cursor-pointer" 
                        title="Italic"
                      >
                        <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 0V3H6.21L2.79 11H0V14H8V11H5.79L9.21 3H12V0H4Z" fill="currentColor"></path>
                        </svg>
                      </button>
                      <button 
                        type="button" 
                        className="h-6 w-6 text-neutral-400 hover:text-[#ae7aff] focus:text-[#ae7aff] transition-colors outline-none cursor-pointer" 
                        title="Link"
                      >
                        <svg width="20" height="10" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1.9 5C1.9 3.29 3.29 1.9 5 1.9H9V0H5C2.24 0 0 2.24 0 5C0 7.76 2.24 10 5 10H9V8.1H5C3.29 8.1 1.9 6.71 1.9 5ZM6 6H14V4H6V6ZM15 0H11V1.9H15C16.71 1.9 18.1 3.29 18.1 5C18.1 6.71 16.71 8.1 15 8.1H11V10H15C17.76 10 20 7.76 20 5C20 2.24 17.76 0 15 0Z" fill="currentColor"></path>
                        </svg>
                      </button>
                      <button 
                        type="button" 
                        className="h-6 w-6 text-neutral-400 hover:text-[#ae7aff] focus:text-[#ae7aff] transition-colors outline-none cursor-pointer" 
                        title="Bullet List"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="w-full h-full">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"></path>
                        </svg>
                      </button>
                      <button 
                        type="button" 
                        className="h-6 w-6 text-neutral-400 hover:text-[#ae7aff] focus:text-[#ae7aff] transition-colors outline-none cursor-pointer" 
                        title="Numbered List"
                      >
                        <svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0 13H2V13.5H1V14.5H2V15H0V16H3V12H0V13ZM1 4H2V0H0V1H1V4ZM0 7H1.8L0 9.1V10H3V9H1.2L3 6.9V6H0V7ZM5 1V3H19V1H5ZM5 15H19V13H5V15ZM5 9H19V7H5V9Z" fill="currentColor"></path>
                        </svg>
                      </button>
                    </div>
                    <div className="w-full">
                      <label className="mb-1 inline-block text-sm font-semibold text-neutral-300" htmlFor="timezone">Timezone</label>
                      <div className="relative w-full rounded-lg border bg-transparent focus-within:border-[#ae7aff] transition-colors">
                        <div className="absolute left-2 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-300">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="w-full h-full">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                        <select 
                          id="timezone" 
                          value={timezone}
                          onChange={(e) => setTimezone(e.target.value)}
                          className="w-full border-r-8 border-transparent bg-transparent py-1.5 pl-8 text-white text-sm outline-none cursor-pointer"
                        >
                          <option value="UTC-12:00">(UTC-12:00) International Date Line West</option>
                          <option value="UTC-11:00">(UTC-11:00) Coordinated Universal Time-11</option>
                          <option value="UTC-10:00">(UTC-10:00) Hawaii</option>
                          <option value="UTC-09:00">(UTC-09:00) Alaska</option>
                          <option value="UTC-08:00">(UTC-08:00) Pacific Time (US & Canada)</option>
                          <option value="UTC-07:00">(UTC-07:00) Mountain Time (US & Canada)</option>
                          <option value="UTC-06:00">(UTC-06:00) Central Time (US & Canada)</option>
                          <option value="UTC-05:00">(UTC-05:00) Eastern Time (US & Canada)</option>
                          <option value="UTC-04:00">(UTC-04:00) Atlantic Time (Canada)</option>
                          <option value="UTC-03:30">(UTC-03:30) Newfoundland</option>
                          <option value="UTC-03:00">(UTC-03:00) Buenos Aires, Georgetown</option>
                          <option value="UTC-02:00">(UTC-02:00) Coordinated Universal Time-02</option>
                          <option value="UTC-01:00">(UTC-01:00) Azores</option>
                          <option value="UTC+00:00">(UTC+00:00) Coordinated Universal Time</option>
                          <option value="UTC+01:00">(UTC+01:00) Central European Time</option>
                          <option value="UTC+02:00">(UTC+02:00) Eastern European Time</option>
                          <option value="UTC+03:00">(UTC+03:00) Moscow, St. Petersburg</option>
                          <option value="UTC+03:30">(UTC+03:30) Tehran</option>
                          <option value="UTC+04:00">(UTC+04:00) Abu Dhabi, Muscat</option>
                          <option value="UTC+04:30">(UTC+04:30) Kabul</option>
                          <option value="UTC+05:00">(UTC+05:00) Tashkent</option>
                          <option value="UTC+05:30">(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                          <option value="UTC+05:45">(UTC+05:45) Kathmandu</option>
                          <option value="UTC+06:00">(UTC+06:00) Almaty, Novosibirsk</option>
                          <option value="UTC+06:30">(UTC+06:30) Yangon (Rangoon)</option>
                          <option value="UTC+07:00">(UTC+07:00) Bangkok, Hanoi, Jakarta</option>
                          <option value="UTC+08:00">(UTC+08:00) Beijing, Chongqing, Hong Kong</option>
                          <option value="UTC+08:45">(UTC+08:45) Eucla</option>
                          <option value="UTC+09:00">(UTC+09:00) Osaka, Sapporo, Tokyo</option>
                          <option value="UTC+09:30">(UTC+09:30) Adelaide</option>
                          <option value="UTC+09:45">(UTC+09:45) Darwin</option>
                          <option value="UTC+10:00">(UTC+10:00) Brisbane</option>
                          <option value="UTC+10:30">(UTC+10:30) Lord Howe Island</option>
                          <option value="UTC+11:00">(UTC+11:00) Solomon Is., New Caledonia</option>
                          <option value="UTC+11:30">(UTC+11:30) Norfolk Island</option>
                          <option value="UTC+12:00">(UTC+12:00) Fiji</option>
                          <option value="UTC+12:45">(UTC+12:45) Chatham Islands</option>
                          <option value="UTC+13:00">(UTC+13:00) Nuku'alofa</option>
                          <option value="UTC+14:00">(UTC+14:00) Kiritimati</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <hr className="border border-gray-300" />
                  <div className="flex items-center justify-end gap-4 p-4">
                    <button 
                      type="button"
                      onClick={handleChannelCancel}
                      className="inline-block rounded-lg border px-3 py-1.5 hover:bg-white/10 text-neutral-300 font-semibold text-sm transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="inline-block bg-[#ae7aff] px-3 py-1.5 text-black font-semibold text-sm transition-colors cursor-pointer"
                    >
                      Save changes
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}

          {/* TAB 3: Change Password */}
          {activeSubTab === 'password' && (
            <>
              <div className="w-full sm:w-1/2 lg:w-1/3">
                <h5 className="font-semibold text-white">Password</h5>
                <p className="text-gray-300 text-sm mt-1">Please enter your current password to change your password.</p>
              </div>
              <div className="w-full sm:w-1/2 lg:w-2/3 mt-2 md:mt-0">
                <form onSubmit={handlePasswordSave} className="rounded-lg border bg-[#121212] overflow-hidden">
                  <div className="flex flex-wrap gap-y-4 p-4">
                    <div className="w-full">
                      <label htmlFor="old-pwd" className="mb-1 inline-block text-sm font-semibold text-neutral-300">Current password</label>
                      <input 
                        type="password" 
                        id="old-pwd"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full rounded-lg border bg-transparent px-2 py-1.5 text-white placeholder-neutral-500 outline-none text-sm" 
                        placeholder="Current password"
                      />
                    </div>
                    <div className="w-full">
                      <label htmlFor="new-pwd" className="mb-1 inline-block text-sm font-semibold text-neutral-300">New password</label>
                      <input 
                        type="password" 
                        id="new-pwd"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full rounded-lg border bg-transparent px-2 py-1.5 text-white placeholder-neutral-500 outline-none text-sm" 
                        placeholder="New password"
                      />
                      <p className="mt-0.5 text-sm text-gray-300 font-medium">Your new password must be more than 8 characters.</p>
                    </div>
                    <div className="w-full">
                      <label htmlFor="cnfrm-pwd" className="mb-1 inline-block text-sm font-semibold text-neutral-300">Confirm password</label>
                      <input 
                        type="password" 
                        id="cnfrm-pwd"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-lg border bg-transparent px-2 py-1.5 text-white placeholder-neutral-500 outline-none text-sm" 
                        placeholder="Confirm password"
                      />
                    </div>
                  </div>
                  <hr className="border border-gray-300" />
                  <div className="flex items-center justify-end gap-4 p-4">
                    <button 
                      type="button"
                      onClick={handlePasswordCancel}
                      className="inline-block rounded-lg border px-3 py-1.5 hover:bg-white/10 text-neutral-300 font-semibold text-sm transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="inline-block bg-[#ae7aff] px-3 py-1.5 text-black font-semibold text-sm transition-colors cursor-pointer"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}

        </div>
      </div>

      {/* Floating Success Toast Alert */}
      <div 
        className={`fixed bottom-5 right-5 z-[100] flex items-center gap-x-2.5 rounded-lg border px-4 py-3 shadow-2xl transition-all duration-300 ${
          showToast ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'
        } ${
          toastType === 'success' 
            ? 'bg-neutral-950 text-white border-[#ae7aff]' 
            : 'bg-neutral-950 text-red-400 border-red-500'
        }`}
      >
        <span className={`inline-flex rounded-full p-1 ${toastType === 'success' ? 'bg-[#E4D3FF] text-[#AE7AFF]' : 'bg-red-950 text-red-400'}`}>
          {toastType === 'success' ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          )}
        </span>
        <span className="font-semibold text-sm">{toastMessage}</span>
      </div>
    </section>
  )
}
