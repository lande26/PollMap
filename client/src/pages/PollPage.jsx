
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Polls from './polls.jsx';
import PasswordProtectedPoll from '../components/ProtectedRoute/PasswordProtectedPoll.jsx'
import { supabase } from '../supabaseClient';
import { UserAuth } from '../context/AuthContext';

const PollPage = () => {
  const { pollId } = useParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [isCreater, setIsCreater] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = UserAuth();

  useEffect(() => {
    const checkPasswordProtection = async () => {
      try {
        const { data, error } = await supabase
          .from('polls')
          .select('is_password_protected, creator_by')
          .eq('id', pollId)
          .single();

        if (error) throw error;
        
        setIsPasswordProtected(data.is_password_protected);

        if(user && data.created_by === user.id){
            setIsCreater(true);
            setIsAuthenticated(true);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error checking password protection:', err);
        setLoading(false);
      }
    };

    checkPasswordProtection();
  }, [pollId, user]);

  if (loading) return <div>Loading...</div>;

  if (isPasswordProtected && !isCreater && !isAuthenticated) {
    return <PasswordProtectedPoll pollId={pollId} onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return <Polls pollId={pollId} />;
};

export default PollPage;