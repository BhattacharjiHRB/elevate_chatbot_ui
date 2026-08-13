'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Mail, AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface LoginPageProps {
  onLoginSuccess: (email: string) => void
}

// List of blocked public email domains
const BLOCKED_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'aol.com',
  'mail.com',
  'protonmail.com',
  'icloud.com',
  'yandex.com',
  'mail.ru',
  'qq.com',
  'zoho.com',
  'tutanota.com',
  'web.de',
  'fremail.com',
  '163.com',
  'sina.com',
]

// List of recognized educational and organizational Entra ID domains (non-exhaustive)
const ALLOWED_EDUCATIONAL_ORGS = [
  '.edu',
  '.net',
  '.org',
  'microsoft.com',
  'onmicrosoft.com',
]

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [privacyConsent, setPrivacyConsent] = useState(false)
  const [eulaConsent, setEulaConsent] = useState(false)
  const [cookieConsent, setCookieConsent] = useState(false)

  const validateEmail = (emailValue: string): boolean => {
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailValue)) {
      setError('Please enter a valid email address')
      return false
    }

    const domain = emailValue.split('@')[1].toLowerCase()

    // Check if domain is in blocked list
    if (BLOCKED_DOMAINS.includes(domain)) {
      setError('Public email domains are not allowed. Please use your organizational or educational email.')
      return false
    }

    // Check if it's an educational/organizational domain
    const isEducationalOrg = ALLOWED_EDUCATIONAL_ORGS.some(
      (allowedDomain) => domain.endsWith(allowedDomain)
    )

    if (!isEducationalOrg) {
      // Additional check: if it looks like a custom domain and not obviously public
      // Allow it if it's not in the blocked list
      if (domain.includes('company') || domain.includes('corp') || domain.includes('org') || 
          domain.includes('enterprise') || domain.includes('work')) {
        return true
      }
      
      // For other domains, be more lenient - allow if not in blocked list
      // In production, you'd validate against Entra ID
      setError('Please use an organizational or educational email address.')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Please enter an email address')
      return
    }
    if (!privacyConsent) {
      setError('Please accept the Privacy Policy to continue')
      return
    }

    if (!eulaConsent) {
      setError('Please accept the End User License Agreement to continue')
      return
    }

    if (!cookieConsent) {
      setError('Please accept the Cookie Policy to continue')
      return
}

    if (!validateEmail(email)) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate authentication delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // In production, this would validate against Azure Entra ID
      // For now, we'll just proceed with the validated email
      onLoginSuccess(email)
    } catch (err) {
      setError('Authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid =
    email.trim() &&
    privacyConsent &&
    eulaConsent &&
    cookieConsent &&
    !isLoading

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Content */}
      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="flex justify-center mb-4">
            <div className="rounded-lg flex items-center justify-center">
              <Image
              src="/assets/elevate.png"
              alt="Elevate Intelligence Logo"
              width={100}
              height={100}
              />
                              
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Elevate Intelligence</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Sign in with your organizational email</p>
        </div>

        {/* Login Card */}
        <div className="bg-card border border-border/50 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="flex gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError('')
                  }}
                  placeholder="your.name@company.com"
                  className={cn(
                    'w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200',
                    'bg-background text-foreground placeholder:text-muted-foreground/50',
                    'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    error && !email.trim() && 'border-destructive/30'
                  )}
                  disabled={isLoading}
                  autoFocus
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Only organizational and educational email addresses are allowed
              </p>
            </div>

          
            {/* Consent Section */}
            <div className="space-y-4 pt-2">

              {/* Privacy Policy */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={privacyConsent}
                  onChange={(e) => {
                    setPrivacyConsent(e.target.checked)
                    setError('')
                  }}
                  disabled={isLoading}
                  className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-border accent-[#F5821F] disabled:cursor-not-allowed disabled:opacity-50"
                />

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground font-medium group-hover:text-primary transition-colors">
                    I agree to the{' '}
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={(e) => {
                        e.preventDefault()
                        window.open('/privacy', '_blank')
                      }}
                    >
                      Privacy Policy
                    </button>
                  </p>
                </div>
              </label>

              {/* End User License Agreement */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={eulaConsent}
                  onChange={(e) => {
                    setEulaConsent(e.target.checked)
                    setError('')
                  }}
                  disabled={isLoading}
                  className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-border accent-[#F5821F] disabled:cursor-not-allowed disabled:opacity-50"
                />

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground font-medium group-hover:text-primary transition-colors">
                    I agree to the{' '}
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={(e) => {
                        e.preventDefault()
                        window.open('/eula', '_blank')
                      }}
                    >
                      End User License Agreement
                    </button>
                  </p>
                </div>
              </label>

              {/* Cookie Policy */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={cookieConsent}
                  onChange={(e) => {
                    setCookieConsent(e.target.checked)
                    setError('')
                  }}
                  disabled={isLoading}
                  className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-border accent-[#F5821F] disabled:cursor-not-allowed disabled:opacity-50"
                />

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground font-medium group-hover:text-primary transition-colors">
                    I agree to the{' '}
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={(e) => {
                        e.preventDefault()
                        window.open('/cookies', '_blank')
                      }}
                    >
                      Cookie Policy
                    </button>
                  </p>
                </div>
              </label>

            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={!isFormValid}
              className="w-full bg-[#F5821F] hover:bg-[#F5821F]/90 text-primary-foreground font-medium py-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Footer Info */}
          <div className="pt-4 border-t border-border/30 space-y-2 text-center">
            <p className="text-xs text-muted-foreground">
              Need help? Contact Us
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
