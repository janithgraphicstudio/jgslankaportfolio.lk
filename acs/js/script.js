document.addEventListener('DOMContentLoaded', () => {
    // Disable right-click context menu across the site
    document.addEventListener('contextmenu', event => event.preventDefault());
});
// --- Preloader Logic ---
const preloader = document.getElementById('preloader');
if (preloader) {
    // Hide preloader on window load
    window.addEventListener('load', () => {
        preloader.classList.add('hidden');
    });
    // Fallback: hide preloader after max 3 seconds
    setTimeout(() => {
        if (!preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
        }
    }, 3000);
}

// Helper to safely initialize looping Swipers by duplicating slides if needed
function initLoopingSwiper(selector, config, minSlidesRequired = 6) {
    const container = document.querySelector(selector);
    if (!container) return null;
    
    const wrapper = container.querySelector('.swiper-wrapper');
    if (wrapper) {
        const slides = wrapper.querySelectorAll('.swiper-slide');
        if (slides.length > 0 && slides.length < minSlidesRequired) {
            const repeatCount = Math.ceil(minSlidesRequired / slides.length);
            for (let i = 0; i < repeatCount - 1; i++) {
                slides.forEach(slide => {
                    const clone = slide.cloneNode(true);
                    wrapper.appendChild(clone);
                });
            }
        }
    }
    if (typeof Swiper !== 'undefined') {
        return new Swiper(selector, config);
    } else {
        console.warn(`Swiper is not loaded, skipped initialization for ${selector}`);
        return null;
    }
}

// --- ALL POPUP LOGIC (Corrected Version) ---

