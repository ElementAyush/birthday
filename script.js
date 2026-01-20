/* =====================================================
   ROMANTIC BIRTHDAY WEBSITE - JAVASCRIPT
   ===================================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all animations and features
    createFloatingHearts();
    createSparkles();
    initConfetti();
    initVideoPlayer();
    initCountdown();
    initScrollAnimations();
});

/* =====================================================
   FLOATING HEARTS ANIMATION
   ===================================================== */
function createFloatingHearts() {
    const container = document.getElementById('heartsContainer');
    const hearts = ['❤️', '💕', '💗', '💖', '💝', '💘', '💓', '💞', '🩷', '🤍'];
    
    function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
        heart.style.animationDuration = (Math.random() * 4 + 4) + 's';
        heart.style.animationDelay = Math.random() * 2 + 's';
        
        container.appendChild(heart);
        
        // Remove heart after animation
        setTimeout(() => {
            heart.remove();
        }, 8000);
    }
    
    // Create hearts periodically
    setInterval(createHeart, 500);
    
    // Initial hearts
    for (let i = 0; i < 10; i++) {
        setTimeout(createHeart, i * 200);
    }
}

/* =====================================================
   SPARKLE EFFECTS
   ===================================================== */
function createSparkles() {
    const container = document.getElementById('sparklesContainer');
    
    function createSparkle() {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDuration = (Math.random() * 2 + 1) + 's';
        
        container.appendChild(sparkle);
        
        // Remove sparkle after animation
        setTimeout(() => {
            sparkle.remove();
        }, 3000);
    }
    
    // Create sparkles periodically
    setInterval(createSparkle, 300);
}

/* =====================================================
   CONFETTI ANIMATION
   ===================================================== */
function initConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Confetti particles
    const confetti = [];
    const colors = ['#ff6b9d', '#ffd700', '#ff8fab', '#c9184a', '#ff69b4', '#ffc2d1'];
    
    class ConfettiPiece {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height;
            this.size = Math.random() * 8 + 4;
            this.speedY = Math.random() * 2 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 10 - 5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.shape = Math.floor(Math.random() * 3); // 0: circle, 1: rectangle, 2: star
        }
        
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;
            
            if (this.y > canvas.height) {
                this.reset();
            }
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = 0.8;
            
            if (this.shape === 0) {
                // Circle
                ctx.beginPath();
                ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                ctx.fill();
            } else if (this.shape === 1) {
                // Rectangle
                ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
            } else {
                // Heart shape
                const s = this.size / 4;
                ctx.beginPath();
                ctx.moveTo(0, s);
                ctx.bezierCurveTo(s, -s, 2*s, s, 0, 2*s);
                ctx.bezierCurveTo(-2*s, s, -s, -s, 0, s);
                ctx.fill();
            }
            
            ctx.restore();
        }
    }
    
    // Create confetti pieces
    for (let i = 0; i < 80; i++) {
        confetti.push(new ConfettiPiece());
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confetti.forEach(piece => {
            piece.update();
            piece.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

/* =====================================================
   VIDEO PLAYER - HOURLY ROTATION
   ===================================================== */

// Array of video sources - add your videos to the 'videos' folder
const videoSources = [];

// Scan for videos (this would need to be populated by your actual video files)
// For now, we'll create a placeholder system that checks for videos

async function initVideoPlayer() {
    const videoElement = document.getElementById('birthdayVideo');
    const placeholder = document.getElementById('videoPlaceholder');
    const timerElement = document.getElementById('timer');
    
    // Simulated video list - In production, you'd populate this array with your actual video files
    // The videos should be placed in the 'videos' folder
    const availableVideos = [
        'videos/video1.mp4',
        'videos/video2.mp4',
        'videos/video3.mp4',
        // Add more videos as needed
    ];
    
    let currentVideoIndex = 0;
    let lastPlayedHour = -1;
    
    function updateTimer() {
        const now = new Date();
        const nextHour = new Date(now);
        nextHour.setHours(nextHour.getHours() + 1);
        nextHour.setMinutes(0);
        nextHour.setSeconds(0);
        
        const diff = nextHour - now;
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        timerElement.textContent = 
            String(minutes).padStart(2, '0') + ':' + 
            String(seconds).padStart(2, '0');
    }
    
    function checkAndPlayVideo() {
        const currentHour = new Date().getHours();
        
        // Play a new video every hour
        if (currentHour !== lastPlayedHour && availableVideos.length > 0) {
            lastPlayedHour = currentHour;
            currentVideoIndex = currentHour % availableVideos.length;
            
            // Try to load the video
            videoElement.src = availableVideos[currentVideoIndex];
            
            // Show video, hide placeholder
            videoElement.style.display = 'block';
            placeholder.style.display = 'none';
            
            // Auto-play the video
            videoElement.play().catch(err => {
                console.log('Auto-play prevented, user interaction required');
            });
        }
    }
    
    // Check if there are any videos available
    // For demo purposes, we'll check if any video files exist
    try {
        const response = await fetch('videos/video1.mp4', { method: 'HEAD' });
        if (response.ok) {
            checkAndPlayVideo();
        }
    } catch (e) {
        // No videos available yet, keep showing placeholder
        console.log('Add videos to the videos folder for hourly playback');
    }
    
    // Update every second
    setInterval(updateTimer, 1000);
    
    // Check for new video every minute
    setInterval(checkAndPlayVideo, 60000);
    
    // Initial timer update
    updateTimer();
    
    // Allow clicking placeholder to trigger video check
    placeholder.addEventListener('click', checkAndPlayVideo);
}

/* =====================================================
   TIME COUNTDOWN DISPLAY
   ===================================================== */
function initCountdown() {
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    function updateCountdown() {
        const now = new Date();
        hoursEl.textContent = String(now.getHours()).padStart(2, '0');
        minutesEl.textContent = String(now.getMinutes()).padStart(2, '0');
        secondsEl.textContent = String(now.getSeconds()).padStart(2, '0');
    }
    
    // Update every second
    setInterval(updateCountdown, 1000);
    updateCountdown();
}

/* =====================================================
   SCROLL ANIMATIONS
   ===================================================== */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger special effects for certain sections
                if (entry.target.classList.contains('message-card')) {
                    triggerHeartBurst(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.animate-slide-in, .animate-scale-in, .animate-slide-up, .message-card').forEach(el => {
        observer.observe(el);
    });
}

/* =====================================================
   HEART BURST EFFECT
   ===================================================== */
function triggerHeartBurst(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const hearts = ['❤️', '💕', '💗', '💖', '💝'];
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.cssText = `
                position: fixed;
                left: ${centerX}px;
                top: ${centerY}px;
                font-size: ${Math.random() * 20 + 20}px;
                pointer-events: none;
                z-index: 9999;
                animation: burstHeart 1.5s ease-out forwards;
                --tx: ${(Math.random() - 0.5) * 200}px;
                --ty: ${(Math.random() - 0.5) * 200}px;
            `;
            
            document.body.appendChild(heart);
            
            setTimeout(() => heart.remove(), 1500);
        }, i * 50);
    }
}

// Add burst animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes burstHeart {
        0% {
            transform: translate(0, 0) scale(0);
            opacity: 1;
        }
        100% {
            transform: translate(var(--tx), var(--ty)) scale(1);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

/* =====================================================
   CURSOR TRAIL EFFECT
   ===================================================== */
document.addEventListener('mousemove', (e) => {
    // Create heart trail on mouse move
    if (Math.random() > 0.92) { // Only create occasionally
        const trail = document.createElement('div');
        trail.innerHTML = '💕';
        trail.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            font-size: 15px;
            pointer-events: none;
            z-index: 9999;
            animation: trailFade 1s ease-out forwards;
        `;
        document.body.appendChild(trail);
        
        setTimeout(() => trail.remove(), 1000);
    }
});

// Add trail animation
const trailStyle = document.createElement('style');
trailStyle.textContent = `
    @keyframes trailFade {
        0% {
            transform: scale(1) translateY(0);
            opacity: 1;
        }
        100% {
            transform: scale(0.5) translateY(-50px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(trailStyle);

/* =====================================================
   TYPING EFFECT FOR MESSAGE
   ===================================================== */
function typeMessage(element, text, speed = 50) {
    element.innerHTML = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

/* =====================================================
   MUSIC TOGGLE (if you want to add background music)
   ===================================================== */
let isMusicPlaying = false;

function toggleMusic() {
    const audio = document.getElementById('backgroundMusic');
    if (audio) {
        if (isMusicPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        isMusicPlaying = !isMusicPlaying;
    }
}

/* =====================================================
   SPECIAL SURPRISE - Click Counter
   ===================================================== */
let clickCount = 0;

document.querySelector('.birthday-badge')?.addEventListener('click', () => {
    clickCount++;
    
    if (clickCount >= 5) {
        // Trigger super confetti burst!
        triggerSuperConfetti();
        clickCount = 0;
    }
});

function triggerSuperConfetti() {
    const colors = ['#ff6b9d', '#ffd700', '#ff8fab', '#c9184a', '#ff69b4'];
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.innerHTML = ['🎉', '🎊', '✨', '💖', '🎈', '🎁'][Math.floor(Math.random() * 6)];
            confetti.style.cssText = `
                position: fixed;
                left: 50%;
                top: 30%;
                font-size: ${Math.random() * 30 + 20}px;
                pointer-events: none;
                z-index: 10000;
                animation: superBurst 2s ease-out forwards;
                --tx: ${(Math.random() - 0.5) * window.innerWidth}px;
                --ty: ${Math.random() * window.innerHeight}px;
            `;
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 2000);
        }, i * 20);
    }
}

// Add super burst animation
const superStyle = document.createElement('style');
superStyle.textContent = `
    @keyframes superBurst {
        0% {
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(superStyle);

console.log('🎂 Happy Birthday Website Loaded! Made with ❤️');
