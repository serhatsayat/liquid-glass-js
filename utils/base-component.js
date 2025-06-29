class BaseGlassComponent {
    constructor(element, options = {}) {
        this.element = element;
        this.options = this.mergeOptions(options);
        this.isDestroyed = false;
        this.eventHandlers = new Map();
        
        this.init();
    }

    mergeOptions(customOptions) {
        const defaultOptions = {
            blur: 25,
            opacity: 0.15,
            borderRadius: 16,
            animationDuration: 300,
            scale: 1.05,
            color: 'rgba(255, 255, 255, 0.1)',
            interactive: true,
            ripple: true,
            ...this.getDefaultOptions()
        };
        
        return { ...defaultOptions, ...customOptions };
    }

    getDefaultOptions() {
        return {};
    }

    init() {
        this.createElement();
        this.applyStyles();
        if (this.options.interactive) {
            this.bindEvents();
        }
        this.onInit();
    }

    createElement() {
        // Override in child classes
    }

    applyStyles() {
        if (!this.element) return;
        
        this.element.style.backdropFilter = `blur(${this.options.blur}px)`;
        this.element.style.webkitBackdropFilter = `blur(${this.options.blur}px)`;
        this.element.style.background = this.options.color;
        this.element.style.borderRadius = `${this.options.borderRadius}px`;
        this.element.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        this.element.style.transition = `all ${this.options.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        this.element.style.boxShadow = `
            0 8px 32px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2)
        `;
    }

    bindEvents() {
        if (this.options.ripple) {
            this.addEventHandler('click', this.createRipple.bind(this));
        }
        
        this.addEventHandler('mouseenter', this.onMouseEnter.bind(this));
        this.addEventHandler('mouseleave', this.onMouseLeave.bind(this));
    }

    addEventHandler(event, handler) {
        if (!this.element || this.isDestroyed) return;
        
        this.element.addEventListener(event, handler);
        
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, []);
        }
        this.eventHandlers.get(event).push(handler);
    }

    removeEventHandlers() {
        this.eventHandlers.forEach((handlers, event) => {
            handlers.forEach(handler => {
                this.element.removeEventListener(event, handler);
            });
        });
        this.eventHandlers.clear();
    }

    createRipple(event) {
        if (!this.element || this.isDestroyed) return;
        
        const rect = this.element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        const ripple = document.createElement('div');
        ripple.className = 'liquid-glass-ripple';
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            border-radius: 50%;
            background: radial-gradient(
                circle,
                rgba(255, 255, 255, 0.4) 0%,
                rgba(255, 255, 255, 0.1) 50%,
                transparent 70%
            );
            pointer-events: none;
            animation: liquidRipple ${this.options.animationDuration * 2}ms ease-out forwards;
            transform: scale(0);
            opacity: 1;
        `;

        this.element.style.position = 'relative';
        this.element.style.overflow = 'hidden';
        this.element.appendChild(ripple);

        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.remove();
            }
        }, this.options.animationDuration * 2);
    }

    onMouseEnter() {
        if (!this.element || this.isDestroyed) return;
        
        this.element.style.transform = `scale(${this.options.scale})`;
        this.element.style.boxShadow = `
            0 16px 64px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.3)
        `;
        this.element.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    }

    onMouseLeave() {
        if (!this.element || this.isDestroyed) return;
        
        this.element.style.transform = '';
        this.element.style.boxShadow = `
            0 8px 32px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2)
        `;
        this.element.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    }

    onInit() {
        // Override in child classes
    }

    update(newOptions) {
        this.options = this.mergeOptions(newOptions);
        this.applyStyles();
    }

    show() {
        if (this.element) {
            this.element.style.display = '';
            this.element.style.opacity = '1';
        }
    }

    hide() {
        if (this.element) {
            this.element.style.opacity = '0';
            setTimeout(() => {
                if (this.element && !this.isDestroyed) {
                    this.element.style.display = 'none';
                }
            }, this.options.animationDuration);
        }
    }

    destroy() {
        if (this.isDestroyed) return;
        
        this.isDestroyed = true;
        this.removeEventHandlers();
        
        if (this.element) {
            // Remove all glass-related classes and styles
            this.element.classList.remove('liquid-glass', 'liquid-glass-morphing', 'liquid-glass-floating', 'liquid-glass-pulse');
            this.element.style.backdropFilter = '';
            this.element.style.webkitBackdropFilter = '';
            this.element.style.background = '';
            this.element.style.borderRadius = '';
            this.element.style.border = '';
            this.element.style.transition = '';
            this.element.style.boxShadow = '';
            this.element.style.transform = '';
        }
        
        this.onDestroy();
    }

    onDestroy() {
        // Override in child classes
    }
}

// Export for both CommonJS and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BaseGlassComponent;
} else if (typeof window !== 'undefined') {
    window.BaseGlassComponent = BaseGlassComponent;
}