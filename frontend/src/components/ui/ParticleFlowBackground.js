import React, { useEffect, useRef } from 'react';

const ParticleFlowBackground = () => {
  const canvasRef = useRef(null);
  const pointerRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let width = 0;
    let height = 0;
    let time = 0;

    const makeParticle = (index, count) => {
      const columns = Math.ceil(Math.sqrt(count * 1.55));
      const rows = Math.ceil(count / columns);
      const column = index % columns;
      const row = Math.floor(index / columns);
      const cellWidth = width / columns;
      const cellHeight = height / rows;
      const jitterX = Math.sin(index * 12.9898) * 0.35;
      const jitterY = Math.cos(index * 78.233) * 0.35;

      return {
        x: (column + 0.5 + jitterX) * cellWidth,
        y: (row + 0.5 + jitterY) * cellHeight,
        baseX: (column + 0.5 + jitterX) * cellWidth,
        baseY: (row + 0.5 + jitterY) * cellHeight,
        radius: 1.2 + (index % 5) * 0.22,
        phase: index * 0.37,
        vx: 0,
        vy: 0
      };
    };

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const count = Math.min(180, Math.max(72, Math.floor((width * height) / 10500)));
      particles = Array.from({ length: count }, (_, index) => makeParticle(index, count));
    };

    const drawBackground = () => {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, 'rgba(8, 13, 24, 0.78)');
      gradient.addColorStop(0.45, 'rgba(13, 18, 30, 0.56)');
      gradient.addColorStop(1, 'rgba(9, 15, 24, 0.76)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    };

    const animate = () => {
      time += 0.0065;
      drawBackground();

      const pointer = pointerRef.current;

      particles.forEach((particle) => {
        const driftX = Math.sin(time + particle.phase) * 10;
        const driftY = Math.cos(time * 0.82 + particle.phase) * 8;
        const targetX = particle.baseX + driftX;
        const targetY = particle.baseY + driftY;

        particle.vx += (targetX - particle.x) * 0.015;
        particle.vy += (targetY - particle.y) * 0.015;

        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const radius = 150;

        if (distance < radius) {
          const force = (radius - distance) / radius;
          const angle = Math.atan2(dy, dx);
          particle.vx += Math.cos(angle) * force * 0.85;
          particle.vy += Math.sin(angle) * force * 0.85;
        }

        particle.vx *= 0.9;
        particle.vy *= 0.9;
        particle.x += particle.vx;
        particle.y += particle.vy;
      });

      ctx.lineWidth = 0.7;
      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 92) {
            const opacity = (1 - distance / 92) * 0.08;
            ctx.strokeStyle = `rgba(148, 163, 184, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      particles.forEach((particle) => {
        const pulse = Math.sin(time * 1.9 + particle.phase) * 0.25;
        const radius = particle.radius + pulse;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, Math.max(0.9, radius), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(226, 232, 240, 0.28)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, Math.max(0.45, radius * 0.45), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(94, 234, 212, 0.32)';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handlePointerMove = (event) => {
      pointerRef.current.x = event.clientX;
      pointerRef.current.y = event.clientY;
    };

    const handlePointerLeave = () => {
      pointerRef.current.x = -1000;
      pointerRef.current.y = -1000;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerleave', handlePointerLeave);

    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default ParticleFlowBackground;