document.addEventListener('DOMContentLoaded', function () {

    // --- Element Definitions ---
    const introPopup = document.getElementById('intro-popup');
    const closePopupBtn = document.getElementById('close-popup-btn');
    const qrPopup = document.getElementById('qr-popup');
    const qrCloseBtn = document.getElementById('qr-close-btn');
    const notif = document.getElementById('chatbot-notification');
    const notifClose = document.getElementById('chatbot-notification-close');

    // --- Function Definitions ---
    setTimeout(() => {
        notif.classList.add('show');
        setTimeout(() => {
            notif.classList.remove('show');
        }, 4000);
    }, 1000);

    notifClose.onclick = () => notif.classList.remove('show');

    // QR Popup එක පෙන්වන සහ එහි ක්‍රියාකාරීත්වය පාලනය කරන Function එක
    function showQrPopup() {
        if (qrPopup && window.innerWidth > 768) {
            qrPopup.classList.remove('initial-hide');

            const qrTimeout = setTimeout(() => {
                if (qrPopup) qrPopup.classList.add('hidden');
            }, 10000);

            if (qrCloseBtn) {
                qrCloseBtn.addEventListener('click', () => {
                    if (qrPopup) qrPopup.classList.add('hidden');
                    clearTimeout(qrTimeout);
                }, { once: true }); // Listener එක එක් වරක් පමණක් ක්‍රියාත්මක වීමට
            }
        }
    }

    // Welcome Popup එක සඟවන Function එක
    function hideWelcomePopup() {
        if (introPopup && !introPopup.classList.contains('hidden')) {
            introPopup.classList.add('hidden');
            // Scroll lock ඉවත් කිරීම (scrollbar compensation සමග)
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            // Welcome popup එකේ auto-close timer එක නතර කිරීම
            clearTimeout(window.welcomePopupTimeout);

            // තත්පර 1කට පසු QR Popup එක පෙන්වීමට trigger කිරීම
            setTimeout(showQrPopup, 1000);
        }
    }

    // --- Initial Triggers and Event Listeners ---

    // --- Premium Features Initialization (Lenis, Cursor, GSAP) ---

    // 1. Initialize Lenis Smooth Scroll
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    } else {
        console.warn('Lenis not loaded');
    }

    // 2. Custom Cursor Logic
    const cursor = document.createElement('div');
    const follower = document.createElement('div');
    cursor.classList.add('cursor');
    follower.classList.add('cursor-follower');
    document.body.appendChild(cursor);
    document.body.appendChild(follower);

    document.addEventListener('mousemove', (e) => {
        if (typeof gsap !== 'undefined') {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1
            });
            gsap.to(follower, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.3
            });
        } else {
            // Simple robust fallback positioning if GSAP is not loaded
            cursor.style.transform = `translate3d(${e.clientX - 10}px, ${e.clientY - 10}px, 0)`;
            follower.style.transform = `translate3d(${e.clientX - 20}px, ${e.clientY - 20}px, 0)`;
        }
    });

    // Cursor Hover Effects
    const hoverElements = document.querySelectorAll('a, button, .card, .portfolio-card, input, textarea');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            follower.classList.add('active');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            follower.classList.remove('active');
        });
    });

    // 3. GSAP Animations (Enhancing existing AOS)
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Hero Text Reveal
        const welcomeTexts = document.querySelectorAll('.welcome-text');
        if (welcomeTexts.length > 0) {
            gsap.from(welcomeTexts, {
                y: 100,
                opacity: 0,
                duration: 1.5,
                stagger: 0.2,
                ease: "power4.out",
                delay: 0.5
            });
        }

        // NOTE: Image parallax disabled — it causes images to overflow
        // the portfolio card wrapper, creating visual glitches on scroll.
        // gsap.utils.toArray('.portfolio-img, .project-card-image').forEach(img => { ... });

        // Section Titles Reveal
        const sectionTitles = document.querySelectorAll('.section-title');
        if (sectionTitles.length > 0) {
            gsap.utils.toArray(sectionTitles).forEach(title => {
                gsap.from(title, {
                    scrollTrigger: {
                        trigger: title,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    },
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out"
                });
            });
        }
    } else {
        console.warn('GSAP or ScrollTrigger not loaded');
    }


    // 4. Magnetic Buttons Effect
    const magneticButtons = document.querySelectorAll('.animated-btn, .portfolio-button');
    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            if (typeof gsap === 'undefined') return;
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        btn.addEventListener('mouseleave', () => {
            if (typeof gsap === 'undefined') return;
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });

    // --- Existing Popup Logic ---

    // Welcome Popup - only show once per user using localStorage
    const INTRO_STORAGE_KEY = 'introSeen';

    const shouldShowIntro = () => {
        try {
            return !localStorage.getItem(INTRO_STORAGE_KEY);
        } catch (err) {
            console.warn('localStorage not available:', err);
            return true;
        }
    };

    const markIntroSeen = () => {
        try {
            localStorage.setItem(INTRO_STORAGE_KEY, '1');
        } catch (err) {
            console.warn('Could not write to localStorage:', err);
        }
    };

    if (introPopup && closePopupBtn) {
        if (shouldShowIntro()) {
            // Popup open — lock scroll + compensate for scrollbar width to prevent layout shift
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollBarWidth}px`;

            window.welcomePopupTimeout = setTimeout(() => {
                hideWelcomePopup();
                markIntroSeen();
            }, 5000);

            closePopupBtn.addEventListener('click', function (e) {
                e.preventDefault();
                hideWelcomePopup();
                markIntroSeen();
            });
        } else {
            introPopup.classList.add('hidden');
            setTimeout(showQrPopup, 500);
        }
    }
});

document.addEventListener('DOMContentLoaded', function () {

    // --- Initialize AOS (Animate On Scroll) ---
    AOS.init({
        duration: 700,
        once: true,       // Play only once — prevents re-trigger jitter
        offset: 60,       // Start animation sooner so elements don't snap-jump
        easing: 'ease-out-cubic', // Smoother deceleration curve
        anchorPlacement: 'top-bottom'
    });


    // initLoopingSwiper helper is now defined globally at the top of this file

    // --- Swiper for Gallery ---
    const swiper = initLoopingSwiper('.swiper-container', {
        loop: true,
        speed: 1000,
        centeredSlides: true,
        slidesPerView: 'auto',
        spaceBetween: 30,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        grabCursor: true,
        allowTouchMove: true,
    }, 6);

    // --- Testimonials Slider Logic ---
    const testimonialsSlider = initLoopingSwiper('.testimonials-slider', {
        loop: true,
        grabCursor: true,
        spaceBetween: 30,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        breakpoints: {
            640: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
        }
    }, 8);

    // --- Animate Skills Bars on Scroll ---
    const skillBars = document.querySelectorAll('.skill-bar');

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.progress-line span');
                const percentage = progressBar.dataset.percent;

                progressBar.style.width = percentage + '%';

                skillObserver.unobserve(entry.target); // Animation එක එක් වරක් පමණක් ක්‍රියාත්මක වීමට
            }
        });
    }, {
        threshold: 0.5 // කොටස 50%ක් පෙනෙන විට animation එක පටන් ගැනීමට
    });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });

    // --- Portfolio Card Lightning Effect (නැවත එක් කරන ලදී) ---
    const cards = document.querySelectorAll('.portfolio-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--mouse-x', '-100%');
            card.style.setProperty('--mouse-y', '-100%');
        });
    });

    // --- International Standard Mobile Navigation Logic ---
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const navLinkItems = document.querySelectorAll('#nav-links li a');
    const toggleIcon = menuToggle.querySelector('i');

    function toggleMenu(forceClose = false) {
        const isOpen = navLinks.classList.contains('active');

        if (isOpen || forceClose) {
            navLinks.classList.remove('active');
            toggleIcon.classList.replace('fa-times', 'fa-bars');
            document.body.style.overflow = ''; // Unlock scroll
        } else {
            navLinks.classList.add('active');
            toggleIcon.classList.replace('fa-bars', 'fa-times');
            document.body.style.overflow = 'hidden'; // Lock scroll
        }
    }

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close menu when a link is clicked
    navLinkItems.forEach(link => {
        link.addEventListener('click', () => toggleMenu(true));
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
            toggleMenu(true);
        }
    });

    // --- Go to Top Button ---
    const goToTopBtn = document.querySelector('.go-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            goToTopBtn.classList.add('show');
        } else {
            goToTopBtn.classList.remove('show');
        }
        // --- Navbar Scrollspy (Highlight link on scroll) ---
        const sections = document.querySelectorAll('section[id], header[id]');
        const navLinks = document.querySelectorAll('.navbar ul li a');

        const observerOptions = {
            root: null, // 'null' යනු viewport එකයි
            rootMargin: '0px',
            threshold: 0.2 // අංශයක් 20%ක් පෙනෙන විට trigger වීමට (වෙනස් කරන ලදී)
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // isIntersecting යනු අංශය තිරයේ පෙනේද යන්නයි
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    const activeLink = document.querySelector(`.navbar ul li a[href="#${id}"]`);

                    // අදාළ ID එකට link එකක් ඇත්නම් පමණක්...
                    if (activeLink) {
                        // පළමුව, සියලුම link වලින් 'active' class එක ඉවත් කරන්න
                        navLinks.forEach(link => link.classList.remove('active'));

                        // අලුතින් පෙනෙන අංශයට අදාළ link එකට 'active' class එක එක් කරන්න
                        activeLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);

        // සියලුම අංශ නිරීක්ෂණය කිරීම ආරම්භ කරන්න
        sections.forEach(section => {
            observer.observe(section);
        });
    });



    // --- Price Accordion ---
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');

        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            accordionItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.accordion-content').style.maxHeight = 0;
            });

            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // --- Project Stats Counter ---
    function animateCount(element, targetNumber, finalDisplayText) {
        let current = 0;
        // ඉලක්කම විශාල වන විට වේගයෙන් ගණනය වීමට
        const increment = targetNumber / 100;

        const interval = setInterval(() => {
            current += increment;
            if (current >= targetNumber) {
                clearInterval(interval);
                element.textContent = finalDisplayText; // අවසානයේදී අවශ්‍ය අගය පෙන්වීම
            } else {
                element.textContent = Math.ceil(current).toLocaleString(); // ගණනය වන අතරතුර සංඛ්‍යාව පෙන්වීම
            }
        }, 20); // මිලි තත්පර 20 කට වරක් update වීම
    }

    const statsSection = document.querySelector('.project-stats');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // අලුත් අගයන් සහ පෙන්විය යුතු ආකාරය මෙහි ලබා දෙන්න
                animateCount(document.getElementById('projects-count'), 250, '250+');
                animateCount(document.getElementById('customers-count'), 10000, '10K+');
                animateCount(document.getElementById('reviews-count'), 5000, '5K+');

                observer.unobserve(statsSection); // එක් වරක් පමණක් ක්‍රියාත්මක වීමට
            }
        });
    }, { threshold: 0.5 });

    // statsSection එකක් ඇත්නම් පමණක් observer එක ක්‍රියාත්මක කිරීම
    if (statsSection) {
        observer.observe(statsSection);
    }
    // --- Order Form WhatsApp Logic ---
    const orderForm = document.getElementById('order-form');
    const agreementCheckbox = document.getElementById('agreement');
    const sendBtn = document.getElementById('send-btn');

    if (agreementCheckbox && sendBtn) {
        agreementCheckbox.addEventListener('change', function () {
            if (this.checked) {
                sendBtn.disabled = false;
            } else {
                sendBtn.disabled = true;
            }
        });
    }

    if (orderForm && agreementCheckbox) {
        orderForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!agreementCheckbox.checked) {
                alert("Please agree to the terms before sending.");
                return;
            }

            const name = document.getElementById('customer-name').value;
            const item = document.getElementById('item-selection').value;
            const message = document.getElementById('customer-message').value;
            const dateTime = new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });

            let whatsappMessage = `*New Order from Website* 🎉\n\n`;
            whatsappMessage += `*Name:* ${name}\n`;
            whatsappMessage += `*Item:* ${item}\n`;
            whatsappMessage += `*Date & Time:* ${dateTime}\n\n`;
            whatsappMessage += `*Message:*\n${message}`;

            const whatsappUrl = `https://wa.me/94702001859?text=${encodeURIComponent(whatsappMessage)}`;

            window.open(whatsappUrl, '_blank');
        });
    }
});

