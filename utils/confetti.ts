// Confetti animation utility for celebrating achievements
export function triggerConfetti(options: {
  duration?: number;
  particleCount?: number;
  colors?: string[];
} = {}) {
  const {
    duration = 3000,
    particleCount = 50,
    colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']
  } = options;

  const confettiContainer = document.createElement('div');
  confettiContainer.style.position = 'fixed';
  confettiContainer.style.top = '0';
  confettiContainer.style.left = '0';
  confettiContainer.style.width = '100vw';
  confettiContainer.style.height = '100vh';
  confettiContainer.style.pointerEvents = 'none';
  confettiContainer.style.zIndex = '9999';
  confettiContainer.style.overflow = 'hidden';
  document.body.appendChild(confettiContainer);

  // Create confetti particles
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    const size = Math.random() * 10 + 5;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const startX = Math.random() * 100;
    const endX = startX + (Math.random() - 0.5) * 40;
    const rotation = Math.random() * 360;
    const delay = Math.random() * 300;

    particle.style.position = 'absolute';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = color;
    particle.style.left = `${startX}%`;
    particle.style.top = '-20px';
    particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    particle.style.opacity = '0.8';
    particle.style.transform = `rotate(${rotation}deg)`;

    confettiContainer.appendChild(particle);

    // Animate
    setTimeout(() => {
      particle.animate([
        {
          transform: `translate(0, 0) rotate(${rotation}deg)`,
          opacity: 0.8
        },
        {
          transform: `translate(${(endX - startX) * 10}px, ${window.innerHeight + 50}px) rotate(${rotation + 720}deg)`,
          opacity: 0
        }
      ], {
        duration: duration,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }).onfinish = () => {
        particle.remove();
      };
    }, delay);
  }

  // Clean up container
  setTimeout(() => {
    confettiContainer.remove();
  }, duration + 500);
}

// Golf-specific celebration with green theme
export function triggerGolfCelebration() {
  triggerConfetti({
    duration: 2500,
    particleCount: 60,
    colors: ['#10b981', '#059669', '#34d399', '#6ee7b7', '#a7f3d0']
  });
}

// PR celebration with mixed colors
export function triggerPRCelebration() {
  triggerConfetti({
    duration: 3000,
    particleCount: 80,
    colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6']
  });
}
