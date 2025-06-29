class LiquidGlass {
    constructor(options = {}) {
        this.defaultOptions = {
            blur: 20,
            opacity: 0.15,
            borderRadius: 16,
            animationDuration: 300,
            scale: 1.05,
            intensity: 1,
            color: 'rgba(255, 255, 255, 0.1)'
        };
        
        this.options = { ...this.defaultOptions, ...options };
        this.elements = new Set();
        this.init();
    }

    init() {
        this.createStyleSheet();
        this.bindEvents();
    }

    createStyleSheet() {
        if (document.getElementById('liquid-glass-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'liquid-glass-styles';
        style.textContent = `
            .liquid-glass {
                position: relative;
                overflow: hidden;
                backdrop-filter: blur(${this.options.blur}px);
                -webkit-backdrop-filter: blur(${this.options.blur}px);
                background: ${this.options.color};
                border-radius: ${this.options.borderRadius}px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                transition: all ${this.options.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 
                    0 8px 32px rgba(0, 0, 0, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2);
            }

            .liquid-glass::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(
                    135deg,
                    rgba(255, 255, 255, 0.2) 0%,
                    rgba(255, 255, 255, 0.05) 50%,
                    rgba(255, 255, 255, 0.1) 100%
                );
                pointer-events: none;
                opacity: 0;
                transition: opacity ${this.options.animationDuration}ms ease;
            }

            .liquid-glass:hover {
                transform: scale(${this.options.scale});
                box-shadow: 
                    0 16px 64px rgba(0, 0, 0, 0.15),
                    inset 0 1px 0 rgba(255, 255, 255, 0.3);
                border-color: rgba(255, 255, 255, 0.3);
            }

            .liquid-glass:hover::before {
                opacity: 1;
            }

            .liquid-glass-ripple {
                position: absolute;
                border-radius: 50%;
                background: radial-gradient(
                    circle,
                    rgba(255, 255, 255, 0.4) 0%,
                    rgba(255, 255, 255, 0.1) 50%,
                    transparent 70%
                );
                pointer-events: none;
                animation: liquidRipple ${this.options.animationDuration * 2}ms ease-out forwards;
            }

            @keyframes liquidRipple {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(4);
                    opacity: 0;
                }
            }

            .liquid-glass-morphing {
                animation: liquidMorph 2s ease-in-out infinite alternate;
            }

            @keyframes liquidMorph {
                0% {
                    border-radius: ${this.options.borderRadius}px;
                    transform: rotate(0deg);
                }
                25% {
                    border-radius: ${this.options.borderRadius * 1.5}px ${this.options.borderRadius * 0.5}px;
                    transform: rotate(1deg);
                }
                50% {
                    border-radius: ${this.options.borderRadius * 0.5}px ${this.options.borderRadius * 1.5}px;
                    transform: rotate(0deg);
                }
                75% {
                    border-radius: ${this.options.borderRadius * 1.2}px ${this.options.borderRadius * 0.8}px;
                    transform: rotate(-1deg);
                }
                100% {
                    border-radius: ${this.options.borderRadius}px;
                    transform: rotate(0deg);
                }
            }

            .liquid-glass-floating {
                animation: liquidFloat 3s ease-in-out infinite;
            }

            @keyframes liquidFloat {
                0%, 100% {
                    transform: translateY(0px);
                }
                50% {
                    transform: translateY(-10px);
                }
            }

            .liquid-glass-pulse {
                animation: liquidPulse 2s ease-in-out infinite;
            }

            @keyframes liquidPulse {
                0%, 100% {
                    box-shadow: 
                        0 8px 32px rgba(0, 0, 0, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2);
                }
                50% {
                    box-shadow: 
                        0 16px 64px rgba(0, 0, 0, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.4);
                }
            }
        `;
        document.head.appendChild(style);
    }

    apply(selector, customOptions = {}) {
        const options = { ...this.options, ...customOptions };
        const elements = typeof selector === 'string' 
            ? document.querySelectorAll(selector)
            : [selector];

        elements.forEach(element => {
            if (this.elements.has(element)) return;
            
            element.classList.add('liquid-glass');
            this.elements.add(element);
            
            element.addEventListener('click', (e) => {
                this.createRipple(e, element);
            });

            if (options.morphing) {
                element.classList.add('liquid-glass-morphing');
            }
            
            if (options.floating) {
                element.classList.add('liquid-glass-floating');
            }
            
            if (options.pulse) {
                element.classList.add('liquid-glass-pulse');
            }
        });
    }

    createRipple(event, element) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        const ripple = document.createElement('div');
        ripple.className = 'liquid-glass-ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, this.options.animationDuration * 2);
    }

    addMorphing(selector) {
        const elements = typeof selector === 'string' 
            ? document.querySelectorAll(selector)
            : [selector];
        
        elements.forEach(element => {
            element.classList.add('liquid-glass-morphing');
        });
    }

    removeMorphing(selector) {
        const elements = typeof selector === 'string' 
            ? document.querySelectorAll(selector)
            : [selector];
        
        elements.forEach(element => {
            element.classList.remove('liquid-glass-morphing');
        });
    }

    addFloating(selector) {
        const elements = typeof selector === 'string' 
            ? document.querySelectorAll(selector)
            : [selector];
        
        elements.forEach(element => {
            element.classList.add('liquid-glass-floating');
        });
    }

    addPulse(selector) {
        const elements = typeof selector === 'string' 
            ? document.querySelectorAll(selector)
            : [selector];
        
        elements.forEach(element => {
            element.classList.add('liquid-glass-pulse');
        });
    }

    remove(selector) {
        const elements = typeof selector === 'string' 
            ? document.querySelectorAll(selector)
            : [selector];

        elements.forEach(element => {
            element.classList.remove('liquid-glass', 'liquid-glass-morphing', 'liquid-glass-floating', 'liquid-glass-pulse');
            this.elements.delete(element);
        });
    }

    destroy() {
        this.elements.forEach(element => {
            element.classList.remove('liquid-glass', 'liquid-glass-morphing', 'liquid-glass-floating', 'liquid-glass-pulse');
        });
        this.elements.clear();
        
        const styleSheet = document.getElementById('liquid-glass-styles');
        if (styleSheet) {
            styleSheet.remove();
        }
    }

    bindEvents() {
        document.addEventListener('DOMContentLoaded', () => {
            const autoElements = document.querySelectorAll('[data-liquid-glass]');
            autoElements.forEach(element => {
                const options = {};
                if (element.dataset.liquidGlassMorphing) options.morphing = true;
                if (element.dataset.liquidGlassFloating) options.floating = true;
                if (element.dataset.liquidGlassPulse) options.pulse = true;
                
                this.apply(element, options);
            });
        });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = LiquidGlass;
} else if (typeof window !== 'undefined') {
    window.LiquidGlass = LiquidGlass;
}