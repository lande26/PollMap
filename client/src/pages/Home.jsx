import React from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
    const navigate = useNavigate();

    return (
        <div className="flex bg-base-200 min-h-screen flex-col items-center text-white p-8">
      <h1 className="text-4xl mt-2 md:text-5xl font-bold mb-6 text-center flex flex-col gap-2 md:block">Welcome to PollMap</h1>
      <p className="text-lg text-center max-w-2xl mb-8">
        PollMap is your platform for real-time, interactive polling. Create polls, participate in
        active discussions, and get instant feedback with live updates and visualizations. Discover
        what people think on topics that matter to you and have your voice heard!
      </p>
      <div className ="flex flex-col md:flex-row gap-4 mb-8">
        <button
          className="btn btn-primary px-6 py-3 text-lg font-semibold"
          onClick={() => navigate('/login')}
        >
          Create Poll
        </button>
      </div>
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="bg-base-300 p-6 rounded-lg shadow-md w-full lg:w-96 text-center">
          <h2 className="text-3xl font-semibold mb-4">Create Polls</h2>
          <p className="text-gray-400">
            Create custom polls on any topic and share them with others. Add options, set
            permissions, and see the responses roll in real-time.
          </p>
        </div>
        <div className="bg-base-300 p-6 rounded-lg shadow-md w-full lg:w-96 text-center">
          <h2 className="text-3xl font-semibold mb-4">Vote & Participate</h2>
          <p className="text-gray-400">
            Browse a variety of public polls or join private ones shared with you. Cast your vote
            and see the real-time results as others participate.
          </p>
        </div>
        <div className="bg-base-300 p-6 rounded-lg shadow-md w-full lg:w-96 text-center">
          <h2 className="text-3xl font-semibold mb-4">Bookmark & Track</h2>
          <p className="text-gray-400">
            Bookmark polls to save them for later, view your past participation, and stay updated
            on topics you care about.
          </p>
        </div>
      </div>
    </div>

    )
}

export default Home