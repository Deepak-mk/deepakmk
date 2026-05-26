/* ==========================================
   THEME TOGGLER & STORAGE
   ========================================== */
const themeToggleBtn = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;

// Initialize theme from localStorage or system preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    htmlEl.setAttribute('data-theme', savedTheme);
} else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    htmlEl.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
}

themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlEl.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Notify canvas if it needs color adjustments
    if (window.updateCanvasColors) {
        window.updateCanvasColors(newTheme);
    }
});

/* ==========================================
   MOBILE NAVIGATION TOGGLE
   ========================================== */
const menuToggleBtn = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

menuToggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    menuToggleBtn.classList.toggle('active');
    
    // Toggle between menu and close icons using Lucide attributes
    const isOpen = navMenu.classList.contains('open');
    const openIcon = menuToggleBtn.querySelector('.icon-open');
    const closeIcon = menuToggleBtn.querySelector('.icon-close');
    
    if (isOpen) {
        openIcon.style.display = 'none';
        closeIcon.style.display = 'block';
    } else {
        openIcon.style.display = 'block';
        closeIcon.style.display = 'none';
    }
});

// Close mobile menu when a nav link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const openIcon = menuToggleBtn.querySelector('.icon-open');
        const closeIcon = menuToggleBtn.querySelector('.icon-close');
        if (openIcon && closeIcon) {
            openIcon.style.display = 'block';
            closeIcon.style.display = 'none';
        }
    });
});


/* ==========================================
   TYPEWRITER EFFECT (HERO)
   ========================================== */
const typewriterEl = document.getElementById('typewriter');
const phrases = [
    "VP-Level Data Science Strategy",
    "Production LLM Deployment",
    "Enterprise RAG Architectures",
    "Scalable Cloud MLOps (AWS)",
    "Sub-100ms Inference Systems"
];
let phraseIdx = 0;
let charIdx = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeWriter() {
    const currentPhrase = phrases[phraseIdx];
    
    if (isDeleting) {
        typewriterEl.textContent = currentPhrase.substring(0, charIdx - 1);
        charIdx--;
        typeSpeed = 40; // delete faster
    } else {
        typewriterEl.textContent = currentPhrase.substring(0, charIdx + 1);
        charIdx++;
        typeSpeed = 90; // typing speed
    }
    
    // State transitions
    if (!isDeleting && charIdx === currentPhrase.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at end of phrase
    } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        typeSpeed = 500; // Pause before starting new phrase
    }
    
    setTimeout(typeWriter, typeSpeed);
}

// Start typewriter if element exists
if (typewriterEl) {
    setTimeout(typeWriter, 1000);
}


/* ==========================================
   PROJECT FILTERING LOGIC
   ========================================== */
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Toggle active button class
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (filterValue === 'all' || category === filterValue) {
                card.style.display = 'flex';
                card.classList.remove('filtered-out');
            } else {
                card.style.display = 'none';
                card.classList.add('filtered-out');
            }
        });
    });
});


/* ==========================================
   INTERACTIVE SKILLS MAPPING (GRID MATRIX)
   ========================================== */
const skillTags = document.querySelectorAll('.skill-tag');
const timelineItems = document.querySelectorAll('.timeline-item');
const activeNotice = document.getElementById('skills-active-notice');
const clearFilterBtn = document.getElementById('clear-skills-filter');
let activeSkill = null;

function applySkillHighlight(skillKey) {
    if (!skillKey) {
        // Reset all highlights
        timelineItems.forEach(item => {
            item.classList.remove('dimmed', 'highlighted-card');
            const cardInner = item.querySelector('.timeline-content');
            if (cardInner) cardInner.classList.remove('highlighted-card');
        });
        projectCards.forEach(card => {
            card.classList.remove('dimmed', 'highlighted-card');
        });
        skillTags.forEach(tag => tag.classList.remove('active'));
        activeNotice.classList.add('hidden');
        activeSkill = null;
        return;
    }

    activeSkill = skillKey;
    activeNotice.classList.remove('hidden');

    // Set matching skill active
    skillTags.forEach(tag => {
        if (tag.getAttribute('data-skill') === skillKey) {
            tag.classList.add('active');
        } else {
            tag.classList.remove('active');
        }
    });

    // Match timeline experience
    timelineItems.forEach(item => {
        const itemSkills = item.getAttribute('data-skills') || '';
        const cardInner = item.querySelector('.timeline-content');
        
        if (itemSkills.split(',').map(s => s.trim()).includes(skillKey)) {
            item.classList.remove('dimmed');
            if (cardInner) cardInner.classList.add('highlighted-card');
        } else {
            item.classList.add('dimmed');
            if (cardInner) cardInner.classList.remove('highlighted-card');
        }
    });

    // Match project cards
    projectCards.forEach(card => {
        const cardSkills = card.getAttribute('data-skills') || '';
        
        if (cardSkills.split(',').map(s => s.trim()).includes(skillKey)) {
            card.classList.remove('dimmed');
            card.classList.add('highlighted-card');
        } else {
            card.classList.add('dimmed');
            card.classList.remove('highlighted-card');
        }
    });
}

// Click event handler for skill tags
skillTags.forEach(tag => {
    tag.addEventListener('click', () => {
        const skillKey = tag.getAttribute('data-skill');
        if (activeSkill === skillKey) {
            // Clicking again resets filter
            applySkillHighlight(null);
        } else {
            applySkillHighlight(skillKey);
            // Auto scroll slightly to reveal highlights if filter is set from top
            const section = document.getElementById('skills');
            if (section) {
                window.scrollTo({
                    top: section.offsetTop + section.offsetHeight - 50,
                    behavior: 'smooth'
                });
            }
        }
    });
});

clearFilterBtn.addEventListener('click', () => {
    applySkillHighlight(null);
});


/* ==========================================
   CONTACT FORM VALIDATION & MODAL
   ========================================== */
const contactForm = document.getElementById('contact-form');
const successModal = document.getElementById('success-modal');
const closeModalBtn = document.getElementById('close-modal-btn');

function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
}

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        const nameInput = document.getElementById('form-name');
        const emailInput = document.getElementById('form-email');
        const subjectInput = document.getElementById('form-subject');
        const messageInput = document.getElementById('form-message');
        
        // Name Validation
        if (!nameInput.value.trim()) {
            nameInput.parentElement.classList.add('invalid');
            isValid = false;
        } else {
            nameInput.parentElement.classList.remove('invalid');
        }
        
        // Email Validation
        if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
            emailInput.parentElement.classList.add('invalid');
            isValid = false;
        } else {
            emailInput.parentElement.classList.remove('invalid');
        }
        
        // Subject Validation
        if (!subjectInput.value.trim()) {
            subjectInput.parentElement.classList.add('invalid');
            isValid = false;
        } else {
            subjectInput.parentElement.classList.remove('invalid');
        }
        
        // Message Validation
        if (!messageInput.value.trim()) {
            messageInput.parentElement.classList.add('invalid');
            isValid = false;
        } else {
            messageInput.parentElement.classList.remove('invalid');
        }
        
        if (isValid) {
            // Trigger Modal on Successful mock submission
            successModal.classList.add('visible');
            contactForm.reset();
        }
    });

    // Realtime invalid state removal on typing
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.value.trim()) {
                input.parentElement.classList.remove('invalid');
            }
        });
    });
}

// Close Modal logic
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        successModal.classList.remove('visible');
    });
}


/* ==========================================
   DYNAMIC CANVAS PARTICLES (AI THEME)
   ========================================== */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let maxParticles = 60;
let connectionDistance = 120;
let particleColor = 'rgba(139, 92, 246, 0.45)'; // default purple-ish
let lineColor = 'rgba(6, 182, 212, 0.08)'; // default cyan-ish line
let mouse = { x: null, y: null, radius: 150 };

// Adjust particle counts based on screen width
function setCanvasDimensions() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (window.innerWidth < 768) {
        maxParticles = 25;
        connectionDistance = 80;
    } else {
        maxParticles = 65;
        connectionDistance = 120;
    }
}
setCanvasDimensions();
window.addEventListener('resize', setCanvasDimensions);

// Set theme-based colors
window.updateCanvasColors = function(theme) {
    if (theme === 'light') {
        particleColor = 'rgba(109, 40, 217, 0.18)'; // transparent primary purple
        lineColor = 'rgba(8, 145, 178, 0.04)'; // transparent cyan lines
    } else {
        particleColor = 'rgba(139, 92, 246, 0.4)'; 
        lineColor = 'rgba(6, 182, 212, 0.06)';
    }
};
// Initial call based on attribute
window.updateCanvasColors(htmlEl.getAttribute('data-theme'));

// Mouse tracking
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

class Particle {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 2 + 1;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Bounce bounds
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
        
        // Mouse push effect
        if (mouse.x !== null && mouse.y !== null) {
            let dx = this.x - mouse.x;
            let dy = this.y - mouse.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius) {
                let force = (mouse.radius - dist) / mouse.radius;
                let angle = Math.atan2(dy, dx);
                this.x += Math.cos(angle) * force * 1.5;
                this.y += Math.sin(angle) * force * 1.5;
            }
        }
    }
    
    draw() {
        ctx.fillStyle = particleColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Generate particles
function initParticles() {
    particles = [];
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }
}
initParticles();
window.addEventListener('resize', initParticles);

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < connectionDistance) {
                // Fade opacity relative to distance
                let alpha = (1 - (dist / connectionDistance)) * 0.6;
                ctx.strokeStyle = lineColor.replace('0.06', alpha * 0.08).replace('0.04', alpha * 0.05);
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    
    // Draw & update particles
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    
    requestAnimationFrame(animate);
}
animate();
