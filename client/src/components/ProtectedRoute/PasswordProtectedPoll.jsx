
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PasswordProtectedPoll = ({ pollId, onAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('polls')
        .select('password_hash')
        .eq('id', pollId)
        .single();

      if (error) throw error;
      
      if(!data.password_hash){
        onAuthenticated();
        return;
      }
      
      if (data.password_hash === password) {
        onAuthenticated();
      } else {
        setError('Incorrect password');
      }
    } catch (err) {
      setError('Failed to verify password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-6">Password Protected</h2>
        <p className="text-gray-300 mb-6">This poll is password protected. Please enter the password to continue.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              required
            />
          </div>
          
          {error && <div className="text-red-400 mb-4">{error}</div>}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordProtectedPoll;