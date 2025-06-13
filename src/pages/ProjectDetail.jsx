import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, Play, Brain, Target, Sparkles, Zap, 
  Upload, Settings, TrendingUp, Clock
} from 'lucide-react';
import MagneticTimeline from '../components/timeline/MagneticTimeline';

const ProjectDetail = () => {
  const [activeTab, setActiveTab] = useState('timeline');
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedCutPoint, setSelectedCutPoint] = useState(null);

  // Demo project data
  const projectData = {
    id: 1,
    name: "Enterprise Training Series",
    description: "AI-powered video analysis for corporate training content optimization",
    duration: 120,
    clips: 24,
    status: "analyzing",
    progress: 67,
    aiInsights: {
      optimalCuts: 12,
      engagement: 89,
      clarity: 94,
      pacing: 76
    }
  };

  const tabs = [
    { id: 'timeline', label: 'Magnetic Timeline', icon: Target },
    { id: 'clips', label: 'AI Clips', icon: Video },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleTimeChange = (time) => {
    setCurrentTime(time);
  };

  const handleCutPointSelect = (cutPoint) => {
    setSelectedCutPoint(cutPoint);
    setCurrentTime(cutPoint.time);
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Project Header with Glass */}
      <motion.div 
        className="comprehensive-glass rounded-2xl p-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-16 h-16 comprehensive-glass glass-button rounded-2xl flex items-center justify-center">
                  <Video className="w-8 h-8 text-indigo-300" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{projectData.name}</h1>
                  <p className="text-white/70">{projectData.description}</p>
                </div>
              </div>
              
              {/* Enhanced Status and Progress */}
              <div className="flex items-center gap-6">
                <motion.div 
                  className="flex items-center gap-2 px-4 py-2 comprehensive-glass glass-button rounded-lg"
                  animate={{
                    boxShadow: ['0 0 0 rgba(251, 146, 60, 0.5)', '0 0 15px rgba(251, 146, 60, 0.8)', '0 0 0 rgba(251, 146, 60, 0.5)']
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <Brain className="w-4 h-4 text-yellow-300" />
                  </motion.div>
                  <span className="text-yellow-300 font-medium">AI Analyzing</span>
                </motion.div>
                
                <div className="flex items-center gap-3">
                  <span className="text-white/60">Progress:</span>
                  <div className="w-32 h-2 comprehensive-glass glass-button rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-indigo-400 to-purple-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${projectData.progress}%` }}
                      transition={{ delay: 0.5, duration: 1.5 }}
                    />
                  </div>
                  <span className="text-white font-medium">{projectData.progress}%</span>
                </div>
              </div>
            </div>
            
            {/* Enhanced Action Buttons */}
            <div className="flex items-center gap-3">
              <motion.button
                className="comprehensive-glass glass-button px-6 py-3 rounded-xl text-white hover:bg-white/20 transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Upload className="w-5 h-5" />
                Upload Video
              </motion.button>
              
              <motion.button
                className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 rounded-xl text-white hover:from-indigo-600 hover:to-purple-600 transition-all flex items-center gap-2 shadow-lg backdrop-blur-sm"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-5 h-5" />
                Export Clips
              </motion.button>
            </div>
          </div>
          
          {/* Enhanced AI Insights Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Optimal Cuts', value: projectData.aiInsights.optimalCuts, icon: Target, color: 'text-green-300' },
              { label: 'Engagement', value: `${projectData.aiInsights.engagement}%`, icon: Sparkles, color: 'text-blue-300' },
              { label: 'Clarity Score', value: `${projectData.aiInsights.clarity}%`, icon: Brain, color: 'text-purple-300' },
              { label: 'Pacing', value: `${projectData.aiInsights.pacing}%`, icon: Zap, color: 'text-yellow-300' }
            ].map((insight, index) => (
              <motion.div
                key={insight.label}
                className="comprehensive-glass glass-button p-4 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <insight.icon className={`w-4 h-4 ${insight.color}`} />
                  <span className="text-white/60 text-sm">{insight.label}</span>
                </div>
                <p className="text-2xl font-bold text-white">{insight.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* Enhanced Navigation Tabs with Glass */}
      <motion.div 
        className="comprehensive-glass rounded-2xl p-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    className="ml-2 w-2 h-2 bg-white rounded-full"
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* Enhanced Content Area with Tab Switching */}
      <AnimatePresence mode="wait">
        {activeTab === 'timeline' && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <MagneticTimeline
              duration={projectData.duration}
              currentTime={currentTime}
              onTimeChange={handleTimeChange}
              onCutPointSelect={handleCutPointSelect}
            />
          </motion.div>
        )}
        
        {activeTab === 'clips' && (
          <motion.div
            key="clips"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="comprehensive-glass rounded-2xl p-8"
          >
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Video className="w-8 h-8 text-indigo-300" />
                AI-Generated Clips
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }, (_, i) => (
                  <motion.div
                    key={i}
                    className="comprehensive-glass glass-button rounded-xl overflow-hidden hover:scale-[1.02] transition-transform"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                    whileHover={{ y: -4 }}
                  >
                    <div className="aspect-video comprehensive-glass glass-button flex items-center justify-center">
                      <Video className="w-12 h-12 text-white/40" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-medium mb-2">Clip {i + 1}</h3>
                      <p className="text-white/60 text-sm mb-3">AI-detected highlight segment</p>
                      <div className="flex items-center justify-between">
                        <span className="text-white/50 text-sm">0:{String(15 + i * 10).padStart(2, '0')}</span>
                        <div className="flex items-center gap-1 text-sm">
                          <Sparkles className="w-4 h-4 text-yellow-400" />
                          <span className="text-white">92</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
        
        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="comprehensive-glass rounded-2xl p-8"
          >
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-indigo-300" />
                Analytics & Insights
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="comprehensive-glass glass-button rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Engagement Analysis</h3>
                  <div className="space-y-4">
                    {['Peak Moments', 'Attention Drops', 'Key Highlights'].map((metric, i) => (
                      <div key={metric} className="flex items-center justify-between">
                        <span className="text-white/70">{metric}</span>
                        <div className="w-24 h-2 comprehensive-glass glass-button rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-green-400 to-blue-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${75 + i * 10}%` }}
                            transition={{ delay: i * 0.2, duration: 1 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="comprehensive-glass glass-button rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">AI Recommendations</h3>
                  <div className="space-y-3">
                    {[
                      'Trim opening by 3.2 seconds',
                      'Enhance segment at 1:45',
                      'Add transition at 2:30'
                    ].map((rec, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center gap-3 p-3 comprehensive-glass glass-button rounded-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.2 }}
                      >
                        <Brain className="w-4 h-4 text-purple-400" />
                        <span className="text-white/80">{rec}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="comprehensive-glass rounded-2xl p-8"
          >
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Settings className="w-8 h-8 text-indigo-300" />
                Project Settings
              </h2>
              
              <div className="space-y-6">
                <div className="comprehensive-glass glass-button rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">AI Analysis Options</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Scene Detection', enabled: true },
                      { label: 'Audio Analysis', enabled: true },
                      { label: 'Motion Tracking', enabled: false },
                      { label: 'Facial Recognition', enabled: true }
                    ].map((option, i) => (
                      <div key={option.label} className="flex items-center justify-between">
                        <span className="text-white/80">{option.label}</span>
                        <motion.div
                          className={`w-12 h-6 rounded-full p-1 transition-colors ${
                            option.enabled ? 'bg-indigo-500' : 'bg-gray-600'
                          }`}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.div
                            className="w-4 h-4 bg-white rounded-full"
                            animate={{ x: option.enabled ? 24 : 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        </motion.div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Enhanced Cut Point Details Panel */}
      <AnimatePresence>
        {selectedCutPoint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="comprehensive-glass rounded-2xl p-6"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-yellow-400" />
                  Cut Point Analysis
                </h3>
                <motion.button
                  onClick={() => setSelectedCutPoint(null)}
                  className="comprehensive-glass glass-button p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  ×
                </motion.button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="comprehensive-glass glass-button rounded-xl p-4">
                  <h4 className="text-white font-medium mb-2">Cut Type</h4>
                  <p className="text-white/70 capitalize">{selectedCutPoint.type.replace('_', ' ')}</p>
                </div>
                
                <div className="comprehensive-glass glass-button rounded-xl p-4">
                  <h4 className="text-white font-medium mb-2">Confidence</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 comprehensive-glass glass-button rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-400 to-blue-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedCutPoint.confidence * 100}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                    <span className="text-white font-medium">
                      {Math.round(selectedCutPoint.confidence * 100)}%
                    </span>
                  </div>
                </div>
                
                <div className="comprehensive-glass glass-button rounded-xl p-4">
                  <h4 className="text-white font-medium mb-2">Timestamp</h4>
                  <p className="text-white/70">
                    {Math.floor(selectedCutPoint.time / 60)}:{String(Math.floor(selectedCutPoint.time % 60)).padStart(2, '0')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetail;