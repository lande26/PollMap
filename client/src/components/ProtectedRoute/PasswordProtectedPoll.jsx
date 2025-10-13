// import React, { useState } from 'react';
// import { supabase } from '../../supabaseClient';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Shield, AlertCircle, Lock, Loader2 } from "lucide-react";

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
//     <div className="flex items-center justify-center min-h-screen p-6">
//       <Card className="w-full max-w-md bg-gradient-to-br from-amber-900/20 to-orange-900/20 backdrop-blur-md border-amber-500/20 text-white shadow-2xl">
//         <CardHeader className="space-y-1">
//           <div className="flex items-center justify-center mb-4">
//             <div className="p-4 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
//               <Shield className="h-8 w-8 text-amber-400" />
//             </div>
//           </div>
//           <CardTitle className="text-2xl text-center">Password Protected</CardTitle>
//           <CardDescription className="text-center text-gray-300">
//             This poll is password protected. Please enter the password to continue.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="password" className="flex items-center gap-2">
//                 <Lock className="h-4 w-4" />
//                 Password
//               </Label>
//               <Input
//                 id="password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-amber-500/50"
//                 placeholder="Enter password"
//                 required
//               />
//             </div>
            
//             {error && (
//               <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300">
//                 <AlertCircle className="h-4 w-4" />
//                 <span className="text-sm">{error}</span>
//               </div>
//             )}
            
//             <Button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Verifying...
//                 </>
//               ) : (
//                 'Submit'
//               )}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default PasswordProtectedPoll;


// // import React, { useState } from 'react';
// // import { supabase } from '../../supabaseClient';
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Shield, AlertCircle, Lock, Loader2, Eye } from "lucide-react";
// // import { toast } from 'sonner';

// // const PasswordProtectedPoll = ({ pollId, onAuthenticated }) => {
// //   const [password, setPassword] = useState('');
// //   const [error, setError] = useState('');
// //   const [loading, setLoading] = useState(false);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError('');

// //     try {
// //       const { data, error } = await supabase
// //         .from('polls')
// //         .select('password_hash')
// //         .eq('id', pollId)
// //         .single();

// //       if (error) throw error;
      
// //       if(!data.password_hash){
// //         onAuthenticated();
// //         return;
// //       }
      
// //       // Compare the password with the hash (you should use a proper hashing comparison)
// //       if (data.password_hash === password) {
// //         onAuthenticated();
// //         toast.success('Password verified successfully!');
// //       } else {
// //         setError('Incorrect password');
// //         toast.error('Incorrect password');
// //       }
// //     } catch (err) {
// //       setError('Failed to verify password');
// //       toast.error('Failed to verify password');
// //       console.log(err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleSkip = () => {
// //     onAuthenticated();
// //     toast.info('Viewing poll without password');
// //   };

// //   return (
// //     <div className="flex items-center justify-center min-h-screen p-6">
// //       <Card className="w-full max-w-md bg-[#10172A]/90 backdrop-blur-md border border-gray-700 text-white shadow-2xl">
// //         <CardHeader className="space-y-1">
// //           <div className="flex items-center justify-center mb-4">
// //             <div className="p-4 rounded-full bg-yellow-500/20 border border-yellow-500/30">
// //               <Shield className="h-8 w-8 text-yellow-400" />
// //             </div>
// //           </div>
// //           <CardTitle className="text-2xl text-center">Password Protected</CardTitle>
// //           <CardDescription className="text-center text-gray-300">
// //             This poll is password protected. Please enter the password to continue.
// //           </CardDescription>
// //         </CardHeader>
// //         <CardContent>
// //           <form onSubmit={handleSubmit} className="space-y-4">
// //             <div className="space-y-2">
// //               <Label htmlFor="password" className="flex items-center gap-2">
// //                 <Lock className="h-4 w-4" />
// //                 Password
// //               </Label>
// //               <Input
// //                 id="password"
// //                 type="password"
// //                 value={password}
// //                 onChange={(e) => setPassword(e.target.value)}
// //                 className="bg-[#0D1425] border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500/50"
// //                 placeholder="Enter password"
// //                 required
// //               />
// //             </div>
            
// //             {error && (
// //               <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300">
// //                 <AlertCircle className="h-4 w-4" />
// //                 <span className="text-sm">{error}</span>
// //               </div>
// //             )}
            
// //             <div className="flex flex-col gap-2">
// //               <Button
// //                 type="submit"
// //                 disabled={loading}
// //                 className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
// //               >
// //                 {loading ? (
// //                   <>
// //                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// //                     Verifying...
// //                   </>
// //                 ) : (
// //                   'Submit'
// //                 )}
// //               </Button>
              
// //               <Button
// //                 type="button"
// //                 variant="outline"
// //                 onClick={handleSkip}
// //                 className="w-full border-gray-600 bg-[#0D1425] hover:bg-[#1a2332] text-white"
// //               >
// //                 <Eye className="mr-2 h-4 w-4" />
// //                 View Without Password
// //               </Button>
// //             </div>
// //           </form>
// //         </CardContent>
// //       </Card>
// //     </div>
// //   );
// // };

// // export default PasswordProtectedPoll;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, AlertCircle, Lock, Loader2, Eye } from "lucide-react";
import { toast } from 'sonner';

const PasswordProtectedPoll = ({ pollId, onAuthenticated, onSkip }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        toast.error('Incorrect password');
      }
    } catch (err) {
      setError('Failed to verify password');
      toast.error('Failed to verify password');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <Card className="w-full max-w-md bg-[#10172A]/90 backdrop-blur-md border border-gray-700 text-white shadow-2xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 rounded-full bg-yellow-500/20 border border-yellow-500/30">
              <Shield className="h-8 w-8 text-yellow-400" />
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
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#0D1425] border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500/50"
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
            
            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
              
              {onSkip && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onSkip}
                  className="w-full border-gray-600 bg-[#0D1425] hover:bg-[#1a2332] text-white"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Without Password
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordProtectedPoll;