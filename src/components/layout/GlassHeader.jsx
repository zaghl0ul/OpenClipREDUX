import React from 'react'
import { motion } from 'framer-motion'
import { 
  Menu, Search, Bell, User, Upload, Plus, 
  Zap, Settings, HelpCircle 
} from 'lucide-react'
import { useSettingsStore } from '../../stores/settingsStore'

const GlassHeader = ({ onMenuClick }) => {
  const isBackendConnected = useSettingsStore((state) => state.isBackendConnected)
  
  return (
    <motion.header
      className="comprehensive-glass glass-header fixed top-4 left-4 right-4 rounded-2xl p-4 z-40"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -1 }}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          {/* Left Section - Logo & Navigation */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <motion.button
              className="lg:hidden comprehensive-glass glass-button rounded-xl p-2 text-white hover:bg-white/20 transition-colors"
              onClick={onMenuClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu className="w-5 h-5" />
            </motion.button>
            
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 comprehensive-glass glass-button rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-indigo-300" />
              </div>
              <span className="text-xl font-bold text-white hidden sm:block">VideoForge</span>
            </motion.div>
            
            {/* Backend Status Indicator with Glass Enhancement */}
            <motion.div
              className="flex items-center gap-2 px-3 py-1 comprehensive-glass glass-button rounded-lg"
              animate={{
                backgroundColor: isBackendConnected 
                  ? 'rgba(34, 197, 94, 0.2)' 
                  : 'rgba(239, 68, 68, 0.2)'
              }}
            >
              <motion.div
                className={`w-2 h-2 rounded-full ${
                  isBackendConnected ? 'bg-green-400' : 'bg-red-400'
                }`}
                animate={{
                  scale: isBackendConnected ? [1, 1.2, 1] : [1, 0.8, 1],
                  boxShadow: isBackendConnected 
                    ? ['0 0 0 rgba(34, 197, 94, 0.5)', '0 0 10px rgba(34, 197, 94, 0.8)', '0 0 0 rgba(34, 197, 94, 0.5)']
                    : ['0 0 0 rgba(239, 68, 68, 0.5)', '0 0 8px rgba(239, 68, 68, 0.8)', '0 0 0 rgba(239, 68, 68, 0.5)']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <span className="text-xs text-white/80 hidden md:block">
                {isBackendConnected ? 'Connected' : 'Disconnected'}
              </span>
            </motion.div>
          </div>
          
          {/* Center Section - Enhanced Search with Glass */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search projects, clips, or keywords..."
                className="w-full comprehensive-glass glass-button rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-white/40 border-0 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all bg-transparent"
              />
            </div>
          </div>
          
          {/* Right Section - Actions & User with Glass Treatment */}
          <div className="flex items-center gap-3">
            {/* Quick Actions */}
            <motion.button
              className="comprehensive-glass glass-button px-4 py-2 rounded-xl text-white hover:bg-white/20 transition-colors flex items-center gap-2 hidden sm:flex"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
              whileTap={{ scale: 0.95 }}
            >
              <Upload className="w-4 h-4" />
              <span className="hidden lg:inline">Upload</span>
            </motion.button>
            
            <motion.button
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 px-4 py-2 rounded-xl text-white transition-all flex items-center gap-2 shadow-lg backdrop-blur-sm"
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden lg:inline">New Project</span>
            </motion.button>
            
            {/* Notification Button with Glass */}
            <motion.button
              className="relative comprehensive-glass glass-button rounded-xl p-2.5 text-white hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="w-5 h-5" />
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  boxShadow: ['0 0 0 rgba(239, 68, 68, 0.5)', '0 0 8px rgba(239, 68, 68, 0.8)', '0 0 0 rgba(239, 68, 68, 0.5)']
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>
            
            {/* Settings Button with Glass Enhancement */}
            <motion.button
              className="comprehensive-glass glass-button rounded-xl p-2.5 text-white hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.05, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="w-5 h-5" />
            </motion.button>
            
            {/* Help Button */}
            <motion.button
              className="comprehensive-glass glass-button rounded-xl p-2.5 text-white hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <HelpCircle className="w-5 h-5" />
            </motion.button>
            
            {/* Enhanced User Profile with Glass */}
            <motion.button
              className="flex items-center gap-3 comprehensive-glass glass-button rounded-xl p-2 hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-sm font-medium text-white">Creator</p>
                <p className="text-xs text-white/60">Professional</p>
              </div>
            </motion.button>
          </div>
        </div>
        
        {/* Mobile Search with Glass Treatment */}
        <motion.div
          className="md:hidden mt-4 pt-4 border-t border-white/10"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full comprehensive-glass glass-button rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-white/40 border-0 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all bg-transparent"
            />
          </div>
        </motion.div>
      </div>
    </motion.header>
  )
}

export default GlassHeader