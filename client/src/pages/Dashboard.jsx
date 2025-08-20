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
  const firstName = userEmail ? userEmail.split('@')[0] : 'User';

  return (
    <div className="flex bg-base-200 min-h-screen flex-col text-white">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">PollMap Dashboard</h1>
        </div>
    </div>
  );
};

export default Dashboard;