import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useSpring } from 'framer-motion'
import GlassHeader from './GlassHeader'
import GlassSidebar from './GlassSidebar'
import BackendStatus from '../Common/BackendStatus'
import { useSettingsStore } from '../../stores/settingsStore'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef(null)
  const appSettings = useSettingsStore((state) => state.app)
  
  // High-performance spring physics for cursor light tracking
  const mouseX = useSpring(0, { stiffness: 400, damping: 45 })
  const mouseY = useSpring(0, { stiffness: 400, damping: 45 })
  
  // Advanced glass physics calculation engine for enterprise-grade optical simulation
  const calculateComprehensiveGlassPhysics = useCallback((elementRect, lightSource) => {
    const { left, top, right, bottom, width, height } = elementRect
    const centerX = left + width / 2
    const centerY = top + height / 2
    
    // Vector mathematics for precise light-surface interaction
    const lightVectorX = lightSource.x - centerX
    const lightVectorY = lightSource.y - centerY
    const lightDistance = Math.sqrt(lightVectorX * lightVectorX + lightVectorY * lightVectorY)
    
    // Professional-grade inverse square law implementation with custom falloff curve
    const maxIlluminationDistance = 500
    const normalizedDistance = Math.min(lightDistance / maxIlluminationDistance, 1)
    const baseIntensity = Math.pow(1 - normalizedDistance, 2.2) * 1.4
    
    // Light incidence angle calculation for realistic material interaction
    const incidenceAngle = Math.atan2(lightVectorY, lightVectorX)
    const angleInDegrees = incidenceAngle * (180 / Math.PI)
    
    // Edge-specific illumination calculations with proper orthogonal positioning
    const edgePhysics = {
      top: {
        distance: Math.abs(lightSource.y - top),
        angle: angleInDegrees,
        intensity: baseIntensity * Math.max(0.2, 1 - Math.abs(Math.sin(incidenceAngle + Math.PI/2)) * 0.6),
        spectralHue: (angleInDegrees + 0) % 360
      },
      right: {
        distance: Math.abs(lightSource.x - right),
        angle: angleInDegrees + 90,
        intensity: baseIntensity * Math.max(0.2, 1 - Math.abs(Math.cos(incidenceAngle)) * 0.6),
        spectralHue: (angleInDegrees + 90) % 360
      },
      bottom: {
        distance: Math.abs(lightSource.y - bottom),
        angle: angleInDegrees + 180,
        intensity: baseIntensity * Math.max(0.2, 1 - Math.abs(Math.sin(incidenceAngle - Math.PI/2)) * 0.6),
        spectralHue: (angleInDegrees + 180) % 360
      },
      left: {
        distance: Math.abs(lightSource.x - left),
        angle: angleInDegrees + 270,
        intensity: baseIntensity * Math.max(0.2, 1 - Math.abs(Math.cos(incidenceAngle + Math.PI)) * 0.6),
        spectralHue: (angleInDegrees + 270) % 360
      }
    }
    
    // Glass material property calculations based on light interaction
    const glassMaterialProperties = {
      clarity: Math.min(1, baseIntensity * 1.5 + 0.6),
      refractiveIndex: 1.52, // Standard optical glass
      internalReflection: baseIntensity * 0.35,
      surfaceReflection: baseIntensity * 0.25,
      depthSimulation: baseIntensity * 0.4,
      chromaticAberration: baseIntensity * 1.2
    }
    
    return {
      baseIntensity,
      lightDistance,
      incidenceAngle: angleInDegrees,
      edgePhysics,
      glassMaterialProperties,
      lightSourceRelativeX: ((lightSource.x - left) / width) * 100,
      lightSourceRelativeY: ((lightSource.y - top) / height) * 100
    }
  }, [])
  
  // Real-time glass physics engine with optimized performance pipeline
  const updateComprehensiveGlassPhysics = useCallback(() => {
    const glassElements = document.querySelectorAll('.comprehensive-glass')
    
    glassElements.forEach((element) => {
      const rect = element.getBoundingClientRect()
      const physics = calculateComprehensiveGlassPhysics(rect, mousePosition)
      
      // Inject edge-specific illumination properties with proper coordinate mapping
      Object.entries(physics.edgePhysics).forEach(([edge, properties]) => {
        element.style.setProperty(`--${edge}-intensity`, properties.intensity.toFixed(3))
        element.style.setProperty(`--${edge}-angle`, `${properties.angle.toFixed(1)}deg`)
        element.style.setProperty(`--${edge}-hue`, properties.spectralHue.toFixed(0))
        element.style.setProperty(`--${edge}-distance`, properties.distance.toFixed(1))
      })
      
      // Glass material property injection for comprehensive surface simulation
      const { glassMaterialProperties } = physics
      element.style.setProperty('--glass-clarity', glassMaterialProperties.clarity.toFixed(3))
      element.style.setProperty('--glass-internal-reflection', glassMaterialProperties.internalReflection.toFixed(3))
      element.style.setProperty('--glass-surface-reflection', glassMaterialProperties.surfaceReflection.toFixed(3))
      element.style.setProperty('--glass-depth', glassMaterialProperties.depthSimulation.toFixed(3))
      element.style.setProperty('--glass-chromatic', glassMaterialProperties.chromaticAberration.toFixed(3))
      
      // Relative light positioning for internal glass effects
      element.style.setProperty('--light-x-relative', `${physics.lightSourceRelativeX.toFixed(1)}%`)
      element.style.setProperty('--light-y-relative', `${physics.lightSourceRelativeY.toFixed(1)}%`)
      element.style.setProperty('--base-illumination', physics.baseIntensity.toFixed(3))
    })
  }, [mousePosition, calculateComprehensiveGlassPhysics])
  
  // Optimized event handling with RAF-based batching for enterprise performance
  const handleMouseMove = useCallback((e) => {
    const x = e.clientX
    const y = e.clientY
    
    setMousePosition({ x, y })
    mouseX.set(x)
    mouseY.set(y)
    
    // Global cursor positioning for atmospheric effects
    document.documentElement.style.setProperty('--global-cursor-x', `${x}px`)
    document.documentElement.style.setProperty('--global-cursor-y', `${y}px`)
    
    // Batch physics calculations within RAF for optimal performance
    requestAnimationFrame(updateComprehensiveGlassPhysics)
  }, [mouseX, mouseY, updateComprehensiveGlassPhysics])
  
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])
  
  return (
    <>
      {/* Comprehensive Glass Physics CSS Architecture */}
      <style jsx global>{`
        :root {
          --global-cursor-x: 50%;
          --global-cursor-y: 50%;
          --light-x-relative: 50%;
          --light-y-relative: 50%;
          --base-illumination: 0;
          
          /* Edge illumination physics variables */
          --top-intensity: 0;
          --top-angle: 0deg;
          --top-hue: 0;
          --top-distance: 100;
          --right-intensity: 0;
          --right-angle: 90deg;
          --right-hue: 90;
          --right-distance: 100;
          --bottom-intensity: 0;
          --bottom-angle: 180deg;
          --bottom-hue: 180;
          --bottom-distance: 100;
          --left-intensity: 0;
          --left-angle: 270deg;
          --left-hue: 270;
          --left-distance: 100;
          
          /* Glass material properties */
          --glass-clarity: 0.6;
          --glass-internal-reflection: 0;
          --glass-surface-reflection: 0;
          --glass-depth: 0;
          --glass-chromatic: 0;
        }
        
        /* Comprehensive glass surface implementation */
        .comprehensive-glass {
          position: relative;
          
          /* Enhanced glass substrate with depth simulation */
          background: 
            linear-gradient(
              135deg,
              rgba(255, 255, 255, calc(0.06 + var(--glass-clarity) * 0.08)) 0%,
              rgba(255, 255, 255, calc(0.02 + var(--glass-clarity) * 0.04)) 50%,
              rgba(255, 255, 255, calc(0.08 + var(--glass-clarity) * 0.06)) 100%
            ),
            radial-gradient(
              ellipse at var(--light-x-relative) var(--light-y-relative),
              rgba(255, 255, 255, calc(var(--glass-internal-reflection) * 0.15)) 0%,
              rgba(255, 255, 255, calc(var(--glass-internal-reflection) * 0.08)) 40%,
              transparent 70%
            );
          
          /* Professional-grade backdrop filter stack */
          backdrop-filter: 
            blur(calc(22px + var(--glass-clarity) * 8px))
            saturate(calc(1.7 + var(--glass-clarity) * 0.5))
            brightness(calc(1.02 + var(--glass-surface-reflection) * 0.08))
            contrast(calc(1.05 + var(--glass-depth) * 0.1));
          
          /* Dynamic border system with enhanced material properties */
          border: 1px solid rgba(255, 255, 255, calc(0.12 + var(--glass-clarity) * 0.15));
          
          /* Sophisticated shadow system for glass depth simulation */
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, calc(0.15 + var(--glass-depth) * 0.1)),
            inset 0 1px 0 rgba(255, 255, 255, calc(0.12 + var(--glass-surface-reflection) * 0.25)),
            inset 0 -1px 0 rgba(255, 255, 255, calc(0.06 + var(--glass-surface-reflection) * 0.12)),
            0 0 calc(var(--glass-chromatic) * 2px) rgba(99, 102, 241, calc(var(--glass-chromatic) * 0.3)),
            0 0 calc(var(--glass-chromatic) * 3px) rgba(168, 85, 247, calc(var(--glass-chromatic) * 0.2));
        }
        
        /* Advanced four-edge prismatic illumination system */
        .comprehensive-glass::before {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: inherit;
          padding: 3px;
          
          /* Precision-engineered multi-edge background system */
          background:
            /* TOP EDGE - Horizontal spectral dispersion */
            linear-gradient(
              90deg,
              transparent 0%,
              hsla(calc(var(--top-hue) + 300), 90%, 70%, calc(var(--top-intensity) * 0.9)) 10%,
              hsla(calc(var(--top-hue) + 240), 95%, 75%, calc(var(--top-intensity) * 1.0)) 25%,
              hsla(calc(var(--top-hue) + 180), 100%, 80%, calc(var(--top-intensity) * 1.1)) 50%,
              hsla(calc(var(--top-hue) + 120), 95%, 75%, calc(var(--top-intensity) * 1.0)) 75%,
              hsla(calc(var(--top-hue) + 60), 90%, 70%, calc(var(--top-intensity) * 0.9)) 90%,
              transparent 100%
            ) 0 0 / 100% 3px no-repeat,
            
            /* RIGHT EDGE - Vertical spectral dispersion */
            linear-gradient(
              180deg,
              transparent 0%,
              hsla(calc(var(--right-hue) + 300), 90%, 70%, calc(var(--right-intensity) * 0.9)) 10%,
              hsla(calc(var(--right-hue) + 240), 95%, 75%, calc(var(--right-intensity) * 1.0)) 25%,
              hsla(calc(var(--right-hue) + 180), 100%, 80%, calc(var(--right-intensity) * 1.1)) 50%,
              hsla(calc(var(--right-hue) + 120), 95%, 75%, calc(var(--right-intensity) * 1.0)) 75%,
              hsla(calc(var(--right-hue) + 60), 90%, 70%, calc(var(--right-intensity) * 0.9)) 90%,
              transparent 100%
            ) right 0 / 3px 100% no-repeat,
            
            /* BOTTOM EDGE - Horizontal spectral dispersion */
            linear-gradient(
              90deg,
              transparent 0%,
              hsla(calc(var(--bottom-hue) + 300), 90%, 70%, calc(var(--bottom-intensity) * 0.9)) 10%,
              hsla(calc(var(--bottom-hue) + 240), 95%, 75%, calc(var(--bottom-intensity) * 1.0)) 25%,
              hsla(calc(var(--bottom-hue) + 180), 100%, 80%, calc(var(--bottom-intensity) * 1.1)) 50%,
              hsla(calc(var(--bottom-hue) + 120), 95%, 75%, calc(var(--bottom-intensity) * 1.0)) 75%,
              hsla(calc(var(--bottom-hue) + 60), 90%, 70%, calc(var(--bottom-intensity) * 0.9)) 90%,
              transparent 100%
            ) 0 bottom / 100% 3px no-repeat,
            
            /* LEFT EDGE - Vertical spectral dispersion */
            linear-gradient(
              180deg,
              transparent 0%,
              hsla(calc(var(--left-hue) + 300), 90%, 70%, calc(var(--left-intensity) * 0.9)) 10%,
              hsla(calc(var(--left-hue) + 240), 95%, 75%, calc(var(--left-intensity) * 1.0)) 25%,
              hsla(calc(var(--left-hue) + 180), 100%, 80%, calc(var(--left-intensity) * 1.1)) 50%,
              hsla(calc(var(--left-hue) + 120), 95%, 75%, calc(var(--left-intensity) * 1.0)) 75%,
              hsla(calc(var(--left-hue) + 60), 90%, 70%, calc(var(--left-intensity) * 0.9)) 90%,
              transparent 100%
            ) 0 0 / 3px 100% no-repeat;
          
          /* CSS mask for border-exclusive rendering */
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: xor;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          
          /* Enhanced spectral dispersion effects */
          filter: blur(calc(var(--base-illumination) * 1.5px));
          opacity: calc((var(--top-intensity) + var(--right-intensity) + var(--bottom-intensity) + var(--left-intensity)) * 0.8 + 0.2);
          z-index: 2;
          transition: opacity 0.12s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Internal glass reflection simulation */
        .comprehensive-glass::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: 
            radial-gradient(
              circle at var(--light-x-relative) var(--light-y-relative),
              rgba(255, 255, 255, calc(var(--glass-internal-reflection) * 0.25)) 0%,
              rgba(255, 255, 255, calc(var(--glass-internal-reflection) * 0.12)) 30%,
              rgba(255, 255, 255, calc(var(--glass-internal-reflection) * 0.06)) 60%,
              transparent 85%
            ),
            linear-gradient(
              calc(var(--top-angle) + 45deg),
              transparent 0%,
              rgba(255, 255, 255, calc(var(--glass-surface-reflection) * 0.08)) 50%,
              transparent 100%
            );
          pointer-events: none;
          z-index: 1;
          mix-blend-mode: soft-light;
        }
        
        /* Global atmospheric lighting system */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background: 
            radial-gradient(
              circle 300px at var(--global-cursor-x) var(--global-cursor-y),
              rgba(99, 102, 241, 0.08) 0%,
              rgba(168, 85, 247, 0.06) 25%,
              rgba(236, 72, 153, 0.04) 50%,
              transparent 70%
            ),
            radial-gradient(
              ellipse 600px 400px at var(--global-cursor-x) var(--global-cursor-y),
              rgba(59, 130, 246, 0.03) 0%,
              transparent 60%
            );
          pointer-events: none;
          z-index: 1;
          mix-blend-mode: screen;
        }
        
        /* Enhanced interactive states for glass surfaces */
        .comprehensive-glass:hover {
          transform: translateY(-4px) scale(1.005);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          
          box-shadow: 
            0 16px 64px rgba(0, 0, 0, calc(0.2 + var(--glass-depth) * 0.15)),
            inset 0 1px 0 rgba(255, 255, 255, calc(0.15 + var(--glass-surface-reflection) * 0.35)),
            inset 0 -1px 0 rgba(255, 255, 255, calc(0.08 + var(--glass-surface-reflection) * 0.18)),
            0 0 calc(var(--glass-chromatic) * 4px) rgba(99, 102, 241, calc(var(--glass-chromatic) * 0.4));
        }
        
        /* Performance optimizations */
        @media (max-width: 768px) {
          .comprehensive-glass::before {
            filter: none;
            background-size: 100% 2px, 2px 100%, 100% 2px, 2px 100%;
          }
          body::before {
            background: none;
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .comprehensive-glass,
          .comprehensive-glass::before,
          .comprehensive-glass::after {
            transition: none !important;
            transform: none !important;
            animation: none !important;
          }
        }
        
        /* Glass surface variants for different UI components */
        .glass-header {
          backdrop-filter: blur(25px) saturate(2.0) brightness(1.05);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.05));
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        }
        
        .glass-sidebar {
          backdrop-filter: blur(30px) saturate(1.8) brightness(1.02);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.10), rgba(255, 255, 255, 0.04));
          border-right: 1px solid rgba(255, 255, 255, 0.12);
        }
        
        .glass-button {
          backdrop-filter: blur(20px) saturate(1.6);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08));
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
      `}</style>
      
      <div 
        ref={containerRef}
        className={`min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 transition-all duration-500 ${
          appSettings?.theme === 'dark' ? 'dark' : ''
        }`}
      >
        {/* Glass Header */}
        <GlassHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Glass Sidebar */}
        <GlassSidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        
        {/* Main Content Area with Glass Surface */}
        <main className="lg:pl-72 pt-20 min-h-screen relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="p-6"
          >
            <div className="comprehensive-glass rounded-2xl p-6 min-h-[calc(100vh-8rem)]">
              <div className="relative z-10">
                {children}
              </div>
            </div>
          </motion.div>
        </main>
        
        {/* Enhanced Backend Status with Glass Treatment */}
        <div className="fixed bottom-4 right-4 z-50">
          <div className="comprehensive-glass glass-button rounded-xl">
            <BackendStatus />
          </div>
        </div>
      </div>
    </>
  )
}

export default Layout