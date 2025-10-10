
// // // import React, { useState } from 'react';
// // // import { useNavigate } from 'react-router-dom';
// // // import { supabase } from '../../supabaseClient';
// // // const PasswordProtectedPoll = ({ pollId, onAuthenticated }) => {
// // //   const [password, setPassword] = useState('');
// // //   const [error, setError] = useState('');
// // //   const [loading, setLoading] = useState(false);

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setLoading(true);
// // //     setError('');

// // //     try {
// // //       const { data, error } = await supabase
// // //         .from('polls')
// // //         .select('password_hash')
// // //         .eq('id', pollId)
// // //         .single();

// // //       if (error) throw error;
      
// // //       if(!data.password_hash){
// // //         onAuthenticated();
// // //         return;
// // //       }
      
// // //       if (data.password_hash === password) {
// // //         onAuthenticated();
// // //       } else {
// // //         setError('Incorrect password');
// // //         console.log('Incorrect password');
// // //       }
// // //     } catch (err) {
// // //       setError('Failed to verify password');
// // //       console.log(err);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   return (
// // //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br gray-900 ">
// // //       <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 max-w-md w-full">
// // //         <h2 className="text-2xl font-bold text-white mb-6">Password Protected</h2>
// // //         <p className="text-gray-300 mb-6">This poll is password protected. Please enter the password to continue.</p>
        
// // //         <form onSubmit={handleSubmit}>
// // //           <div className="mb-4">
// // //             <input
// // //               type="password"
// // //               value={password}
// // //               onChange={(e) => setPassword(e.target.value)}
// // //               className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //               placeholder="Enter password"
// // //               required
// // //             />
// // //           </div>
          
// // //           {error && <div className="text-red-400 mb-4">{error}</div>}
          
// // //           <button
// // //             type="submit"
// // //             disabled={loading}
// // //             className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium disabled:opacity-50"
// // //           >
// // //             {loading ? 'Verifying...' : 'Submit'}
// // //           </button>
// // //         </form>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default PasswordProtectedPoll;



// // import React, { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { supabase } from '../../supabaseClient';
// // import { 
// //   Dialog,
// //   DialogContent,
// //   DialogDescription,
// //   DialogHeader,
// //   DialogTitle,
// //   DialogFooter,
// // } from "@/components/ui/dialog";
// // import { Input } from "@/components/ui/input";
// // import { Button } from "@/components/ui/button";
// // import { Label } from "@/components/ui/label";
// // import { Lock, Shield, Eye, EyeOff, ArrowLeft } from 'lucide-react';
// // import { toast } from 'sonner';

