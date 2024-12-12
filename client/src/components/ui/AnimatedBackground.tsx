export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-grid-foreground/[0.03] bg-[size:60px_60px] animate-pulse-slow" />
      
      <div
        className="absolute inset-y-0 right-1/2 -z-10 w-[200%] origin-bottom-left 
        skew-x-[-30deg] bg-muted/30 
        shadow-[0_0_50px_20px] shadow-primary/20 
        ring-1 ring-primary/10 
        animate-glow-pulse
        translate-x-[-20%] sm:translate-x-[-10%] lg:translate-x-0
        xl:origin-center"
        aria-hidden="true"
      />
      
      <div className="absolute left-1/2 top-0 h-[80vh] w-[80vw] -translate-x-1/2 
        stroke-muted-foreground/30 
        [mask-image:linear-gradient(to_bottom,white_30%,transparent_80%)] 
        sm:h-screen sm:w-screen">
        <svg
          viewBox="0 0 1026 1026"
          fill="none"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full animate-spin-slow"
        >
          <path
            d="M1025 513c0 282.77-229.23 512-512 512S1 795.77 1 513 230.23 1 513 1s512 229.23 512 512Z"
            stroke="currentColor"
            strokeOpacity="0.8"
            className="filter drop-shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]"
          />
          <path
            d="M513 1025C230.23 1025 1 795.77 1 513"
            stroke="url(#gradient-1)"
            strokeLinecap="round"
            className="animate-pulse-slow"
          />
          <defs>
            <linearGradient
              id="gradient-1"
              x1="1"
              y1="513"
              x2="1"
              y2="1025"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="currentColor" stopOpacity="0.7" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}