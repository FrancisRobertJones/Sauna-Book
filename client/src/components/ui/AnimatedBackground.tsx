export function AnimatedBackground() {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-foreground/[0.02] bg-[size:60px_60px]" />
        <div
          className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-muted/20 shadow-xl shadow-primary/10 ring-1 ring-primary/5 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center"
          aria-hidden="true"
        />
        <div className="absolute left-1/2 top-0 h-[80vh] w-[80vw] -translate-x-1/2 stroke-muted-foreground/20 [mask-image:linear-gradient(to_bottom,white_20%,transparent_75%)] sm:h-screen sm:w-screen">
          <svg
            viewBox="0 0 1026 1026"
            fill="none"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full animate-spin-slow"
          >
            <path
              d="M1025 513c0 282.77-229.23 512-512 512S1 795.77 1 513 230.23 1 513 1s512 229.23 512 512Z"
              stroke="currentColor"
              strokeOpacity="0.7"
              className="glow"
            />
            <path
              d="M513 1025C230.23 1025 1 795.77 1 513"
              stroke="url(#:R65m:-gradient-1)"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient
                id=":R65m:-gradient-1"
                x1="1"
                y1="513"
                x2="1"
                y2="1025"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="currentColor" />
                <stop offset="1" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    )
  }