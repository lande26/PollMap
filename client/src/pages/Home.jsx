import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { BarChart3, Bookmark, Users, ArrowRight, PlusCircle, Activity } from 'lucide-react';

// --- COPIED COMPONENTS FROM DASHBOARD.JSX FOR CONSISTENCY ---

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2
};

const TiltedCard = ({
  imageSrc,
  altText = 'Tilted card image',
  captionText = '',
  containerHeight = '300px',
  containerWidth = '300px',
  imageHeight = '300px',
  imageWidth = '300px',
  scaleOnHover = 1.1,
  rotateAmplitude = 14,
  showMobileWarning = true,
  showTooltip = true,
  overlayContent = null,
  displayOverlayContent = false
}) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1
  });

  const [lastY, setLastY] = useState(0);

  function handleMouse(e) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rotateX.set(rotationX);
    rotateY.set(rotationY);

    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);

    const velocityY = offsetY - lastY;
    rotateFigcaption.set(-velocityY * 0.6);
    setLastY(offsetY);
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
    opacity.set(1);
  }

  function handleMouseLeave() {
    opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
  }

  return (
    <figure
      ref={ref}
      className="relative w-full h-full [perspective:800px] flex flex-col items-center justify-center"
      style={{
        height: containerHeight,
        width: containerWidth
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showMobileWarning && (
        <div className="absolute top-4 text-center text-sm block sm:hidden text-white">
          This effect is not optimized for mobile. Check on desktop.
        </div>
      )}

      <motion.div
        className="relative [transform-style:preserve-3d]"
        style={{
          width: imageWidth,
          height: imageHeight,
          rotateX,
          rotateY,
          scale
        }}
      >
        <motion.div
          className="absolute top-0 left-0 object-cover rounded-[15px] will-change-transform [transform:translateZ(0)]"
          style={{
            width: imageWidth,
            height: imageHeight
          }}
        >
          {overlayContent}
        </motion.div>
      </motion.div>

      {showTooltip && (
        <motion.figcaption
          className="pointer-events-none absolute left-0 top-0 rounded-[4px] bg-white px-[10px] py-[4px] text-[10px] text-[#2d2d2d] opacity-0 z-[3] hidden sm:block"
          style={{
            x,
            y,
            opacity,
            rotate: rotateFigcaption
          }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  );
};

const FeatureCard = ({ icon, title, description, gradientColors, borderColor }) => (
  <TiltedCard
    imageSrc=""
    altText={title}
    captionText={title}
    containerHeight="300px"
    containerWidth="300px"
    imageHeight="300px"
    imageWidth="300px"
    scaleOnHover={1.05}
    rotateAmplitude={10}
    showMobileWarning={false}
    showTooltip={false}
    displayOverlayContent={true}
    overlayContent={
      <div className={`p-8 h-full flex flex-col justify-center bg-gradient-to-br ${gradientColors} backdrop-blur-md border-2 ${borderColor} rounded-[15px]`}>
        <div className={`${borderColor.replace('border-', 'bg-').replace('/30', '/30')} w-16 h-16 rounded-2xl flex items-center justify-center mb-6`}>
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
        <p className="text-gray-200 text-base leading-relaxed">
          {description}
        </p>
      </div>
    }
  />
);

const SpotlightCard = ({ children, className = '', spotlightColor = 'rgba(255, 255, 255, 0.25)' }) => {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = e => {
    if (!divRef.current || isFocused) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(0.6);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(0.6);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-3xl border backdrop-blur-sm overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`
        }}
      />
      {children}
    </div>
  );
};

// --- HOME PAGE COMPONENT ---

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center py-20">
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center">

        {/* Header Section */}
        <div className="text-center mb-20 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm md:text-base text-blue-300 mb-8 backdrop-blur-sm">
            <Activity size={18} />
            <span>Real-time Polling Platform</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight"
            style={{
              fontFamily: 'Lato, sans-serif',
              fontWeight: 700
            }}>
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">PollMap</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Create interactive polls, gather real-time feedback, and visualize data instantly.
            Join the conversation and discover what the world thinks.
          </p>

          <div className="flex flex-wrap gap-6 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-10 py-4 rounded-xl font-medium flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 hover:scale-105 text-lg"
            >
              Get Started
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bg-white/5 hover:bg-white/10 backdrop-blur-lg border border-white/20 text-white px-10 py-4 rounded-xl font-medium flex items-center gap-3 transition-all duration-300 hover:shadow-lg hover:border-white/40 text-lg"
            >
              Explore Polls
            </button>
          </div>
        </div>

        {/* Feature Grid using Dashboard Components */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl">
          <FeatureCard
            icon={<PlusCircle size={32} className="text-blue-300" />}
            title="Create & Customize"
            description="Design custom polls with various question types. Set permissions and control who can participate."
            gradientColors="from-blue-500/20 to-blue-600/10"
            borderColor="border-blue-500/30"
          />

          <FeatureCard
            icon={<Users size={32} className="text-green-300" />}
            title="Vote Real-time"
            description="Watch results update instantly as people vote. Experience live visualization of data."
            gradientColors="from-green-500/20 to-green-600/10"
            borderColor="border-green-500/30"
          />

          <FeatureCard
            icon={<Bookmark size={32} className="text-purple-300" />}
            title="Track & Analyze"
            description="Bookmark interesting polls, track your participation history, and get deep insights."
            gradientColors="from-purple-500/20 to-purple-600/10"
            borderColor="border-purple-500/30"
          />
        </div>


      </div>
    </div>
  );
};

export default Home;