/**
 * Vercel Speed Insights Initialization
 * This script initializes Speed Insights for performance monitoring
 */

// Speed Insights queue initialization
window.si = window.si || function () { 
  (window.siq = window.siq || []).push(arguments); 
};

// The actual Speed Insights script will be loaded by Vercel after deployment
// when Speed Insights is enabled in the Vercel dashboard
