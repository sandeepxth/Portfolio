import React, { useEffect, useRef, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const CodingBackground = () => {
  const canvasRef = useRef(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Code snippets and tokens list
    const codeTokens = [
      'const', 'let', 'var', 'function', 'class', 'import', 'export', 'return',
      'if', 'else', 'for', 'while', 'switch', 'case', 'break', 'continue',
      'async', 'await', 'try', 'catch', 'throw', 'new', 'this', 'super',
      'true', 'false', 'null', 'undefined', 'console.log', 'map', 'filter',
      'reduce', 'forEach', 'find', 'push', 'pop', 'shift', 'unshift', 'length',
      'React', 'useState', 'useEffect', 'useContext', 'useRef', 'useMemo',
      'div', 'section', 'main', 'header', 'footer', 'nav', 'button', 'input',
      '=>', '===', '!==', '&&', '||', '++', '--', '+=', '-=', '...',
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      '<html>', '</html>', '<body>', '</body>', '<script>', '</script>',
      'interface', 'type', 'public', 'private', 'protected', 'extends', 'implements',
      'db.connect()', 'app.use()', 'req', 'res', 'next', 'process.env', 'PORT',
      'mongoose.Schema', 'jwt.sign', 'bcrypt.compare'
    ];

    // Color palettes for dark and light theme
    // Dark theme: vibrant neons
    const darkPalette = [
      '#6366f1', // Indigo
      '#a855f7', // Purple
      '#ec4899', // Pink
      '#06b6d4', // Cyan
      '#10b981', // Emerald
      '#f59e0b', // Amber
      '#ef4444'  // Rose
    ];

    // Light theme: slightly softer colors to maintain contrast
    const lightPalette = [
      '#4f46e5', // Deep Indigo
      '#7c3aed', // Deep Purple
      '#db2777', // Deep Pink
      '#0891b2', // Deep Cyan
      '#059669', // Deep Emerald
      '#d97706'  // Deep Amber
    ];

    // Columns config
    const fontSize = 14;
    let columnsCount = Math.floor(width / 35);
    let columns = [];

    // Initialize columns
    const initColumns = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columnsCount = Math.floor(width / 35);
      columns = [];
      for (let i = 0; i < columnsCount; i++) {
        columns.push({
          x: i * 35,
          y: Math.random() * -height - 100, // staggered start
          speed: 1.0 + Math.random() * 1.5,
          token: codeTokens[Math.floor(Math.random() * codeTokens.length)],
          color: theme === 'dark' 
            ? darkPalette[Math.floor(Math.random() * darkPalette.length)]
            : lightPalette[Math.floor(Math.random() * lightPalette.length)],
          opacity: 0.15 + Math.random() * 0.45,
          scale: 0.8 + Math.random() * 0.4
        });
      }
    };

    initColumns();

    // Mouse tracking for ripple/glow
    let mouse = { x: null, y: null };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    // Resize handler
    const handleResize = () => {
      initColumns();
    };
    window.addEventListener('resize', handleResize);

    // Draw loop
    const draw = () => {
      // Clear with semi-transparent background to create trail effect
      ctx.fillStyle = theme === 'dark' 
        ? 'rgba(2, 3, 8, 0.15)' 
        : 'rgba(248, 250, 252, 0.15)';
      ctx.fillRect(0, 0, width, height);

      // Loop through columns
      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        
        // Font setup
        ctx.font = `${Math.floor(fontSize * col.scale)}px 'Courier New', Courier, monospace`;
        ctx.fontWeight = 'bold';
        
        // Dynamic properties based on mouse proximity
        let finalOpacity = col.opacity;
        let finalSpeed = col.speed;
        
        if (mouse.x !== null && mouse.y !== null) {
          const dx = col.x - mouse.x;
          const dy = col.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            // Glow and speed up near cursor
            finalOpacity = Math.min(1.0, col.opacity * 2.2);
            finalSpeed = col.speed * 2.2;
          }
        }

        // Apply theme adjustments for overall opacity (increased for light mode readability)
        const themeOpacityFactor = theme === 'dark' ? 0.35 : 0.32;
        ctx.fillStyle = col.color;
        ctx.globalAlpha = finalOpacity * themeOpacityFactor;

        // Draw token
        ctx.fillText(col.token, col.x, col.y);

        // Update y coordinate
        col.y += finalSpeed;

        // Reset if it goes off screen
        if (col.y > height + 50) {
          col.y = -50;
          col.token = codeTokens[Math.floor(Math.random() * codeTokens.length)];
          col.color = theme === 'dark'
            ? darkPalette[Math.floor(Math.random() * darkPalette.length)]
            : lightPalette[Math.floor(Math.random() * lightPalette.length)];
          col.speed = 1.0 + Math.random() * 1.5;
          col.opacity = 0.15 + Math.random() * 0.45;
          col.scale = 0.8 + Math.random() * 0.4;
        }
      }

      ctx.globalAlpha = 1.0;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        display: 'block'
      }}
    />
  );
};

export default CodingBackground;
