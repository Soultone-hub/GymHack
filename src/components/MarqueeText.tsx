import React, { useRef, useEffect, useState } from 'react';

interface MarqueeTextProps {
  text: string;
  className?: string;
  /** pixels per second — default 35 */
  speed?: number;
  /** pause at start before scrolling (ms) — default 1200 */
  delay?: number;
}

/**
 * Displays text normally when it fits.
 * If it overflows, scrolls it continuously like a marquee.
 */
export const MarqueeText: React.FC<MarqueeTextProps> = ({
  text,
  className = '',
  speed = 35,
  delay = 1200,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef      = useRef<HTMLSpanElement>(null);
  const [overflows, setOverflows] = useState(false);
  const [duration,  setDuration]  = useState(4);

  useEffect(() => {
    const measure = () => {
      if (!containerRef.current || !textRef.current) return;
      const cw = containerRef.current.clientWidth;
      const tw = textRef.current.scrollWidth;
      if (tw > cw + 2) {            // +2px tolerance
        setOverflows(true);
        setDuration(tw / speed);   // dynamic speed based on text length
      } else {
        setOverflows(false);
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [text, speed]);

  return (
    <div ref={containerRef} className={`overflow-hidden whitespace-nowrap ${className}`}>
      {overflows ? (
        <span
          ref={textRef}
          className="inline-block"
          style={{
            animation: `marquee-slide ${duration}s linear ${delay}ms infinite`,
            paddingRight: '3rem',
          }}
        >
          {text}
          {/* duplicate for seamless loop */}
          <span style={{ paddingLeft: '3rem' }}>{text}</span>
        </span>
      ) : (
        <span ref={textRef}>{text}</span>
      )}
    </div>
  );
};
