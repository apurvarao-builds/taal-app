import { useState } from 'react'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { signIn, signUp } from '../hooks/useAuth'

export function AuthPage() {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)

    try {
      if (mode === 'signin') {
        await signIn(email, password)
      } else {
        await signUp(email, password)
        setInfo('Check your email to confirm your account, then sign in.')
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
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gold">Taal</h1>
          <p className="text-text-sub mt-2">Your Kathak practice journal</p>
        </div>

        {/* Card */}
        <div className="bg-surface border border-border rounded-2xl p-6">
          <h2 className="text-base font-semibold text-text-main mb-5">
            {mode === 'signin' ? 'Welcome back' : 'Create account'}
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
            <Input
              label="Password"
              type="password"
              placeholder={mode === 'signup' ? 'At least 6 characters' : ''}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

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
              {loading
                ? 'Please wait…'
                : mode === 'signin' ? 'Sign in' : 'Create account'}
            </Button>
          </form>

          <p className="text-sm text-center text-text-sub mt-4">
            {mode === 'signin' ? (
              <>No account?{' '}
                <button onClick={() => setMode('signup')} className="text-gold hover:text-gold-light transition-colors">
                  Sign up
                </button>
              </>
            ) : (
              <>Already have one?{' '}
                <button onClick={() => setMode('signin')} className="text-gold hover:text-gold-light transition-colors">
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
