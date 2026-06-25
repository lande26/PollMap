import React from 'react';
import { Github, Heart } from 'lucide-react';
import TwitterXIcon from './ui/icons/TwitterXIcon';
import LinkedinIcon from './ui/icons/LinkedinIcon';

const Footer = () => {
    return (
        <footer className="relative z-10 w-full px-4 pb-8 pt-2 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,19,36,0.84),rgba(8,14,28,0.78))] px-6 py-5 shadow-[0_24px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    {/* Copyright */}
                    <div className="text-sm text-gray-500 font-medium">
                        © {new Date().getFullYear()} PollMap
                    </div>

                    {/* Social Icons */}
                    <div className="flex gap-5">
                        <a href="https://github.com/lande26" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors duration-200">
                            <Github size={18} />
                        </a>
                        <a href="https://x.com/KartikLande15" className="text-gray-500 hover:text-[#1DA1F2] transition-colors duration-200">
                            <TwitterXIcon size={18} />
                        </a>
                        <a href="https://www.linkedin.com/in/kartik-lande" className="text-gray-500 hover:text-[#0A66C2] transition-colors duration-200">
                            <LinkedinIcon size={18} />
                        </a>
                    </div>

                    {/* Attribution */}
                    <div className="text-sm border border-white/10 bg-white/5 px-3 py-1.5 rounded-full text-gray-400 flex items-center gap-1.5 font-medium hover:bg-white/10 transition-colors duration-300">
                        Built with <Heart size={14} className="text-red-500/80 fill-red-500/20 animate-pulse" /> by Kartik
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;
