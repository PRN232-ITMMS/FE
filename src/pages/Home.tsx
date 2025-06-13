const Home = () => {
  return (
    <div className='flex min-h-[calc(100vh-128px)] items-center justify-center bg-gradient-to-br from-background to-muted/50'>
      <div className='container mx-auto text-center'>
        <div className='space-y-8'>
          {/* Hero Section */}
          <div className='space-y-4'>
            <h1 className='text-4xl font-bold tracking-tight text-foreground sm:text-6xl'>
              Welcome to <span className='text-primary'>Sporta</span>
            </h1>
            <p className='mx-auto max-w-2xl text-lg text-muted-foreground'>
              Your ultimate multi-sport platform connecting athletes, coaches, and sports enthusiasts worldwide. Built
              with modern technologies for the best experience.
            </p>
          </div>

          {/* Sports Icons */}
          <div className='flex justify-center space-x-8 py-8'>
            {/* Basketball */}
            <div className='flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20'>
              <svg className='h-8 w-8 text-orange-600 dark:text-orange-400' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z' />
              </svg>
            </div>

            {/* Soccer */}
            <div className='flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20'>
              <svg className='h-8 w-8 text-green-600 dark:text-green-400' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z' />
              </svg>
            </div>

            {/* Tennis */}
            <div className='flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/20 dark:to-yellow-800/20'>
              <svg className='h-8 w-8 text-yellow-600 dark:text-yellow-400' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z' />
              </svg>
            </div>

            {/* Volleyball */}
            <div className='flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20'>
              <svg className='h-8 w-8 text-purple-600 dark:text-purple-400' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z' />
              </svg>
            </div>
          </div>

          {/* Feature Cards */}
          {/* <div className='mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            <div className='group rounded-xl border bg-card/50 p-6 shadow-sm transition-all hover:bg-card/80 hover:shadow-lg'>
              <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
                <svg className='h-6 w-6 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                </svg>
              </div>
              <h3 className='mb-2 text-lg font-semibold text-card-foreground'>React 19</h3>
              <p className='text-sm text-muted-foreground'>
                Latest React with modern features and improved performance
              </p>
            </div>

            <div className='group rounded-xl border bg-card/50 p-6 shadow-sm transition-all hover:bg-card/80 hover:shadow-lg'>
              <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
                <svg className='h-6 w-6 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <h3 className='mb-2 text-lg font-semibold text-card-foreground'>TypeScript</h3>
              <p className='text-sm text-muted-foreground'>Type-safe development experience with strict mode</p>
            </div>

            <div className='group rounded-xl border bg-card/50 p-6 shadow-sm transition-all hover:bg-card/80 hover:shadow-lg'>
              <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
                <svg className='h-6 w-6 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z'
                  />
                </svg>
              </div>
              <h3 className='mb-2 text-lg font-semibold text-card-foreground'>ShadcnUI</h3>
              <p className='text-sm text-muted-foreground'>Beautiful UI components with dark/light mode support</p>
            </div>

            <div className='group rounded-xl border bg-card/50 p-6 shadow-sm transition-all hover:bg-card/80 hover:shadow-lg'>
              <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
                <svg className='h-6 w-6 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                  />
                </svg>
              </div>
              <h3 className='mb-2 text-lg font-semibold text-card-foreground'>Zustand</h3>
              <p className='text-sm text-muted-foreground'>Lightweight and powerful state management solution</p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default Home
