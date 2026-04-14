import { useState } from 'react'

type Props = {
  images: string[]
  name: string
}

export default function ProductGallery({ images, name }: Props) {
  const [active, setActive] = useState(0)

  return (
    <div className="space-y-3 lg:sticky lg:top-24 self-start">
      {/* Main image */}
      <div className="relative overflow-hidden bg-muted" style={{ aspectRatio: '4/5' }}>
        <img
          src={images[active]}
          alt={`${name} — main view`}
          className="w-full h-full object-cover transition-opacity duration-200"
          key={active}
        />
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-3 gap-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`View ${name} image ${i + 1}`}
            aria-current={active === i ? 'true' : undefined}
            className={`cursor-pointer relative overflow-hidden bg-muted transition-all duration-150 ${
              active === i
                ? 'ring-2 ring-primary ring-offset-1'
                : 'opacity-60 hover:opacity-100'
            }`}
            style={{ aspectRatio: '1' }}
          >
            <img
              src={img}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
