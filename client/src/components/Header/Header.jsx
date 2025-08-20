import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
    
    return (
        <nav className="bg-base-100 shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-gray-800">
                    PollMap
                </Link>
                <nav className="space-x-4">
                    <Link to="/login" className="text-gray-600 hover:text-gray-800">
                        Login
                    </Link>
                    <Link to="/signup" className="text-gray-600 hover:text-gray-800">
                        Sign Up
                    </Link>
                </nav>
            </div>
      </nav>  
    )
}
export default Header;