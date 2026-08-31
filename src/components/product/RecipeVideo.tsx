import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WashiTape } from '@/components/decor/Doodles'
import { DURATION, EASE } from '@/lib/motion'

interface RecipeVideoProps {
  videoUrl: string
  poster: string
  productName: string
}

function Sprockets() {
  return (
    <div className="flex gap-2.5 px-3" aria-hidden>
      {Array.from({ length: 14 }).map((_, i) => (
        <span key={i} className="h-2.5 w-4 rounded-[3px] bg-lavender/90 shrink-0" />
      ))}
    </div>
  )
}

export function RecipeVideo({ videoUrl, poster, productName }: RecipeVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  return (
    <section className="relative pt-2">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, ease: EASE.entrance }}
          className="relative max-w-5xl mx-auto"
        >
          <WashiTape className="left-8 -top-3 z-20" color="var(--color-butter)" rotate={-6} width={90} />
          <WashiTape className="right-8 -top-3 z-20" color="var(--color-pink)" rotate={5} width={90} />

          <div className="bg-ink rounded-2xl overflow-hidden craft-shadow-lg">
            <div className="py-2 bg-ink/90">
              <Sprockets />
            </div>
            <div className="relative aspect-video w-full overflow-hidden">
              <video
                ref={videoRef}
                src={videoUrl}
                poster={poster || undefined}
                muted={isMuted}
                loop
                playsInline
                className="w-full h-full object-cover"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/10 pointer-events-none" />

              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
                <p className="font-hand text-2xl text-butter mb-1">watch the recipe</p>
                <p className="font-serif text-xl sm:text-3xl font-bold text-cream mb-4">
                  How We Make {productName}
                </p>

                <div className="flex items-center gap-3">
                  <Button
                    variant="coral"
                    size="icon"
                    onClick={togglePlay}
                    className="rounded-full h-12 w-12"
                    aria-label={isPlaying ? 'Pause video' : 'Play video'}
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="rounded-full h-10 w-10 text-cream hover:bg-white/10"
                    aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
            <div className="py-2 bg-ink/90">
              <Sprockets />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
