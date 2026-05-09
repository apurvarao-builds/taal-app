import { useState } from 'react'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useAuthStore } from '../store/authStore'
import { signIn, signUp, resetPassword, updatePassword } from '../hooks/useAuth'

export function AuthPage() {
  const { recoveryMode, setRecoveryMode } = useAuthStore()
  const [mode, setMode]         = useState('signin')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [info, setInfo]         = useState('')
  const [loading, setLoading]   = useState(false)

  if (recoveryMode) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gold">Taal</h1>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-6">
            <h2 className="text-base font-semibold text-text-main mb-1">Set new password</h2>
            <p className="text-xs text-text-sub mb-5">Choose a new password for your account.</p>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                setError('')
                setLoading(true)
                try {
                  await updatePassword(password)
                  setRecoveryMode(false)
                } catch (err) {
                  setError(err.message || 'Something went wrong')
                } finally {
                  setLoading(false)
                }
              }}
              className="space-y-4"
            >
              <Input
                label="New password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              {error && (
                <p className="text-sm text-red-400 bg-red-900/20 border border-red-800/40 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
              <Button type="submit" disabled={loading} className="w-full justify-center">
                {loading ? 'Saving...' : 'Set password'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)
    try {
      if (mode === 'signin') {
        await signIn(email, password)
      } else if (mode === 'signup') {
        await signUp(email, password)
        setInfo('Check your email to confirm your account, then sign in.')
        setMode('signin')
      } else if (mode === 'reset') {
        await resetPassword(email)
        setInfo('Password reset email sent - check your inbox.')
        setMode('signin')
      }
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gold">Taal</h1>
          <p className="text-text-sub mt-2">Your Kathak practice journal</p>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-6">
          <h2 className="text-base font-semibold text-text-main mb-5">
            {mode === 'signin' ? 'Welcome back' : mode === 'signup' ? 'Create account' : 'Reset password'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {mode !== 'reset' && (
              <div>
                <Input
                  label="Password"
                  type="password"
                  placeholder={mode === 'signup' ? 'At least 6 characters' : ''}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => { setMode('reset'); setError(''); setInfo('') }}
                    className="text-xs text-muted hover:text-gold mt-1.5 transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
            )}
            {error && (
              <p className="text-sm text-red-400 bg-red-900/20 border border-red-800/40 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            {info && (
              <p className="text-sm text-emerald-400 bg-emerald-900/20 border border-emerald-800/40 rounded-lg px-3 py-2">
                {info}
              </p>
            )}
            <Button type="submit" disabled={loading} className="w-full justify-center">
              {loading ? 'Please wait...'
                : mode === 'signin' ? 'Sign in'
                : mode === 'signup' ? 'Create account'
                : 'Send reset email'}
            </Button>
          </form>
          <p className="text-sm text-center text-text-sub mt-4">
            {mode === 'signin' ? (
              <>No account?{' '}
                <button onClick={() => { setMode('signup'); setError(''); setInfo('') }} className="text-gold hover:text-gold-light transition-colors">Sign up</button>
              </>
            ) : (
              <button onClick={() => { setMode('signin'); setError(''); setInfo('') }} className="text-gold hover:text-gold-light transition-colors">Back to sign in</button>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
