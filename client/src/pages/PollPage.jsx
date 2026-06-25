import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Polls from './polls';
import PasswordProtectedPoll from '../components/ProtectedRoute/PasswordProtectedPoll';
import { supabase } from '../supabaseClient';
import { UserAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import PageShell, { GlassSection } from '../components/ui/PageShell.jsx';

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
      <PageShell
        width="max-w-4xl"
        badge={<span>Poll Access</span>}
        title="Opening poll"
        description="Loading the poll surface and checking access requirements."
      >
        <GlassSection className="flex min-h-[320px] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-orange-400"></div>
        </GlassSection>
      </PageShell>
    );
  }
  
  if (error) {
    return (
      <PageShell
        width="max-w-4xl"
        badge={<span>Poll Access</span>}
        title="Error loading poll"
        description="The single-poll screen failed before it could mount."
      >
        <GlassSection className="px-8 py-14 text-center">
          <div className="text-red-400 text-xl mb-4">Error loading poll</div>
          <div className="text-gray-400">{error}</div>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button 
              onClick={() => navigate('/polls')} 
              className="px-4 py-2 border border-white/10 bg-white/5 text-white rounded-lg hover:bg-white/10"
            >
              Back to Polls
            </button>
            <button 
              onClick={() => window.location.reload()} 
              className="rounded-lg bg-gradient-to-r from-orange-500 to-amber-400 px-4 py-2 text-slate-950 hover:from-orange-400 hover:to-amber-300"
            >
              Try Again
            </button>
          </div>
        </GlassSection>
      </PageShell>
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
