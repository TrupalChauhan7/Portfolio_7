class GridSystem {
    constructor() {
        this.container = document.getElementById('gridContainer');
        this.verticalLines = [];
        this.horizontalLines = [];
        this.intersections = [];
        this.animationEnabled = true;
        this.gridSize = 'medium';
        this.showIntersections = true;
        this.gridSizes = {
            small: 40,
            medium: 80,
            large: 120
        };
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.init();
        this.bindEvents();
    }

    init() {
        this.createGrid();
    }

    createGrid() {
        // Clear existing grid
        this.container.innerHTML = '';
        this.verticalLines = [];
        this.horizontalLines = [];
        this.intersections = [];

        const spacing = this.gridSizes[this.gridSize];
        const cols = Math.ceil(window.innerWidth / spacing);
        const rows = Math.ceil(window.innerHeight / spacing);

        // Create vertical lines
        for (let col = 0; col <= cols; col++) {
            const line = document.createElement('div');
            line.className = 'vertical-line';
            line.style.left = `${col * spacing}px`;
            
            // Add random delay for animation
            const delay = Math.random() * 2;
            line.style.animationDelay = `${delay}s`;
            
            this.container.appendChild(line);
            this.verticalLines.push({
                element: line,
                x: col * spacing,
                index: col
            });
        }

        // Create horizontal lines
        for (let row = 0; row <= rows; row++) {
            const line = document.createElement('div');
            line.className = 'horizontal-line';
            line.style.top = `${row * spacing}px`;
            
            // Add random delay for animation
            const delay = Math.random() * 3;
            line.style.animationDelay = `${delay}s`;
            
            this.container.appendChild(line);
            this.horizontalLines.push({
                element: line,
                y: row * spacing,
                index: row
            });
        }

        // Create intersection dots
        if (this.showIntersections) {
            for (let row = 0; row <= rows; row++) {
                for (let col = 0; col <= cols; col++) {
                    const dot = document.createElement('div');
                    dot.className = 'grid-intersection';
                    dot.style.left = `${col * spacing}px`;
                    dot.style.top = `${row * spacing}px`;
                    
                    // Add random delay for animation
                    const delay = Math.random() * 4;
                    dot.style.animationDelay = `${delay}s`;
                    
                    this.container.appendChild(dot);
                    this.intersections.push({
                        element: dot,
                        x: col * spacing,
                        y: row * spacing,
                        col: col,
                        row: row
                    });
                }
            }
        }
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.updateGridNearMouse();
        });

        document.addEventListener('click', (e) => {
            this.createFlowEffect(e.clientX, e.clientY);
        });

        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Scroll-based effects
        window.addEventListener('scroll', () => {
            this.updateScrollEffects();
        });
    }

    updateGridNearMouse() {
        if (!this.animationEnabled) return;

        const proximity = 100;

        // Update vertical lines
        this.verticalLines.forEach(line => {
            const distance = Math.abs(line.x - this.mouseX);
            if (distance < proximity) {
                line.element.classList.add('bright-line');
            } else {
                line.element.classList.remove('bright-line');
            }
        });

        // Update horizontal lines
        this.horizontalLines.forEach(line => {
            const distance = Math.abs(line.y - this.mouseY);
            if (distance < proximity) {
                line.element.classList.add('bright-line');
            } else {
                line.element.classList.remove('bright-line');
            }
        });

        // Update intersections
        this.intersections.forEach(intersection => {
            const distance = Math.sqrt(
                Math.pow(intersection.x - this.mouseX, 2) + 
                Math.pow(intersection.y - this.mouseY, 2)
            );
            if (distance < proximity) {
                intersection.element.classList.add('bright-intersection');
            } else {
                intersection.element.classList.remove('bright-intersection');
            }
        });
    }

    createFlowEffect(x, y) {
        // Find nearest vertical and horizontal lines
        let nearestVertical = null;
        let nearestHorizontal = null;
        let minVerticalDistance = Infinity;
        let minHorizontalDistance = Infinity;

        this.verticalLines.forEach(line => {
            const distance = Math.abs(line.x - x);
            if (distance < minVerticalDistance) {
                minVerticalDistance = distance;
                nearestVertical = line;
            }
        });

        this.horizontalLines.forEach(line => {
            const distance = Math.abs(line.y - y);
            if (distance < minHorizontalDistance) {
                minHorizontalDistance = distance;
                nearestHorizontal = line;
            }
        });

        // Apply flowing effect
        if (nearestVertical) {
            nearestVertical.element.classList.add('flowing-line');
            setTimeout(() => {
                nearestVertical.element.classList.remove('flowing-line');
            }, 3000);
        }

        if (nearestHorizontal) {
            nearestHorizontal.element.classList.add('flowing-line');
            setTimeout(() => {
                nearestHorizontal.element.classList.remove('flowing-line');
            }, 3000);
        }
    }

    updateScrollEffects() {
        const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    }

    changeGridSize() {
        const sizes = Object.keys(this.gridSizes);
        const currentIndex = sizes.indexOf(this.gridSize);
        const nextIndex = (currentIndex + 1) % sizes.length;
        this.gridSize = sizes[nextIndex];
        
        this.createGrid();

        // Update button text
        const button = document.querySelector('.control-btn:nth-child(2)');
        button.textContent = `Grid: ${this.gridSize.charAt(0).toUpperCase() + this.gridSize.slice(1)}`;
    }

    toggleIntersections() {
        this.showIntersections = !this.showIntersections;
        this.createGrid();

        const button = document.querySelector('.control-btn:nth-child(3)');
        button.textContent = `Dots: ${this.showIntersections ? 'ON' : 'OFF'}`;
        button.classList.toggle('active', this.showIntersections);
    }

    toggleAnimation() {
        this.animationEnabled = !this.animationEnabled;
        const button = document.querySelector('.control-btn:nth-child(1)');
        
        if (this.animationEnabled) {
            this.container.style.animation = '';
            this.verticalLines.forEach(line => {
                line.element.style.animation = 'pulse 4s ease-in-out infinite';
            });
            this.horizontalLines.forEach(line => {
                line.element.style.animation = 'pulse 6s ease-in-out infinite';
            });
            this.intersections.forEach(intersection => {
                intersection.element.style.animation = 'glow 3s ease-in-out infinite';
            });
            button.textContent = 'Animation: ON';
            button.classList.add('active');
        } else {
            this.verticalLines.forEach(line => {
                line.element.style.animation = 'none';
                line.element.classList.remove('active');
            });
            this.horizontalLines.forEach(line => {
                line.element.style.animation = 'none';
                line.element.classList.remove('active');
            });
            this.intersections.forEach(intersection => {
                intersection.element.style.animation = 'none';
                intersection.element.classList.remove('active');
            });
            button.textContent = 'Animation: OFF';
            button.classList.remove('active');
        }
    }

    handleResize() {
        // Recreate grid on resize
        setTimeout(() => {
            this.createGrid();
        }, 100);
    }
}

// Global functions for controls
let gridSystem;

function toggleAnimation() {
    gridSystem.toggleAnimation();
}

function changeGridSize() {
    gridSystem.changeGridSize();
}

function toggleIntersections() {
    gridSystem.toggleIntersections();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    gridSystem = new GridSystem();
});

// Page loader
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelector('.page-loader').classList.add('hidden');
    }, 1000);
});

// Custom Cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = (e.clientX - 8) + 'px';
    cursor.style.top = (e.clientY - 8) + 'px';
    setTimeout(() => {
        cursorFollower.style.left = (e.clientX - 16) + 'px';
        cursorFollower.style.top = (e.clientY - 16) + 'px';
    }, 80);
});

// Header scroll effect
let lastScrollY = 0;
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScrollY = currentScrollY;
});

// Scroll progress
window.addEventListener('scroll', () => {
    const scrollProgress = document.querySelector('.scroll-progress');
    const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    scrollProgress.style.width = Math.min(scrollPercent, 100) + '%';
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.studio-image, .studio-content, .process-item, .cta-title, .cta-subtitle, .contact-button').forEach(el => {
    observer.observe(el);
});

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Subtle parallax effects
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.3;
    
    // Hero parallax
    const heroSection = document.querySelector('.hero-section');
    if (heroSection && scrolled < window.innerHeight) {
        heroSection.style.transform = `translateY(${rate}px)`;
    }
});

// Service items enhanced hover effects
document.querySelectorAll('.service-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
        this.style.background = 'rgba(255, 255, 255, 0.025)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.background = 'transparent';
        setTimeout(() => {
            this.style.background = '';
        }, 400);
    });
});

let cursorIsHovering = false;

function getCursorFollowerBorderColor(isHover) {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) {
        return isHover ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.2)';
    } else {
        return isHover ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)';
    }
}

function updateCursorFollowerBorderColor() {
    cursorFollower.style.borderColor = getCursorFollowerBorderColor(cursorIsHovering);
}

document.querySelectorAll('a, button, .service-item, .logo').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.8)';
        cursorFollower.style.transform = 'scale(1.8)';
        cursorIsHovering = true;
        updateCursorFollowerBorderColor();
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursorFollower.style.transform = 'scale(1)';
        cursorIsHovering = false;
        updateCursorFollowerBorderColor();
    });
});

// Stagger animation for process items
const processItems = document.querySelectorAll('.process-item');
const processObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 150);
        }
    });
}, { threshold: 0.2 });

processItems.forEach(item => {
    processObserver.observe(item);
});

// Performance optimization: throttle scroll events
let ticking = false;
function updateScrollEffects() {
    // All scroll-based effects here
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
    }
}

// Enhanced mobile touch interactions
let touchStartY = 0;
document.addEventListener('touchstart', e => {
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchmove', e => {
    if (Math.abs(e.touches[0].clientY - touchStartY) > 5) {
        requestTick();
    }
});

// --- Sintesis Work Slider ---


        (function(){
  const slider = document.querySelector('.work-slider-track');
  const cards = Array.from(slider.querySelectorAll('.work-slider-card'));
  let mobile = window.matchMedia('(max-width:900px)').matches;
  if(mobile){
    // Mobile logic: overlay on tap, vertical cards
    cards.forEach(card => {
      const overlay = card.querySelector('.work-slider-overlay');
      card.addEventListener('touchend',e=>{
        // Hide overlays on others
        cards.forEach(c=>{if(c!==card){const o=c.querySelector('.work-slider-overlay');if(o){o.style.opacity=0;o.style.transform='translateY(22px)';}}});
        overlay.style.opacity=1;
        overlay.style.transform='translateY(0)';
        setTimeout(()=>{
          window.addEventListener('touchstart',function hideOverlay(ev){
            if(!card.contains(ev.target)){
              overlay.style.opacity=0;
              overlay.style.transform='translateY(22px)';
              window.removeEventListener('touchstart',hideOverlay,true);
            }
          },true);
        },20);
        e.stopPropagation();
      });
    });
  }else{
    // Desktop hover effect; smooth horizontal scrolling
    slider.addEventListener('wheel', function(e){
      if(Math.abs(e.deltaX) < Math.abs(e.deltaY)){
        // Vertical wheel → horizontal scroll
        slider.scrollLeft += e.deltaY * 4;
        e.preventDefault();
      }
    },{passive:false});
    // Overlay slides up on hover (already in CSS)
  }

  // Always: avoid image drag ghosting
  cards.forEach(el=>el.addEventListener('dragstart',e=>e.preventDefault()));
})();

// Simple parallax effect
window.addEventListener('scroll', function() {
    const parallaxBg = document.querySelector('.parallax-bg');
    if (parallaxBg) {
        const scrolled = window.pageYOffset;
        parallaxBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Initialize parallax position
window.addEventListener('load', function() {
    const parallaxBg = document.querySelector('.parallax-bg');
    if (parallaxBg) {
        const scrolled = window.pageYOffset;
        parallaxBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Progress bar functionality
window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Calculate scroll progress
    const scrollProgress = scrollPosition / (documentHeight - windowHeight);
    
    // Update progress bar
    document.querySelector('.progress-bar').style.width = `${scrollProgress * 100}%`;
    
    // Update scroll percentage
    document.querySelector('.scroll-percentage').textContent = `${Math.round(scrollProgress * 100)}%`;
});

// Parallax effect
(function() {
    const aboutSection = document.querySelector('.about-section');
    const parallaxBg = document.querySelector('.parallax-bg');
    
    if(!aboutSection || !parallaxBg) return;

    function updateParallax() {
        const rect = aboutSection.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Only apply effect when section is in viewport
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            // Calculate how far we've scrolled relative to the section
            const scrolled = scrollTop - aboutSection.offsetTop;
            // Move background at 30% of scroll speed
            const rate = scrolled * 0.3;
            parallaxBg.style.transform = `translateY(${rate}px)`;
        }
    }

    // Update on scroll
    window.addEventListener('scroll', updateParallax);
    
    // Initial update
    updateParallax();
})();
function updateClock() {
const now = new Date().toLocaleTimeString('en-US', {
timeZone: 'Asia/Kolkata',
hour12: false
});
document.getElementById("clock").textContent = now;
}
setInterval(updateClock, 1000);
updateClock();

class ScrollReveal {
    constructor() {
        this.planningItems = document.querySelectorAll('.planning-item');
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateOnScroll();
    }

    bindEvents() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateOnScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    updateOnScroll() {
        const scrollY = window.scrollY;
        
        this.planningItems.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            const itemTop = scrollY + rect.top;
            const headerHeight = 120;
            
            const content = item.querySelector('.planning-content');
            const contentRect = content.getBoundingClientRect();
            const contentTop = scrollY + contentRect.top;
            const contentHeight = contentRect.height;
            
            // Calculate when content should start hiding (moved closer to the end point)
            const hideStartPoint = contentTop + contentHeight - headerHeight - 200; // Restored to 200
            const hideEndPoint = contentTop + contentHeight - headerHeight;
            
            if (scrollY >= hideStartPoint && scrollY <= hideEndPoint) {
                // Calculate progress of hiding animation
                const progress = (scrollY - hideStartPoint) / (hideEndPoint - hideStartPoint);
                const clampedProgress = Math.max(0, Math.min(1, progress));
                
                // Apply hiding effect - content moves up and fades but doesn't completely disappear
                const elements = content.querySelectorAll('.planning-description, .planning-features, .planning-tech');
                elements.forEach(el => {
                    const opacity = Math.max(0.1, 1 - clampedProgress); // Keep minimum opacity
                    const translateY = -100 * clampedProgress; // Move further up
                    
                    el.style.opacity = opacity;
                    el.style.transform = `translateY(${translateY}px)`;
                });
            } else if (scrollY < hideStartPoint) {
                // Show content when scrolling up
                const elements = content.querySelectorAll('.planning-description, .planning-features, .planning-tech');
                elements.forEach(el => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                });
            } else {
                // Keep content mostly hidden but slightly visible when past the hide point
                const elements = content.querySelectorAll('.planning-description, .planning-features, .planning-tech');
                elements.forEach(el => {
                    el.style.opacity = '0.1';
                    el.style.transform = 'translateY(-100px)';
                });
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ScrollReveal();
});

// Planning Section Scroll Effect
function initPlanningScroll() {
    const planningItems = document.querySelectorAll('.planning-item');
    const headerHeight = 80;
    const planningHeaderHeight = 120;
    let currentActiveIndex = -1;
    let prevHeaderTimeout = null;

    function handleScroll() {
        const scrollY = window.scrollY;
        const triggerPoint = scrollY + headerHeight + planningHeaderHeight;

        let newActiveIndex = -1;
        planningItems.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            const itemTop = rect.top + scrollY;
            const itemBottom = itemTop + rect.height;
            if (itemTop <= triggerPoint && itemBottom > triggerPoint) {
                newActiveIndex = index;
            }
        });

        // If the active index has changed
        if (newActiveIndex !== currentActiveIndex) {
            // Remove .active from all headers except the new one
            planningItems.forEach((item, idx) => {
                const header = item.querySelector('.planning-header');
                const content = item.querySelector('.planning-content');
                if (idx !== newActiveIndex) {
                    header.classList.remove('active');
                    content.classList.remove('hiding');
                }
            });

            // Handle fade-out for previous header
            if (currentActiveIndex >= 0 && newActiveIndex !== -1) {
                const prevHeader = planningItems[currentActiveIndex].querySelector('.planning-header');
                const prevContent = planningItems[currentActiveIndex].querySelector('.planning-content');
                if (prevHeaderTimeout) clearTimeout(prevHeaderTimeout);
                prevHeaderTimeout = setTimeout(() => {
                    prevHeader.classList.remove('active');
                    prevContent.classList.remove('hiding');
                }, 300);
            }

            // Add .active to the new header
            if (newActiveIndex !== -1) {
                const newHeader = planningItems[newActiveIndex].querySelector('.planning-header');
                const newContent = planningItems[newActiveIndex].querySelector('.planning-content');
                newHeader.classList.add('active');
                newContent.classList.add('hiding');
            }

            currentActiveIndex = newActiveIndex;
        }
    }

    window.addEventListener('scroll', () => {
        requestAnimationFrame(handleScroll);
    });

    handleScroll();
}

// Initialize planning scroll effect when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initPlanningScroll();
});

// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const closeMenu = document.getElementById('closeMenu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    if (hamburgerMenu && mobileMenuOverlay && closeMenu) {
        hamburgerMenu.addEventListener('click', () => {
            mobileMenuOverlay.classList.toggle('active');
        });

        closeMenu.addEventListener('click', () => {
            mobileMenuOverlay.classList.remove('active');
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuOverlay.classList.remove('active');
            });
        });
    }
});

class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.update = this.update.bind(this);
        this.frame = 0;
        this.queue = [];
        this.resolve = null;
        this.frameRequest = null;
    }

    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        
        // Create a more dynamic queue with varying start times and durations
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            // Stagger the start times
            const start = Math.floor(Math.random() * 20);
            // Vary the duration for each character
            const duration = 20 + Math.floor(Math.random() * 30);
            const end = start + duration;
            this.queue.push({ from, to, start, end, char: null });
        }

        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;
        
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                // Increase the frequency of character changes
                if (!char || Math.random() < 0.4) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                // Add a glitch effect class for some characters
                const glitchClass = Math.random() < 0.1 ? 'glitch' : '';
                output += `<span class="scramble ${glitchClass}">${char}</span>`;
            } else {
                output += from;
            }
        }

        this.el.innerHTML = output;
        
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// Initialize text scramble effect for section titles
document.addEventListener('DOMContentLoaded', () => {
    const titles = [
        document.querySelector('.work-title'),
        document.querySelector('.services-title'),
        document.querySelector('.planning-main-title'),
        document.querySelector('.about-title')
    ];

    // Create an Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const title = entry.target;
                const fx = new TextScramble(title);
                const originalText = title.innerText;
                
                // Initial scramble with a slight delay
                setTimeout(() => {
                    fx.setText(originalText);
                }, 100);

                // Re-scramble on hover with a slight delay
                title.addEventListener('mouseenter', () => {
                    setTimeout(() => {
                        fx.setText(originalText);
                    }, 50);
                });

                // Unobserve after first trigger
                observer.unobserve(title);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px'
    });

    // Observe each title
    titles.forEach(title => {
        if (title) {
            observer.observe(title);
        }
    });
});

// Theme Toggle Functionality
class ThemeToggle {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.sunIcon = this.themeToggle.querySelector('.sun-icon');
        this.moonIcon = this.themeToggle.querySelector('.moon-icon');
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        
        this.init();
        this.bindEvents();
    }

    init() {
        // Set initial theme
        this.setTheme(this.currentTheme);
        this.updateIcon();
    }

    bindEvents() {
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                    this.updateIcon();
                }
            });
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        this.updateIcon();
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateCursorFollowerBorderColor();
    }

    updateIcon() {
        if (this.currentTheme === 'dark') {
            this.sunIcon.style.display = 'block';
            this.moonIcon.style.display = 'none';
        } else {
            this.sunIcon.style.display = 'none';
            this.moonIcon.style.display = 'block';
        }
    }
}

// Initialize theme toggle when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeToggle();
});