import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocketContext } from '../context/SocketContext';
import { UserAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveRadar } from '@nivo/radar';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, Users, TrendingUp, BarChart3, Vote, Shield, 
  Clock, Trophy, ArrowLeft, Activity, Download, Eye, Share2,
  FileText, Filter, ChevronDown, Zap, MessageSquare, BarChart4,
  PieChart, LineChart, Target, TrendingUp as TrendingUpIcon
} from 'lucide-react';
import { toast } from 'sonner';

const NIVO_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6366F1', '#EC4899', '#84CC16'];

const PollAnalytics = () => {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChart, setActiveChart] = useState('bar');
  const [isExpired, setIsExpired] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const socketContext = useSocketContext();
  const socket = socketContext?.socket;
  const { user } = UserAuth();

  // Fetch poll data
  const fetchPoll = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data: pollData, error: pollError } = await supabase
        .from('polls')
        .select(`
          *,
          options(*),
          profiles(username, avatar_url),
          votes(*)
        `)
        .eq('id', pollId)
        .single();
        
      if (pollError) throw pollError;

      const isExpiredNow = pollData.expires_at && new Date(pollData.expires_at) < new Date();
      
      const totalVotes = pollData.options.reduce((sum, opt) => sum + opt.votes_count, 0);
      const processedPoll = { ...pollData, totalVotes };

      setPoll(processedPoll);
      setIsExpired(isExpiredNow);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching poll:", err);
      setError(err.message);
      setLoading(false);
      toast.error('Failed to load poll');
    }
  }, [pollId]);

  // Initial fetch
  useEffect(() => {
    if (pollId && pollId !== "undefined") {
      fetchPoll();
    } else {
      setError("Invalid poll ID");
      setLoading(false);
    }
  }, [pollId, fetchPoll]);

  // Socket connection
  useEffect(() => {
    if (!socket || !pollId || pollId === "undefined") return;
    
    socket.emit("joinPoll", pollId);
    
    const handlePollUpdate = (data) => {
      if (data.data.id === pollId) {
        setPoll(data.data);
      }
    };
    
    socket.on("pollDataUpdated", handlePollUpdate);
    
    return () => {
      socket.off("pollDataUpdated", handlePollUpdate);
      socket.emit("leavePoll", pollId);
    };
  }, [socket, pollId]);

  const getTopChoice = useCallback((options) => {
    if (!options || options.length === 0) return null;
    return options.reduce((prev, current) => 
      (prev.votes_count > current.votes_count) ? prev : current
    );
  }, []);

  // Nivo chart data transformations
  const nivoBarData = useMemo(() => {
    if (!poll?.options) return [];
    return poll.options.map((option, index) => ({
      id: option.option_text,
      option: option.option_text,
      votes: option.votes_count,
      color: NIVO_COLORS[index % NIVO_COLORS.length]
    }));
  }, [poll]);

  const nivoPieData = useMemo(() => {
    if (!poll?.options) return [];
    return poll.options.map((option, index) => ({
      id: option.option_text,
      label: option.option_text,
      value: option.votes_count,
      color: NIVO_COLORS[index % NIVO_COLORS.length]
    }));
  }, [poll]);

  const nivoLineData = useMemo(() => {
    if (!poll?.options) return [];
    return [{
      id: 'votes',
      data: poll.options.map((option, index) => ({
        x: option.option_text,
        y: option.votes_count
      }))
    }];
  }, [poll]);

  const nivoRadarData = useMemo(() => {
    if (!poll?.options) return [];
    return poll.options.map((option) => ({
      option: option.option_text,
      votes: option.votes_count
    }));
  }, [poll]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br ">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-white text-lg">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br  p-8">
        <Card className="bg-[#10172A]/80 backdrop-blur border border-gray-700 max-w-md text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="h-8 w-8 text-red-400">!</div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Unable to Load Analytics</h3>
            <p className="text-gray-300 mb-4">{error}</p>
            <Button 
              onClick={fetchPoll}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br  p-8">
        <Card className="bg-[#10172A]/80 backdrop-blur border border-gray-700 max-w-md text-center">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold text-white mb-2">Poll Not Found</h3>
            <p className="text-gray-300 mb-4">The poll you're looking for doesn't exist or has been removed.</p>
            <Button 
              onClick={() => navigate('/polls')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Back to Polls
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br ">
      

      {/* Main Content */}
      <div className="pt-20 px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-[#10172A]/80 backdrop-blur border border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Votes</p>
                    <p className="text-3xl font-bold text-white">{poll.totalVotes}</p>
                    <p className="text-xs text-gray-500 mt-1">All time</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#10172A]/80 backdrop-blur border border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Options</p>
                    <p className="text-3xl font-bold text-white">{poll.options?.length || 0}</p>
                    <p className="text-xs text-gray-500 mt-1">Choices</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <Vote className="h-6 w-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#10172A]/80 backdrop-blur border border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Top Choice</p>
                    <p className="text-xl font-bold text-white truncate">
                      {getTopChoice(poll.options)?.option_text || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Most selected</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#10172A]/80 backdrop-blur border border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Status</p>
                    <Badge className={isExpired ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}>
                      {isExpired ? 'Expired' : 'Active'}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {isExpired ? 'Ended' : 'Ongoing'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Clock className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Poll Details */}
          <Card className="bg-[#10172A]/80 backdrop-blur border border-gray-700 mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-white">Poll Details</CardTitle>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Analytics
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Question</h3>
                  <p className="text-gray-300">{poll.question}</p>
                  {poll.description && (
                    <>
                      <h3 className="text-lg font-semibold text-white mb-2 mt-4">Description</h3>
                      <p className="text-gray-300">{poll.description}</p>
                    </>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Created By</h3>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={poll.profiles?.avatar_url} />
                      <AvatarFallback className="bg-blue-500/20 text-blue-300">
                        {poll.profiles?.username?.substring(0, 2).toUpperCase() || 'US'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white font-medium">{poll.profiles?.username || 'Anonymous'}</p>
                      <p className="text-gray-400 text-sm">
                        Created on {new Date(poll.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-[#10172A]/80 backdrop-blur border border-gray-700">
              <TabsTrigger value="overview" className="text-white data-[state=active]:bg-[#1a2332]">
                <BarChart4 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="charts" className="text-white data-[state=active]:bg-[#1a2332]">
                <BarChart3 className="h-4 w-4 mr-2" />
                Charts
              </TabsTrigger>
              <TabsTrigger value="breakdown" className="text-white data-[state=active]:bg-[#1a2332]">
                <FileText className="h-4 w-4 mr-2" />
                Breakdown
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Choice Card */}
                <Card className="bg-[#10172A]/80 backdrop-blur border border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg text-white flex items-center">
                      <Trophy className="h-5 w-5 mr-2 text-yellow-400" />
                      Top Choice
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Option</span>
                        <span className="text-gray-300">Votes</span>
                      </div>
                      {poll.options
                        .sort((a, b) => b.votes_count - a.votes_count)
                        .slice(0, 3)
                        .map((option, index) => {
                          const percentage = poll.totalVotes > 0 
                            ? Math.round((option.votes_count / poll.totalVotes) * 100) 
                            : 0;
                          return (
                            <div key={option.id} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-0">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" 
                                     style={{ backgroundColor: NIVO_COLORS[index % NIVO_COLORS.length] }}>
                                  {index + 1}
                                </div>
                                <span className="text-white">{option.option_text}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-white font-medium">{option.votes_count}</span>
                                <span className="text-gray-400 text-sm">({percentage}%)</span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </CardContent>
                </Card>

                {/* Engagement Metrics */}
                <Card className="bg-[#10172A]/80 backdrop-blur border border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg text-white flex items-center">
                      <TrendingUpIcon className="h-5 w-5 mr-2 text-green-400" />
                      Engagement Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Total Votes</span>
                        <span className="text-white font-bold text-lg">{poll.totalVotes}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Average Votes/Option</span>
                        <span className="text-white font-bold text-lg">
                          {poll.options.length > 0 ? Math.round(poll.totalVotes / poll.options.length) : 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Participation Rate</span>
                        <span className="text-white font-bold text-lg">
                          {poll.votes?.length || 0} unique voters
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Poll Status</span>
                        <Badge className={isExpired ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}>
                          {isExpired ? 'Expired' : 'Active'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="charts" className="mt-6">
              <Card className="bg-[#10172A]/80 backdrop-blur border border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-white">Visual Analytics</CardTitle>
                    <div className="flex gap-2">
                      {[
                        { key: 'bar', icon: BarChart4, label: 'Bar' },
                        { key: 'pie', icon: PieChart, label: 'Pie' },
                        { key: 'line', icon: LineChart, label: 'Line' },
                        { key: 'radar', icon: Activity, label: 'Radar' }
                      ].map(({ key, icon: Icon, label }) => (
                        <Button
                          key={key}
                          variant={activeChart === key ? "default" : "outline"}
                          onClick={() => setActiveChart(key)}
                          className={`flex items-center gap-2 ${
                            activeChart === key 
                              ? 'bg-blue-600 text-white hover:bg-blue-700' 
                              : 'bg-[#0D1425] text-white border-gray-600 hover:bg-[#1a2332]'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          {label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div style={{ height: '500px' }}>
                    {activeChart === 'bar' && (
                      <ResponsiveBar
                        data={nivoBarData}
                        keys={['votes']}
                        indexBy="option"
                        margin={{ top: 50, right: 130, bottom: 100, left: 60 }}
                        padding={0.3}
                        valueScale={{ type: 'linear' }}
                        colors={{ scheme: 'nivo' }}
                        borderRadius={8}
                        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                          tickSize: 5,
                          tickPadding: 5,
                          tickRotation: -45,
                          legend: 'Options',
                          legendPosition: 'middle',
                          legendOffset: 70
                        }}
                        axisLeft={{
                          tickSize: 5,
                          tickPadding: 5,
                          tickRotation: 0,
                          legend: 'Votes',
                          legendPosition: 'middle',
                          legendOffset: -50
                        }}
                        labelSkipWidth={12}
                        labelSkipHeight={12}
                        labelTextColor="#ffffff"
                        animate={true}
                        motionConfig="gentle"
                        theme={{
                          axis: {
                            ticks: { text: { fill: '#9CA3AF' } },
                            legend: { text: { fill: '#D1D5DB' } }
                          },
                          grid: { line: { stroke: '#374151' } },
                          tooltip: {
                            container: {
                              background: '#1F2937',
                              color: '#ffffff',
                              fontSize: 14,
                              borderRadius: 8,
                              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                            }
                          }
                        }}
                      />
                    )}

                    {activeChart === 'pie' && (
                      <ResponsivePie
                        data={nivoPieData}
                        margin={{ top: 40, right: 200, bottom: 40, left: 80 }}
                        innerRadius={0.5}
                        padAngle={2}
                        cornerRadius={8}
                        activeOuterRadiusOffset={8}
                        colors={{ scheme: 'nivo' }}
                        borderWidth={2}
                        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                        arcLinkLabelsSkipAngle={10}
                        arcLinkLabelsTextColor="#D1D5DB"
                        arcLinkLabelsThickness={2}
                        arcLinkLabelsColor={{ from: 'color' }}
                        arcLabelsSkipAngle={10}
                        arcLabelsTextColor="#ffffff"
                        legends={[
                          {
                            anchor: 'right',
                            direction: 'column',
                            justify: false,
                            translateX: 140,
                            translateY: 0,
                            itemsSpacing: 12,
                            itemWidth: 120,
                            itemHeight: 20,
                            itemTextColor: '#D1D5DB',
                            itemDirection: 'left-to-right',
                            itemOpacity: 1,
                            symbolSize: 16,
                            symbolShape: 'circle'
                          }
                        ]}
                        animate={true}
                        motionConfig="gentle"
                        theme={{
                          tooltip: {
                            container: {
                              background: '#1F2937',
                              color: '#ffffff',
                              fontSize: 14,
                              borderRadius: 8,
                              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                            }
                          }
                        }}
                      />
                    )}

                    {activeChart === 'line' && (
                      <ResponsiveLine
                        data={nivoLineData}
                        margin={{ top: 50, right: 110, bottom: 100, left: 60 }}
                        xScale={{ type: 'point' }}
                        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false }}
                        curve="cardinal"
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                          tickSize: 5,
                          tickPadding: 5,
                          tickRotation: -45,
                          legend: 'Options',
                          legendOffset: 70,
                          legendPosition: 'middle'
                        }}
                        axisLeft={{
                          tickSize: 5,
                          tickPadding: 5,
                          tickRotation: 0,
                          legend: 'Votes',
                          legendOffset: -50,
                          legendPosition: 'middle'
                        }}
                        pointSize={12}
                        pointColor={{ theme: 'background' }}
                        pointBorderWidth={3}
                        pointBorderColor={{ from: 'serieColor' }}
                        pointLabelYOffset={-12}
                        useMesh={true}
                        colors={{ scheme: 'nivo' }}
                        lineWidth={4}
                        enableGridX={false}
                        animate={true}
                        motionConfig="gentle"
                        theme={{
                          axis: {
                            ticks: { text: { fill: '#9CA3AF' } },
                            legend: { text: { fill: '#D1D5DB' } }
                          },
                          grid: { line: { stroke: '#374151' } },
                          tooltip: {
                            container: {
                              background: '#1F2937',
                              color: '#ffffff',
                              fontSize: 14,
                              borderRadius: 8,
                              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                            }
                          }
                        }}
                      />
                    )}

                    {activeChart === 'radar' && (
                      <ResponsiveRadar
                        data={nivoRadarData}
                        keys={['votes']}
                        indexBy="option"
                        maxValue="auto"
                        margin={{ top: 70, right: 80, bottom: 70, left: 80 }}
                        curve="linearClosed"
                        borderWidth={3}
                        borderColor={{ from: 'color' }}
                        gridLevels={5}
                        gridShape="circular"
                        gridLabelOffset={36}
                        enableDots={true}
                        dotSize={10}
                        dotColor={{ theme: 'background' }}
                        dotBorderWidth={2}
                        dotBorderColor={{ from: 'color' }}
                        colors={{ scheme: 'nivo' }}
                        fillOpacity={0.25}
                        blendMode="multiply"
                        animate={true}
                        motionConfig="gentle"
                        theme={{
                          axis: {
                            ticks: { text: { fill: '#9CA3AF' } },
                            legend: { text: { fill: '#D1D5DB' } }
                          },
                          grid: { line: { stroke: '#374151' } },
                          tooltip: {
                            container: {
                              background: '#1F2937',
                              color: '#ffffff',
                              fontSize: 14,
                              borderRadius: 8,
                              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                            }
                          }
                        }}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="breakdown" className="mt-6">
              <Card className="bg-[#10172A]/80 backdrop-blur border border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Detailed Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {poll.options?.map((option, index) => {
                      const percentage = poll.totalVotes > 0 
                        ? Math.round((option.votes_count / poll.totalVotes) * 100) 
                        : 0;
                      return (
                        <div key={option.id} className="space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: NIVO_COLORS[index % NIVO_COLORS.length] }}
                              />
                              <span className="text-white font-medium text-lg">{option.option_text}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-blue-400 font-bold text-lg">{percentage}%</span>
                              <span className="text-gray-400">{option.votes_count} votes</span>
                            </div>
                          </div>
                          <Progress value={percentage} className="h-3 bg-gray-700" />
                          <div className="flex justify-between text-sm text-gray-400">
                            <span>{option.votes_count} votes</span>
                            <span>{percentage}% of total</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Export Options */}
          <div className="flex justify-end gap-3 mt-8">
            <Button
              variant="outline"
              className="border-gray-600 bg-[#0D1425] hover:bg-[#1a2332] text-white"
              onClick={() => {
                toast.info('PDF export coming soon!');
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Export as PDF
            </Button>
            <Button
              variant="outline"
              className="border-gray-600 bg-[#0D1425] hover:bg-[#1a2332] text-white"
              onClick={() => {
                toast.info('Image export coming soon!');
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Export as Image
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollAnalytics;
