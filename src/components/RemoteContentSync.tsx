import { useEffect } from 'react'
import { loadRemoteContent } from '@/config/content'

const CONTENT_REFRESH_INTERVAL_MS = 60_000

export function RemoteContentSync() {
  useEffect(() => {
    if (!import.meta.env.VITE_CONTENT_URL) return

    void loadRemoteContent()
    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') void loadRemoteContent()
    }, CONTENT_REFRESH_INTERVAL_MS)

    return () => window.clearInterval(intervalId)
  }, [])

  return null
}
