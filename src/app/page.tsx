export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-center">
          🧬 Built With Science
        </h1>
      </div>

      <div className="relative flex place-items-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">
            Welcome to Built With Science
          </h2>
          <p className="text-lg text-gray-600">
            A modern platform for sharing and discovering scientific knowledge
          </p>
        </div>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
          <h3 className="mb-3 text-2xl font-semibold">
            Research
          </h3>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Explore cutting-edge scientific research and discoveries.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
          <h3 className="mb-3 text-2xl font-semibold">
            Collaborate
          </h3>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Connect with researchers and collaborate on projects.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
          <h3 className="mb-3 text-2xl font-semibold">
            Share
          </h3>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Share your research and get peer feedback.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
          <h3 className="mb-3 text-2xl font-semibold">
            Learn
          </h3>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Access educational content and scientific resources.
          </p>
        </div>
      </div>
    </main>
  )
}
