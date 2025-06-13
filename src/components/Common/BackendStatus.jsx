import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, CheckCircle, XCircle, RefreshCw, Activity } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import apiService from '../../services/api';

const BackendStatus = () => {
  const isBackendConnected = useSettingsStore((state) => state.isBackendConnected);
  const [isChecking, setIsChecking] = useState(false);
  const [statusDetails, setStatusDetails] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState(null);

  const checkBackendStatus = async () => {
    setIsChecking(true);
    try {
      const healthResponse = await apiService.healthCheck();
      setStatusDetails(healthResponse);
      setLastCheckTime(new Date());
    } catch (error) {
      console.error('Backend health check failed:', error);
      setStatusDetails({
        status: 'unhealthy',
        error: error.message
      });
      setLastCheckTime(new Date());
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Check status on mount
    checkBackendStatus();
    
    // Set up interval to check periodically
    const interval = setInterval(checkBackendStatus, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <motion.button 
        onClick={() => setShowDetails(!showDetails)}
        className={`comprehensive-glass glass-button flex items-center gap-2 px-3 py-2 rounded-full transition-all relative overflow-hidden ${
          isBackendConnected 
            ? 'text-green-300 hover:bg-green-500/20' 
            : 'text-red-300 hover:bg-red-500/20'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: isBackendConnected 
            ? ['0 0 0 rgba(34, 197, 94, 0.5)', '0 0 15px rgba(34, 197, 94, 0.8)', '0 0 0 rgba(34, 197, 94, 0.5)']
            : ['0 0 0 rgba(239, 68, 68, 0.5)', '0 0 12px rgba(239, 68, 68, 0.8)', '0 0 0 rgba(239, 68, 68, 0.5)']
        }}
        transition={{
          boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <div className="relative z-10">
          <div className="relative">
            {isChecking ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <RefreshCw className="w-4 h-4" />
              </motion.div>
            ) : (
              <motion.div
                animate={isBackendConnected ? { scale: [1, 1.1, 1] } : { scale: [1, 0.9, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {isBackendConnected ? (
                  <Server className="w-4 h-4" />
                ) : (
                  <Server className="w-4 h-4" />
                )}
              </motion.div>
            )}
          </div>
          
          <span className="text-xs font-medium">
            {isBackendConnected ? 'Connected' : 'Disconnected'}
          </span>
          
          {/* Status indicator dot */}
          <motion.div
            className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
              isBackendConnected ? 'bg-green-400' : 'bg-red-400'
            }`}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.button>
      
      {/* Enhanced Status Details Panel with Glass */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full right-0 mb-3 comprehensive-glass rounded-lg p-4 min-w-[320px] shadow-2xl"
            style={{ backdropFilter: 'blur(25px)' }}
          >
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Backend Status
                </h3>
                <motion.div
                  className={`w-2 h-2 rounded-full ${
                    isBackendConnected ? 'bg-green-400' : 'bg-red-400'
                  }`}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity
                  }}
                />
              </div>
              
              {/* Status Information */}
              <div className="space-y-3 text-sm">
                <div className="comprehensive-glass glass-button rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Connection Status:</span>
                    <span className={`font-medium ${
                      isBackendConnected ? 'text-green-300' : 'text-red-300'
                    }`}>
                      {isBackendConnected ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                {statusDetails && (
                  <>
                    <div className="comprehensive-glass glass-button rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white/70">Service Status:</span>
                        <span className={`font-medium ${
                          statusDetails.status === 'healthy' ? 'text-green-300' : 'text-orange-300'
                        }`}>
                          {statusDetails.status || 'Unknown'}
                        </span>
                      </div>
                    </div>
                    
                    {statusDetails.version && (
                      <div className="comprehensive-glass glass-button rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-white/70">Version:</span>
                          <span className="text-white font-mono text-xs">
                            {statusDetails.version}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {lastCheckTime && (
                      <div className="comprehensive-glass glass-button rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-white/70">Last Check:</span>
                          <span className="text-white/90 text-xs">
                            {lastCheckTime.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {statusDetails.error && (
                      <div className="comprehensive-glass rounded-lg p-3 border border-red-500/30">
                        <div className="text-red-300 text-xs">
                          <span className="font-medium">Error:</span>
                          <div className="mt-1 text-red-200/80">
                            {statusDetails.error}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
                
                {/* Performance Indicators */}
                <div className="comprehensive-glass glass-button rounded-lg p-3">
                  <div className="text-white/70 text-xs mb-2">Performance</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white/10 rounded-full h-1.5">
                      <motion.div
                        className={`h-full rounded-full ${
                          isBackendConnected ? 'bg-green-400' : 'bg-red-400'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: isBackendConnected ? '85%' : '15%' }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                    <span className="text-white/60 text-xs">
                      {isBackendConnected ? '85%' : '15%'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-4 space-y-2">
                <motion.button
                  onClick={checkBackendStatus}
                  disabled={isChecking}
                  className="w-full comprehensive-glass glass-button py-2 rounded-lg text-white text-sm font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isChecking ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </motion.div>
                      Checking...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Refresh Status
                    </>
                  )}
                </motion.button>
                
                <motion.button
                  onClick={() => setShowDetails(false)}
                  className="w-full comprehensive-glass glass-button py-2 rounded-lg text-white/70 text-sm hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BackendStatus;