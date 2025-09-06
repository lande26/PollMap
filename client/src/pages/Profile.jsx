import React, { useState, useEffect } from 'react';
import {User,Mail,BarChart3, Users, MessageCircle, Settings, CreditCard, Lock, LogOut, Edit2, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    return (
        <>
        <h1 className="text-2xl text-white">Profile Page</h1>
        <p className="text-white">Email: {user?.email}</p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
        </button>
        </>
    )

}

export default Profile;

