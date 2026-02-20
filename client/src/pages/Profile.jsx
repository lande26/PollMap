// Profile.jsx
import React, { useState, useEffect } from 'react';
import { User, BarChart3, Users, TrendingUp, PieChart, Download, Copy, Eye, Vote, Calendar, Clock, Shield, Zap, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';

function Profile() {
  const [user, setUser] = useState(null);
  const [userPolls, setUserPolls] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
    fetchUserPolls();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchUserPolls = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data: polls, error } = await supabase
        .from('polls')
        .select(`
          *,
          options (
            id,
            option_text,
            votes_count
          )
        `)
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const pollsWithDetails = await Promise.all(
        (polls || []).map(async (poll) => {
          // Get total votes from votes table
          const { count: totalVotes, error: votesError } = await supabase
            .from('votes')
            .select('*', { count: 'exact', head: true })
            .eq('poll_id', poll.id);

          // Get unique participants
          const { data: participants, error: participantsError } = await supabase
            .from('votes')
            .select('user_id')
            .eq('poll_id', poll.id);

          const uniqueParticipants = new Set(participants?.map(p => p.user_id).filter(Boolean)).size;

          return {
            ...poll,
            total_votes: totalVotes || 0,
            unique_participants: uniqueParticipants,
            engagement_rate: calculateEngagementRate(poll, totalVotes || 0)
          };
        })
      );

      setUserPolls(pollsWithDetails);
      calculateAnalytics(pollsWithDetails);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching polls:', error);
      setLoading(false);
    }
  };

  const calculateEngagementRate = (poll, totalVotes) => {
    const optionCount = poll.options?.length || 1;
    const maxPossibleVotes = totalVotes * optionCount;
    const actualVotes = poll.options?.reduce((sum, opt) => sum + (opt.votes_count || 0), 0) || 0;

    return maxPossibleVotes > 0 ? (actualVotes / maxPossibleVotes) * 100 : 0;
  };

  const calculateAnalytics = (polls) => {
    const totalPolls = polls.length;
    const totalVotes = polls.reduce((sum, poll) => sum + poll.total_votes, 0);
    const totalParticipants = polls.reduce((sum, poll) => sum + poll.unique_participants, 0);

    const activePolls = polls.filter(poll => {
      if (!poll.expires_at) return true;
      return new Date(poll.expires_at) > new Date();
    }).length;

    const protectedPolls = polls.filter(poll => poll.is_password_protected).length;

    const avgEngagement = polls.length > 0
      ? polls.reduce((sum, poll) => sum + poll.engagement_rate, 0) / polls.length
      : 0;

    const recentPolls = polls
      .filter(poll => new Date(poll.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      .length;

    setAnalytics({
      totalPolls,
      totalVotes,
      totalParticipants,
      activePolls,
      protectedPolls,
      avgEngagement: Math.round(avgEngagement),
      recentPolls
    });
  };

  const handleExportData = async (format) => {
    try {
      const exportData = userPolls.map(poll => ({
        question: poll.question,
        created_date: new Date(poll.created_at).toLocaleDateString(),
        total_votes: poll.total_votes,
        unique_participants: poll.unique_participants,
        engagement_rate: `${Math.round(poll.engagement_rate)}%`,
        is_protected: poll.is_password_protected ? 'Yes' : 'No',
        expires_at: poll.expires_at ? new Date(poll.expires_at).toLocaleDateString() : 'Never',
        status: getPollStatus(poll)
      }));

      if (format === 'csv') {
        const headers = ['Question', 'Created Date', 'Total Votes', 'Participants', 'Engagement Rate', 'Protected', 'Expires', 'Status'];
        const csvContent = [
          headers,
          ...exportData.map(row => [
            `"${row.question.replace(/"/g, '""')}"`,
            row.created_date,
            row.total_votes,
            row.unique_participants,
            row.engagement_rate,
            row.is_protected,
            row.expires_at,
            row.status
          ])
        ].map(row => row.join(',')).join('\n');

        downloadFile(csvContent, 'poll-analytics.csv', 'text/csv');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyPollLink = (pollId) => {
    navigator.clipboard.writeText(`${window.location.origin}/polls/${pollId}`);
    // Add toast notification
  };

  const getPollStatus = (poll) => {
    if (poll.expires_at && new Date(poll.expires_at) < new Date()) {
      return 'expired';
    }
    return 'active';
  };

  const getInitials = (email) => {
    return email ? email.substring(0, 2).toUpperCase() : 'US';
  };

  const getTotalVotesForPoll = (poll) => {
    return poll.options?.reduce((sum, option) => sum + (option.votes_count || 0), 0) || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center bg-[#0B101E]">
        {/* Background Gradients to match app aesthetic */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-xl bg-blue-500/30 animate-pulse"></div>
            <Loader2 className="w-12 h-12 text-blue-400 animate-spin relative z-10" />
          </div>
          <h2 className="text-2xl font-bold text-white mt-6 tracking-tight">Loading Profile</h2>
          <p className="text-gray-400 mt-2 text-center max-w-sm">Fetching your poll analytics and engagement metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Profile Card */}
          <Card className="bg-gray-900/90 border-gray-700 lg:col-span-1">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="w-24 h-24 border-4 border-blue-500">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-600 to-purple-600">
                    {getInitials(user?.email)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl text-white">
                {user?.user_metadata?.display_name || 'Poll Creator'}
              </CardTitle>
              <CardDescription className="text-gray-300">
                {user?.email}
              </CardDescription>
              <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                <div className="text-sm text-gray-300">Member since</div>
                <div className="text-white font-semibold">
                  {new Date(user?.created_at).toLocaleDateString()}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Analytics Overview */}
          <Card className="bg-gray-900/90 border-gray-700 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BarChart3 className="w-6 h-6 text-blue-400" />
                Poll Analytics Dashboard
              </CardTitle>
              <CardDescription className="text-gray-300">
                Real-time insights from your polling activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <PieChart className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                  <div className="text-2xl font-bold text-white">{analytics?.totalPolls || 0}</div>
                  <div className="text-sm text-gray-300">Total Polls</div>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <Vote className="w-8 h-8 mx-auto mb-2 text-green-400" />
                  <div className="text-2xl font-bold text-white">{analytics?.totalVotes || 0}</div>
                  <div className="text-sm text-gray-300">Total Votes</div>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <Users className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                  <div className="text-2xl font-bold text-white">{analytics?.totalParticipants || 0}</div>
                  <div className="text-sm text-gray-300">Participants</div>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                  <div className="text-2xl font-bold text-white">{analytics?.avgEngagement || 0}%</div>
                  <div className="text-sm text-gray-300">Engagement</div>
                </div>
              </div>

              {/* Secondary Metrics */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <Clock className="w-6 h-6 mx-auto mb-1 text-green-400" />
                  <div className="text-lg font-bold text-white">{analytics?.activePolls || 0}</div>
                  <div className="text-xs text-gray-300">Active</div>
                </div>
                <div className="text-center p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <Shield className="w-6 h-6 mx-auto mb-1 text-yellow-400" />
                  <div className="text-lg font-bold text-white">{analytics?.protectedPolls || 0}</div>
                  <div className="text-xs text-gray-300">Protected</div>
                </div>
                <div className="text-center p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <Calendar className="w-6 h-6 mx-auto mb-1 text-blue-400" />
                  <div className="text-lg font-bold text-white">{analytics?.recentPolls || 0}</div>
                  <div className="text-xs text-gray-300">This Week</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="polls" className="space-y-8">
          <TabsList className="bg-gray-900 border border-gray-700 p-1">
            <TabsTrigger value="polls" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              My Polls
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <TrendingUp className="w-4 h-4 mr-2" />
              Performance
            </TabsTrigger>
          </TabsList>

          {/* My Polls Tab */}
          <TabsContent value="polls">
            <div className="grid gap-6">
              {userPolls.map((poll) => {
                const totalVotes = getTotalVotesForPoll(poll);
                const status = getPollStatus(poll);
                const isExpired = status === 'expired';

                return (
                  <Card key={poll.id} className="bg-gray-900/90 border-gray-700 hover:border-gray-600 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2">{poll.question}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(poll.created_at).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Vote className="w-4 h-4" />
                              {totalVotes} votes
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {poll.unique_participants} participants
                            </span>
                            {poll.expires_at && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {isExpired ? 'Expired' : `Expires ${new Date(poll.expires_at).toLocaleDateString()}`}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {poll.is_password_protected && (
                            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                              <Shield className="w-3 h-3 mr-1" />
                              Protected
                            </Badge>
                          )}
                          <Badge variant={isExpired ? "destructive" : "default"} className={isExpired ? "bg-red-500/20 text-red-300 border-red-500/30" : "bg-green-500/20 text-green-300 border-green-500/30"}>
                            {isExpired ? 'Expired' : 'Active'}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex gap-2 mb-4">
                        <Button
                          size="sm"
                          onClick={() => navigate(`/polls/${poll.id}`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={isExpired}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          {isExpired ? 'View Results' : 'Live Poll'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyPollLink(poll.id)}
                          className="border-gray-600 hover:bg-gray-800 text-white"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Link
                        </Button>
                      </div>

                      {/* Engagement Metrics */}
                      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                        <div className="p-2 bg-gray-800 rounded">
                          <div className="text-white font-semibold">{totalVotes}</div>
                          <div className="text-xs text-gray-300">Total Votes</div>
                        </div>
                        <div className="p-2 bg-gray-800 rounded">
                          <div className="text-white font-semibold">{poll.unique_participants}</div>
                          <div className="text-xs text-gray-300">Participants</div>
                        </div>
                        <div className="p-2 bg-gray-800 rounded">
                          <div className="text-white font-semibold">{Math.round(poll.engagement_rate)}%</div>
                          <div className="text-xs text-gray-300">Engagement</div>
                        </div>
                      </div>

                      {/* Poll Results Preview */}
                      {poll.options && poll.options.length > 0 && (
                        <div className="space-y-2">
                          {poll.options.slice(0, 4).map((option) => {
                            const percentage = totalVotes > 0 ? ((option.votes_count || 0) / totalVotes) * 100 : 0;

                            return (
                              <div key={option.id} className="flex items-center gap-3">
                                <div className="w-32 text-sm text-white truncate">
                                  {option.option_text}
                                </div>
                                <Progress value={percentage} className="flex-1 bg-gray-700" />
                                <div className="w-12 text-sm text-white text-right">
                                  {Math.round(percentage)}%
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}

              {userPolls.length === 0 && (
                <Card className="bg-gray-900/90 border-gray-700">
                  <CardContent className="p-8 text-center">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold text-white mb-2">No polls created yet</h3>
                    <p className="text-gray-300 mb-4">Start creating interactive polls to see analytics here</p>
                    <Button
                      onClick={() => navigate('/create-poll')}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Create Your First Poll
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Performance Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid gap-6">
              {/* Top Performing Polls */}
              <Card className="bg-gray-900/90 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Top Performing Polls</CardTitle>
                  <CardDescription className="text-gray-300">
                    Your most engaging polls based on participant interaction
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userPolls
                      .sort((a, b) => b.engagement_rate - a.engagement_rate)
                      .slice(0, 5)
                      .map((poll, index) => (
                        <div key={poll.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${index === 0 ? 'bg-yellow-500/20 text-yellow-300' :
                                index === 1 ? 'bg-gray-500/20 text-gray-300' :
                                  index === 2 ? 'bg-orange-500/20 text-orange-300' :
                                    'bg-blue-500/20 text-blue-300'
                              }`}>
                              <span className="font-bold">{index + 1}</span>
                            </div>
                            <div>
                              <div className="font-medium text-white">{poll.question}</div>
                              <div className="text-sm text-gray-300">
                                {getTotalVotesForPoll(poll)} votes • {poll.unique_participants} participants
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-400">
                              {Math.round(poll.engagement_rate)}%
                            </div>
                            <div className="text-sm text-gray-300">Engagement</div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </CardContent>
              </Card>

              {/* Export Section */}
              <Card className="bg-gray-900/90 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Export Analytics</CardTitle>
                  <CardDescription className="text-gray-300">
                    Download your poll data for detailed analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Button
                      onClick={() => handleExportData('csv')}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export as CSV
                    </Button>
                    <div className="text-sm text-gray-300 flex items-center">
                      Includes all poll data, votes, and engagement metrics
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Profile;