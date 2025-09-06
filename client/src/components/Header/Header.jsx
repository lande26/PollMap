import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserAuth } from '../../context/AuthContext';

function Header() {
  const { user, signOut } = UserAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  
  const handleLogout = async () => {
    try {
      await signOut();
      setDropdownOpen(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getUserId = () => {
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return '';
  };

  return (
    <header className="bg-[#0D1425] fixed top-0 left-0 right-0 w-full h-16 z-[1000] shadow-lg border-0">
      <nav className="w-full h-full">
        <div className="max-w-full h-full flex items-center justify-between px-6">
          <Link to="/dashboard" className="text-blue-600 text-2xl font-bold flex-shrink-0 hover:opacity-80 transition-opacity duration-200">
            PollMap
          </Link>
          
          <div className="flex items-center space-x-6 flex-shrink-0">
        {user ? (
          <>
            <Link to="/polls" className="text-blue-600 text-xl hover:text-gray-300 whitespace-nowrap">
              Polls
            </Link>
            
                <div className="relative">
                  <div 
                    className="w-8 h-8 bg-[#4f4f4f] rounded-full flex items-center justify-center text-white text-sm font-medium cursor-pointer hover:bg-blue-600 flex-shrink-0 transition-colors duration-200"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    {getUserId()?.charAt(0).toUpperCase() || 'U'}
                  </div>
              
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-black rounded-lg shadow-xl border border-gray-200 z-[60] overflow-hidden">
                      <div className="py-2">
                        <Link 
                          to="/profile" 
                          className="flex items-center px-4 py-2 text-blue-600 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Profile
                        </Link>
                        
                        <Link 
                          to="/bookmarks" 
                          className="flex items-center px-4 py-2 text-blue-600 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                          Bookmarks
                        </Link>
                        
                        <div className="px-2 pb-2">
                          <button 
                            onClick={handleLogout}
                            className="w-full flex items-center px-3 py-2 bg-black text-red-500 rounded-md hover:bg-gray-800 transition-colors duration-200"
                          >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="text-white text-sm hover:text-gray-300 whitespace-nowrap">
              Login
            </Link>
            <Link to="/signup" className="bg-white text-[#133E87] hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all duration-200 border border-transparent hover:border-gray-300">
              Sign Up
            </Link>
          </>
        )}
        </div>
      </div>
      
      {dropdownOpen && (
        <div 
          className="fixed inset-0 z-[55]" 
          onClick={() => setDropdownOpen(false)}
        ></div>
      )}
    </nav>  
    </header>
  );
}

export default Header;