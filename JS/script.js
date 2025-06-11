document.addEventListener('DOMContentLoaded', () => {
    // Select all anchor links with a hash
    const anchorLinks = document.querySelectorAll('a[href*="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Prevent default anchor behavior
            e.preventDefault();

            // Get the target element's ID from the href
            const targetId = link.getAttribute('href').split('#')[1];
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Scroll to the target element with smooth behavior
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            } else if (link.getAttribute('href') === `#${targetId}`) {
                // If the target is on the same page but not found, scroll to top
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Desktop menu functionality
    const menuItems = document.querySelectorAll('.megaMenu > li.has-submenu');
    let activeSubmenu = null;
    let timeout = null;
    let lastHoveredMenu = null;

    // Function to remove all animation classes
    const removeAnimationClasses = (submenu) => {
        submenu.classList.remove('submenu-enter', 'submenu-exit', 'submenu-slide-left-to-right', 'submenu-slide-right-to-left');
    };

    // Function to update ARIA attributes
    const updateAriaAttributes = (item, isExpanded) => {
        const link = item.querySelector('a');
        link.setAttribute('aria-expanded', isExpanded);
    };

    // Function to show submenu with animation
    const showSubmenu = (submenu, item, menuText) => {
        clearTimeout(timeout);

        if (activeSubmenu && activeSubmenu !== submenu) {
            // Close previous submenu
            const prevMenuText = lastHoveredMenu?.querySelector('a').textContent.trim();
            removeAnimationClasses(activeSubmenu);
            activeSubmenu.classList.add('submenu-exit');
            updateAriaAttributes(lastHoveredMenu, false);

            setTimeout(() => {
                activeSubmenu.classList.remove('active', 'submenu-exit');

                // Show new submenu with appropriate animation
                removeAnimationClasses(submenu);
                if (prevMenuText === 'Projects' && menuText === 'Services') {
                    submenu.classList.add('submenu-slide-left-to-right');
                } else if (prevMenuText === 'Services' && menuText === 'Projects') {
                    submenu.classList.add('submenu-slide-right-to-left');
                } else {
                    submenu.classList.add('submenu-enter');
                }
                submenu.classList.add('active');
                updateAriaAttributes(item, true);
            }, 500);
        } else {
            // Show submenu for the first time
            removeAnimationClasses(submenu);
            submenu.classList.add('submenu-enter', 'active');
            updateAriaAttributes(item, true);
        }

        activeSubmenu = submenu;
        lastHoveredMenu = item;
    };

    // Function to hide submenu
    const hideSubmenu = (submenu, item, delay = 1000) => {
        timeout = setTimeout(() => {
            if (submenu && submenu.classList.contains('active')) {
                removeAnimationClasses(submenu);
                submenu.classList.add('submenu-exit');
                updateAriaAttributes(item, false);

                setTimeout(() => {
                    submenu.classList.remove('active', 'submenu-exit');
                    if (activeSubmenu === submenu) {
                        activeSubmenu = null;
                        lastHoveredMenu = null;
                    }
                }, 1000);
            }
        }, delay);
    };

    menuItems.forEach(item => {
        const submenu = item.querySelector('.submenu');
        const menuText = item.querySelector('a').textContent.trim();

        if (submenu) {
            // Show submenu on hover over parent li
            item.addEventListener('mouseenter', () => {
                showSubmenu(submenu, item, menuText);
            });

            // Hide submenu when leaving parent li
            item.addEventListener('mouseleave', () => {
                hideSubmenu(submenu, item);
            });

            // Keep submenu open when hovering over it
            submenu.addEventListener('mouseenter', () => {
                clearTimeout(timeout);
            });

            // Hide submenu when leaving submenu
            submenu.addEventListener('mouseleave', () => {
                hideSubmenu(submenu, item, 1000);
            });
        }
    });

    // Close any open submenu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.megaMenu')) {
            if (activeSubmenu) {
                removeAnimationClasses(activeSubmenu);
                activeSubmenu.classList.add('submenu-exit');
                updateAriaAttributes(lastHoveredMenu, false);
                setTimeout(() => {
                    activeSubmenu.classList.remove('active', 'submenu-exit');
                    activeSubmenu = null;
                    lastHoveredMenu = null;
                }, 1000);
            }
        }
    });

    // Mobile menu functionality
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const body = document.body;

    // Mobile submenu variables
    const mobileMenuItems = document.querySelectorAll('.mobile-menu-item');
    let activeMobileSubmenu = null;
    let mobileTimeout = null;
    let lastHoveredMobileMenu = null;

    // Function to remove all mobile animation classes
    const removeMobileAnimationClasses = (submenu) => {
        submenu.classList.remove('submenu-enter', 'submenu-exit', 'submenu-slide-left-to-right', 'submenu-slide-right-to-left');
    };

    // Function to close mobile menu and submenus
    const closeMobileMenu = () => {
        mobileToggle.classList.remove('active');
        mobileNavOverlay.classList.remove('active');
        body.style.overflow = '';

        if (activeMobileSubmenu) {
            removeMobileAnimationClasses(activeMobileSubmenu);
            activeMobileSubmenu.classList.remove('active');
            lastHoveredMobileMenu?.classList.remove('active');
            activeMobileSubmenu = null;
            lastHoveredMobileMenu = null;
        }
    };

    // Mobile submenu functionality
    mobileMenuItems.forEach(item => {
        const submenuId = item.getAttribute('data-submenu');
        const submenu = document.getElementById(`mobile-submenu-${submenuId}`);
        const menuText = item.querySelector('.mobile-menu-label').textContent.trim();

        if (submenu) {
            // Click handler for mobile menu items
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                clearTimeout(mobileTimeout);

                // If clicking the same item that's already active, close it
                if (activeMobileSubmenu === submenu && submenu.classList.contains('active')) {
                    removeMobileAnimationClasses(submenu);
                    submenu.classList.add('submenu-exit');
                    item.classList.remove('active');

                    setTimeout(() => {
                        submenu.classList.remove('active', 'submenu-exit');
                        activeMobileSubmenu = null;
                        lastHoveredMobileMenu = null;
                    }, 400);
                    return;
                }

                // If there's another active submenu, close it first
                if (activeMobileSubmenu && activeMobileSubmenu !== submenu) {
                    const prevMenuText = lastHoveredMobileMenu?.querySelector('.mobile-menu-label').textContent.trim();
                    const prevItem = lastHoveredMobileMenu;

                    removeMobileAnimationClasses(activeMobileSubmenu);
                    activeMobileSubmenu.classList.add('submenu-exit');
                    prevItem.classList.remove('active');

                    setTimeout(() => {
                        activeMobileSubmenu.classList.remove('active', 'submenu-exit');
                    }, 400);

                    // Apply slide animations based on menu transition
                    if (prevMenuText === 'Projects' && menuText === 'Services') {
                        submenu.classList.add('submenu-slide-left-to-right');
                    } else if (prevMenuText === 'Services' && menuText === 'Projects') {
                        submenu.classList.add('submenu-slide-right-to-left');
                    } else {
                        submenu.classList.add('submenu-enter');
                    }
                } else {
                    submenu.classList.add('submenu-enter');
                }

                // Activate the new submenu
                submenu.classList.add('active');
                item.classList.add('active');
                activeMobileSubmenu = submenu;
                lastHoveredMobileMenu = item;
            });

            // Close submenu when clicking outside
            submenu.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    });

    // Close mobile submenus when clicking elsewhere in the overlay
    mobileNavOverlay.addEventListener('click', (e) => {
        if (e.target === mobileNavOverlay || !e.target.closest('.mobile-submenu')) {
            if (activeMobileSubmenu) {
                removeMobileAnimationClasses(activeMobileSubmenu);
                activeMobileSubmenu.classList.add('submenu-exit');
                lastHoveredMobileMenu?.classList.remove('active');

                setTimeout(() => {
                    activeMobileSubmenu.classList.remove('active', 'submenu-exit');
                    activeMobileSubmenu = null;
                    lastHoveredMobileMenu = null;
                }, 400);
            }

            // Close main mobile menu
            if (e.target === mobileNavOverlay) {
                closeMobileMenu();
            }
        }
    });

    // Close mobile menu when clicking any link within mobileNavOverlay
    const mobileLinks = mobileNavOverlay.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Allow default link behavior (e.g., navigation or anchor scrolling)
            // Close the mobile menu and submenus
            closeMobileMenu();
        });
    });

    // Toggle mobile menu
    mobileToggle.addEventListener('click', () => {
        const isActive = mobileToggle.classList.contains('active');

        if (isActive) {
            closeMobileMenu();
        } else {
            // Open menu
            mobileToggle.classList.add('active');
            mobileNavOverlay.classList.add('active');
            body.style.overflow = 'hidden';
        }
    });

    // Close mobile menu on window resize if screen becomes large
    window.addEventListener('resize', () => {
        if (window.innerWidth > 968) {
            closeMobileMenu();
        }
    });

    // Prevent body scroll when mobile menu is open
    mobileNavOverlay.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });

    // Handle escape key to close mobile menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNavOverlay.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Scroll Popup JavaScript
    (function () {
        'use strict';

        // Configuration
        const SCROLL_DURATION = 3000; // 5 seconds in milliseconds
        const POPUP_SHOWN_KEY = 'yahiaScrollPopupShown';

        // State variables
        let scrollStartTime = null;
        let isScrolling = false;
        let scrollTimer = null;
        let popupShown = sessionStorage.getItem(POPUP_SHOWN_KEY) === 'true';

        // Get popup elements
        const overlay = document.getElementById('yahiaScrollPopupOverlay');
        const closeButton = document.getElementById('yahiaScrollPopupClose');

        // Show popup
        function showPopup() {
            if (popupShown || !overlay) return;

            overlay.classList.add('yahia-popup-active');
            popupShown = true;
            sessionStorage.setItem(POPUP_SHOWN_KEY, 'true');
        }

        // Hide popup
        function hidePopup() {
            if (overlay) {
                overlay.classList.remove('yahia-popup-active');
            }
        }

        // Add event listeners for closing popup
        function addCloseEventListeners() {
            if (closeButton) {
                closeButton.addEventListener('click', hidePopup, { once: true });
            }

            if (overlay) {
                overlay.addEventListener('click', function (e) {
                    if (e.target === overlay) {
                        hidePopup();
                    }
                }, { once: true });
            }

            // Close with Escape key
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && overlay && overlay.classList.contains('yahia-popup-active')) {
                    hidePopup();
                }
            }, { once: true });
        }

        // Handle scroll events
        function handleScroll() {
            if (popupShown) return;

            const currentTime = Date.now();

            if (!isScrolling) {
                scrollStartTime = currentTime;
                isScrolling = true;
            }

            // Clear existing timer
            if (scrollTimer) {
                clearTimeout(scrollTimer);
            }

            // Check if user has been scrolling for the required duration
            if (currentTime - scrollStartTime >= SCROLL_DURATION) {
                showPopup();
                isScrolling = false;
                scrollStartTime = null;
                return;
            }

            // Reset scrolling state if no scroll for 200ms
            scrollTimer = setTimeout(function () {
                isScrolling = false;
                scrollStartTime = null;
            }, 200);
        }

        // Throttle function to limit scroll event frequency
        function throttle(func, limit) {
            let inThrottle;
            return function () {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => (inThrottle = false), limit);
                }
            };
        }

        // Initialize popup
        function initPopup() {
            if (overlay && closeButton) {
                addCloseEventListeners();
                const throttledScrollHandler = throttle(handleScroll, 100);
                window.addEventListener('scroll', throttledScrollHandler, { passive: true });
                window.addEventListener('touchmove', throttledScrollHandler, { passive: true });
            }
        }

        // Initialize when DOM is ready
        initPopup();
    })();
});

// Smooth scroll function
function scrollToNext() {
    window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
    });
}

// Add hover effect to CTA buttons
const ctaButtons = document.querySelectorAll('.cta-btn');
ctaButtons.forEach(btn => {
    btn.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-2px) scale(1.02)';
    });

    btn.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});
