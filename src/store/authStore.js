import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  session: null,
  user: null,
  loading: true,
  recoveryMode: false,
  setSession: (session) =>
    set({ session, user: session?.user ?? null, loading: false }),
  setLoading: (loading) => set({ loading }),
  setRecoveryMode: (recoveryMode) => set({ recoveryMode }),
}))