// tsParticles ක්‍රියාත්මක කිරීම
(async () => {
    await tsParticles.load({
        id: "tsparticles",
        options: {
            // පසුබිම
            background: {
                color: {
                    value: "#121212" // ඔබගේ වෙබ් අඩවියේ පසුබිම් වර්ණය
                },
            },
            // අංශු (Particles)
            particles: {
                number: {
                    value: 160, // අංශු ගණන (noise effect එකට වැඩි අගයක්)
                    density: {
                        enable: true,
                    },
                },
                color: {
                    value: "#666" // අංශුවල අළු පැහැය
                },
                shape: {
                    type: "circle",
                },
                opacity: {
                    value: { min: 0.1, max: 0.5 }, // විනිවිදභාවය
                },
                size: {
                    value: { min: 1, max: 2.5 }, // අංශුවල කුඩා ප්‍රමාණය
                },
                links: {
                    enable: false, // අංශු අතර සම්බන්ධතා ඉවත් කිරීම
                },
                move: {
                    enable: true,
                    speed: 0.5, // ඉතා සෙමින් චලනය වීමට
                    direction: "none",
                    outModes: {
                        default: "out",
                    },
                },
            },
            // Interactive බව
            interactivity: {
                events: {
                    onHover: {
                        enable: true,
                        mode: "repulse", // mouse pointer එකට අංශු විකර්ෂණය වීම
                    },
                },
                modes: {
                    repulse: {
                        distance: 60,
                        duration: 0.4,
                    },
                },
            },
            detectRetina: true,
        },
    });

    // --- Chatbot Logic (Advanced Version) --- [English]
    const chatbotButton = document.getElementById('chatbot-button');
    const chatbotPanel = document.querySelector('.chatbot-panel');
    const chatbotClose = document.querySelector('.chatbot-close');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn'); // ID එක script.js එකේ 'send-btn' ලෙස තිබුනත්, HTML එකේ 'send-btn' ID එක chatbot එකට අදාල එකක් නොවේ. මම chatbot එකේ ID එකට අදාලව සකසමි.
    // HTML එකේ chatbot send button එකට ID එකක් නැති නිසා, මම එය මෙසේ තෝරාගනිමි:
    const chatbotSendBtn = chatbotPanel.querySelector('.chatbot-input button');

    if (chatbotButton && chatbotPanel && chatbotClose && chatbotMessages && userInput && chatbotSendBtn) {
        let currentState = 'initial';

        // පරිශීලකයා type කර send කලවිට ක්‍රියාත්මක වන function එක (Requirement #3)
        const handleUserSendMessage = () => {
            const message = userInput.value.trim();
            if (message === '') return;

            addUserMessage(message);
            userInput.value = '';

            // Hide explain cards when user starts chatting
            const explainContainer = document.getElementById('chatbot-explain');
            if (explainContainer) explainContainer.classList.add('hide');

            // --- WhatsApp Logic ---
            const dateTime = new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });
            const whatsappMessage = `*Chatbot Inquiry* 🤖\n\n*Message:* ${message}\n*Date:* ${dateTime}`;
            const whatsappUrl = `https://wa.me/94702001859?text=${encodeURIComponent(whatsappMessage)}`;

            // WhatsApp එක නව tab එකකින් විවෘත කිරීම
            window.open(whatsappUrl, '_blank');
            // --- End WhatsApp Logic ---

            setTimeout(() => {
                addBotMessage("Your message has been sent to our support team. Thank you!", () => {
                    setTimeout(showResetButton, 1000);
                });
            }, 1000);
        };

        // Chatbot එක විවෘත කිරීම සහ වැසීම
        chatbotButton.addEventListener('click', () => {
            chatbotPanel.classList.toggle('active');

            // Hide explain cards when chatbot is opened
            const explainContainer = document.getElementById('chatbot-explain');
            if (explainContainer) explainContainer.classList.add('hide');

            if (chatbotPanel.classList.contains('active') && chatbotMessages.children.length === 0) {
                showInitialMessages();
            }
        });

        chatbotClose.addEventListener('click', () => {
            chatbotPanel.classList.remove('active');
        });

        // Send button සහ Enter key එකට event listeners
        chatbotSendBtn.addEventListener('click', handleUserSendMessage);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleUserSendMessage();
            }
        });

        // --- Helper Functions (සහායක Functions) ---

        // Chat එක ස්වයංක්‍රීයව පහළට scroll කිරීම
        const scrollToBottom = () => {
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        };

        // Bot ගේ පණිවිඩ chat එකට එකතු කිරීම (Advance Thinking Animation සමග)
        const addBotMessage = (text, callback) => {
            const messageElement = document.createElement('div');
            messageElement.className = 'bot-message message';
            // "Advance Thinking Animation" (Requirement #5)
            messageElement.innerHTML = '<div class="thinking"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>';
            chatbotMessages.appendChild(messageElement);
            scrollToBottom();

            const typingTime = Math.min(text.length * 30, 1500) + 500; // සිතීමේ කාලය

            setTimeout(() => {
                messageElement.innerHTML = text; // සැබෑ පණිවිඩය පෙන්වීම
                scrollToBottom();
                if (callback) callback();
            }, typingTime);
        };

        // User ගේ පණිවිඩ chat එකට එකතු කිරීම
        const addUserMessage = (text) => {
            const messageElement = document.createElement('div');
            messageElement.className = 'user-message message';
            messageElement.textContent = text;
            chatbotMessages.appendChild(messageElement);
            scrollToBottom();
        };

        // Dynamic buttons හෝ cards එකතු කිරීම
        const addDynamicBotMessage = (html, selector, event, handler) => {
            const container = document.createElement('div');
            container.className = 'bot-message message';
            container.innerHTML = '<div class="thinking"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>';
            chatbotMessages.appendChild(container);
            scrollToBottom();

            setTimeout(() => {
                container.innerHTML = html;
                container.querySelectorAll(selector).forEach(el => {
                    el.addEventListener(event, handler);
                });
                scrollToBottom();
            }, 1000);
        };

        // පිටුවේ අදාල කොටසට Scroll කිරීමේ function එක (Requirement #2)
        const scrollToSection = (selector) => {
            const element = document.querySelector(selector);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Scroll කල පසු chatbot එක වැසීම
                chatbotPanel.classList.remove('active');
            } else {
                console.warn(`Scroll target ${selector} not found.`);
            }
        };

        // "නැවත අරඹන්න" (Reset) button එක පෙන්වීම (Requirement #4)
        const showResetButton = () => {
            const resetHtml = `<div class="options-list"><div class="option-item reset-btn" data-action="reset"><i class="fas fa-redo"></i> Start Over</div></div>`;
            addDynamicBotMessage(resetHtml, '.reset-btn', 'click', () => {
                chatbotMessages.innerHTML = '';
                showInitialMessages();
            });
        };

        // --- Chatbot Flow Functions (සංවාද රටා) ---

        // 1. ආරම්භක පණිවිඩ (Requirement #1)
        const showInitialMessages = () => {
            currentState = 'initial';
            addBotMessage("Welcome to our main website. Please select the service you need.", () => {
                setTimeout(showMainCategories, 1000);
            });
        };

        // 2. ප්‍රධාන Categories පෙන්වීම (Requirement #1)
        const showMainCategories = () => {
            currentState = 'categories';
            const cardsHtml = `
            <div class="category-cards">
                <div class="category-card" data-service="web-nav"><i class="fas fa-compass"></i><span>Web Navigator</span></div>
                <div class="category-card" data-service="graphic-design"><i class="fas fa-paint-brush"></i><span>Graphic Design</span></div>
                <div class="category-card" data-service="it-service"><i class="fas fa-laptop-code"></i><span>IT Service</span></div>
                <div class="category-card" data-service="other-service"><i class="fas fa-concierge-bell"></i><span>Other Service</span></div>
                <div class="category-card" data-service="about-us"><i class="fas fa-info-circle"></i><span>About Us</span></div>
            </div>`;
            addDynamicBotMessage(cardsHtml, '.category-card', 'click', (e) => {
                handleMainCategorySelection(e.currentTarget.dataset.service);
            });
        };

        // 3. ප්‍රධාන Category එකක් තේරූ විට
        const handleMainCategorySelection = (service) => {
            const serviceCard = document.querySelector(`.category-card[data-service="${service}"]`);
            if (serviceCard) {
                addUserMessage(serviceCard.textContent.trim());
            }
            document.querySelector('.category-cards')?.parentElement.remove();

            switch (service) {
                case 'web-nav':
                    showWebNavOptions();
                    break;
                case 'graphic-design':
                    showGraphicDesignOptions();
                    break;
                case 'it-service':
                    showITServiceOptions();
                    break;
                case 'other-service':
                    // "Other Service" සඳහා පැවති 'consulting' logic එක (Requirement #4)
                    addBotMessage("We are happy to assist you. Please describe your issue or question.", showConsultingInput);
                    break;
                case 'about-us':
                    // "About Us" සඳහා නව logic එක (Requirement #4 & #5)
                    showAboutUsOptions();
                    break;
            }
        };

        // 4. "Web Navigator" Options (Requirement #2)
        const showWebNavOptions = () => {
            currentState = 'web-nav-options';
            const optionsHtml = `
            <div class="options-list">
                <div class="option-item" data-action="scroll" data-target="#home"><i class="fas fa-home"></i> Home</div>
                <div class="option-item" data-action="link" data-target="https://sites.google.com/view/janithgraphicstudio/services"><i class="fas fa-briefcase"></i> Service</div>
                <div class="option-item" data-action="scroll" data-target="#portfolio"><i class="fas fa-image"></i> Portfolio</div>
                <div class="option-item" data-action="link" data-target="https://sites.google.com/view/janithgraphicstudio/shop"><i class="fas fa-shopping-cart"></i> Shop</div>
                <div class="option-item" data-action="scroll" data-target="#about-me"><i class="fas fa-user"></i> Designer</div>
                <div class="option-item" data-action="scroll" data-target="#about-me"><i class="fas fa-info-circle"></i> About Us</div>
            </div>`;
            addDynamicBotMessage(optionsHtml, '.option-item', 'click', (e) => {
                const target = e.currentTarget.dataset.target;
                const action = e.currentTarget.dataset.action;

                addUserMessage(e.currentTarget.textContent.trim());
                document.querySelector('.options-list')?.parentElement.remove();

                if (action === 'scroll') {
                    addBotMessage(`Taking you to ${target.substring(1)} section...`, () => {
                        scrollToSection(target);
                        setTimeout(showResetButton, 500);
                    });
                } else {
                    addBotMessage(`Opening link...`, () => {
                        window.open(target, '_blank');
                        setTimeout(showResetButton, 500);
                    });
                }
            });
        };

        // 5. "Graphic Design Service" Options (Requirement #2)

        // --- Show Chatbot Explain Cards ---
        setTimeout(() => {
            const exp1 = document.getElementById('exp-card-1');
            const exp2 = document.getElementById('exp-card-2');
            if (exp1) exp1.classList.add('show');
            if (exp2) setTimeout(() => exp2.classList.add('show'), 500);
        }, 2000);
        const showGraphicDesignOptions = () => {
            currentState = 'graphic-design-options';
            const optionsHtml = `
            <div class="options-list">
                <div class="option-item" data-action="link" data-target="https://sites.google.com/view/janithgraphicstudio/home"><i class="fas fa-book"></i> Our Services</div>
                <div class="option-item" data-action="scroll" data-target="#portfolio"><i class="fas fa-eye"></i> View Our Designs</div>
                <div class="option-item" data-action="scroll" data-target="#projects"><i class="fas fa-project-diagram"></i> View Our Projects</div>
                <div class="option-item" data-action="scroll" data-target="#company-branding"><i class="fas fa-building"></i> Learn about Professional Services</div>
                <div class="option-item" data-action="scroll" data-target="#about-me"><i class="fas fa-user-circle"></i> Learn About Us</div>
                <div class="option-item" data-action="link" data-target="https://sites.google.com/view/janithgraphicstudio/shop"><i class="fas fa-shopping-basket"></i> Order Services</div>
            </div>`;
            addDynamicBotMessage(optionsHtml, '.option-item', 'click', (e) => {
                const target = e.currentTarget.dataset.target;
                const action = e.currentTarget.dataset.action;

                addUserMessage(e.currentTarget.textContent.trim());
                document.querySelector('.options-list')?.parentElement.remove();

                if (action === 'scroll') {
                    addBotMessage(`Scrolling to ${target.substring(1)} section...`, () => {
                        scrollToSection(target);
                        setTimeout(showResetButton, 500);
                    });
                } else {
                    addBotMessage(`Opening link...`, () => {
                        window.open(target, '_blank');
                        setTimeout(showResetButton, 500);
                    });
                }
            });
        };

        // 6. "IT Service" Options (Requirement #2)
        const showITServiceOptions = () => {
            currentState = 'it-service-options';
            const optionsHtml = `
            <div class="options-list">
                <div class="option-item" data-action="link" data-target="https://sites.google.com/view/janithgraphicstudio/about"><i class="fas fa-headset"></i> Help and Support Facility</div>
                <div class="option-item" data-action="link" data-target="https://sites.google.com/view/janithgraphicstudio/home"><i class="fas fa-info"></i> About IT Service</div>
            </div>`;
            addDynamicBotMessage(optionsHtml, '.option-item', 'click', (e) => {
                const target = e.currentTarget.dataset.target;

                addUserMessage(e.currentTarget.textContent.trim());
                document.querySelector('.options-list')?.parentElement.remove();

                addBotMessage(`Opening link...`, () => {
                    window.open(target, '_blank');
                    setTimeout(showResetButton, 500);
                });
            });
        };

        // 7. "About Us" & Contact Options (Requirement #2 & #5)
        const showAboutUsOptions = () => {
            currentState = 'about-us-options';
            addBotMessage("Use the methods below to learn about us and get in touch.", () => {
                const buttonsHtml = `
            <div class="action-buttons-vertical">
                <button class="action-btn" data-action="link" data-target="https://sites.google.com/view/janithgraphicstudio/about">
                    <i class="fas fa-external-link-alt"></i> Visit About Page
                </button>
                <button class="action-btn whatsapp" data-action="link" data-target="https://wa.me/94702001859?text=Hi%20JGS%2C%20I%20need%20assistance.">
                    <i class="fab fa-whatsapp"></i> Contact via WhatsApp
                </button>
                <button class="action-btn call" data-action="link" data-target="tel:+94702001859">
                    <i class="fas fa-phone"></i> Call Us (070 200 1859)
                </button>
            </div>`;
                addDynamicBotMessage(buttonsHtml, '.action-btn', 'click', (e) => {
                    const target = e.currentTarget.dataset.target;
                    addUserMessage(e.currentTarget.textContent.trim());
                    window.open(target, (target.startsWith('tel:') ? '_self' : '_blank'));

                    // button එක click කල පසු reset button එක පෙන්වීම
                    document.querySelector('.action-buttons-vertical')?.parentElement.remove();
                    setTimeout(showResetButton, 1000);
                });
                // කිසිවක් නොකලත් reset button එක පෙන්වීම
                setTimeout(showResetButton, 5000);
            });
        };

        // 8. "Other Service" (Consulting) Input (Requirement #4)
        const showConsultingInput = () => {
            const inputHtml = `
            <p>Please write your question or problem:</p>
            <div class="chatbot-input" style="padding: 10px 0 0 0; border: none; background: transparent;">
                <input type="text" placeholder="Type your question..." id="consulting-input" style="width: 100%;">
            </div>
            <div class="action-buttons">
                <button class="action-btn whatsapp" id="send-consultation" style="margin-top: 10px;"><i class="fab fa-whatsapp"></i> Send via WhatsApp</button>
            </div>`;
            addDynamicBotMessage(inputHtml, '#send-consultation', 'click', () => {
                const input = document.getElementById('consulting-input');
                if (input && input.value.trim() !== '') {
                    const userQuery = input.value;
                    addUserMessage(userQuery);
                    // Input box එක ඉවත් කිරීම
                    document.querySelector('#consulting-input').parentElement.parentElement.remove();

                    setTimeout(() => {
                        addBotMessage("Thank you! Your question is being redirected to WhatsApp...", () => {
                            window.open(`https://wa.me/94702001859?text=${encodeURIComponent(userQuery)}`, '_blank');
                            setTimeout(showResetButton, 1000);
                        });
                    }, 500);
                }
            });
        };
    }
    // --- End of Chatbot Logic (Advanced Version) --- [English]

    // --- Package Section 'Shop Now' Button Logic ---
    const packageShopButtons = document.querySelectorAll('.package-shop-btn');

    packageShopButtons.forEach(button => {
        button.addEventListener('click', () => {
            const packageName = button.dataset.packageName;
            const now = new Date();
            const dateTime = now.toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });

            let whatsappMessage = `Package Buy\n\n`;
            whatsappMessage += `Package : ${packageName}\n`;
            whatsappMessage += `Powerd by JGS LANKA Co.\n`;
            whatsappMessage += `${dateTime}`;

            const whatsappUrl = `https://wa.me/94702001859?text=${encodeURIComponent(whatsappMessage)}`;

            window.open(whatsappUrl, '_blank');
        });
    });
    // --- Standalone Service Launcher Toggle (FINAL CORRECTED VERSION) ---
    const launcherContainer = document.querySelector('.jgs-service-launcher');
    const launcherToggle = document.getElementById('service-launcher-toggle');
    const launcherPopup = document.getElementById('service-launcher-popup');
    const launcherClose = document.getElementById('launcher-popup-close');

    if (launcherContainer && launcherToggle && launcherPopup && launcherClose) {

        // Open the popup
        launcherToggle.addEventListener('click', (event) => {
            event.stopPropagation();
            launcherPopup.classList.toggle('active');
        });

        // Close with the 'X' button
        launcherClose.addEventListener('click', () => {
            launcherPopup.classList.remove('active');
        });

        // Close by clicking anywhere outside the launcher container (button AND popup)
        document.addEventListener('click', (event) => {
            if (launcherPopup.classList.contains('active') && !launcherContainer.contains(event.target)) {
                launcherPopup.classList.remove('active');
            }
        });
    }

    // --- Portfolio Price Popup Logic ---
    // priceDetailsData is now loaded synchronously via details.js

    window.showPricePopup = function (event, button) {
        event.preventDefault();
        event.stopPropagation();

        const itemId = button.getAttribute('data-item');
        const popup = document.getElementById('price-popup');

        // Use window.priceDetailsData loaded from details.js
        if (!window.priceDetailsData || !window.priceDetailsData[itemId]) {
            console.warn('Details not found for item:', itemId);
            return;
        } else {
            const details = window.priceDetailsData[itemId];

            // Update content
            document.getElementById('price-popup-title').textContent = details.title;
            document.getElementById('price-popup-range').textContent = details.priceRange;
            document.getElementById('price-popup-desc').textContent = details.description;

            // Set WhatsApp link message
            const waLink = document.querySelector('.price-popup-buy-btn');
            waLink.style.display = 'block';
            const message = `I would like to order: ${details.title}\nPrice Range: ${details.priceRange}`;
            waLink.href = `https://wa.me/94702001859?text=${encodeURIComponent(message)}`;
        }

        // Position popup above the button like a chat bubble
        popup.style.display = 'flex'; // make sure it's display flex before measuring
        const btnRect = button.getBoundingClientRect();

        let topPos = btnRect.top + window.scrollY - popup.offsetHeight - 15; // 15px above for arrow space
        let leftPos = btnRect.right - 280 + window.scrollX; // Align right side with button (280px is popup width)

        // Prevent overflowing left edge
        if (leftPos < 10) {
            leftPos = 10;
        }
        // Prevent overflowing top edge
        if (topPos < window.scrollY + 10) {
            topPos = btnRect.bottom + window.scrollY + 15; // Show below if no space above
            // Hide the default arrow and show top arrow (advanced css needed, or just let it be)
        }

        popup.style.top = `${topPos}px`;
        popup.style.left = `${leftPos}px`;

        popup.classList.add('active');
    };

    window.closePricePopup = function () {
        const popup = document.getElementById('price-popup');
        popup.classList.remove('active');
    };

    // Close popup when clicking outside
    document.addEventListener('click', function (event) {
        const popup = document.getElementById('price-popup');
        if (popup.classList.contains('active')) {
            // Check if click was outside the popup and not on a buy button
            const isClickInside = popup.contains(event.target);
            const isBuyBtnClick = event.target.closest('.buy-btn');
            if (!isClickInside && !isBuyBtnClick) {
                closePricePopup();
            }
        }
    });

    // --- Company Branding Section (New) ---

    // Swiper Sliders දෙක initialize කිරීම
    const brandSwiper = initLoopingSwiper('.branding-slider-brand', {
        loop: true,
        speed: 600,
        centeredSlides: true,
        slidesPerView: 'auto', // CSS එකෙන් පළල පාලනය කිරීමට

        // --- AUTOPLAY (අලුතින් එක් කරන ලදී) ---
        autoplay: {
            delay: 3000, // තත්පර 3 කට වරක්
            disableOnInteraction: false, // පරිශීලකයා click/drag කල පසුවත් play වීමට
        },
        // -------------------------------------

        navigation: {
            nextEl: '.brand-next',
            prevEl: '.brand-prev',
        },
        grabCursor: true,
        breakpoints: {
            // Mobile (default)
            320: {
                spaceBetween: 15
            },
            // Desktop
            768: {
                spaceBetween: 30
            }
        }
    }, 6);

    const logoSwiper = initLoopingSwiper('.branding-slider-logo', {
        loop: true,
        speed: 600,
        centeredSlides: true,
        slidesPerView: 'auto', // CSS එකෙන් පළල පාලනය කිරීමට

        // --- AUTOPLAY (අලුතින් එක් කරන ලදී) ---
        autoplay: {
            delay: 3000, // තත්පර 3 කට වරක්
            disableOnInteraction: false, // පරිශීලකයා click/drag කල පසුවත් play වීමට
        },
        // -------------------------------------

        navigation: {
            nextEl: '.logo-next',
            prevEl: '.logo-prev',
        },
        grabCursor: true,
        breakpoints: {
            // Mobile (default)
            320: {
                spaceBetween: 15
            },
            // Desktop
            768: {
                spaceBetween: 30
            }
        }
    }, 6);

    // Tab ක්‍රියාකාරීත්වය
    const tabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.branding-tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // සියලු active class ඉවත් කිරීම
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // click කල tab එක සහ ඊට අදාල content එක active කිරීම
            tab.classList.add('active');
            const contentId = tab.dataset.tab;
            document.getElementById(contentId).classList.add('active');

            // අලුතින් පෙන්වූ Swiper එක update කිරීම (මානයන් නිවැරදිව ගණනය වීමට)
            if (contentId === 'brand-content') {
                brandSwiper.update();
            } else if (contentId === 'logo-content') {
                logoSwiper.update();
            }
        });
    });

    // Lightbox (පින්තූර විශාල කර බැලීමේ) ක්‍රියාකාරීත්වය
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    // Slider දෙකේම ඇති සියලුම පින්තූර තෝරා ගැනීම
    const sliderImages = document.querySelectorAll('#company-branding .swiper-slide img');

    sliderImages.forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightbox.style.display = 'flex';
        });
    });

    // Lightbox එක වැසීමට
    const closeLightbox = () => {
        lightbox.style.display = 'none';
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) { // අඳුරු overlay එක click කල විට පමණක් වැසීමට
            closeLightbox();
        }
    });
})();

