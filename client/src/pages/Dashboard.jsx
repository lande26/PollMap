import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { session, signOut } = UserAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const userEmail = session?.user?.email;
  const firstName = userEmail 
    ? userEmail.split('@')[0].replace(/[^a-zA-Z]/g, '') || 'User'
    : 'User';

  return (
    <div className="min-h-screen relative overflow-hidden">
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-6">
        <div className="text-center mb-16 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Welcome back,<br/>
            <span className="text-[#535BF1]">{firstName}!</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-12 leading-relaxed">
            PollMap is your platform for real-time, interactive polling. Create polls, participate in 
            active discussions, and get instant feedback with live updates and visualizations.
          </p>
          <button
            onClick={() => navigate('/polls')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-full text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl backdrop-blur-sm"
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

      </main>
</div>
  );
};

export default Dashboard;