import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Video,
  Upload,
  TrendingUp,
  Clock,
  Play,
  Plus,
  Sparkles,
  Brain,
  Target,
  Zap,
  Coffee,
  ChevronRight
} from 'lucide-react'
import useProjectStore from '../stores/projectStore'
import { useAdaptiveUIStore } from '../stores/adaptiveUIStore'
import { useAdaptiveUI } from '../contexts/AdaptiveUIContext'
import StatsCard from '../components/dashboard/StatsCard'
import RecentActivity from '../components/dashboard/RecentActivity'
import QuickActions from '../components/dashboard/QuickActions'
import { useDashboard } from '../hooks/useDashboard'

const Dashboard = () => {
  const navigate = useNavigate()
  const { projects } = useProjectStore()
  const { personality, uiState, predictions } = useAdaptiveUIStore()
  const { createAdaptiveClickHandler } = useAdaptiveUI()
  const { stats, recentActivity, loading } = useDashboard()
  const [timeGreeting, setTimeGreeting] = useState('')
  const [motivationalQuote, setMotivationalQuote] = useState('')
  
  // Set time-based greeting with glass-enhanced experience
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setTimeGreeting('Good morning')
    else if (hour < 18) setTimeGreeting('Good afternoon')
    else setTimeGreeting('Good evening')
    
    // Motivational quotes optimized for glass interface
    const quotes = {
      friendly: [
        "Let's create something amazing together!",
        "Your creativity is inspiring!",
        "Ready to make magic happen?"
      ],
      focused: [
        "Time to get things done.",
        "Focus leads to excellence.",
        "Efficiency is key today."
      ],
      energetic: [
        "You're on fire today! 🔥",
        "High energy, high results!",
        "Let's crush those goals!"
      ],
      calm: [
        "Take it one step at a time.",
        "Quality over quantity.",
        "Peaceful productivity."
      ],
      playful: [
        "Let's have some fun with this!",
        "Creativity loves play!",
        "Time to experiment!"
      ]
    }
    
    const moodQuotes = quotes[personality.mood] || quotes.friendly
    setMotivationalQuote(moodQuotes[Math.floor(Math.random() * moodQuotes.length)])
  }, [personality.mood])
  
  const handleCreateProject = createAdaptiveClickHandler('create-project-dashboard', () => {
    navigate('/projects?create=true')
  })
  
  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`)
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 mx-auto mb-4"
          >
            <Brain className="w-full h-full text-blue-500" />
          </motion.div>
          <p className="text-white/60">
            Preparing your workspace...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Hero Section with Glass Physics */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden comprehensive-glass rounded-2xl p-8 text-white"
      >
        <div className="relative z-10">
          {/* Animated background pattern with glass integration */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
              }}
              animate={{
                x: [0, 100, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>
          
          <motion.h1 
            className="text-3xl font-bold mb-2"
            animate={{
              scale: personality.mood === 'energetic' ? [1, 1.02, 1] : 1,
            }}
            transition={{
              duration: 2,
              repeat: personality.mood === 'energetic' ? Infinity : 0,
            }}
          >
            {timeGreeting}, Creator!
          </motion.h1>
          <p className="text-lg opacity-90 mb-6">{motivationalQuote}</p>
          
          {/* Enhanced quick stats in header with glass treatment */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="comprehensive-glass glass-button rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Video className="w-4 h-4" />
                <span className="text-sm opacity-80">Projects</span>
              </div>
              <p className="text-2xl font-bold">{stats.totalProjects}</p>
            </div>
            <div className="comprehensive-glass glass-button rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Play className="w-4 h-4" />
                <span className="text-sm opacity-80">Total Clips</span>
              </div>
              <p className="text-2xl font-bold">{stats.totalClips}</p>
            </div>
            <div className="comprehensive-glass glass-button rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm opacity-80">Avg Score</span>
              </div>
              <p className="text-2xl font-bold">{stats.averageScore.toFixed(1)}</p>
            </div>
            <div className="comprehensive-glass glass-button rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4" />
                <span className="text-sm opacity-80">Productivity</span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">{personality.experience}%</p>
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Enhanced Adaptive Quick Actions with Glass */}
      <AnimatePresence>
        {predictions.nextAction && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="comprehensive-glass glass-button rounded-lg p-4"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm font-medium text-white">
                      Predicted Next Action
                    </p>
                    <p className="text-xs text-white/60">
                      {predictions.nextAction.suggestion}
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={() => {
                    if (predictions.nextAction.action === 'upload') {
                      navigate('/projects?create=true')
                    } else if (predictions.nextAction.action === 'export') {
                      navigate('/clips')
                    }
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 comprehensive-glass glass-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Go</span>
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Enhanced Main Content Grid with Glass */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enhanced Quick Actions with Glass Treatment */}
        <motion.div className="lg:col-span-2" layout>
          <div className="comprehensive-glass rounded-lg p-6">
            <div className="relative z-10">
              <QuickActions />
            </div>
          </div>
        </motion.div>
        
        {/* Enhanced Recent Projects with Glass */}
        <motion.div className="lg:col-span-1" layout>
          <div className="comprehensive-glass rounded-lg p-6">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">
                  Recent Projects
                </h2>
                <button
                  onClick={() => navigate('/projects')}
                  className="text-sm text-blue-400 hover:underline"
                >
                  View all
                </button>
              </div>
              
              {projects.length === 0 ? (
                <div className="text-center py-8">
                  <Video className="w-12 h-12 text-white/40 mx-auto mb-3" />
                  <p className="text-white/60 mb-4">
                    No projects yet. Start by creating one!
                  </p>
                  <motion.button
                    onClick={handleCreateProject}
                    className="comprehensive-glass glass-button px-4 py-2 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center gap-2 mx-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="w-4 h-4" />
                    Create Project
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-3">
                  {projects.slice(0, 5).map((project) => (
                    <motion.div
                      key={project.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleProjectClick(project.id)}
                      className="p-4 comprehensive-glass glass-button rounded-lg cursor-pointer hover:bg-white/15 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-white">
                            {project.name}
                          </h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-white/60">
                            <span>{project.clips?.length || 0} clips</span>
                            <span>•</span>
                            <span>{new Date(project.created_at || project.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {project.status === 'analyzing' && (
                            <div className="flex items-center gap-2 text-blue-400">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                              >
                                <Brain className="w-4 h-4" />
                              </motion.div>
                              <span className="text-sm">Analyzing</span>
                            </div>
                          )}
                          <ChevronRight className="w-5 h-5 text-white/40" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Enhanced Activity & AI Insights with Glass */}
      <motion.div layout>
        <div className="comprehensive-glass rounded-lg p-6">
          <div className="relative z-10">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Activity & AI Insights</h2>
            <RecentActivity />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard