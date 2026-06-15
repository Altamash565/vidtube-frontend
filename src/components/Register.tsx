import React, { useState } from 'react'
import { X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export interface RegisterProps {
  onClose: () => void
  onRegisterSuccess: (email: string) => void
}

export const Register: React.FC<RegisterProps> = ({ onClose, onRegisterSuccess }) => {
  const [fullname, setFullname] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!fullname.trim()) {
      setError('Full name is required')
      return
    }
    if (!username.trim()) {
      setError('Username is required')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (!avatarFile) {
      setError('Avatar image is required')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('fullname', fullname.trim())
      formData.append('username', username.trim().toLowerCase())
      formData.append('email', email.trim())
      formData.append('password', password)
      formData.append('avatar', avatarFile)

      await register(formData)
      
      // Auto-login after successful registration
      await login({ username: username.trim().toLowerCase(), password })
      onRegisterSuccess(email.trim())
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      setError(axiosErr.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center overflow-y-auto bg-[#121212]/95 backdrop-blur-md text-white p-4">
      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-neutral-400 hover:text-white p-2 rounded-full hover:bg-neutral-800/50 transition-all cursor-pointer"
        aria-label="Close"
      >
        <X size={24} />
      </button>

      {/* Main card */}
      <div className="mx-auto w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 shadow-2xl backdrop-blur-lg max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Logo */}
          <div className="mx-auto mb-4 w-16">
            <svg style={{ width: '100%' }} viewBox="0 0 63 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M47.25 47.458C55.9485 38.7595 55.9485 24.6565 47.25 15.958C38.5515 7.25952 24.4485 7.25952 15.75 15.958C7.05151 24.6565 7.05151 38.7595 15.75 47.458C24.4485 56.1565 38.5515 56.1565 47.25 47.458Z" stroke="#E9FCFF" strokeWidth="1.38962" strokeMiterlimit="10"></path>
              <path d="M10.5366 47.7971V17.5057C10.5366 16.9599 11.1511 16.6391 11.599 16.9495L33.4166 32.0952C33.8041 32.3639 33.8041 32.9368 33.4166 33.2076L11.599 48.3533C11.1511 48.6657 10.5366 48.3429 10.5366 47.7971Z" stroke="url(#paint0_linear_reg)" strokeWidth="6.99574" strokeMiterlimit="10" strokeLinecap="round"></path>
              <path d="M18.1915 27.6963C20.1641 27.6963 21.7285 28.7066 21.7285 30.9021C21.7285 33.0976 20.1621 34.2433 18.1915 34.2433H16.8854V37.8677H14.1733V27.6984H18.1915V27.6963Z" fill="#E9FCFF"></path>
              <path d="M25.2053 27.6963V35.4868H28.484V37.8657H22.4932V27.6963H25.2053Z" fill="#E9FCFF"></path>
              <path d="M35.3142 27.6963L39.4553 37.8657H36.5328L35.9162 36.1763H32.1939L31.5773 37.8657H28.6548L32.7959 27.6963H35.3101H35.3142ZM34.9143 33.5663L34.2144 31.7832C34.1582 31.6395 33.954 31.6395 33.8978 31.7832L33.1979 33.5663C33.1541 33.6767 33.2354 33.7975 33.3562 33.7975H34.756C34.8747 33.7975 34.958 33.6767 34.9143 33.5663Z" fill="#E9FCFF"></path>
              <path d="M40.9491 27.6963L42.8592 30.5188L44.7694 27.6963H48.0355L44.2132 33.2559V37.8657H41.5011V33.2559L37.6787 27.6963H40.9449H40.9491Z" fill="#E9FCFF"></path>
              <path d="M16.894 32.1396V29.9129C16.894 29.8212 16.9982 29.7671 17.0732 29.8191L18.6771 30.9315C18.7417 30.9773 18.7417 31.0731 18.6771 31.1189L17.0732 32.2313C16.9982 32.2834 16.894 32.2313 16.894 32.1375V32.1396Z" fill="#232323"></path>
              <defs>
                <linearGradient id="paint0_linear_reg" x1="2.23416" y1="20.3361" x2="26.863" y2="44.9649" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#007EF8"></stop>
                  <stop offset="1" stopColor="#FF4A9A"></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Title */}
          <div className="mb-6 w-full text-center text-2xl font-bold uppercase tracking-wider text-white">
            Play
          </div>

          {/* Full Name */}
          <label htmlFor="reg-fullname" className="mb-1.5 inline-block text-sm font-medium text-neutral-300">
            Full Name*
          </label>
          <input 
            id="reg-fullname" 
            type="text" 
            placeholder="John Doe" 
            value={fullname}
            onChange={(e) => { setFullname(e.target.value); if (error) setError('') }}
            className={`mb-3 w-full rounded-lg border bg-transparent px-3 py-2 text-white placeholder-neutral-500 outline-none transition-all duration-150 focus:border-[#ae7aff] focus:ring-1 focus:ring-[#ae7aff] ${error ? 'border-red-500/50' : 'border-neutral-700'}`}
          />

          {/* Username */}
          <label htmlFor="reg-username" className="mb-1.5 inline-block text-sm font-medium text-neutral-300">
            Username*
          </label>
          <input 
            id="reg-username" 
            type="text" 
            placeholder="johndoe" 
            value={username}
            onChange={(e) => { setUsername(e.target.value); if (error) setError('') }}
            className={`mb-3 w-full rounded-lg border bg-transparent px-3 py-2 text-white placeholder-neutral-500 outline-none transition-all duration-150 focus:border-[#ae7aff] focus:ring-1 focus:ring-[#ae7aff] ${error ? 'border-red-500/50' : 'border-neutral-700'}`}
          />

          {/* Email */}
          <label htmlFor="reg-email" className="mb-1.5 inline-block text-sm font-medium text-neutral-300">
            Email*
          </label>
          <input 
            id="reg-email" 
            type="email" 
            placeholder="john@example.com" 
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (error) setError('') }}
            className={`mb-3 w-full rounded-lg border bg-transparent px-3 py-2 text-white placeholder-neutral-500 outline-none transition-all duration-150 focus:border-[#ae7aff] focus:ring-1 focus:ring-[#ae7aff] ${error ? 'border-red-500/50' : 'border-neutral-700'}`}
          />

          {/* Password */}
          <label htmlFor="reg-password" className="mb-1.5 inline-block text-sm font-medium text-neutral-300">
            Password*
          </label>
          <input 
            id="reg-password" 
            type="password" 
            placeholder="Minimum 6 characters" 
            value={password}
            onChange={(e) => { setPassword(e.target.value); if (error) setError('') }}
            className={`mb-3 w-full rounded-lg border bg-transparent px-3 py-2 text-white placeholder-neutral-500 outline-none transition-all duration-150 focus:border-[#ae7aff] focus:ring-1 focus:ring-[#ae7aff] ${error ? 'border-red-500/50' : 'border-neutral-700'}`}
          />

          {/* Avatar File */}
          <label htmlFor="reg-avatar" className="mb-1.5 inline-block text-sm font-medium text-neutral-300">
            Avatar Image*
          </label>
          <input 
            id="reg-avatar" 
            type="file" 
            accept="image/*"
            onChange={(e) => { setAvatarFile(e.target.files?.[0] || null); if (error) setError('') }}
            className="mb-4 w-full border border-neutral-700 bg-transparent p-1.5 text-sm text-white file:mr-3 file:border-none file:bg-[#ae7aff] file:px-3 file:py-1 file:font-semibold file:text-black file:cursor-pointer rounded-lg"
          />

          {/* Error Message */}
          {error && (
            <div className="mb-4 text-xs font-semibold text-red-500 transition-opacity">
              {error}
            </div>
          )}

          {/* Action Button */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#ae7aff] py-3 font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out hover:bg-[#b98dff] active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating Account...' : 'Sign up'}
          </button>

          {/* Cancel */}
          <button 
            type="button"
            onClick={onClose}
            className="mt-5 text-center text-sm font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register
