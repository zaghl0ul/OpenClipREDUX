import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
  Home, Folder, Film, BarChart3, Settings, X,
  Video, TrendingUp, Clock, Users, Sparkles,
  Zap, Brain, Target, Coffee
} from 'lucide-react'
import useProjectStore from '../../stores/projectStore'

const GlassSidebar = ({ isOpen, onClose }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { projects } = useProjectStore()
  
  const navigationItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard", active: location.pathname === '/dashboard' },
    { icon: Folder, label: "Projects", path: "/projects", active: location.pathname === '/projects' },
    { icon: Film, label: "Clips", path: "/clips", active: location.pathname === '/clips' },
    { icon: BarChart3, label: "Analytics", path: "/analytics", active: location.pathname === '/analytics' },
    { icon: Settings, label: "Settings", path: "/settings", active: location.pathname === '/settings' }
  ]
  
  const handleNavigation = (path) => {
    navigate(path)
    onClose()
  }
  
  // Calculate project statistics for glass interface
  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    totalClips: projects.reduce((sum, p) => sum + (p.clips?.length || 0), 0),
    completedProjects: projects.filter(p => p.status === 'complete').length
  }
  
  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    },
    closed: {
      x: -300,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  }
  
  const itemVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    closed: {
      x: -50,
      opacity: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  }
  
  return (
    <>
      {/* Mobile Overlay with Glass Effect */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      
      {/* Glass Sidebar */}
      <AnimatePresence>
        <motion.div
          className={`comprehensive-glass glass-sidebar fixed left-4 top-20 bottom-4 w-64 rounded-2xl p-6 z-40 ${
            isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          } transition-transform lg:transition-none`}
          variants={sidebarVariants}
          initial="closed"
          animate="open"
          exit="closed"
        >
          <div className="relative z-10">
            {/* Close button for mobile with glass treatment */}
            <motion.button
              className="lg:hidden absolute top-4 right-4 comprehensive-glass glass-button rounded-lg p-2 text-white hover:bg-white/20 transition-colors"
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-4 h-4" />
            </motion.button>
            
            {/* Navigation with enhanced glass effects */}
            <motion.nav className="space-y-2 mb-8" variants={itemVariants}>
              {navigationItems.map((item, index) => (
                <motion.button
                  key={item.label}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative overflow-hidden ${
                    item.active 
                      ? 'comprehensive-glass text-white border border-white/30' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  onClick={() => handleNavigation(item.path)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  variants={itemVariants}
                >
                  {/* Enhanced active indicator with glass glow effect */}
                  {item.active && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl"
                      layoutId="activeIndicator"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  <item.icon className={`w-5 h-5 relative z-10 ${
                    item.active ? 'text-indigo-300' : ''
                  }`} />
                  <span className="font-medium relative z-10">{item.label}</span>
                  
                  {item.active && (
                    <motion.div
                      className="ml-auto w-2 h-2 bg-indigo-400 rounded-full relative z-10"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.7, 1, 0.7],
                        boxShadow: [
                          '0 0 0 rgba(99, 102, 241, 0.5)',
                          '0 0 10px rgba(99, 102, 241, 0.8)',
                          '0 0 0 rgba(99, 102, 241, 0.5)'
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </motion.button>
              ))}
            </motion.nav>
            
            {/* Enhanced Quick Stats with Glass */}
            <motion.div className="space-y-4 mb-8" variants={itemVariants}>
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wide">
                Overview
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <motion.div 
                  className="comprehensive-glass glass-button rounded-xl p-3 hover:bg-white/15 transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Folder className="w-4 h-4 text-indigo-300" />
                    <span className="text-xs text-white/60">Projects</span>
                  </div>
                  <p className="text-lg font-bold text-white">{stats.totalProjects}</p>
                </motion.div>
                
                <motion.div 
                  className="comprehensive-glass glass-button rounded-xl p-3 hover:bg-white/15 transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Film className="w-4 h-4 text-purple-300" />
                    <span className="text-xs text-white/60">Clips</span>
                  </div>
                  <p className="text-lg font-bold text-white">{stats.totalClips}</p>
                </motion.div>
                
                <motion.div 
                  className="comprehensive-glass glass-button rounded-xl p-3 hover:bg-white/15 transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-300" />
                    <span className="text-xs text-white/60">Active</span>
                  </div>
                  <p className="text-lg font-bold text-white">{stats.activeProjects}</p>
                </motion.div>
                
                <motion.div 
                  className="comprehensive-glass glass-button rounded-xl p-3 hover:bg-white/15 transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-blue-300" />
                    <span className="text-xs text-white/60">Done</span>
                  </div>
                  <p className="text-lg font-bold text-white">{stats.completedProjects}</p>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Enhanced AI Assistant Preview with Glass */}
            <motion.div 
              className="comprehensive-glass glass-button rounded-xl p-4 mb-6"
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-lg flex items-center justify-center comprehensive-glass"
                  animate={{
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      '0 0 0 rgba(99, 102, 241, 0.5)',
                      '0 0 15px rgba(99, 102, 241, 0.8)',
                      '0 0 0 rgba(99, 102, 241, 0.5)'
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Brain className="w-4 h-4 text-white" />
                </motion.div>
                <div>
                  <p className="text-sm font-medium text-white">AI Assistant</p>
                  <p className="text-xs text-white/60">Ready to help</p>
                </div>
              </div>
              
              <p className="text-sm text-white/80 mb-3">
                "Ready to analyze your next video? I can detect optimal cut points and suggest improvements."
              </p>
              
              <motion.button
                className="w-full px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Analysis
              </motion.button>
            </motion.div>
            
            {/* Enhanced Recent Activity with Glass */}
            <motion.div variants={itemVariants}>
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
                Recent Activity
              </h3>
              
              <div className="space-y-2">
                {projects.slice(0, 3).map((project, index) => (
                  <motion.div
                    key={project.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer comprehensive-glass glass-button"
                    whileHover={{ x: 2 }}
                    onClick={() => handleNavigation(`/projects/${project.id}`)}
                  >
                    <motion.div 
                      className={`w-2 h-2 rounded-full ${
                        project.status === 'active' ? 'bg-green-400' :
                        project.status === 'analyzing' ? 'bg-yellow-400' :
                        'bg-blue-400'
                      }`}
                      animate={{
                        scale: project.status === 'active' ? [1, 1.2, 1] : 1,
                        opacity: project.status === 'active' ? [0.7, 1, 0.7] : 1
                      }}
                      transition={{
                        duration: 2,
                        repeat: project.status === 'active' ? Infinity : 0
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{project.name}</p>
                      <p className="text-xs text-white/60">{project.clips?.length || 0} clips</p>
                    </div>
                  </motion.div>
                ))}
                
                {projects.length === 0 && (
                  <div className="text-center py-4">
                    <Video className="w-8 h-8 text-white/40 mx-auto mb-2" />
                    <p className="text-sm text-white/60">No projects yet</p>
                    <p className="text-xs text-white/40">Create your first project</p>
                  </div>
                )}
              </div>
            </motion.div>
            
            {/* Enhanced Productivity Meter with Glass */}
            <motion.div 
              className="mt-6 comprehensive-glass glass-button rounded-xl p-4"
              variants={itemVariants}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/60">Today's Progress</span>
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </div>
              
              <div className="w-full bg-white/10 rounded-full h-2 mb-2 comprehensive-glass">
                <motion.div
                  className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "68%" }}
                  transition={{ delay: 0.5, duration: 1 }}
                />
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">4 clips processed</span>
                <span className="text-green-400 font-medium">68%</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  )
}

export default GlassSidebar