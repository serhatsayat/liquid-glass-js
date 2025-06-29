class GlassTooltip extends BaseGlassComponent {
    constructor(element, options = {}) {
        super(element, options);
    }

    getDefaultOptions() {
        return {
            content: '',
            placement: 'top', // top, bottom, left, right, auto
            trigger: 'hover', // hover, click, focus, manual
            delay: { show: 300, hide: 100 },
            offset: 10,
            arrow: true,
            animation: 'fade', // fade, scale, slide
            interactive: false,
            maxWidth: 300,
            theme: 'dark', // dark, light, glass
            onShow: null,
            onHide: null
        };
    }

    createElement() {
        this.createTooltip();
        this.setupTriggers();
        this.calculatePosition();
    }

    createTooltip() {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'liquid-glass-tooltip';
        this.tooltip.style.cssText = `
            position: absolute;
            z-index: 10000;
            opacity: 0;
            visibility: hidden;
            pointer-events: ${this.options.interactive ? 'auto' : 'none'};
            max-width: ${this.options.maxWidth}px;
            padding: 8px 12px;
            font-size: 0.875rem;
            line-height: 1.4;
            border-radius: 8px;
            transition: all ${this.options.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1);
            word-wrap: break-word;
            transform: ${this.getInitialTransform()};
        `;
        
        this.applyTheme();
        this.setContent(this.options.content);
        
        if (this.options.arrow) {
            this.createArrow();
        }
        
        document.body.appendChild(this.tooltip);
    }

    createArrow() {
        this.arrow = document.createElement('div');
        this.arrow.className = 'tooltip-arrow';
        this.arrow.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            background: inherit;
            border: inherit;
            transform: rotate(45deg);
            z-index: -1;
        `;
        
        this.tooltip.appendChild(this.arrow);
    }

    applyTheme() {
        switch (this.options.theme) {
            case 'dark':
                this.tooltip.style.background = 'rgba(0, 0, 0, 0.9)';
                this.tooltip.style.color = 'white';
                this.tooltip.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                this.tooltip.style.backdropFilter = 'blur(10px)';
                this.tooltip.style.webkitBackdropFilter = 'blur(10px)';
                break;
                
            case 'light':
                this.tooltip.style.background = 'rgba(255, 255, 255, 0.95)';
                this.tooltip.style.color = '#333';
                this.tooltip.style.border = '1px solid rgba(0, 0, 0, 0.1)';
                this.tooltip.style.backdropFilter = 'blur(10px)';
                this.tooltip.style.webkitBackdropFilter = 'blur(10px)';
                this.tooltip.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                break;
                
            case 'glass':
                this.tooltip.style.background = this.options.color;
                this.tooltip.style.color = 'white';
                this.tooltip.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                this.tooltip.style.backdropFilter = `blur(${this.options.blur}px)`;
                this.tooltip.style.webkitBackdropFilter = `blur(${this.options.blur}px)`;
                this.tooltip.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                break;
        }
    }

    setupTriggers() {
        if (!this.element) return;

        switch (this.options.trigger) {
            case 'hover':
                this.element.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
                this.element.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
                
                if (this.options.interactive) {
                    this.tooltip.addEventListener('mouseenter', this.handleTooltipMouseEnter.bind(this));
                    this.tooltip.addEventListener('mouseleave', this.handleTooltipMouseLeave.bind(this));
                }
                break;
                
            case 'click':
                this.element.addEventListener('click', this.handleClick.bind(this));
                document.addEventListener('click', this.handleDocumentClick.bind(this));
                break;
                
            case 'focus':
                this.element.addEventListener('focus', this.handleFocus.bind(this));
                this.element.addEventListener('blur', this.handleBlur.bind(this));
                break;
        }
    }

    handleMouseEnter() {
        this.clearTimeouts();
        this.showTimeout = setTimeout(() => {
            this.show();
        }, this.options.delay.show);
    }

    handleMouseLeave() {
        this.clearTimeouts();
        this.hideTimeout = setTimeout(() => {
            this.hide();
        }, this.options.delay.hide);
    }

    handleTooltipMouseEnter() {
        this.clearTimeouts();
    }

    handleTooltipMouseLeave() {
        this.clearTimeouts();
        this.hideTimeout = setTimeout(() => {
            this.hide();
        }, this.options.delay.hide);
    }

    handleClick(e) {
        e.preventDefault();
        this.toggle();
    }

    handleDocumentClick(e) {
        if (!this.element.contains(e.target) && !this.tooltip.contains(e.target)) {
            this.hide();
        }
    }

    handleFocus() {
        this.show();
    }

    handleBlur() {
        this.hide();
    }

    clearTimeouts() {
        if (this.showTimeout) {
            clearTimeout(this.showTimeout);
            this.showTimeout = null;
        }
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
    }

    calculatePosition() {
        if (!this.element || !this.tooltip) return;

        const elementRect = this.element.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const scrollX = window.pageXOffset;
        const scrollY = window.pageYOffset;

        let placement = this.options.placement;
        
        // Auto placement logic
        if (placement === 'auto') {
            const spaceTop = elementRect.top;
            const spaceBottom = viewportHeight - elementRect.bottom;
            const spaceLeft = elementRect.left;
            const spaceRight = viewportWidth - elementRect.right;
            
            const maxSpace = Math.max(spaceTop, spaceBottom, spaceLeft, spaceRight);
            
            if (maxSpace === spaceTop) placement = 'top';
            else if (maxSpace === spaceBottom) placement = 'bottom';
            else if (maxSpace === spaceLeft) placement = 'left';
            else placement = 'right';
        }

        let top, left;
        
        switch (placement) {
            case 'top':
                top = elementRect.top + scrollY - tooltipRect.height - this.options.offset;
                left = elementRect.left + scrollX + (elementRect.width / 2) - (tooltipRect.width / 2);
                break;
                
            case 'bottom':
                top = elementRect.bottom + scrollY + this.options.offset;
                left = elementRect.left + scrollX + (elementRect.width / 2) - (tooltipRect.width / 2);
                break;
                
            case 'left':
                top = elementRect.top + scrollY + (elementRect.height / 2) - (tooltipRect.height / 2);
                left = elementRect.left + scrollX - tooltipRect.width - this.options.offset;
                break;
                
            case 'right':
                top = elementRect.top + scrollY + (elementRect.height / 2) - (tooltipRect.height / 2);
                left = elementRect.right + scrollX + this.options.offset;
                break;
        }

        // Viewport boundary adjustments
        if (left < scrollX) {
            left = scrollX + 8;
        } else if (left + tooltipRect.width > scrollX + viewportWidth) {
            left = scrollX + viewportWidth - tooltipRect.width - 8;
        }

        if (top < scrollY) {
            top = scrollY + 8;
        } else if (top + tooltipRect.height > scrollY + viewportHeight) {
            top = scrollY + viewportHeight - tooltipRect.height - 8;
        }

        this.tooltip.style.top = `${top}px`;
        this.tooltip.style.left = `${left}px`;
        
        this.currentPlacement = placement;
        this.positionArrow();
    }

    positionArrow() {
        if (!this.arrow || !this.element) return;

        const elementRect = this.element.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();
        const scrollX = window.pageXOffset;
        const scrollY = window.pageYOffset;

        switch (this.currentPlacement) {
            case 'top':
                this.arrow.style.top = 'calc(100% - 4px)';
                this.arrow.style.left = `${elementRect.left + scrollX + (elementRect.width / 2) - tooltipRect.left - scrollX - 4}px`;
                this.arrow.style.transform = 'rotate(45deg)';
                break;
                
            case 'bottom':
                this.arrow.style.top = '-4px';
                this.arrow.style.left = `${elementRect.left + scrollX + (elementRect.width / 2) - tooltipRect.left - scrollX - 4}px`;
                this.arrow.style.transform = 'rotate(45deg)';
                break;
                
            case 'left':
                this.arrow.style.left = 'calc(100% - 4px)';
                this.arrow.style.top = `${elementRect.top + scrollY + (elementRect.height / 2) - tooltipRect.top - scrollY - 4}px`;
                this.arrow.style.transform = 'rotate(45deg)';
                break;
                
            case 'right':
                this.arrow.style.left = '-4px';
                this.arrow.style.top = `${elementRect.top + scrollY + (elementRect.height / 2) - tooltipRect.top - scrollY - 4}px`;
                this.arrow.style.transform = 'rotate(45deg)';
                break;
        }
    }

    getInitialTransform() {
        switch (this.options.animation) {
            case 'scale':
                return 'scale(0.8)';
            case 'slide':
                return this.getSlideTransform();
            case 'fade':
            default:
                return 'scale(1)';
        }
    }

    getSlideTransform() {
        switch (this.options.placement) {
            case 'top':
                return 'translateY(10px)';
            case 'bottom':
                return 'translateY(-10px)';
            case 'left':
                return 'translateX(10px)';
            case 'right':
                return 'translateX(-10px)';
            default:
                return 'translateY(10px)';
        }
    }

    show() {
        if (!this.tooltip || this.isVisible) return;

        this.isVisible = true;
        this.calculatePosition();
        
        this.tooltip.style.opacity = '1';
        this.tooltip.style.visibility = 'visible';
        this.tooltip.style.transform = 'scale(1) translateX(0) translateY(0)';
        
        if (this.options.onShow) {
            this.options.onShow(this);
        }
    }

    hide() {
        if (!this.tooltip || !this.isVisible) return;

        this.isVisible = false;
        
        this.tooltip.style.opacity = '0';
        this.tooltip.style.visibility = 'hidden';
        this.tooltip.style.transform = this.getInitialTransform();
        
        if (this.options.onHide) {
            this.options.onHide(this);
        }
    }

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    setContent(content) {
        if (!this.tooltip) return;
        
        this.options.content = content;
        
        if (typeof content === 'string') {
            this.tooltip.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            this.tooltip.innerHTML = '';
            this.tooltip.appendChild(content);
        }
        
        // Re-add arrow if it exists
        if (this.arrow && !this.tooltip.contains(this.arrow)) {
            this.tooltip.appendChild(this.arrow);
        }
    }

    setPlacement(placement) {
        this.options.placement = placement;
        if (this.isVisible) {
            this.calculatePosition();
        }
    }

    enable() {
        this.disabled = false;
    }

    disable() {
        this.disabled = true;
        this.hide();
    }

    onInit() {
        this.isVisible = false;
        this.disabled = false;
        
        // Get content from element if not provided
        if (!this.options.content && this.element) {
            this.options.content = this.element.getAttribute('title') || 
                                  this.element.getAttribute('data-tooltip') || '';
            
            // Remove title to prevent browser tooltip
            if (this.element.hasAttribute('title')) {
                this.element.removeAttribute('title');
            }
        }
    }

    destroy() {
        this.clearTimeouts();
        
        if (this.tooltip && this.tooltip.parentNode) {
            this.tooltip.parentNode.removeChild(this.tooltip);
        }
        
        // Remove document click listener if using click trigger
        if (this.options.trigger === 'click') {
            document.removeEventListener('click', this.handleDocumentClick.bind(this));
        }
        
        super.destroy();
    }

    // Static factory methods
    static create(element, options = {}) {
        return new GlassTooltip(element, options);
    }

    static createSimple(element, content, placement = 'top') {
        return new GlassTooltip(element, {
            content: content,
            placement: placement
        });
    }

    static createInteractive(element, content, placement = 'top') {
        return new GlassTooltip(element, {
            content: content,
            placement: placement,
            interactive: true,
            trigger: 'hover'
        });
    }

    static createClick(element, content) {
        return new GlassTooltip(element, {
            content: content,
            trigger: 'click'
        });
    }

    static initializeAll(selector = '[data-tooltip]') {
        const elements = document.querySelectorAll(selector);
        const tooltips = [];
        
        elements.forEach(element => {
            const content = element.getAttribute('data-tooltip') || element.getAttribute('title');
            const placement = element.getAttribute('data-placement') || 'top';
            const trigger = element.getAttribute('data-trigger') || 'hover';
            
            if (content) {
                const tooltip = new GlassTooltip(element, {
                    content: content,
                    placement: placement,
                    trigger: trigger
                });
                tooltips.push(tooltip);
            }
        });
        
        return tooltips;
    }
}

// Export for both CommonJS and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GlassTooltip;
} else if (typeof window !== 'undefined') {
    window.GlassTooltip = GlassTooltip;
}