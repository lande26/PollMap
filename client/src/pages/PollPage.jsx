import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Polls from './polls';
import PasswordProtectedPoll from '../components/ProtectedRoute/PasswordProtectedPoll';
import { supabase } from '../supabaseClient';
import { UserAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const PollPage = () => {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = UserAuth();

  useEffect(() => {
    const checkPasswordProtection = async () => {
      try {
        const { data, error } = await supabase
          .from('polls')
          .select('is_password_protected, created_by')
          .eq('id', pollId)
          .single();

        if (error) throw error;
        
        setIsPasswordProtected(data.is_password_protected);

        if(user && data.created_by === user.id){
            setIsCreator(true);
            setIsAuthenticated(true);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error checking password protection:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (pollId && pollId !== "undefined") {
      checkPasswordProtection();
    } else {
      setError("Invalid poll ID");
      setLoading(false);
    }
  }, [pollId, user]);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
    toast.success('Password verified successfully!');
  };

  const handleSkipPassword = () => {
    navigate('/polls');
    toast.info('Viewing public polls');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900  to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900  to-slate-900">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Error loading poll</div>
          <div className="text-gray-400">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  if (isPasswordProtected && !isCreator && !isAuthenticated) {
    return (
      <PasswordProtectedPoll 
        pollId={pollId} 
        onAuthenticated={handleAuthenticated} 
        onSkip={handleSkipPassword}
      />
    );
  }

  return <Polls pollId={pollId} />;
};

export default PollPage;