// // const PasswordProtectedPoll = ({ pollId, onAuthenticated, isForAnalytics = false }) => {
// //   const [password, setPassword] = useState('');
// //   const [error, setError] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [showPassword, setShowPassword] = useState(false);
// //   const navigate = useNavigate();

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!password.trim()) {
// //       setError('Please enter a password');
// //       return;
// //     }

// //     setLoading(true);
// //     setError('');

// //     try {
// //       // First check if poll is password protected
// //       const { data: pollCheck, error: checkError } = await supabase
// //         .from('polls')
// //         .select('is_password_protected, password_hash')
// //         .eq('id', pollId)
// //         .single();

// //       if (checkError) throw checkError;
      
// //       if(!pollCheck.is_password_protected){
// //         onAuthenticated();
// //         toast.success('Access granted!');
// //         return;
// //       }
      
// //       // In a real app, you'd want to hash the password and compare
// //       if (pollCheck.password_hash === password) {
// //         onAuthenticated();
// //         toast.success('Access granted!');
// //       } else {
// //         setError('Incorrect password. Please try again.');
// //         toast.error('Incorrect password');
// //       }
// //     } catch (err) {
// //       setError('Failed to verify password. Please try again.');
// //       toast.error('Verification failed');
// //       console.error('Password verification error:', err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleGoBack = () => {
// //     navigate('/polls');
// //     toast.info('Returning to public polls');
// //   };

// //   return (
// //     <Dialog open={true} onOpenChange={() => {}}>
// //       <DialogContent className="sm:max-w-md bg-[#10172A]/90 backdrop-blur border border-gray-700 text-white">
// //         <DialogHeader className="text-center">
// //           <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
// //             <Lock className="h-8 w-8 text-blue-400" />
// //           </div>
// //           <DialogTitle className="text-2xl font-bold text-white text-center">
// //             Password Protected Poll
// //           </DialogTitle>
// //           <DialogDescription className="text-gray-300 text-center text-lg mt-2">
// //             {isForAnalytics 
// //               ? "This poll's analytics are password protected. Enter the password to view the analytics."
// //               : "This poll is password protected. Enter the password to view and participate."
// //             }
// //           </DialogDescription>
// //         </DialogHeader>

// //         <form onSubmit={handleSubmit} className="space-y-6 mt-4">
// //           <div className="space-y-2">
// //             <Label htmlFor="password" className="text-gray-300 text-sm font-medium">
// //               Password
// //             </Label>
// //             <div className="relative">
// //               <Input
// //                 id="password"
// //                 type={showPassword ? "text" : "password"}
// //                 value={password}
// //                 onChange={(e) => setPassword(e.target.value)}
// //                 className="w-full bg-[#0D1425] border-gray-700 text-white placeholder:text-gray-500 focus:bg-[#1a2332] focus:border-blue-500 pr-12"
// //                 placeholder="Enter poll password"
// //                 required
// //                 disabled={loading}
// //               />
// //               <Button
// //                 type="button"
// //                 variant="ghost"
// //                 size="sm"
// //                 className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-[#1a2332] text-gray-400"
// //                 onClick={() => setShowPassword(!showPassword)}
// //                 disabled={loading}
// //               >
// //                 {showPassword ? (
// //                   <EyeOff className="h-4 w-4" />
// //                 ) : (
// //                   <Eye className="h-4 w-4" />
// //                 )}
// //               </Button>
// //             </div>
// //           </div>

// //           {error && (
// //             <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
// //               <div className="flex items-center gap-2 text-red-300 text-sm">
// //                 <Shield className="h-4 w-4" />
// //                 {error}
// //               </div>
// //             </div>
// //           )}

// //           <Button
// //             type="submit"
// //             disabled={loading || !password.trim()}
// //             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
// //           >
// //             {loading ? (
// //               <div className="flex items-center gap-2">
// //                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
// //                 Verifying...
// //               </div>
// //             ) : (
// //               isForAnalytics ? 'View Analytics' : 'Access Poll'
// //             )}
// //           </Button>
// //         </form>

// //         <div className="text-center">
// //           <p className="text-gray-400 text-sm">
// //             Don't have the password? Contact the poll creator.
// //           </p>
// //         </div>

// //         <DialogFooter className="flex justify-center sm:justify-between gap-2 mt-4">
// //           <Button
// //             type="button"
// //             variant="outline"
// //             onClick={handleGoBack}
// //             className="border-gray-600 bg-[#0D1425] hover:bg-[#1a2332] text-white"
// //           >
// //             <ArrowLeft className="mr-2 h-4 w-4" />
// //             Go Back
// //           </Button>
// //         </DialogFooter>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // };

// // export default PasswordProtectedPoll;

// import React, { useState } from 'react';
// import { supabase } from '../../supabaseClient';

// const PasswordProtectedPoll = ({ pollId, onAuthenticated }) => {
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const { data, error } = await supabase
//         .from('polls')
//         .select('password_hash')
//         .eq('id', pollId)
//         .single();

//       if (error) throw error;
      
//       if(!data.password_hash){
//         onAuthenticated();
//         return;
//       }
      
//       // Compare the password with the hash (you should use a proper hashing comparison)
//       if (data.password_hash === password) {
//         onAuthenticated();
//       } else {
//         setError('Incorrect password');
//         console.log('Incorrect password');
//       }
//     } catch (err) {
//       setError('Failed to verify password');
//       console.log(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
//       <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 max-w-md w-full shadow-2xl">
//         <h2 className="text-2xl font-bold text-white mb-6">Password Protected</h2>
//         <p className="text-gray-300 mb-6">This poll is password protected. Please enter the password to continue.</p>
        
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
//               placeholder="Enter password"
//               required
//             />
//           </div>
          
//           {error && <div className="text-red-400 mb-4 p-3 bg-red-500/10 rounded-lg border border-red-500/30">{error}</div>}
          
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium disabled:opacity-50 transition-all"
//           >
//             {loading ? 'Verifying...' : 'Submit'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PasswordProtectedPoll;


import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, AlertCircle } from "lucide-react";

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
      
      // Compare the password with the hash (you should use a proper hashing comparison)
      if (data.password_hash === password) {
        onAuthenticated();
      } else {
        setError('Incorrect password');
        console.log('Incorrect password');
      }
    } catch (err) {
      setError('Failed to verify password');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20 text-white">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-white/10">
              <Lock className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Password Protected</CardTitle>
          <CardDescription className="text-center text-gray-300">
            This poll is password protected. Please enter the password to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                placeholder="Enter password"
                required
              />
            </div>
            
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Submit'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordProtectedPoll;