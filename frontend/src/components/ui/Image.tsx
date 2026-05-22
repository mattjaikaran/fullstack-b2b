import {
  useState,
  useRef,
  useCallback,
  type ReactNode,
  type SyntheticEvent,
  type CSSProperties,
  type ImgHTMLAttributes,
} from 'react'
import { cn } from '@/lib/utils'

type ImageLayout = 'responsive' | 'fill' | 'fixed' | 'intrinsic'
type ImagePlaceholder = 'skeleton' | 'blur' | 'none'
type ImageRounded = false | 'sm' | 'md' | 'lg' | 'full'
type LoadStatus = 'loading' | 'loaded' | 'error'

export interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'placeholder'> {
  src: string
  alt: string
  layout?: ImageLayout
  aspectRatio?: string
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  objectPosition?: string
  placeholder?: ImagePlaceholder
  blurDataURL?: string
  priority?: boolean
  fallbackSrc?: string
  fallback?: ReactNode
  rounded?: ImageRounded
  wrapperClassName?: string
}

export interface AvatarImageProps extends Omit<ImageProps, 'layout' | 'rounded' | 'objectFit'> {
  size?: number
}

const roundedMap: Record<Exclude<ImageRounded, false>, string> = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
}

const Image = ({
  src,
  alt,
  layout = 'responsive',
  aspectRatio,
  objectFit = 'cover',
  objectPosition = 'center',
  placeholder = 'none',
  blurDataURL,
  priority = false,
  fallbackSrc,
  fallback,
  rounded = false,
  wrapperClassName,
  className,
  width,
  height,
  style,
  onLoad,
  onError,
  ...props
}: ImageProps) => {
  const prevSrcRef = useRef(src)
  const [useFallback, setUseFallback] = useState(false)
  const [status, setStatus] = useState<LoadStatus>('loading')

  if (prevSrcRef.current !== src) {
    prevSrcRef.current = src
    setUseFallback(false)
    setStatus('loading')
  }

  const currentSrc = useFallback && fallbackSrc ? fallbackSrc : src

  const imgCallbackRef = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete) {
      setStatus('loaded')
    }
  }, [])

  const handleLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    setStatus('loaded')
    onLoad?.(e)
  }

  const handleError = (e: SyntheticEvent<HTMLImageElement>) => {
    if (fallbackSrc && !useFallback) {
      setUseFallback(true)
      setStatus('loading')
    } else {
      setStatus('error')
    }
    onError?.(e)
  }

  const isLoading = status === 'loading'
  const isError = status === 'error'
  const roundedClass = rounded ? roundedMap[rounded] : ''

  if (isError && fallback) {
    return <>{fallback}</>
  }

  const wrapperStyle: CSSProperties = {}
  const imgStyle: CSSProperties = { objectFit, objectPosition, ...style }

  if (layout === 'fill') {
    wrapperStyle.position = 'absolute'
    wrapperStyle.inset = 0
    imgStyle.width = '100%'
    imgStyle.height = '100%'
  } else if (layout === 'fixed') {
    wrapperStyle.display = 'inline-block'
    wrapperStyle.position = 'relative'
    if (width) wrapperStyle.width = width
    if (height) wrapperStyle.height = height
    imgStyle.width = width
    imgStyle.height = height
  } else if (layout === 'intrinsic') {
    wrapperStyle.display = 'inline-block'
    wrapperStyle.position = 'relative'
    wrapperStyle.maxWidth = '100%'
    if (width) imgStyle.width = width
    if (height) imgStyle.height = height
  } else {
    wrapperStyle.position = 'relative'
    wrapperStyle.width = '100%'
    if (aspectRatio) {
      wrapperStyle.aspectRatio = aspectRatio
    } else if (width && height) {
      wrapperStyle.aspectRatio = `${width}/${height}`
    }
    imgStyle.width = '100%'
    imgStyle.height = '100%'
  }

  const showSkeleton = isLoading && placeholder === 'skeleton'
  const showBlur = isLoading && placeholder === 'blur' && Boolean(blurDataURL)

  return (
    <span
      className={cn('block overflow-hidden', roundedClass, wrapperClassName)}
      style={wrapperStyle}
    >
      {showSkeleton && (
        <span
          className={cn('absolute inset-0 animate-pulse bg-gray-200', roundedClass)}
        />
      )}
      {showBlur && (
        <img
          src={blurDataURL}
          aria-hidden
          alt=""
          className={cn('absolute inset-0 h-full w-full scale-110 blur-xl', roundedClass)}
          style={{ objectFit }}
        />
      )}
      <img
        ref={imgCallbackRef}
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? undefined : 'lazy'}
        decoding={priority ? undefined : 'async'}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          roundedClass,
          className,
        )}
        style={imgStyle}
        {...props}
      />
    </span>
  )
}

const AvatarImage = ({ size = 40, width, height, ...props }: AvatarImageProps) => (
  <Image
    layout="fixed"
    rounded="full"
    objectFit="cover"
    width={width ?? size}
    height={height ?? size}
    {...props}
  />
)

const HeroImage = (
  props: Omit<ImageProps, 'layout' | 'aspectRatio' | 'priority' | 'objectFit'>,
) => (
  <Image
    layout="responsive"
    aspectRatio="16/9"
    priority
    objectFit="cover"
    {...props}
  />
)

const ThumbnailImage = (
  props: Omit<ImageProps, 'layout' | 'aspectRatio' | 'rounded' | 'objectFit'>,
) => (
  <Image
    layout="responsive"
    aspectRatio="16/9"
    rounded="md"
    objectFit="cover"
    {...props}
  />
)

export { Image, AvatarImage, HeroImage, ThumbnailImage }
