import React from 'react';
import { createRoot } from 'react-dom/client';
import { GradientForm } from './components/GradientForm';
import './styles/styles.css';

// Add console logs for debugging
console.log('UI script is running');

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM Content Loaded');
  
  const container = document.getElementById('root');
  console.log('Container found:', container);

  if (container) {
    const root = createRoot(container);
    console.log('Root created');
    
    root.render(
      <React.StrictMode>
        <GradientForm />
      </React.StrictMode>
    );
    console.log('Render called');
  } else {
    console.error('Root container not found');
  }
});