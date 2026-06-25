/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { createBrowserRouter, useNavigate } from 'react-router-dom';
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';
import { useAuthModal } from './context/AuthModalContext.jsx';
import { UserAuth } from './context/AuthContext.jsx';

const Home = React.lazy(() => import('./pages/Home.jsx'));
const Dashboard = React.lazy(() => import('./pages/Dashboard.jsx'));
const Profile = React.lazy(() => import('./pages/Profile.jsx'));
const Polls = React.lazy(() => import('./pages/polls.jsx'));
const CreatePoll = React.lazy(() => import('./pages/CreatePoll.jsx'));
const PollPage = React.lazy(() => import('./pages/PollPage.jsx'));
const PollAnalytics = React.lazy(() => import('./pages/PollAnalytics.jsx'));
const RoomsPage = React.lazy(() => import('./pages/RoomsPage.jsx'));
const RoomPage = React.lazy(() => import('./pages/RoomPage.jsx'));
const JoinRoomByLink = React.lazy(() => import('./pages/JoinRoomByLink.jsx'));

const RouteFallback = () => (
  <div className="flex min-h-[60vh] items-center justify-center px-4">
    <div className="rounded-3xl border border-white/10 bg-slate-950/50 px-8 py-6 text-center text-sm text-slate-300 backdrop-blur-xl">
      Loading page...
    </div>
  </div>
);

const withSuspense = (node) => (
  <React.Suspense fallback={<RouteFallback />}>
    {node}
  </React.Suspense>
);

const Layout = ({ children, showHeader = true, showFooter = true }) => (
  <div className="min-h-screen relative flex flex-col">
    {showHeader && <Header />}
    <div className={`flex-1 ${showHeader ? 'pt-20' : ''}`}>{children}</div>
    {showFooter && <Footer />}
  </div>
);

const AuthRouteHandler = ({ mode }) => {
  const navigate = useNavigate();
  const { openAuthModal } = useAuthModal();
  const { user, loading } = UserAuth();

  React.useEffect(() => {
    if (loading) return;

    if (user) {
      navigate('/dashboard', { replace: true });
      return;
    }

    openAuthModal({ mode, intent: 'signin' });
    navigate('/', { replace: true });
  }, [loading, mode, navigate, openAuthModal, user]);

  return null;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout showHeader>{withSuspense(<Home />)}</Layout>,
  },
  {
    path: '/login',
    element: <AuthRouteHandler mode="login" />,
  },
  {
    path: '/signup',
    element: <AuthRouteHandler mode="signup" />,
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute><Layout showHeader>{withSuspense(<Dashboard />)}</Layout></ProtectedRoute>,
  },
  {
    path: '/profile',
    element: <ProtectedRoute><Layout showHeader>{withSuspense(<Profile />)}</Layout></ProtectedRoute>,
  },
  {
    path: '/polls',
    element: <ProtectedRoute><Layout showHeader>{withSuspense(<Polls />)}</Layout></ProtectedRoute>,
  },
  {
    path: '/create-poll',
    element: <ProtectedRoute><Layout showHeader>{withSuspense(<CreatePoll />)}</Layout></ProtectedRoute>,
  },
  {
    path: '/polls/:pollId',
    element: <ProtectedRoute><Layout showHeader>{withSuspense(<PollPage />)}</Layout></ProtectedRoute>,
  },
  {
    path: '/polls/:pollId/analytics',
    element: <ProtectedRoute><Layout showHeader>{withSuspense(<PollAnalytics />)}</Layout></ProtectedRoute>,
  },
  {
    path: '/rooms',
    element: <ProtectedRoute><Layout showHeader>{withSuspense(<RoomsPage />)}</Layout></ProtectedRoute>,
  },
  {
    path: '/rooms/:roomCode',
    element: <ProtectedRoute><Layout showHeader>{withSuspense(<RoomPage />)}</Layout></ProtectedRoute>,
  },
  {
    path: '/rooms/join/:token',
    element: <ProtectedRoute><Layout showHeader>{withSuspense(<JoinRoomByLink />)}</Layout></ProtectedRoute>,
  },
]);
