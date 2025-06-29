class GlassCard extends BaseGlassComponent {
    constructor(element, options = {}) {
        super(element, options);
    }

    getDefaultOptions() {
        return {
            variant: 'default', // default, elevated, flat, outlined
            padding: 'medium', // small, medium, large, none
            header: null,
            footer: null,
            image: null,
            imagePosition: 'top', // top, left, right, background
            clickable: false,
            hoverable: true,
            loading: false,
            morphing: false,
            floating: false,
            pulse: false,
            onClick: null,
            onHover: null
        };
    }

    createElement() {
        if (!this.element) {
            this.element = document.createElement('div');
        }
        
        this.element.classList.add('liquid-glass-card');
        this.applyVariant();
        this.createStructure();
        this.updateContent();
    }

    applyVariant() {
        // Remove existing variant classes
        this.element.classList.remove('card-default', 'card-elevated', 'card-flat', 'card-outlined');
        
        switch (this.options.variant) {
            case 'default':
                this.element.classList.add('card-default');
                this.options.color = 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 50%, rgba(255, 255, 255, 0.08) 100%)';
                break;
            case 'elevated':
                this.element.classList.add('card-elevated');
                this.options.color = 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)';
                break;
            case 'flat':
                this.element.classList.add('card-flat');
                this.options.color = 'rgba(255, 255, 255, 0.08)';
                break;
            case 'outlined':
                this.element.classList.add('card-outlined');
                this.options.color = 'transparent';
                break;
        }
    }

    createStructure() {
        this.element.innerHTML = '';
        
        // Create main container
        this.container = document.createElement('div');
        this.container.className = 'card-container';
        
        // Create image container if needed
        if (this.options.image) {
            this.createImageElement();
        }
        
        // Create content wrapper
        this.contentWrapper = document.createElement('div');
        this.contentWrapper.className = 'card-content-wrapper';
        
        // Create header if specified
        if (this.options.header) {
            this.createHeaderElement();
        }
        
        // Create main content area
        this.contentArea = document.createElement('div');
        this.contentArea.className = 'card-content';
        this.contentWrapper.appendChild(this.contentArea);
        
        // Create footer if specified
        if (this.options.footer) {
            this.createFooterElement();
        }
        
        this.container.appendChild(this.contentWrapper);
        this.element.appendChild(this.container);
    }

    createImageElement() {
        this.imageContainer = document.createElement('div');
        this.imageContainer.className = `card-image card-image-${this.options.imagePosition}`;
        
        if (typeof this.options.image === 'string') {
            this.imageElement = document.createElement('img');
            this.imageElement.src = this.options.image;
            this.imageElement.alt = '';
            this.imageElement.style.cssText = `
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: inherit;
            `;
        } else if (this.options.image instanceof HTMLElement) {
            this.imageElement = this.options.image;
        }
        
        if (this.imageElement) {
            this.imageContainer.appendChild(this.imageElement);
            
            if (this.options.imagePosition === 'background') {
                this.imageContainer.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: -1;
                    opacity: 0.3;
                `;
                this.element.style.position = 'relative';
                this.element.appendChild(this.imageContainer);
            } else {
                this.container.insertBefore(this.imageContainer, this.contentWrapper);
            }
        }
    }

    createHeaderElement() {
        this.headerElement = document.createElement('div');
        this.headerElement.className = 'card-header';
        
        if (typeof this.options.header === 'string') {
            this.headerElement.innerHTML = this.options.header;
        } else if (this.options.header instanceof HTMLElement) {
            this.headerElement.appendChild(this.options.header);
        }
        
        this.contentWrapper.insertBefore(this.headerElement, this.contentArea);
    }

    createFooterElement() {
        this.footerElement = document.createElement('div');
        this.footerElement.className = 'card-footer';
        
        if (typeof this.options.footer === 'string') {
            this.footerElement.innerHTML = this.options.footer;
        } else if (this.options.footer instanceof HTMLElement) {
            this.footerElement.appendChild(this.options.footer);
        }
        
        this.contentWrapper.appendChild(this.footerElement);
    }

    updateContent() {
        if (this.options.loading) {
            this.showLoading();
        } else {
            this.showContent();
        }
    }

    showContent() {
        if (this.originalContent && this.contentArea) {
            this.contentArea.innerHTML = this.originalContent;
        }
        
        this.element.classList.remove('card-loading');
    }

    showLoading() {
        this.element.classList.add('card-loading');
        
        if (this.contentArea) {
            this.contentArea.innerHTML = `
                <div class="card-loading-content">
                    <div class="loading-shimmer"></div>
                    <div class="loading-shimmer"></div>
                    <div class="loading-shimmer"></div>
                </div>
            `;
        }
    }

    applyStyles() {
        super.applyStyles();
        
        this.element.style.background = this.options.color;
        this.element.style.padding = this.getPadding();
        this.element.style.cursor = this.options.clickable ? 'pointer' : 'default';
        this.element.style.userSelect = this.options.clickable ? 'none' : 'auto';
        this.element.style.display = 'block';
        this.element.style.color = 'white';
        this.element.style.position = 'relative';
        this.element.style.overflow = 'hidden';
        
        // Apply border based on variant
        if (this.options.variant === 'outlined') {
            this.element.style.border = '2px solid rgba(255, 255, 255, 0.2)';
        }
    }

    getPadding() {
        switch (this.options.padding) {
            case 'none': return '0';
            case 'small': return '1rem';
            case 'medium': return '1.5rem';
            case 'large': return '2rem';
            default: return '1.5rem';
        }
    }

    bindEvents() {
        super.bindEvents();
        
        if (this.options.clickable && this.options.onClick) {
            this.addEventHandler('click', (e) => {
                this.options.onClick(e, this);
            });
        }
        
        if (this.options.onHover) {
            this.addEventHandler('mouseenter', (e) => {
                this.options.onHover(e, this, 'enter');
            });
            
            this.addEventHandler('mouseleave', (e) => {
                this.options.onHover(e, this, 'leave');
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

    onMouseEnter() {
        if (!this.options.hoverable) return;
        super.onMouseEnter();
        
        if (this.options.variant === 'elevated') {
            this.element.style.transform = `translateY(-8px) scale(${this.options.scale})`;
        }
    }

    onMouseLeave() {
        if (!this.options.hoverable) return;
        super.onMouseLeave();
        
        if (this.options.variant === 'elevated') {
            this.element.style.transform = '';
        }
    }

    onInit() {
        // Store original content
        this.originalContent = this.element.innerHTML;
    }

    // Public methods
    setLoading(loading) {
        this.options.loading = loading;
        this.updateContent();
    }

    setHeader(header) {
        this.options.header = header;
        if (this.headerElement) {
            this.headerElement.remove();
        }
        if (header) {
            this.createHeaderElement();
        }
    }

    setFooter(footer) {
        this.options.footer = footer;
        if (this.footerElement) {
            this.footerElement.remove();
        }
        if (footer) {
            this.createFooterElement();
        }
    }

    setContent(content) {
        this.originalContent = content;
        if (!this.options.loading && this.contentArea) {
            this.contentArea.innerHTML = content;
        }
    }

    setImage(image, position = 'top') {
        this.options.image = image;
        this.options.imagePosition = position;
        
        if (this.imageContainer) {
            this.imageContainer.remove();
        }
        
        if (image) {
            this.createImageElement();
        }
    }

    setClickable(clickable, onClick = null) {
        this.options.clickable = clickable;
        this.options.onClick = onClick;
        this.applyStyles();
        this.bindEvents();
    }

    // Static factory methods
    static create(options = {}) {
        const element = document.createElement('div');
        return new GlassCard(element, options);
    }

    static createSimple(content) {
        const card = GlassCard.create();
        card.setContent(content);
        return card;
    }

    static createWithHeader(header, content, footer = null) {
        const card = GlassCard.create({
            header: header,
            footer: footer
        });
        card.setContent(content);
        return card;
    }

    static createWithImage(image, content, imagePosition = 'top') {
        const card = GlassCard.create({
            image: image,
            imagePosition: imagePosition
        });
        card.setContent(content);
        return card;
    }

    static createClickable(content, onClick) {
        const card = GlassCard.create({
            clickable: true,
            onClick: onClick
        });
        card.setContent(content);
        return card;
    }

    static createElevated(content) {
        const card = GlassCard.create({
            variant: 'elevated'
        });
        card.setContent(content);
        return card;
    }

    static createFloating(content) {
        const card = GlassCard.create({
            floating: true
        });
        card.setContent(content);
        return card;
    }
}

// Export for both CommonJS and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GlassCard;
} else if (typeof window !== 'undefined') {
    window.GlassCard = GlassCard;
}