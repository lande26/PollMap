import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { PlusCircle, X, Lock, Clock } from 'lucide-react';

const CreatePoll = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState('');
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [expiresAt, setExpiresAt] = useState('');
  const [hasExpiration, setHasExpiration] = useState(false);
  const navigate = useNavigate();
  const { user } = UserAuth();
  
  const addOption = () => {
    if (options.length < 10) { // Limit to 10 options
      setOptions([...options, '']);
    }
  };
  
  const removeOption = (index) => {
    if (options.length > 2) { // Minimum 2 options
      const newOptions = [...options];
      newOptions.splice(index, 1);
      setOptions(newOptions);
    }
  };
  
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }
    
    const validOptions = options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) {
      setError('Please provide at least two options');
      return;
    }
    
    // If password protection is enabled, validate password
    if (isPasswordProtected && !password.trim()) {
      setError('Please enter a password');
      return;
    }
    
    // If expiration is enabled, validate expiration time
    if (hasExpiration && !expiresAt) {
      setError('Please set an expiration time');
      return;
    }
    
    // If expiration is enabled, check if it's in the future
    if (hasExpiration && expiresAt) {
      const expirationDate = new Date(expiresAt);
      if (expirationDate <= new Date()) {
        setError('Expiration time must be in the future');
        return;
      }
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Create the poll with all fields
      const { data: poll, error: pollError } = await supabase
        .from('polls')
        .insert([{
          question: question.trim(),
          created_by: user?.id,
          is_password_protected: isPasswordProtected,
          password_hash: isPasswordProtected ? password : null,
          expires_at: hasExpiration ? expiresAt : null
        }])
        .select()
        .single();
        
      if (pollError) throw pollError;
      
      // Create the options
      const optionsToInsert = validOptions.map(option => ({
        poll_id: poll.id,
        option_text: option.trim()
      }));
      
      const { error: optionsError } = await supabase
        .from('options')
        .insert(optionsToInsert);
        
      if (optionsError) throw optionsError;
      
      // Navigate to the poll page
      navigate(`/polls/${poll.id}`);
      
    } catch (err) {
      console.error('Error creating poll:', err);
      setError('Failed to create poll. Please try again.');
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 to-black">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-900/20 to-transparent"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h1 className="text-3xl font-bold text-white mb-6">Create a New Poll</h1>
            
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="question" className="block text-white font-medium mb-2">
                  Poll Question
                </label>
                <input
                  type="text"
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What do you want to ask?"
                />
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-white font-medium">
                    Options
                  </label>
                  <button
                    type="button"
                    onClick={addOption}
                    disabled={options.length >= 10}
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1 disabled:opacity-50"
                  >
                    <PlusCircle size={18} />
                    Add Option
                  </button>
                </div>
                
                <div className="space-y-3">
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Option ${index + 1}`}
                      />
                      {options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="text-red-400 hover:text-red-300 p-2"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Password Protection Section */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    id="passwordProtection"
                    checked={isPasswordProtected}
                    onChange={(e) => setIsPasswordProtected(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="passwordProtection" className="flex items-center gap-2 text-white font-medium cursor-pointer">
                    <Lock size={18} />
                    Password protect this poll
                  </label>
                </div>
                
                {isPasswordProtected && (
                  <div>
                    <label htmlFor="password" className="block text-white font-medium mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter password"
                    />
                    <p className="text-gray-400 text-sm mt-2">
                      Users will need to enter this password to access the poll
                    </p>
                  </div>
                )}
              </div>
              
              {/* Expiration Time Section */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    id="expiration"
                    checked={hasExpiration}
                    onChange={(e) => setHasExpiration(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="expiration" className="flex items-center gap-2 text-white font-medium cursor-pointer">
                    <Clock size={18} />
                    Set expiration time
                  </label>
                </div>
                
                {hasExpiration && (
                  <div>
                    <label htmlFor="expiresAt" className="block text-white font-medium mb-2">
                      Expires At
                    </label>
                    <input
                      type="datetime-local"
                      id="expiresAt"
                      value={expiresAt}
                      onChange={(e) => setExpiresAt(e.target.value)}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-gray-400 text-sm mt-2">
                      After this time, the poll will no longer accept votes
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 transition-colors"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      Creating...
                    </>
                  ) : (
                    'Create Poll'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePoll;