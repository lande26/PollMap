import React from 'react';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="w-full mt-auto py-6 border-t border-white/5 bg-transparent z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                    {/* Copyright */}
                    <div className="text-sm text-gray-500 font-medium">
                        © {new Date().getFullYear()} PollMap
                    </div>

                    {/* Social Icons */}
                    <div className="flex gap-5">
                        <a href="https://github.com/lande26" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors duration-200">
                            <Github size={18} />
                        </a>
                        <a href="#" className="text-gray-500 hover:text-[#1DA1F2] transition-colors duration-200">
                            <Twitter size={18} />
                        </a>
                        <a href="#" className="text-gray-500 hover:text-[#0A66C2] transition-colors duration-200">
                            <Linkedin size={18} />
                        </a>
                    </div>

                    {/* Attribution */}
                    <div className="text-sm border border-white/10 px-3 py-1.5 rounded-full text-gray-500 flex items-center gap-1.5 font-medium hover:bg-white/5 transition-colors duration-300">
                        Built with <Heart size={14} className="text-red-500/80 fill-red-500/20 animate-pulse" /> by Kartik
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;
