class GlassButton extends BaseGlassComponent {
    constructor(element, options = {}) {
        super(element, options);
    }

    getDefaultOptions() {
        return {
            variant: 'primary', // primary, secondary, outline, ghost
            size: 'medium', // small, medium, large
            loading: false,
            disabled: false,
            icon: null,
            iconPosition: 'left', // left, right
            morphing: false,
            floating: false,
            pulse: false,
            onClick: null
        };
    }

    createElement() {
        if (!this.element) {
            this.element = document.createElement('button');
        }
        
        this.element.classList.add('liquid-glass-button');
        this.applyVariant();
        this.applySize();
        this.updateContent();
    }

    applyVariant() {
        // Remove existing variant classes
        this.element.classList.remove('btn-primary', 'btn-secondary', 'btn-outline', 'btn-ghost');
        
        switch (this.options.variant) {
            case 'primary':
                this.element.classList.add('btn-primary');
                this.options.color = 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)';
                break;
            case 'secondary':
                this.element.classList.add('btn-secondary');
                this.options.color = 'linear-gradient(135deg, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.05) 100%)';
                break;
            case 'outline':
                this.element.classList.add('btn-outline');
                this.options.color = 'transparent';
                break;
            case 'ghost':
                this.element.classList.add('btn-ghost');
                this.options.color = 'rgba(255, 255, 255, 0.05)';
                break;
        }
    }

    applySize() {
        this.element.classList.remove('btn-small', 'btn-medium', 'btn-large');
        
        switch (this.options.size) {
            case 'small':
                this.element.classList.add('btn-small');
                this.options.borderRadius = 12;
                break;
            case 'medium':
                this.element.classList.add('btn-medium');
                this.options.borderRadius = 16;
                break;
            case 'large':
                this.element.classList.add('btn-large');
                this.options.borderRadius = 20;
                break;
        }
    }

    applyStyles() {
        super.applyStyles();
        
        this.element.style.background = this.options.color;
        this.element.style.padding = this.getPadding();
        this.element.style.fontSize = this.getFontSize();
        this.element.style.fontWeight = '500';
        this.element.style.cursor = this.options.disabled ? 'not-allowed' : 'pointer';
        this.element.style.opacity = this.options.disabled ? '0.6' : '1';
        this.element.style.pointerEvents = this.options.disabled ? 'none' : 'auto';
        this.element.style.display = 'inline-flex';
        this.element.style.alignItems = 'center';
        this.element.style.justifyContent = 'center';
        this.element.style.gap = '8px';
        this.element.style.border = this.getBorder();
        this.element.style.color = this.getTextColor();
        this.element.style.textDecoration = 'none';
        this.element.style.userSelect = 'none';
        this.element.style.position = 'relative';
        this.element.style.overflow = 'hidden';
    }

    getPadding() {
        switch (this.options.size) {
            case 'small': return '8px 16px';
            case 'medium': return '12px 24px';
            case 'large': return '16px 32px';
            default: return '12px 24px';
        }
    }

    getFontSize() {
        switch (this.options.size) {
            case 'small': return '0.875rem';
            case 'medium': return '1rem';
            case 'large': return '1.125rem';
            default: return '1rem';
        }
    }

    getBorder() {
        switch (this.options.variant) {
            case 'outline':
                return '2px solid rgba(255, 255, 255, 0.3)';
            default:
                return '1px solid rgba(255, 255, 255, 0.2)';
        }
    }

    getTextColor() {
        switch (this.options.variant) {
            case 'secondary':
                return 'rgba(255, 255, 255, 0.9)';
            default:
                return 'white';
        }
    }

    updateContent() {
        if (this.options.loading) {
            this.showLoading();
        } else {
            this.showContent();
        }
    }

    showContent() {
        let content = '';
        
        if (this.options.icon && this.options.iconPosition === 'left') {
            content += `<span class="btn-icon">${this.options.icon}</span>`;
        }
        
        if (this.originalText) {
            content += `<span class="btn-text">${this.originalText}</span>`;
        }
        
        if (this.options.icon && this.options.iconPosition === 'right') {
            content += `<span class="btn-icon">${this.options.icon}</span>`;
        }
        
        if (content) {
            this.element.innerHTML = content;
        }
    }

    showLoading() {
        this.element.innerHTML = `
            <span class="btn-loading">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="animation: spin 1s linear infinite;">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="31.416" stroke-dashoffset="31.416" style="animation: dash 2s ease-in-out infinite;">
                    </circle>
                </svg>
            </span>
        `;
    }

    bindEvents() {
        super.bindEvents();
        
        if (this.options.onClick) {
            this.addEventHandler('click', (e) => {
                if (!this.options.disabled && !this.options.loading) {
                    this.options.onClick(e, this);
                }
            });
        }

        // Apply animation effects
        if (this.options.morphing) {
            this.element.classList.add('liquid-glass-morphing');
        }
        
        if (this.options.floating) {
            this.element.classList.add('liquid-glass-floating');
        }
        
        if (this.options.pulse) {
            this.element.classList.add('liquid-glass-pulse');
        }
    }

    onInit() {
        // Store original text content
        this.originalText = this.element.textContent || this.element.innerText || '';
    }

    setLoading(loading) {
        this.options.loading = loading;
        this.updateContent();
        this.applyStyles();
    }

    setDisabled(disabled) {
        this.options.disabled = disabled;
        this.element.disabled = disabled;
        this.applyStyles();
    }

    setText(text) {
        this.originalText = text;
        if (!this.options.loading) {
            this.updateContent();
        }
    }

    setIcon(icon, position = 'left') {
        this.options.icon = icon;
        this.options.iconPosition = position;
        if (!this.options.loading) {
            this.updateContent();
        }
    }

    click() {
        if (!this.options.disabled && !this.options.loading) {
            this.element.click();
        }
    }

    focus() {
        this.element.focus();
    }

    blur() {
        this.element.blur();
    }

    // Static factory methods
    static create(options = {}) {
        const element = document.createElement('button');
        return new GlassButton(element, options);
    }

    static createPrimary(text, onClick) {
        const button = GlassButton.create({
            variant: 'primary',
            onClick: onClick
        });
        button.setText(text);
        return button;
    }

    static createSecondary(text, onClick) {
        const button = GlassButton.create({
            variant: 'secondary',
            onClick: onClick
        });
        button.setText(text);
        return button;
    }

    static createOutline(text, onClick) {
        const button = GlassButton.create({
            variant: 'outline',
            onClick: onClick
        });
        button.setText(text);
        return button;
    }

    static createWithIcon(text, icon, onClick, iconPosition = 'left') {
        const button = GlassButton.create({
            icon: icon,
            iconPosition: iconPosition,
            onClick: onClick
        });
        button.setText(text);
        return button;
    }

    static createFloating(text, onClick) {
        const button = GlassButton.create({
            floating: true,
            onClick: onClick
        });
        button.setText(text);
        return button;
    }

    static createMorphing(text, onClick) {
        const button = GlassButton.create({
            morphing: true,
            onClick: onClick
        });
        button.setText(text);
        return button;
    }
}

// Export for both CommonJS and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GlassButton;
} else if (typeof window !== 'undefined') {
    window.GlassButton = GlassButton;
}