/**
 * --- JGS Powerful Search Engine Logic ---
 */
(function () {
    const searchOverlay = document.getElementById('search-overlay');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const searchOpenBtn = document.getElementById('search-open-btn');
    const searchCloseBtn = document.getElementById('search-close-btn');
    const searchClearBtn = document.getElementById('search-clear-btn');

    let searchIndex = [];

    // 1. Build Search Index
    function buildIndex() {
        searchIndex = [];

        // Index Sections
        document.querySelectorAll('section[id], header[id]').forEach(section => {
            const id = section.getAttribute('id');
            const title = section.querySelector('.section-title, .hero-title')?.innerText || id;
            const desc = section.querySelector('.project-intro, .hero-description')?.innerText || '';

            searchIndex.push({
                type: 'Section',
                title: title.trim(),
                desc: desc.trim().substring(0, 100) + '...',
                target: `#${id}`,
                icon: 'fa-layer-group'
            });
        });

        // Index Portfolio Cards
        document.querySelectorAll('.portfolio-card').forEach(card => {
            const title = card.querySelector('.portfolio-title')?.innerText || '';
            const desc = card.querySelector('.portfolio-description')?.innerText || '';
            const link = card.querySelector('a')?.getAttribute('href') || '#';

            if (title) {
                searchIndex.push({
                    type: 'Portfolio',
                    title: title.trim(),
                    desc: desc.trim().substring(0, 100) + '...',
                    target: link,
                    icon: 'fa-briefcase'
                });
            }
        });

        // Index Pricing/FAQ Items
        document.querySelectorAll('.accordion-item').forEach(item => {
            const title = item.querySelector('.accordion-header')?.innerText || '';
            const content = item.querySelector('.accordion-content')?.innerText || '';

            if (title) {
                searchIndex.push({
                    type: 'Info/FAQ',
                    title: title.trim(),
                    desc: content.trim().substring(0, 100) + '...',
                    target: '#price', // Generic target for price/faq
                    icon: 'fa-question-circle'
                });
            }
        });
    }

    // 2. Open / Close Search
    function toggleSearch(show) {
        if (show) {
            searchOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
            setTimeout(() => searchInput.focus(), 300);
            if (searchIndex.length === 0) buildIndex();
        } else {
            searchOverlay.classList.remove('active');
            document.body.style.overflow = '';
            searchInput.value = '';
            renderResults([]);
        }
    }

    // 3. Render Results
    function renderResults(results) {
        if (results.length === 0) {
            if (searchInput.value.trim() === '') {
                searchResults.innerHTML = `
                    <div class="search-empty-state">
                        <i class="fas fa-search"></i>
                        <p>Start typing to search across the portfolio...</p>
                    </div>`;
            } else {
                searchResults.innerHTML = `
                    <div class="search-empty-state">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>No results found for "${searchInput.value}"</p>
                    </div>`;
            }
            return;
        }

        searchResults.innerHTML = results.map((res, index) => `
            <a href="${res.target}" class="search-item" style="animation-delay: ${index * 0.05}s">
                <div class="search-item-icon">
                    <i class="fas ${res.icon}"></i>
                </div>
                <div class="search-item-info">
                    <span class="search-item-title">${res.title}</span>
                    <span class="search-item-desc">${res.desc}</span>
                </div>
                <i class="fas fa-chevron-right" style="opacity: 0.3"></i>
            </a>
        `).join('');

        // Add click events to close overlay on navigation
        searchResults.querySelectorAll('.search-item').forEach(item => {
            item.addEventListener('click', () => toggleSearch(false));
        });
    }

    // 4. Search Execution
    function performSearch(query) {
        query = query.toLowerCase().trim();
        if (query.length < 2) {
            renderResults([]);
            searchClearBtn.classList.remove('active');
            return;
        }

        searchClearBtn.classList.add('active');

        const filtered = searchIndex.filter(item =>
            item.title.toLowerCase().includes(query) ||
            item.desc.toLowerCase().includes(query) ||
            item.type.toLowerCase().includes(query)
        );

        renderResults(filtered);
    }

    // Event Listeners
    if (searchOpenBtn) searchOpenBtn.addEventListener('click', () => toggleSearch(true));
    if (searchCloseBtn) searchCloseBtn.addEventListener('click', () => toggleSearch(false));
    if (searchClearBtn) {
        searchClearBtn.addEventListener('click', () => {
            searchInput.value = '';
            performSearch('');
            searchInput.focus();
        });
    }

    searchInput.addEventListener('input', (e) => performSearch(e.target.value));

    // Shortcut: ESC to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            toggleSearch(false);
        }
    });

    // Touch support improvement for mobile close
    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) toggleSearch(false);
    });
})();
