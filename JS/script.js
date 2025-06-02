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

    // Mobile menu functionality remains unchanged
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
                mobileToggle.classList.remove('active');
                mobileNavOverlay.classList.remove('active');
                body.style.overflow = '';
            }
        }
    });

    // Toggle mobile menu
    mobileToggle.addEventListener('click', () => {
        const isActive = mobileToggle.classList.contains('active');

        if (isActive) {
            // Close menu and any active submenus
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
        }
    });

    // Prevent body scroll when mobile menu is open
    mobileNavOverlay.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });

    // Handle escape key to close mobile menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNavOverlay.classList.contains('active')) {
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
        }
    });
});

// Smooth scroll function
function scrollToNext() {
    window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
    });
}

// Parallax effect on scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.shape');

    shapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.1);
        shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Mouse movement effect
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.02;
        const x = (mouseX - 0.5) * speed * 100;
        const y = (mouseY - 0.5) * speed * 100;

        shape.style.transform = `translate(${x}px, ${y}px)`;
    });
});

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
// Select all project cards
const projectCards = document.querySelectorAll('.project-card');

// Create popup container
const popup = document.createElement('div');
popup.classList.add('image-popup');

// Create close button
const closeButton = document.createElement('span');
closeButton.classList.add('close-button');
closeButton.innerHTML = '&times;'; // HTML entity for '×'
popup.appendChild(closeButton);

// Create image element for popup
const popupImage = document.createElement('img');
popup.appendChild(popupImage);

// Append popup to body
document.body.appendChild(popup);

// Add click event to each project card's overlay
projectCards.forEach(card => {
    const overlay = card.querySelector('.project-overlay');
    const image = card.querySelector('.project-image img');

    overlay.addEventListener('click', () => {
        // Set the popup image source
        popupImage.src = image.src;
        popupImage.alt = image.alt;
        // Show the popup
        popup.style.display = 'flex';
    });
});

// Add click event to close button
closeButton.addEventListener('click', () => {
    popup.style.display = 'none';
});

// Close popup when clicking outside the image
popup.addEventListener('click', (e) => {
    if (e.target === popup) {
        popup.style.display = 'none';
    }
});

// Optional: Close popup with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup.style.display === 'flex') {
        popup.style.display = 'none';
    }
});
// Filter functionality
const filterButtons = document.querySelectorAll('.filter-btn');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        projectCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.6s ease-out';
            } else {
                card.style.display = 'none';
            }
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    // Get all SVG elements within project-overlay-content
    const zoomIcons = document.querySelectorAll('.project-overlay-content svg');
    const imagePopup = document.getElementById('imagePopup');
    const popupImage = document.getElementById('popupImage');
    const closePopup = document.getElementById('closePopup');

    // Add click event listener to each zoom icon
    zoomIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            // Prevent default behavior
            e.preventDefault();

            // Get the parent project card and its image
            const projectCard = icon.closest('.project-card');
            const projectImage = projectCard.querySelector('.project-image img');

            // Set the popup image source
            popupImage.src = projectImage.src;

            // Show the popup
            imagePopup.style.display = 'flex';
        });
    });

    // Close popup when clicking the close button
    closePopup.addEventListener('click', () => {
        imagePopup.style.display = 'none';
    });

    // Close popup when clicking outside the image
    imagePopup.addEventListener('click', (e) => {
        if (e.target === imagePopup) {
            imagePopup.style.display = 'none';
        }
    });

    // Close popup with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && imagePopup.style.display === 'flex') {
            imagePopup.style.display = 'none';
        }
    });
});