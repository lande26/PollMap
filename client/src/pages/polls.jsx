import React, { useState, useEffect } from 'react';
import {useQuery} from '@tanstack/react-query';
import socket from '../socket';

function Polls() {

    return (
        <>
        <h1 className="text-2xl text-white">Polls Page</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
        </button>
        </>
    )
}

export default Polls;