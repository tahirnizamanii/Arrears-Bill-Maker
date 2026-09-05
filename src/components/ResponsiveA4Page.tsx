import React, { useState, useEffect, useRef } from 'react';

interface ResponsiveA4PageProps {
  children: React.ReactNode;
  pageTitle: string;
  zoomScale: number; // 0 for auto-fit, >0 for fixed scale (e.g. 1 for 100%)
}

export const ResponsiveA4Page: React.FC<ResponsiveA4PageProps> = ({
  children,
  pageTitle,
  zoomScale,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', updateWidth);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  const BASE_WIDTH = 794;
  const BASE_HEIGHT = 1123;

  // Calculate actual scale factor
  let scale = 1;
  if (zoomScale > 0) {
    scale = zoomScale;
  } else if (containerWidth > 0) {
    // Auto-fit mode: Scale down if container is narrower than 794px, cap at 1.0 on desktop
    const availableWidth = Math.max(containerWidth - 16, 280);
    scale = Math.min(1, availableWidth / BASE_WIDTH);
  }

  const scaledHeight = BASE_HEIGHT * scale;
  const scaledWidth = BASE_WIDTH * scale;

  return (
    <div className="page-break w-full flex flex-col items-center">
      <div className="text-center mb-2 font-bold text-xs text-neutral-500 uppercase tracking-widest no-print">
        {pageTitle}
      </div>

      <div
        ref={containerRef}
        className="w-full flex justify-center overflow-x-auto py-1"
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div
          className="relative transition-all duration-150 ease-out"
          style={{
            width: `${scaledWidth}px`,
            height: `${scaledHeight}px`,
            minWidth: `${scaledWidth}px`,
            minHeight: `${scaledHeight}px`,
          }}
        >
          <div
            style={{
              width: `${BASE_WIDTH}px`,
              height: `${BASE_HEIGHT}px`,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              position: 'absolute',
              top: 0,
              left: 0,
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
              borderRadius: '2px',
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
