class GlassNavbar extends BaseGlassComponent {
    constructor(element, options = {}) {
        super(element, options);
    }

    getDefaultOptions() {
        return {
            position: 'fixed', // fixed, sticky, static
            placement: 'top', // top, bottom
            transparent: true,
            scrollEffect: true,
            hideOnScroll: false,
            brand: null,
            items: [],
            mobileBreakpoint: 768,
            mobileMenu: true,
            searchable: false,
            onScroll: null,
            onItemClick: null
        };
    }

    createElement() {
        if (!this.element) {
            this.element = document.createElement('nav');
        }
        
        this.element.classList.add('liquid-glass-navbar');
        this.setupStructure();
        this.setupScrollHandler();
        this.setupMobileMenu();
    }

    setupStructure() {
        this.element.innerHTML = '';
        
        // Create navbar container
        this.container = document.createElement('div');
        this.container.className = 'navbar-container';
        
        // Create brand section
        if (this.options.brand) {
            this.createBrand();
        }
        
        // Create navigation items
        this.createNavItems();
        
        // Create mobile toggle
        if (this.options.mobileMenu) {
            this.createMobileToggle();
        }
        
        // Create search if enabled
        if (this.options.searchable) {
            this.createSearch();
        }
        
        this.element.appendChild(this.container);
    }

    createBrand() {
        this.brandElement = document.createElement('div');
        this.brandElement.className = 'navbar-brand';
        
        if (typeof this.options.brand === 'string') {
            this.brandElement.innerHTML = this.options.brand;
        } else if (this.options.brand instanceof HTMLElement) {
            this.brandElement.appendChild(this.options.brand);
        }
        
        this.container.appendChild(this.brandElement);
    }

    createNavItems() {
        this.navItemsContainer = document.createElement('div');
        this.navItemsContainer.className = 'navbar-items';
        
        this.options.items.forEach((item, index) => {
            const navItem = this.createNavItem(item, index);
            this.navItemsContainer.appendChild(navItem);
        });
        
        this.container.appendChild(this.navItemsContainer);
    }

    createNavItem(item, index) {
        const navItem = document.createElement('div');
        navItem.className = 'navbar-item';
        
        if (item.type === 'dropdown') {
            navItem.classList.add('navbar-dropdown');
            navItem.innerHTML = `
                <button class="navbar-link dropdown-toggle" data-index="${index}">
                    ${item.label}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                        <path d="M6 8l-4-4h8l-4 4z"/>
                    </svg>
                </button>
                <div class="dropdown-menu">
                    ${item.items.map(subItem => `
                        <a href="${subItem.href || '#'}" class="dropdown-item" data-action="${subItem.action || ''}">
                            ${subItem.label}
                        </a>
                    `).join('')}
                </div>
            `;
        } else {
            navItem.innerHTML = `
                <a href="${item.href || '#'}" class="navbar-link" data-index="${index}" data-action="${item.action || ''}">
                    ${item.icon ? `<span class="nav-icon">${item.icon}</span>` : ''}
                    ${item.label}
                    ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
                </a>
            `;
        }
        
        // Add click handler
        const link = navItem.querySelector('.navbar-link');
        link.addEventListener('click', (e) => {
            // Prevent default navigation for all navbar links
            e.preventDefault();
            e.stopPropagation();
            
            if (this.options.onItemClick) {
                this.options.onItemClick(item, index, e);
            }
            
            // Handle dropdown items
            if (item.type === 'dropdown') {
                const dropdownItems = navItem.querySelectorAll('.dropdown-item');
                dropdownItems.forEach(dropdownItem => {
                    dropdownItem.addEventListener('click', (dropdownEvent) => {
                        dropdownEvent.preventDefault();
                        dropdownEvent.stopPropagation();
                        
                        const action = dropdownItem.getAttribute('data-action');
                        const href = dropdownItem.getAttribute('href');
                        
                        if (this.options.onItemClick) {
                            this.options.onItemClick({
                                label: dropdownItem.textContent,
                                action: action,
                                href: href
                            }, index, dropdownEvent);
                        }
                    });
                });
            }
        });
        
        return navItem;
    }

