import React from 'react';

const badgeCount = 14;
const badgeBasePath = '/assets/badge'; // Assuming assets are served from public/assets

export function BadgeGallery() {
  // Handler to fallback to .gif if .png fails
  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (!img.src.endsWith('.gif')) {
      img.src = img.src.replace('.png', '.gif');
    }
  };

  return (
    <div className="flex flex-col items-start">
      <div className="flex flex-nowrap gap-1 items-center justify-start">
        {Array.from({ length: badgeCount }, (_, i) => (
          <span
            key={i}
            style={{
              display: 'inline-flex',
              borderRadius: 0,
              padding: 0,
              margin: 0,
              position: 'relative',
              background: 'transparent',
              boxShadow: '0 0 0 0 transparent',
            }}
          >
            <img
              src={`${badgeBasePath}${i + 1}.png`}
              alt={`Badge ${i + 1}`}
              className="w-5 h-5"
              style={{
                position: 'relative',
                zIndex: 1,
                background: 'transparent',
                border: 'none',
                borderRadius: 0,
                padding: 0,
                margin: 0,
                filter: 'drop-shadow(0 0 6px #60a5fa) drop-shadow(0 0 50px #22d3ee) drop-shadow(0 0 12px #a78bfa)'
              }}
              onError={handleImgError}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
