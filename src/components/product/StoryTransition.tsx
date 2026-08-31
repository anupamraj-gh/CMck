import { motion } from 'framer-motion'
import { WashiTape, ScribbleUnderline, StitchDivider } from '@/components/decor/Doodles'
import { DURATION, EASE } from '@/lib/motion'

/**
 * A gentle editorial beat between the Purchase Card and the recipe story — a washi-taped,
 * hand-lettered invitation to keep reading, not a modern section divider. Built entirely from
 * the existing scrapbook pieces (washi tape, scribble underline, stitched seam); the Notebook
 * section itself is untouched.
 */
export function StoryTransition() {
  return (
    <div className="relative py-16 sm:py-24 flex flex-col items-center text-center px-4">
      <WashiTape className="left-1/2 -top-3 -translate-x-1/2 z-10" color="var(--color-blue)" rotate={-4} width={84} />
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: DURATION.slow, ease: EASE.entrance }}
        className="font-hand text-3xl sm:text-4xl text-ink -rotate-1"
      >
        Here&apos;s how we make it
      </motion.p>
      <ScribbleUnderline className="h-2.5 w-28 text-coral-deep mt-2" />
      <StitchDivider className="h-4 w-full max-w-md text-ink-faint/35 mt-6" />
    </div>
  )
}
