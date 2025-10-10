
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import Polls from './polls.jsx';
// import PasswordProtectedPoll from '../components/ProtectedRoute/PasswordProtectedPoll.jsx'
// import { supabase } from '../supabaseClient';
// import { UserAuth } from '../context/AuthContext';

// const PollPage = () => {
//   const { pollId } = useParams();
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isPasswordProtected, setIsPasswordProtected] = useState(false);
//   const [isCreator, setIsCreator] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { user } = UserAuth();

//   useEffect(() => {
//     const checkPasswordProtection = async () => {
//       try {
//         const { data, error } = await supabase
//           .from('polls')
//           .select('is_password_protected, created_by')
//           .eq('id', pollId)
//           .single();

//         if (error) throw error;
        
//         setIsPasswordProtected(data.is_password_protected);

//         if(user && data.created_by === user.id){
//             setIsCreator(true);
//             setIsAuthenticated(true);
//         }
//         setLoading(false);
//       } catch (err) {
//         console.error('Error checking password protection:', err);
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     checkPasswordProtection();
//   }, [pollId, user]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;
  
//   if (isPasswordProtected && !isCreator && !isAuthenticated) {
//     return <PasswordProtectedPoll pollId={pollId} onAuthenticated={() => setIsAuthenticated(true)} />;
//   }

//   return <Polls pollId={pollId} />;
// };

// export default PollPage;


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Polls from './polls.jsx';
import PasswordProtectedPoll from '../components/ProtectedRoute/PasswordProtectedPoll.jsx';
import { supabase } from '../supabaseClient';
import { UserAuth } from '../context/AuthContext';

const PollPage = () => {
  const { pollId } = useParams();
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

    checkPasswordProtection();
  }, [pollId, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Error loading poll</div>
          <div className="text-gray-400">{error}</div>
        </div>
      </div>
    );
  }
  
  if (isPasswordProtected && !isCreator && !isAuthenticated) {
    return (
      <PasswordProtectedPoll 
        pollId={pollId} 
        onAuthenticated={() => setIsAuthenticated(true)} 
      />
    );
  }

  return <Polls pollId={pollId} />;
};

export default PollPage;