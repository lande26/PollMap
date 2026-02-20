import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Heart, HelpCircle, FileText, Shield } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="w-full border-t border-white/10 bg-[#070b14]/50 backdrop-blur-md mt-auto z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient">
                            PollMap
                        </h3>
                        <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
                            Interactive, real-time polling and Q&A platform for seamless audience engagement. Perfect for meetings, classrooms, and live events.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <a href="https://github.com/lande26" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:-translate-y-1">
                                <Github size={18} />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-[#1DA1F2]/50 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-[#1DA1F2] transition-all duration-300 hover:-translate-y-1">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-[#0A66C2]/50 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-[#0A66C2] transition-all duration-300 hover:-translate-y-1">
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Product</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/0 group-hover:bg-indigo-500 transition-colors"></span>
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link to="/" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/0 group-hover:bg-indigo-500 transition-colors"></span>
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link to="/" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/0 group-hover:bg-indigo-500 transition-colors"></span>
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Legal</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                                    <Shield size={14} className="group-hover:text-indigo-400 transition-colors" /> Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                                    <FileText size={14} className="group-hover:text-indigo-400 transition-colors" /> Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link to="/" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                                    <HelpCircle size={14} className="group-hover:text-indigo-400 transition-colors" /> Help Center
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} PollMap. All rights reserved.
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1.5 hover:text-gray-300 transition-colors cursor-default">
                        Built with <Heart size={14} className="text-red-500/80 fill-red-500/20 animate-pulse" /> by Kartik
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
