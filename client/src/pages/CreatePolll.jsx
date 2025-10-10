// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { UserAuth } from '../context/AuthContext';
// import { supabase } from '../supabaseClient';
// import { PlusCircle, X, Lock, Clock } from 'lucide-react';

// const CreatePoll = () => {
//   const [question, setQuestion] = useState('');
//   const [options, setOptions] = useState(['', '']);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [password, setPassword] = useState('');
//   const [isPasswordProtected, setIsPasswordProtected] = useState(false);
//   const [expiresAt, setExpiresAt] = useState('');
//   const [hasExpiration, setHasExpiration] = useState(false);
//   const navigate = useNavigate();
//   const { user } = UserAuth();
  
//   const addOption = () => {
//     if (options.length < 10) { // Limit to 10 options
//       setOptions([...options, '']);
//     }
//   };
  
//   const removeOption = (index) => {
//     if (options.length > 2) { // Minimum 2 options
//       const newOptions = [...options];
//       newOptions.splice(index, 1);
//       setOptions(newOptions);
//     }
//   };
  
//   const handleOptionChange = (index, value) => {
//     const newOptions = [...options];
//     newOptions[index] = value;
//     setOptions(newOptions);
//   };
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Validate form
//     if (!question.trim()) {
//       setError('Please enter a question');
//       return;
//     }
    
//     const validOptions = options.filter(opt => opt.trim() !== '');
//     if (validOptions.length < 2) {
//       setError('Please provide at least two options');
//       return;
//     }
    
//     // If password protection is enabled, validate password
//     if (isPasswordProtected && !password.trim()) {
//       setError('Please enter a password');
//       return;
//     }
    
//     // If expiration is enabled, validate expiration time
//     if (hasExpiration && !expiresAt) {
//       setError('Please set an expiration time');
//       return;
//     }
    
//     // If expiration is enabled, check if it's in the future
//     if (hasExpiration && expiresAt) {
//       const expirationDate = new Date(expiresAt);
//       if (expirationDate <= new Date()) {
//         setError('Expiration time must be in the future');
//         return;
//       }
//     }
    
//     setLoading(true);
//     setError(null);
    
//     try {
//       // Create the poll with all fields
//       const { data: poll, error: pollError } = await supabase
//         .from('polls')
//         .insert([{
//           question: question.trim(),
//           created_by: user?.id,
//           is_password_protected: isPasswordProtected,
//           password_hash: isPasswordProtected ? password : null,
//           expires_at: hasExpiration ? expiresAt : null
//         }])
//         .select()
//         .single();
        
//       if (pollError) throw pollError;
      
//       // Create the options
//       const optionsToInsert = validOptions.map(option => ({
//         poll_id: poll.id,
//         option_text: option.trim()
//       }));
      
//       const { error: optionsError } = await supabase
//         .from('options')
//         .insert(optionsToInsert);
        
//       if (optionsError) throw optionsError;
      
//       // Navigate to the poll page
//       navigate(`/polls/${poll.id}`);
      
//     } catch (err) {
//       console.error('Error creating poll:', err);
//       setError('Failed to create poll. Please try again.');
//       setLoading(false);
//     }
//   };
  
//   return (
//     <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 to-black">
//       {/* Background decoration */}
//       <div className="absolute inset-0 z-0">
//         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 to-transparent"></div>
//         <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-900/20 to-transparent"></div>
//       </div>
      
//       <div className="relative z-10 container mx-auto px-4 py-8">
//         <div className="max-w-2xl mx-auto">
//           <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
//             <h1 className="text-3xl font-bold text-white mb-6">Create a New Poll</h1>
            
//             {error && (
//               <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg mb-6">
//                 {error}
//               </div>
//             )}
            
//             <form onSubmit={handleSubmit}>
//               <div className="mb-6">
//                 <label htmlFor="question" className="block text-white font-medium mb-2">
//                   Poll Question
//                 </label>
//                 <input
//                   type="text"
//                   id="question"
//                   value={question}
//                   onChange={(e) => setQuestion(e.target.value)}
//                   className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="What do you want to ask?"
//                 />
//               </div>
              
//               <div className="mb-6">
//                 <div className="flex justify-between items-center mb-2">
//                   <label className="block text-white font-medium">
//                     Options
//                   </label>
//                   <button
//                     type="button"
//                     onClick={addOption}
//                     disabled={options.length >= 10}
//                     className="text-blue-400 hover:text-blue-300 flex items-center gap-1 disabled:opacity-50"
//                   >
//                     <PlusCircle size={18} />
//                     Add Option
//                   </button>
//                 </div>
                
//                 <div className="space-y-3">
//                   {options.map((option, index) => (
//                     <div key={index} className="flex items-center gap-2">
//                       <input
//                         type="text"
//                         value={option}
//                         onChange={(e) => handleOptionChange(index, e.target.value)}
//                         className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         placeholder={`Option ${index + 1}`}
//                       />
//                       {options.length > 2 && (
//                         <button
//                           type="button"
//                           onClick={() => removeOption(index)}
//                           className="text-red-400 hover:text-red-300 p-2"
//                         >
//                           <X size={18} />
//                         </button>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
              
//               {/* Password Protection Section */}
//               <div className="mb-6">
//                 <div className="flex items-center gap-2 mb-4">
//                   <input
//                     type="checkbox"
//                     id="passwordProtection"
//                     checked={isPasswordProtected}
//                     onChange={(e) => setIsPasswordProtected(e.target.checked)}
//                     className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
//                   />
//                   <label htmlFor="passwordProtection" className="flex items-center gap-2 text-white font-medium cursor-pointer">
//                     <Lock size={18} />
//                     Password protect this poll
//                   </label>
//                 </div>
                
//                 {isPasswordProtected && (
//                   <div>
//                     <label htmlFor="password" className="block text-white font-medium mb-2">
//                       Password
//                     </label>
//                     <input
//                       type="password"
//                       id="password"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="Enter password"
//                     />
//                     <p className="text-gray-400 text-sm mt-2">
//                       Users will need to enter this password to access the poll
//                     </p>
//                   </div>
//                 )}
//               </div>
              
//               {/* Expiration Time Section */}
//               <div className="mb-6">
//                 <div className="flex items-center gap-2 mb-4">
//                   <input
//                     type="checkbox"
//                     id="expiration"
//                     checked={hasExpiration}
//                     onChange={(e) => setHasExpiration(e.target.checked)}
//                     className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
//                   />
//                   <label htmlFor="expiration" className="flex items-center gap-2 text-white font-medium cursor-pointer">
//                     <Clock size={18} />
//                     Set expiration time
//                   </label>
//                 </div>
                
//                 {hasExpiration && (
//                   <div>
//                     <label htmlFor="expiresAt" className="block text-white font-medium mb-2">
//                       Expires At
//                     </label>
//                     <input
//                       type="datetime-local"
//                       id="expiresAt"
//                       value={expiresAt}
//                       onChange={(e) => setExpiresAt(e.target.value)}
//                       className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     <p className="text-gray-400 text-sm mt-2">
//                       After this time, the poll will no longer accept votes
//                     </p>
//                   </div>
//                 )}
//               </div>
              
//               <div className="flex justify-end gap-3">
//                 <button
//                   type="button"
//                   onClick={() => navigate('/dashboard')}
//                   className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 transition-colors"
//                 >
//                   {loading ? (
//                     <>
//                       <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
//                       Creating...
//                     </>
//                   ) : (
//                     'Create Poll'
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreatePoll;


import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, X, Lock, Clock, Upload, Loader2, AlertCircle, Sparkles, FileImage } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { toast } from 'react-hot-toast';

const CreatePoll = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState('');
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [expiresAt, setExpiresAt] = useState('');
  const [hasExpiration, setHasExpiration] = useState(false);
  const [ocrFile, setOcrFile] = useState(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [ocrError, setOcrError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const {user} = UserAuth();

  useEffect(() => {
    if (location.state?.ocrData) {
      const { question, options } = location.state.ocrData;
      setQuestion(question);
      setOptions(options);
    }
  }, [location.state]);
  
  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };
  
  const removeOption = (index) => {
    if (options.length > 2) {
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
    
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }
    
    const validOptions = options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) {
      setError('Please provide at least two options');
      return;
    }
    
    if (isPasswordProtected && !password.trim()) {
      setError('Please enter a password');
      return;
    }
    
    if (hasExpiration && !expiresAt) {
      setError('Please set an expiration time');
      return;
    }
    
    if (hasExpiration && expiresAt) {
      const expirationDate = new Date(expiresAt);
      if (expirationDate <= new Date()) {
        setError('Expiration time must be in the future');
        return;
      }
    }
    
    setLoading(true);
    setError(null);
    
    try{
      const {data:poll, error:pollError} = await supabase
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

        if(pollError) throw pollError;

        const optionsToInsert = validOptions.map(option => ({
          poll_id: poll.id,
          option_text: option.trim()
        }));

        const {error:optionsError} = await supabase
          .from('options')
          .insert(optionsToInsert);

        if(optionsError) throw optionsError;

        navigate(`/polls/${poll.id}`);

    }catch(err){
      console.error('Error creating poll:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      setOcrError('Please upload a JPG, PNG, or PDF file');
      return;
    }

    if (file.size > maxSize) {
      setOcrError('File size must be less than 10MB');
      return;
    }

    setOcrFile(file);
    setOcrError(null);
    processOCR(file);
  };

  const fileToGenerativePart = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        resolve({
          inlineData: {
            data: base64String,
            mimeType: file.type,
          },
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const processOCR = async (file) => {
    setOcrLoading(true);
    setOcrError(null);

    try {
      // Get API key from environment variable
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const imagePart = await fileToGenerativePart(file);

      const prompt = `Analyze this image and extract poll information. 
      You must respond with ONLY a valid JSON object in this exact format:
      {
        "question": "the poll question",
        "options": ["option1", "option2", "option3", ...]
      }
      
      If the image contains a poll question and multiple choice options, extract them.
      If the image doesn't contain clear poll information, still provide a JSON response with empty or placeholder values.
      Do not include any markdown formatting, explanations, or additional text - just the raw JSON object.`;

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();

      let jsonText = text.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/g, '');
      }

      const parsedData = JSON.parse(jsonText);

      if (!parsedData.question || !parsedData.options || !Array.isArray(parsedData.options)) {
        throw new Error("Invalid response format from AI");
      }

      setOcrResult(parsedData);
      setQuestion(parsedData.question);
      setOptions(parsedData.options);
      setOcrLoading(false);
    } catch (err) {
      console.error('OCR Error:', err);
      setOcrError(err.message || 'Failed to extract text from file');
      setOcrLoading(false);
    }
  };

  const resetOCR = () => {
    setOcrFile(null);
    setOcrResult(null);
    setOcrError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="min-h-screen relative py-8 px-4">
      <div className="absolute inset-0 bg-gradient-to-b via-transparent pointer-events-none" />
      
      <div className="relative z-10 container mx-auto max-w-7xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3 px-4 py-2 rounded-full bg-indigo-500/15 border border-indigo-400/30 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-indigo-300" />
            <span className="text-sm text-indigo-200 font-medium">Create Your Poll</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Share Your Question
          </h1>
          <p className="text-gray-400 text-base">
            Create manually or extract from an image using AI
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Manual Creation */}
          <Card className="bg-[#0f1729]/60 backdrop-blur-xl border-indigo-500/20 shadow-2xl shadow-indigo-900/20">
            <CardHeader className="border-b border-indigo-500/20 pb-5">
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-indigo-500/25 flex items-center justify-center text-indigo-300 text-sm">1</span>
                Manual Creation
              </CardTitle>
              <p className="text-gray-400 text-sm">Create your poll from scratch</p>
            </CardHeader>
            
            <CardContent className="pt-6 space-y-6">
              {error && (
                <div className="bg-red-500/15 border border-red-400/40 text-red-200 px-3 py-3 rounded-lg flex items-start backdrop-blur-sm">
                  <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-red-300" />
                  <div className="text-sm">{error}</div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="question" className="text-white font-medium text-sm">
                  Poll Question
                </Label>
                <Textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full bg-[#0a0f1c]/40 border-indigo-400/20 text-white placeholder:text-gray-500 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-500/20 min-h-[100px] resize-none backdrop-blur-sm transition-all text-sm"
                  placeholder="What would you like to ask?"
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-white font-medium text-sm">
                    Answer Options
                  </Label>
                  <Button
                    type="button"
                    onClick={addOption}
                    disabled={options.length >= 10}
                    variant="ghost"
                    size="sm"
                    className="border border-indigo-400/30 text-indigo-300 hover:bg-indigo-500/15 hover:border-indigo-400/50 disabled:opacity-30 h-8 text-xs"
                  >
                    <PlusCircle size={14} className="mr-1.5" />
                    Add
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2 group">
                      <div className="flex-1 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400/60 font-medium text-xs">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <Input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          className="w-full pl-9 pr-3 h-10 bg-[#0a0f1c]/40 border-indigo-400/20 text-white placeholder:text-gray-500 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-500/20 backdrop-blur-sm text-sm"
                          placeholder={`Option ${index + 1}`}
                        />
                      </div>
                      {options.length > 2 && (
                        <Button
                          type="button"
                          onClick={() => removeOption(index)}
                          variant="ghost"
                          size="icon"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/15 opacity-0 group-hover:opacity-100 transition-all h-10 w-10"
                        >
                          <X size={16} />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-gray-500 text-xs">
                  {options.length < 10 ? `${10 - options.length} more available` : "Max reached"}
                </p>
              </div>
              
              <div className="space-y-3">
                <Label className="text-white font-medium text-sm">Poll Settings</Label>
                
                <Tabs defaultValue="security" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-[#0a0f1c]/40 backdrop-blur-sm border border-indigo-400/20 p-1 h-10">
                    <TabsTrigger 
                      value="security" 
                      className="data-[state=active]:bg-indigo-500/25 data-[state=active]:text-white text-gray-400 transition-all text-xs"
                    >
                      <Lock size={14} className="mr-1.5" />
                      Security
                    </TabsTrigger>
                    <TabsTrigger 
                      value="timing" 
                      className="data-[state=active]:bg-indigo-500/25 data-[state=active]:text-white text-gray-400 transition-all text-xs"
                    >
                      <Clock size={14} className="mr-1.5" />
                      Timing
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="security" className="mt-4 p-4 rounded-lg bg-[#0a0f1c]/30 backdrop-blur-sm border border-indigo-400/20">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="passwordProtection" className="text-white font-medium cursor-pointer text-sm">
                            Password Protection
                          </Label>
                          <p className="text-xs text-gray-400">Restrict with password</p>
                        </div>
                        <Switch
                          id="passwordProtection"
                          checked={isPasswordProtected}
                          onCheckedChange={setIsPasswordProtected}
                          className="data-[state=checked]:bg-indigo-500"
                        />
                      </div>
                      
                      {isPasswordProtected && (
                        <div className="space-y-1.5 pt-1">
                          <Label htmlFor="password" className="text-white font-medium text-sm">
                            Password
                          </Label>
                          <Input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-9 bg-[#060a14]/60 border-indigo-400/20 text-white placeholder:text-gray-500 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-500/20 text-sm"
                            placeholder="Enter password"
                          />
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="timing" className="mt-4 p-4 rounded-lg bg-[#0a0f1c]/30 backdrop-blur-sm border border-indigo-400/20">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="expiration" className="text-white font-medium cursor-pointer text-sm">
                            Auto-Close Poll
                          </Label>
                          <p className="text-xs text-gray-400">Set expiration date</p>
                        </div>
                        <Switch
                          id="expiration"
                          checked={hasExpiration}
                          onCheckedChange={setHasExpiration}
                          className="data-[state=checked]:bg-indigo-500"
                        />
                      </div>
                      
                      {hasExpiration && (
                        <div className="space-y-1.5 pt-1">
                          <Label htmlFor="expiresAt" className="text-white font-medium text-sm">
                            Expires At
                          </Label>
                          <Input
                            type="datetime-local"
                            id="expiresAt"
                            value={expiresAt}
                            onChange={(e) => setExpiresAt(e.target.value)}
                            className="h-9 bg-[#060a14]/60 border-indigo-400/20 text-white focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-500/20 text-sm"
                          />
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              <Separator className="my-4 bg-indigo-500/20" />
              
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  variant="outline"
                  className="border-gray-600/40 text-gray-300 hover:bg-gray-700/30 h-10 px-5 text-sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30 disabled:opacity-50 h-10 px-6 text-sm font-medium"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Create Poll
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Right Column - OCR Upload */}
          <Card className="bg-[#0f1729]/60 backdrop-blur-xl border-purple-500/20 shadow-2xl shadow-purple-900/20">
            <CardHeader className="border-b border-purple-500/20 pb-5">
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-purple-500/25 flex items-center justify-center text-purple-300 text-sm">2</span>
                Extract from Image/PDF
              </CardTitle>
              <p className="text-gray-400 text-sm">Upload and let AI do the work</p>
            </CardHeader>
            
            <CardContent className="pt-6 space-y-5">
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
                  dragActive 
                    ? 'border-purple-400 bg-purple-500/10' 
                    : 'border-purple-400/30 bg-[#0a0f1c]/20'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-purple-300" />
                  </div>
                  <p className="text-white font-medium mb-1 text-center">Drop your file here or click to browse</p>
                  <p className="text-gray-400 text-sm text-center">Supports JPG, PNG, and PDF files up to 10MB</p>
                </label>
              </div>

              {ocrFile && !ocrLoading && !ocrResult && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-purple-500/10 border border-purple-400/30">
                  <div className="flex items-center gap-3">
                    <FileImage className="h-5 w-5 text-purple-400 flex-shrink-0" />
                    <span className="text-sm text-gray-300 truncate">{ocrFile.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetOCR}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/15 h-8"
                  >
                    <X size={16} />
                  </Button>
                </div>
              )}

              {ocrError && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/15 border border-red-400/40">
                  <AlertCircle className="h-5 w-5 text-red-300 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-red-200">{ocrError}</span>
                </div>
              )}

              {ocrLoading && (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="animate-spin h-12 w-12 text-purple-400 mb-4" />
                  <p className="text-purple-300 font-medium">Analyzing with Gemini AI...</p>
                  <p className="text-gray-400 text-sm mt-1">This may take a few seconds</p>
                </div>
              )}

              {ocrResult && !ocrLoading && (
                <div className="space-y-4">
                  <div className="bg-green-500/10 border border-green-400/30 p-3 rounded-lg flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-green-300" />
                    </div>
                    <div>
                      <p className="text-green-200 font-medium text-sm">Successfully extracted!</p>
                      <p className="text-green-300/70 text-xs">Data has been populated in the form</p>
                    </div>
                  </div>

                  <div className="bg-[#0a0f1c]/60 p-4 rounded-lg border border-purple-400/30 space-y-3">
                    <div>
                      <h4 className="font-medium mb-2 text-purple-300 text-xs uppercase tracking-wide">Question</h4>
                      <p className="text-gray-200 text-sm">{ocrResult.question}</p>
                    </div>
                    <Separator className="bg-purple-500/20" />
                    <div>
                      <h4 className="font-medium mb-2 text-purple-300 text-xs uppercase tracking-wide">Options</h4>
                      <ul className="space-y-2">
                        {ocrResult.options.map((option, index) => (
                          <li key={index} className="text-gray-200 flex items-center gap-2 text-sm">
                            <span className="w-5 h-5 rounded bg-purple-500/20 flex items-center justify-center text-xs text-purple-300 font-medium flex-shrink-0">
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span>{option}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Button
                    onClick={resetOCR}
                    variant="outline"
                    className="w-full border-purple-400/30 text-purple-300 hover:bg-purple-500/15 h-10 text-sm"
                  >
                    Upload Another File
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreatePoll;