// Professional portfolio animations and interactions
(function(){
    // set current year in footer
    const yearEl = document.getElementById('year');
    if(yearEl) yearEl.textContent = new Date().getFullYear();

    // check if animations should be disabled
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Typing Animation
    function typeWriter(element, text, speed = 50) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                // Remove only the cursor after typing is complete, keep all text
                setTimeout(() => {
                    // Preserve the text content
                    const finalText = element.textContent;
                    // Remove cursor styling only
                    element.style.borderRight = 'none';
                    element.style.animation = 'none';
                    element.classList.add('typing-complete');
                    // Ensure text is preserved
                    element.textContent = finalText;
                }, 500);
            }
        }
        type();
    }

    // Initialize typing animations when page loads
    window.addEventListener('load', () => {
        if (!prefersReducedMotion) {
            const typingName = document.querySelector('.typing-text');
            const typingSubtitle = document.querySelector('.typing-subtitle');
            
            // Responsive typing speeds
            const isMobile = window.innerWidth <= 480;
            const isTablet = window.innerWidth <= 768;
            
            const nameSpeed = isMobile ? 60 : isTablet ? 70 : 80;
            const subtitleSpeed = isMobile ? 20 : isTablet ? 22 : 25;
            
            if (typingName) {
                const nameText = typingName.getAttribute('data-text');
                setTimeout(() => {
                    typeWriter(typingName, nameText, nameSpeed);
                }, 500);
            }
            
            if (typingSubtitle) {
                const subtitleText = typingSubtitle.getAttribute('data-text');
                // Adjust delay based on name length and speed
                const nameLength = typingName ? typingName.getAttribute('data-text').length : 0;
                const nameTypingTime = nameLength * nameSpeed;
                const startDelay = 500 + nameTypingTime + (isMobile ? 800 : 1000);
                
                setTimeout(() => {
                    typeWriter(typingSubtitle, subtitleText, subtitleSpeed);
                }, startDelay);
            }
        } else {
            // Fallback for reduced motion
            const typingName = document.querySelector('.typing-text');
            const typingSubtitle = document.querySelector('.typing-subtitle');
            
            if (typingName) typingName.textContent = typingName.getAttribute('data-text');
            if (typingSubtitle) typingSubtitle.textContent = typingSubtitle.getAttribute('data-text');
        }
    });

    // Simple cursor system (only when motion allowed)
    if(!prefersReducedMotion){
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorTrail = document.querySelector('.cursor-trail');
        let mouseX = -100, mouseY = -100; // Start off-screen
        let dotX = mouseX, dotY = mouseY, trailX = mouseX, trailY = mouseY;
        let hasMouseMoved = false;
        
        if(cursorDot && cursorTrail){
            // Hide cursor initially
            cursorDot.style.opacity = '0';
            cursorDot.style.visibility = 'hidden';
            cursorDot.style.display = 'block';
            cursorTrail.style.opacity = '0';
            cursorTrail.style.visibility = 'hidden';
            cursorTrail.style.display = 'block';
            
            // Set initial position off-screen
            cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
            cursorTrail.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
            
            window.addEventListener('mousemove', e=>{
                if(!hasMouseMoved){
                    // Show cursor on first mouse movement
                    hasMouseMoved = true;
                    cursorDot.style.opacity = '1';
                    cursorDot.style.visibility = 'visible';
                    cursorTrail.style.opacity = '0.6';
                    cursorTrail.style.visibility = 'visible';
                }
                mouseX = e.clientX;
                mouseY = e.clientY;
                
                // Simple hover effects
                const target = e.target.closest('a, button, .btn, input, textarea, .card, .project-card');
                if(target) {
                    cursorDot.classList.add('hover');
                    cursorTrail.style.opacity = '0.8';
                } else {
                    cursorDot.classList.remove('hover');
                    cursorTrail.style.opacity = '0.6';
                }
            }, {passive:true});

            // Simple smooth follow animation
            function animateCursor(){
                dotX += (mouseX - dotX) * 0.2;
                dotY += (mouseY - dotY) * 0.2;
                trailX += (mouseX - trailX) * 0.1;
                trailY += (mouseY - trailY) * 0.1;
                
                cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
                cursorTrail.style.transform = `translate3d(${trailX}px, ${trailY}px, 0) translate(-50%, -50%)`;
                
                requestAnimationFrame(animateCursor);
            }
            requestAnimationFrame(animateCursor);
        }
    }

    // smooth scroll for internal links
    document.addEventListener('click', e=>{
        const a = e.target.closest('a');
        if(!a) return;
        const href = a.getAttribute('href');
        if(href && href.startsWith('#')){
            e.preventDefault();
            const target = document.querySelector(href);
            if(target) target.scrollIntoView({behavior:'smooth'});
        }
    });

    // mobile menu toggle (works across pages)
    document.addEventListener('DOMContentLoaded', ()=>{
        const menuToggle = document.querySelector('.menu-toggle');
        const navList = document.querySelector('.main-nav ul');
        if(menuToggle && navList){
            menuToggle.addEventListener('click', (ev)=>{
                navList.classList.toggle('active');
                menuToggle.classList.toggle('active');
                ev.stopPropagation();
            });

            // close menu when clicking outside
            document.addEventListener('click', (ev)=>{
                if(!ev.target.closest('.main-nav') && !ev.target.closest('.menu-toggle')){
                    navList.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            });
        }

        // remove animation toggle logic (no longer needed)

        // legacy support for old menu-icon class
        const legacyMenu = document.querySelector('.menu-icon');
        if(legacyMenu && navList){
            legacyMenu.addEventListener('click', (ev)=>{
                navList.classList.toggle('active');
                ev.stopPropagation();
            });
        }
    });

    /* Neural network particle system
       - creates multiple layers of neural networks
       - different depths, speeds, and colors for rich background
       - connections light up like synapses
       - reacts to cursor with neural activation
    */
    (function initNeuralNetwork(){
        const canvas = document.getElementById('particle-canvas');
        if(!canvas || prefersReducedMotion) return;
        
        const ctx = canvas.getContext('2d');
        let neuralLayers = [];
        let width = 0, height = 0;
        const DPR = Math.max(1, window.devicePixelRatio || 1);
        const BASE_NEURON_COUNT = Math.floor((window.innerWidth * window.innerHeight) / 15000);
        const CONNECTION_DISTANCE = 150;
        const ACTIVATION_DISTANCE = 180;
        const mouse = {x: null, y: null};

        // Define multiple neural network layers with black/white only
        const layerConfigs = [
            { 
                color: { r: 255, g: 255, b: 255 }, // Pure white
                opacity: 0.6, 
                speed: 2.5, 
                connectionDistance: 160,
                neuronMultiplier: 1.0,
                pulseSpeed: 0.08,
                depth: 0
            },
            { 
                color: { r: 240, g: 240, b: 240 }, // Off white
                opacity: 0.4, 
                speed: 2.0, 
                connectionDistance: 140,
                neuronMultiplier: 0.8,
                pulseSpeed: 0.06,
                depth: 1
            },
            { 
                color: { r: 200, g: 200, b: 200 }, // Light gray
                opacity: 0.3, 
                speed: 1.5, 
                connectionDistance: 120,
                neuronMultiplier: 0.6,
                pulseSpeed: 0.05,
                depth: 2
            },
            { 
                color: { r: 160, g: 160, b: 160 }, // Medium gray
                opacity: 0.2, 
                speed: 1.0, 
                connectionDistance: 100,
                neuronMultiplier: 0.4,
                pulseSpeed: 0.04,
                depth: 3
            }
        ];

        function resize(){
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = Math.floor(width * DPR);
            canvas.height = Math.floor(height * DPR);
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            ctx.setTransform(DPR,0,0,DPR,0,0);
        }

        function createNeuralLayers(){
            neuralLayers = [];
            
            layerConfigs.forEach((config, layerIndex) => {
                const neurons = [];
                const count = Math.max(20, Math.min(80, Math.floor(BASE_NEURON_COUNT * config.neuronMultiplier)));
                
                for(let i = 0; i < count; i++){
                    neurons.push({
                        x: Math.random() * width,
                        y: Math.random() * height,
                        vx: (Math.random() - 0.5) * 0.8 * config.speed,
                        vy: (Math.random() - 0.5) * 0.8 * config.speed,
                        size: Math.random() * 2 + 1.5 + (3 - layerIndex) * 0.5,
                        baseOpacity: Math.random() * 0.3 + 0.2,
                        opacity: Math.random() * 0.3 + 0.2,
                        pulse: Math.random() * Math.PI * 2,
                        activationLevel: 0,
                        layer: layerIndex
                    });
                }
                
                neuralLayers.push({
                    neurons: neurons,
                    config: config
                });
            });
        }

        function draw(){
            ctx.clearRect(0, 0, width, height);
            
            const time = Date.now() * 0.001;
            
            // Draw each neural layer from back to front
            neuralLayers.forEach((layer, layerIndex) => {
                const { neurons, config } = layer;
                const layerOpacity = config.opacity;
                const { r, g, b } = config.color;
                
                // Update neurons in this layer
                neurons.forEach((neuron, i) => {
                    // gentle drift movement
                    neuron.x += neuron.vx;
                    neuron.y += neuron.vy;
                    
                    // soft boundary reflection
                    if(neuron.x < 20 || neuron.x > width - 20) neuron.vx *= -1;
                    if(neuron.y < 20 || neuron.y > height - 20) neuron.vy *= -1;
                    
                    // neural pulse animation
                    neuron.pulse += config.pulseSpeed;
                    const pulseIntensity = (Math.sin(neuron.pulse) + 1) * 0.5;
                    neuron.opacity = neuron.baseOpacity + pulseIntensity * 0.3;
                    
                    // mouse interaction - neural activation
                    if(mouse.x !== null){
                        const dx = mouse.x - neuron.x;
                        const dy = mouse.y - neuron.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if(distance < ACTIVATION_DISTANCE){
                            neuron.activationLevel = Math.max(0, 1 - distance / ACTIVATION_DISTANCE);
                        } else {
                            neuron.activationLevel *= 0.92; // faster decay
                        }
                    }
                    
                    // draw neuron core
                    const coreSize = neuron.size + neuron.activationLevel * 2;
                    const coreOpacity = (neuron.opacity + neuron.activationLevel * 0.6) * layerOpacity;
                    
                    // outer glow
                    ctx.beginPath();
                    ctx.arc(neuron.x, neuron.y, coreSize * 2, 0, Math.PI * 2);
                    const gradient = ctx.createRadialGradient(neuron.x, neuron.y, 0, neuron.x, neuron.y, coreSize * 2);
                    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${coreOpacity * 0.3})`);
                    gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${coreOpacity * 0.1})`);
                    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
                    ctx.fillStyle = gradient;
                    ctx.fill();
                    
                    // inner core
                    ctx.beginPath();
                    ctx.arc(neuron.x, neuron.y, coreSize, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${coreOpacity})`;
                    ctx.fill();
                    
                    // neural connections (synapses) within the same layer
                    neurons.slice(i + 1).forEach(otherNeuron => {
                        const dx = neuron.x - otherNeuron.x;
                        const dy = neuron.y - otherNeuron.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if(distance < config.connectionDistance){
                            const connectionStrength = (1 - distance / config.connectionDistance);
                            const activationBoost = (neuron.activationLevel + otherNeuron.activationLevel) * 0.5;
                            const synapseOpacity = (connectionStrength * 0.15 + activationBoost * 0.4) * layerOpacity;
                            
                            // animated synapse effect
                            const synapseWidth = (0.5 + activationBoost * 1.5) * (1 - layerIndex * 0.2);
                            const animOffset = (time * 8 * config.speed + distance * 0.02) % 1;
                            
                            ctx.beginPath();
                            ctx.moveTo(neuron.x, neuron.y);
                            ctx.lineTo(otherNeuron.x, otherNeuron.y);
                            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${synapseOpacity})`;
                            ctx.lineWidth = synapseWidth;
                            ctx.stroke();
                            
                            // synaptic pulse
                            if(activationBoost > 0.1){
                                const pulseX = neuron.x + (otherNeuron.x - neuron.x) * animOffset;
                                const pulseY = neuron.y + (otherNeuron.y - neuron.y) * animOffset;
                                
                                ctx.beginPath();
                                ctx.arc(pulseX, pulseY, (2 + activationBoost * 3) * (1 - layerIndex * 0.15), 0, Math.PI * 2);
                                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${activationBoost * 0.8 * layerOpacity})`;
                                ctx.fill();
                            }
                        }
                    });
                });
                
                // Cross-layer connections (weaker, between adjacent layers)
                if(layerIndex < neuralLayers.length - 1){
                    const nextLayer = neuralLayers[layerIndex + 1];
                    neurons.forEach(neuron => {
                        nextLayer.neurons.forEach(nextNeuron => {
                            const dx = neuron.x - nextNeuron.x;
                            const dy = neuron.y - nextNeuron.y;
                            const distance = Math.sqrt(dx * dx + dy * dy);
                            
                            if(distance < 80 && Math.random() < 0.1){
                                const connectionStrength = (1 - distance / 80) * 0.1;
                                const activationBoost = (neuron.activationLevel + nextNeuron.activationLevel) * 0.3;
                                const synapseOpacity = (connectionStrength + activationBoost * 0.2) * Math.min(config.opacity, nextLayer.config.opacity);
                                
                                ctx.beginPath();
                                ctx.moveTo(neuron.x, neuron.y);
                                ctx.lineTo(nextNeuron.x, nextNeuron.y);
                                ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${synapseOpacity})`;
                                ctx.lineWidth = 0.3;
                                ctx.stroke();
                            }
                        });
                    });
                }
            });
        }

        function loop(){
            draw();
            requestAnimationFrame(loop);
        }

        resize();
        createNeuralLayers();
        loop();

        window.addEventListener('resize', () => { resize(); createNeuralLayers(); });
        window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, {passive:true});
        window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
    })();

    // Skill bar animations for about page
    function animateSkillBars() {
        const skillsSection = document.querySelector('.skills-section');
        if (!skillsSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add animation class to trigger skill bar animations
                    entry.target.classList.add('animate-skills');
                    
                    // Animate each skill bar individually with delay
                    const skillBars = entry.target.querySelectorAll('.skill-progress');
                    skillBars.forEach((bar, index) => {
                        setTimeout(() => {
                            const width = bar.getAttribute('data-width');
                            bar.style.width = width;
                        }, index * 200); // 200ms delay between each bar
                    });
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3
        });

        observer.observe(skillsSection);
    }

    // Initialize skill bar animations when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', animateSkillBars);
    } else {
        animateSkillBars();
    }

    // Project filtering functionality
    function initProjectFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        
        if (!filterButtons.length || !projectCards.length) return;

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filter = button.getAttribute('data-filter');
                
                // Filter projects with animation
                projectCards.forEach((card, index) => {
                    const categories = card.getAttribute('data-category') || '';
                    const shouldShow = filter === 'all' || categories.includes(filter);
                    
                    if (shouldShow) {
                        setTimeout(() => {
                            card.classList.remove('hidden');
                            card.classList.add('visible');
                        }, index * 50);
                    } else {
                        card.classList.add('hidden');
                        card.classList.remove('visible');
                    }
                });
            });
        });

        // Initialize all projects as visible
        projectCards.forEach(card => {
            card.classList.add('visible');
        });
    }

    // Initialize project filters when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProjectFilters);
    } else {
        initProjectFilters();
    }

    // Star Rating System
    function initStarRating() {
        const starRatings = document.querySelectorAll('.star-rating');
        
        starRatings.forEach(rating => {
            const stars = rating.querySelectorAll('.star');
            const projectName = rating.getAttribute('data-project');
            const ratingDisplay = rating.parentElement.querySelector('.rating-display');
            
            // Load saved rating from localStorage
            const savedRating = localStorage.getItem(`rating-${projectName}`);
            if (savedRating) {
                updateStarDisplay(stars, parseInt(savedRating));
                ratingDisplay.textContent = `You rated: ${savedRating}/5 stars`;
                ratingDisplay.classList.add('rated');
            }
            
            stars.forEach((star, index) => {
                // Hover effect
                star.addEventListener('mouseenter', () => {
                    updateStarDisplay(stars, index + 1);
                });
                
                // Reset on mouse leave (unless rated)
                rating.addEventListener('mouseleave', () => {
                    const currentRating = localStorage.getItem(`rating-${projectName}`);
                    if (currentRating) {
                        updateStarDisplay(stars, parseInt(currentRating));
                    } else {
                        updateStarDisplay(stars, 0);
                    }
                });
                
                // Click to rate
                star.addEventListener('click', () => {
                    const ratingValue = index + 1;
                    
                    // Save rating locally
                    localStorage.setItem(`rating-${projectName}`, ratingValue);
                    
                    // Update display
                    updateStarDisplay(stars, ratingValue);
                    ratingDisplay.textContent = `You rated: ${ratingValue}/5 stars`;
                    ratingDisplay.classList.add('rated');
                    
                    // Send rating to email
                    sendRatingToEmail(projectName, ratingValue);
                    
                    // Show confirmation
                    showRatingConfirmation(ratingValue);
                });
            });
        });
    }
    
    function updateStarDisplay(stars, rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }
    
    function sendRatingToEmail(projectName, rating) {
        // Using EmailJS or a similar service to send the rating
        const emailData = {
            project_name: projectName,
            rating: rating,
            timestamp: new Date().toLocaleString(),
            user_ip: 'visitor', // You could get actual IP if needed
            page_url: window.location.href
        };
        
        // Using Formspree or EmailJS - replace with your service
        fetch('https://formspree.io/f/xjkyggjd', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                subject: `Portfolio Project Rating: ${projectName}`,
                message: `
                    New project rating received!
                    
                    Project: ${projectName}
                    Rating: ${rating}/5 stars
                    Timestamp: ${emailData.timestamp}
                    Page: ${emailData.page_url}
                    
                    This rating was submitted through your portfolio website.
                `,
                _replyto: 'noreply@portfolio.com'
            })
        }).catch(error => {
            console.log('Rating saved locally. Email service unavailable:', error);
        });
    }
    
    function showRatingConfirmation(rating) {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 215, 0, 0.9);
            color: black;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            animation: slideInFromRight 0.3s ease;
        `;
        notification.textContent = `Thank you! You rated this project ${rating}/5 stars ⭐`;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutToRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Initialize star ratings when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initStarRating);
    } else {
        initStarRating();
    }
})();

// Contact Page Functionality
(function() {
    'use strict';
    
    function initContactPage() {
        // Initialize feedback form star rating
        initFeedbackStarRating();
        
        // Add form validation and enhancement
        initFormValidation();
        
        // Add form submission handling
        initFormSubmission();
        
        // Enhance select dropdowns
        initSelectEnhancements();
    }
    
    function initFeedbackStarRating() {
        const starsInput = document.querySelector('.stars-input');
        const ratingText = document.querySelector('.rating-text');
        
        if (!starsInput || !ratingText) return;
        
        const starLabels = starsInput.querySelectorAll('label');
        const starInputs = starsInput.querySelectorAll('input[type="radio"]');
        
        // Handle star hover effects
        starLabels.forEach((label, index) => {
            label.addEventListener('mouseenter', () => {
                highlightStars(index);
                updateRatingText(5 - index);
            });
            
            label.addEventListener('click', () => {
                const rating = 5 - index;
                updateRatingText(rating, true);
                // Show confirmation
                showFeedbackConfirmation(rating);
            });
        });
        
        // Reset on mouse leave
        starsInput.addEventListener('mouseleave', () => {
            const checkedInput = starsInput.querySelector('input:checked');
            if (checkedInput) {
                const checkedIndex = Array.from(starInputs).indexOf(checkedInput);
                highlightStars(checkedIndex);
                updateRatingText(5 - checkedIndex, true);
            } else {
                resetStars();
                ratingText.textContent = 'Click to rate';
            }
        });
        
        function highlightStars(upToIndex) {
            starLabels.forEach((label, index) => {
                if (index <= upToIndex) {
                    label.style.color = '#ffd700';
                } else {
                    label.style.color = '#333333';
                }
            });
        }
        
        function resetStars() {
            starLabels.forEach(label => {
                label.style.color = '#333333';
            });
        }
        
        function updateRatingText(rating, isSelected = false) {
            const ratingTexts = {
                1: 'Poor',
                2: 'Fair',
                3: 'Good',
                4: 'Very Good',
                5: 'Excellent'
            };
            
            if (isSelected) {
                ratingText.textContent = `${ratingTexts[rating]} (${rating}/5)`;
                ratingText.style.color = '#ffd700';
            } else {
                ratingText.textContent = `${ratingTexts[rating]} (${rating}/5)`;
                ratingText.style.color = '#a0a0a0';
            }
        }
    }
    
    function showFeedbackConfirmation(rating) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ffd700;
            color: #000000;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            font-weight: 600;
            z-index: 1000;
            box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4);
            animation: slideInFromRight 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;
        notification.innerHTML = `<i class="fas fa-star"></i> Rating selected: ${rating}/5 stars!`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutToRight 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 2500);
    }
    
    function initSelectEnhancements() {
        const selectElements = document.querySelectorAll('.contact-form select, .feedback-form select');
        
        selectElements.forEach(select => {
            // Add visual feedback when option is selected
            select.addEventListener('change', function() {
                if (this.value) {
                    this.style.color = '#ffffff';
                    this.style.fontWeight = '600';
                    this.style.background = 'rgba(255, 255, 255, 0.1)';
                } else {
                    this.style.color = '#a0a0a0';
                    this.style.fontWeight = '500';
                    this.style.background = 'rgba(255, 255, 255, 0.08)';
                }
            });
            
            // Initial state check
            if (select.value) {
                select.style.color = '#ffffff';
                select.style.fontWeight = '600';
                select.style.background = 'rgba(255, 255, 255, 0.1)';
            } else {
                select.style.color = '#a0a0a0';
                select.style.fontWeight = '500';
                select.style.background = 'rgba(255, 255, 255, 0.08)';
            }
            
            // Add click effect for better user feedback
            select.addEventListener('click', function() {
                this.style.borderColor = '#ffd700';
                this.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.3)';
            });
            
            // Reset on blur if no selection
            select.addEventListener('blur', function() {
                if (!this.value) {
                    this.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    this.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                }
            });
            
            // Add enhanced hover effects
            select.addEventListener('mouseenter', function() {
                if (!this.matches(':focus')) {
                    this.style.borderColor = 'rgba(255, 215, 0, 0.5)';
                    this.style.transform = 'translateY(-1px)';
                }
            });
            
            select.addEventListener('mouseleave', function() {
                if (!this.matches(':focus') && !this.value) {
                    this.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    this.style.transform = 'translateY(0)';
                } else if (!this.matches(':focus') && this.value) {
                    this.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                    this.style.transform = 'translateY(0)';
                }
            });
        });
    }
    
    function initFormValidation() {
        const forms = document.querySelectorAll('.contact-form, .feedback-form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                // Add real-time validation
                input.addEventListener('blur', validateField);
                input.addEventListener('input', clearValidationErrors);
            });
        });
        
        function validateField(event) {
            const field = event.target;
            const value = field.value.trim();
            
            // Remove existing error styling
            field.classList.remove('error');
            removeErrorMessage(field);
            
            // Validation rules
            if (field.hasAttribute('required') && !value) {
                showFieldError(field, 'This field is required');
                return false;
            }
            
            if (field.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    showFieldError(field, 'Please enter a valid email address');
                    return false;
                }
            }
            
            if (field.type === 'tel' && value) {
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                    showFieldError(field, 'Please enter a valid phone number');
                    return false;
                }
            }
            
            return true;
        }
        
        function clearValidationErrors(event) {
            const field = event.target;
            field.classList.remove('error');
            removeErrorMessage(field);
        }
        
        function showFieldError(field, message) {
            field.classList.add('error');
            
            const errorElement = document.createElement('span');
            errorElement.className = 'field-error';
            errorElement.textContent = message;
            errorElement.style.cssText = `
                color: #ffffff;
                font-size: 0.8rem;
                margin-top: 0.25rem;
                display: block;
            `;
            
            field.parentNode.appendChild(errorElement);
        }
        
        function removeErrorMessage(field) {
            const errorElement = field.parentNode.querySelector('.field-error');
            if (errorElement) {
                errorElement.remove();
            }
        }
    }
    
    function initFormSubmission() {
        const forms = document.querySelectorAll('.contact-form, .feedback-form');
        
        forms.forEach(form => {
            form.addEventListener('submit', handleFormSubmission);
        });
        
        function handleFormSubmission(event) {
            event.preventDefault();
            
            const form = event.target;
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonContent = submitButton.innerHTML;
            
            // Validate all fields
            const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                }
            });
            
            if (!isValid) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // Submit form using Formspree
            const formData = new FormData(form);
            
            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                    form.reset();
                    
                    // Reset star rating if it's feedback form
                    if (form.classList.contains('feedback-form')) {
                        const ratingText = document.querySelector('.rating-text');
                        if (ratingText) {
                            ratingText.textContent = 'Click to rate';
                            ratingText.style.color = '#a0a0a0';
                        }
                        
                        const starLabels = document.querySelectorAll('.stars-input label');
                        starLabels.forEach(label => {
                            label.style.color = '#333333';
                        });
                    }
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(error => {
                console.error('Form submission error:', error);
                showNotification('There was an error sending your message. Please try again.', 'error');
            })
            .finally(() => {
                // Restore button state
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonContent;
            });
        }
        
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            const bgColor = type === 'success' ? '#ffd700' :
                           type === 'error' ? '#ffffff' :
                           '#ffd700';
            const textColor = type === 'success' ? '#000000' :
                             type === 'error' ? '#000000' :
                             '#000000';
            
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${bgColor};
                color: ${textColor};
                padding: 1rem 1.5rem;
                border-radius: 10px;
                font-weight: 600;
                z-index: 1000;
                box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4);
                animation: slideInFromRight 0.3s ease;
                max-width: 350px;
                word-wrap: break-word;
            `;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOutToRight 0.3s ease';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }, 4000);
        }
    }
    
    // Add error styling to CSS
    const errorStyles = `
        .form-group input.error,
        .form-group textarea.error,
        .form-group select.error {
            border-color: #ffffff !important;
            background: rgba(255, 255, 255, 0.05) !important;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.3) !important;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = errorStyles;
    document.head.appendChild(styleSheet);
    
    // Initialize contact page functionality when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initContactPage);
    } else {
        initContactPage();
    }
})();

// Profile Picture Loading Handler
(function() {
    'use strict';
    
    function initProfilePicture() {
        const profileImg = document.querySelector('.profile-img');
        if (!profileImg) return;
        
        // Handle image load success
        profileImg.addEventListener('load', function() {
            this.setAttribute('data-loaded', 'true');
            console.log('Profile picture loaded successfully');
        });
        
        // Handle image load error (image not found)
        profileImg.addEventListener('error', function() {
            console.log('Profile picture not found, using fallback');
            this.style.display = 'none';
            
            // Create fallback element
            const fallback = document.createElement('div');
            fallback.className = 'profile-fallback';
            fallback.innerHTML = 'VR';
            fallback.style.cssText = `
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 235, 59, 0.3));
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 3rem;
                font-weight: 700;
                color: var(--accent);
                text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
            `;
            
            // Replace image with fallback
            this.parentNode.insertBefore(fallback, this);
        });
        
        // Check if image source exists
        if (profileImg.src && !profileImg.complete) {
            // Image is still loading
            profileImg.style.opacity = '0.5';
            profileImg.addEventListener('load', function() {
                this.style.opacity = '1';
            });
        }
    }
    
    // Initialize profile picture handling when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProfilePicture);
    } else {
        initProfilePicture();
    }
})();
