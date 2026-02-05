import React, {useRef} from 'react'
import { ImageOff } from 'lucide-react'
interface MediaDisplayProps {
  image_url?: string | null;
  video_url?: string | null;
  alt: string;
}
function MediaDisplay({ video_url, image_url, alt }: MediaDisplayProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  return (
    <div className="relative h-52 w-full overflow-hidden">
      {/* Priority 1: Video */}
      {video_url ? (
          <video
      ref={videoRef}
      src={video_url}
      className="h-full w-full object-cover"
      loop
      muted
      playsInline
      onMouseEnter={() => videoRef.current?.play()}
      onMouseLeave={() => videoRef.current?.pause()}
    />  
      ) : image_url ? (
        /* Priority 2: Image */
        <img
          src={image_url}
          alt={alt}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        /* Priority 3: Fallback */
        <div className="flex h-full flex-col items-center justify-center bg-gray-100">
          <ImageOff className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 font-medium">No Media</p>
        </div>
      )}
    </div>
  )
}

export default MediaDisplay