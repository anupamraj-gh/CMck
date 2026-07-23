import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { PhotoPlaceholder } from '@/components/craft/PhotoPlaceholder'

interface PolaroidProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  src: string
  alt: string
  caption?: string
  rotate?: number
  aspect?: string
}

export function Polaroid({
  src,
  alt,
  caption,
  rotate = -3,
  aspect = 'aspect-square',
  className,
  ...props
}: PolaroidProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30, rotate: rotate - 8 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ rotate: 0, y: -6, scale: 1.03, transition: { duration: 0.3 } }}
      className={cn('craft-shadow-lg bg-paper p-3 pb-5 rounded-sm', className)}
      {...props}
    >
      <div className={cn('overflow-hidden bg-lavender-deep', aspect)}>
        {src ? (
          <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <PhotoPlaceholder />
        )}
      </div>
      {caption && (
        <p className="font-hand text-xl text-ink text-center pt-2.5 leading-none">{caption}</p>
      )}
    </motion.div>
  )
}
