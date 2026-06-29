'use client'

import { useState, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import styles from './page.module.css'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const resetToken = searchParams.get('resetToken') ?? ''

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupError, setSignupError] = useState('')
  const [signupLoading, setSignupLoading] = useState(false)

  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotError, setForgotError] = useState('')
  const [forgotMessage, setForgotMessage] = useState('')
  const [forgotToken, setForgotToken] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)

  const [resetPassword, setResetPassword] = useState('')
  const [resetConfirmPassword, setResetConfirmPassword] = useState('')
  const [resetError, setResetError] = useState('')
  const [resetMessage, setResetMessage] = useState('')
  const [resetLoading, setResetLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Login failed')
        setLoading(false)
        return
      }

      window.location.href = '/graph'
    } catch {
      setError('Unable to connect to the server')
      setLoading(false)
    }
  }

  async function handleSignup(e: FormEvent) {
    e.preventDefault()
    setSignupError('')
    setSignupLoading(true)

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: signupName, email: signupEmail, password: signupPassword }),
      })

      const data = await res.json()
      if (!res.ok) {
        setSignupError(data.error || 'Sign up failed')
        setSignupLoading(false)
        return
      }

      window.location.href = '/graph'
    } catch {
      setSignupError('Unable to connect to the server')
      setSignupLoading(false)
    }
  }

  async function handleForgotPassword(e: FormEvent) {
    e.preventDefault()
    setForgotError('')
    setForgotMessage('')
    setForgotToken('')
    setForgotLoading(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      })

      const data = await res.json()
      if (!res.ok) {
        setForgotError(data.error || 'Failed to generate reset token')
        setForgotLoading(false)
        return
      }

      setForgotMessage('If the account exists, a reset token has been generated.')
      setForgotToken(data.resetToken || '')
      setForgotLoading(false)
    } catch {
      setForgotError('Unable to connect to the server')
      setForgotLoading(false)
    }
  }

  async function handleResetPassword(e: FormEvent) {
    e.preventDefault()
    setResetError('')
    setResetMessage('')

    const activeResetToken = forgotToken || resetToken
    if (!activeResetToken) {
      setResetError('Reset token is required')
      return
    }

    if (resetPassword !== resetConfirmPassword) {
      setResetError('Passwords do not match')
      return
    }

    setResetLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: activeResetToken, password: resetPassword }),
      })

      const data = await res.json()
      if (!res.ok) {
        setResetError(data.error || 'Failed to reset password')
        setResetLoading(false)
        return
      }

      setResetMessage('Password reset successful. You can sign in now.')
      setResetPassword('')
      setResetConfirmPassword('')
      setResetLoading(false)
      router.replace('/login')
    } catch {
      setResetError('Unable to connect to the server')
      setResetLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <Image
        src="/logo.png"
        alt=""
        width={520}
        height={520}
        className={styles.watermark}
        priority
      />

      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logoRow}>
            <Image src="/logo.png" alt="RedAmon" width={40} height={40} priority />
            <span className={styles.logoText}>
              <span className={styles.logoAccent}>Red</span>Amon
            </span>
          </div>
          <p className={styles.subtitle}>Sign in to your account</p>
        </div>

        <div className={styles.body}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Sign In</h2>
              <p className={styles.sectionDescription}>Access your existing RedAmon workspace.</p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              {error && <div className={styles.error}>{error}</div>}

              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>Email</label>
                <input
                  id="email"
                  type="email"
                  className={styles.input}
                  placeholder="admin@redamon.local"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoFocus
                  autoComplete="email"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="password" className={styles.label}>Password</label>
                <input
                  id="password"
                  type="password"
                  className={styles.input}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading || !email || !password}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </section>

          <div className={styles.divider} aria-hidden="true" />

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Sign Up</h2>
              <p className={styles.sectionDescription}>
                Create a new RedAmon account and start with your own workspace.
              </p>
            </div>
            <form className={styles.form} onSubmit={handleSignup}>
              {signupError && <div className={styles.error}>{signupError}</div>}

              <div className={styles.field}>
                <label htmlFor="signup-name" className={styles.label}>Name</label>
                <input
                  id="signup-name"
                  type="text"
                  className={styles.input}
                  placeholder="Your name"
                  value={signupName}
                  onChange={e => setSignupName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="signup-email" className={styles.label}>Email</label>
                <input
                  id="signup-email"
                  type="email"
                  className={styles.input}
                  placeholder="you@example.com"
                  value={signupEmail}
                  onChange={e => setSignupEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="signup-password" className={styles.label}>Password</label>
                <input
                  id="signup-password"
                  type="password"
                  className={styles.input}
                  placeholder="Create a password"
                  value={signupPassword}
                  onChange={e => setSignupPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={signupLoading || !signupName || !signupEmail || !signupPassword}
              >
                {signupLoading ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>
          </section>

          <div className={styles.divider} aria-hidden="true" />

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Forgot Password</h2>
              <p className={styles.sectionDescription}>
                Request a reset token and use it here to set a new password.
              </p>
            </div>
            <form className={styles.form} onSubmit={handleForgotPassword}>
              {forgotError && <div className={styles.error}>{forgotError}</div>}
              {forgotMessage && <div className={styles.success}>{forgotMessage}</div>}

              <div className={styles.field}>
                <label htmlFor="forgot-email" className={styles.label}>Email</label>
                <input
                  id="forgot-email"
                  type="email"
                  className={styles.input}
                  placeholder="you@example.com"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <button
                type="submit"
                className={styles.secondaryButton}
                disabled={forgotLoading || !forgotEmail}
              >
                {forgotLoading ? 'Generating token...' : 'Generate Reset Token'}
              </button>
            </form>

            {(forgotToken || resetToken) && (
              <div className={styles.infoCard}>
                <p className={styles.infoText}>
                  Use the token below to reset the password for your account.
                </p>
                <code className={styles.tokenBox}>{forgotToken || resetToken}</code>
                <form className={styles.form} onSubmit={handleResetPassword}>
                  {resetError && <div className={styles.error}>{resetError}</div>}
                  {resetMessage && <div className={styles.success}>{resetMessage}</div>}

                  <div className={styles.field}>
                    <label htmlFor="reset-password" className={styles.label}>New Password</label>
                    <input
                      id="reset-password"
                      type="password"
                      className={styles.input}
                      placeholder="Enter a new password"
                      value={resetPassword}
                      onChange={e => setResetPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="reset-confirm-password" className={styles.label}>Confirm Password</label>
                    <input
                      id="reset-confirm-password"
                      type="password"
                      className={styles.input}
                      placeholder="Confirm your new password"
                      value={resetConfirmPassword}
                      onChange={e => setResetConfirmPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                    />
                  </div>

                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={resetLoading || !resetPassword || !resetConfirmPassword || !(forgotToken || resetToken)}
                  >
                    {resetLoading ? 'Resetting password...' : 'Reset Password'}
                  </button>
                </form>
              </div>
            )}
          </section>
        </div>

        <div className={styles.footer}>
          <span className={styles.version}>
            {process.env.NEXT_PUBLIC_REDAMON_VERSION
              ? `v${process.env.NEXT_PUBLIC_REDAMON_VERSION}`
              : 'RedAmon'}
          </span>
        </div>
      </div>
    </div>
  )
}
