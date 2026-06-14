import React from 'react'

export function Logo({ className = "", size = 32 }: { className?: string; size?: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Upward triangle (stability/foundation) */}
      <path d="M256 72L400 360H112L256 72Z" fill="currentColor"/>
      
      {/* Downward triangle (connection/flow) - interlocked with transparency */}
      <path d="M256 440L112 152H400L256 440Z" fill="currentColor" fillOpacity="0.35"/>
      
      {/* Central diamond (shared workspace/collaboration) */}
      <path d="M256 184L316 316H196L256 184Z" fill="currentColor" fillOpacity="0.9"/>
    </svg>
  )
}