    createMobileToggle() {
        this.mobileToggle = document.createElement('button');
        this.mobileToggle.className = 'navbar-mobile-toggle';
        this.mobileToggle.innerHTML = `
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
        `;
        
        this.mobileToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });
        
        this.container.appendChild(this.mobileToggle);
    }

    createSearch() {
        this.searchContainer = document.createElement('div');
        this.searchContainer.className = 'navbar-search';
        this.searchContainer.innerHTML = `
            <div class="search-input-wrapper">
                <input type="text" placeholder="Search..." class="search-input">
                <button class="search-button">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                    </svg>
                </button>
            </div>
        `;
        
        this.container.appendChild(this.searchContainer);
    }

    setupScrollHandler() {
        if (!this.options.scrollEffect && !this.options.hideOnScroll) return;
        
        let lastScrollY = window.scrollY;
        let isScrolling = false;
        
        this.scrollHandler = () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;
                    
                    if (this.options.scrollEffect) {
                        if (currentScrollY > 50) {
                            this.element.classList.add('scrolled');
                        } else {
                            this.element.classList.remove('scrolled');
                        }
                    }
                    
                    if (this.options.hideOnScroll) {
                        if (currentScrollY > lastScrollY && currentScrollY > 100) {
                            this.element.classList.add('hidden');
                        } else {
                            this.element.classList.remove('hidden');
                        }
                    }
                    
                    if (this.options.onScroll) {
                        this.options.onScroll(currentScrollY, lastScrollY, this);
                    }
                    
                    lastScrollY = currentScrollY;
                    isScrolling = false;
                });
                
                isScrolling = true;
            }
        };
        
        window.addEventListener('scroll', this.scrollHandler, { passive: true });
    }

    setupMobileMenu() {
        if (!this.options.mobileMenu) return;
        
        this.resizeHandler = () => {
            if (window.innerWidth > this.options.mobileBreakpoint) {
                this.element.classList.remove('mobile-menu-open');
                this.navItemsContainer.style.display = '';
            }
        };
        
        window.addEventListener('resize', this.resizeHandler);
    }

    toggleMobileMenu() {
        this.element.classList.toggle('mobile-menu-open');
        
        if (this.element.classList.contains('mobile-menu-open')) {
            this.navItemsContainer.style.display = 'flex';
        } else {
            this.navItemsContainer.style.display = '';
        }
    }

    applyStyles() {
        super.applyStyles();
        
        this.element.style.position = this.options.position;
        this.element.style[this.options.placement] = '0';
        this.element.style.left = '0';
        this.element.style.right = '0';
        this.element.style.zIndex = '1000';
        this.element.style.padding = '1rem 2rem';
        this.element.style.transition = `all ${this.options.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        
        if (this.options.transparent) {
            this.element.style.background = 'rgba(255, 255, 255, 0.08)';
        }
        
        if (this.options.placement === 'bottom') {
            this.element.style.top = 'auto';
            this.element.style.bottom = '0';
            this.element.style.borderTop = '1px solid rgba(255, 255, 255, 0.1)';
            this.element.style.borderBottom = 'none';
        } else {
            this.element.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        }
    }

    addItem(item, position = -1) {
        if (position === -1) {
            this.options.items.push(item);
        } else {
            this.options.items.splice(position, 0, item);
        }
        
        const navItem = this.createNavItem(item, this.options.items.length - 1);
        
        if (position === -1) {
            this.navItemsContainer.appendChild(navItem);
        } else {
            const referenceNode = this.navItemsContainer.children[position];
            this.navItemsContainer.insertBefore(navItem, referenceNode);
        }
    }

    removeItem(index) {
        if (index >= 0 && index < this.options.items.length) {
            this.options.items.splice(index, 1);
            const navItem = this.navItemsContainer.children[index];
            if (navItem) {
                navItem.remove();
            }
        }
    }

    updateItem(index, newItem) {
        if (index >= 0 && index < this.options.items.length) {
            this.options.items[index] = newItem;
            const oldNavItem = this.navItemsContainer.children[index];
            const newNavItem = this.createNavItem(newItem, index);
            
            if (oldNavItem) {
                this.navItemsContainer.replaceChild(newNavItem, oldNavItem);
            }
        }
    }

    setBrand(brand) {
        this.options.brand = brand;
        
        if (this.brandElement) {
            if (typeof brand === 'string') {
                this.brandElement.innerHTML = brand;
            } else if (brand instanceof HTMLElement) {
                this.brandElement.innerHTML = '';
                this.brandElement.appendChild(brand);
            }
        } else if (brand) {
            this.createBrand();
        }
    }

    setActive(index) {
        // Remove active class from all items
        this.navItemsContainer.querySelectorAll('.navbar-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to specified item
        const targetLink = this.navItemsContainer.querySelector(`[data-index="${index}"]`);
        if (targetLink) {
            targetLink.classList.add('active');
        }
    }

    show() {
        this.element.style.transform = 'translateY(0)';
        this.element.classList.remove('hidden');
    }

    hide() {
        const translateY = this.options.placement === 'top' ? '-100%' : '100%';
        this.element.style.transform = `translateY(${translateY})`;
        this.element.classList.add('hidden');
    }

    destroy() {
        if (this.scrollHandler) {
            window.removeEventListener('scroll', this.scrollHandler);
        }
        
        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler);
        }
        
        super.destroy();
    }

    // Static factory methods
    static create(options = {}) {
        const element = document.createElement('nav');
        return new GlassNavbar(element, options);
    }

    static createSimple(brand, items) {
        return GlassNavbar.create({
            brand: brand,
            items: items
        });
    }

    static createWithSearch(brand, items) {
        return GlassNavbar.create({
            brand: brand,
            items: items,
            searchable: true
        });
    }

    static createScrollHide(brand, items) {
        return GlassNavbar.create({
            brand: brand,
            items: items,
            hideOnScroll: true
        });
    }
}

// Export for both CommonJS and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GlassNavbar;
} else if (typeof window !== 'undefined') {
    window.GlassNavbar = GlassNavbar;
}