class GlassModal extends BaseGlassComponent {
    constructor(element, options = {}) {
        super(element, options);
    }

    getDefaultOptions() {
        return {
            size: 'medium', // small, medium, large, fullscreen
            position: 'center', // center, top, bottom
            backdrop: true,
            backdropClosable: true,
            keyboard: true,
            animation: 'slideUp', // slideUp, slideDown, fade, scale, slideLeft, slideRight
            header: null,
            footer: null,
            closeButton: true,
            scrollable: false,
            persistent: false,
            onShow: null,
            onHide: null,
            onBackdropClick: null
        };
    }

    createElement() {
        if (!this.element) {
            this.element = document.createElement('div');
        }
        
        this.createOverlay();
        this.createModal();
        this.createStructure();
        this.setupEventHandlers();
    }

    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'liquid-glass-modal-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all ${this.options.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1);
        `;
        
        if (this.options.backdrop) {
            this.overlay.style.background = 'rgba(0, 0, 0, 0.5)';
            this.overlay.style.backdropFilter = 'blur(5px)';
            this.overlay.style.webkitBackdropFilter = 'blur(5px)';
        }
        
        this.applyPosition();
        document.body.appendChild(this.overlay);
    }

    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'liquid-glass-modal';
        this.modal.style.cssText = `
            position: relative;
            background: ${this.options.color};
            border-radius: ${this.options.borderRadius}px;
            box-shadow: 
                0 40px 80px rgba(0, 0, 0, 0.25),
                0 16px 32px rgba(0, 0, 0, 0.15),
                inset 0 2px 0 rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(${this.options.blur}px) saturate(180%);
            -webkit-backdrop-filter: blur(${this.options.blur}px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            max-height: 90vh;
            max-width: 90vw;
            width: ${this.getModalWidth()};
            transform: ${this.getInitialTransform()};
            transition: transform ${this.options.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            flex-direction: column;
        `;
        
        this.overlay.appendChild(this.modal);
    }

    createStructure() {
        this.modal.innerHTML = '';
        
        // Create header
        if (this.options.header || this.options.closeButton) {
            this.createHeader();
        }
        
        // Create content area
        this.createContent();
        
        // Create footer
        if (this.options.footer) {
            this.createFooter();
        }
    }

    createHeader() {
        this.headerElement = document.createElement('div');
        this.headerElement.className = 'modal-header';
        this.headerElement.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1.5rem 2rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: ${this.options.borderRadius}px ${this.options.borderRadius}px 0 0;
        `;
        
        // Add header content
        if (this.options.header) {
            this.headerContent = document.createElement('div');
            this.headerContent.className = 'modal-header-content';
            this.headerContent.style.cssText = `
                font-size: 1.25rem;
                font-weight: 600;
                color: white;
            `;
            
            if (typeof this.options.header === 'string') {
                this.headerContent.innerHTML = this.options.header;
            } else if (this.options.header instanceof HTMLElement) {
                this.headerContent.appendChild(this.options.header);
            }
            
            this.headerElement.appendChild(this.headerContent);
        }
        
        // Add close button
        if (this.options.closeButton) {
            this.closeButton = document.createElement('button');
            this.closeButton.className = 'modal-close-button';
            this.closeButton.innerHTML = '×';
            this.closeButton.style.cssText = `
                background: none;
                border: none;
                color: rgba(255, 255, 255, 0.7);
                font-size: 2rem;
                cursor: pointer;
                padding: 0;
                width: 2rem;
                height: 2rem;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 200ms ease;
            `;
            
            this.closeButton.addEventListener('mouseenter', () => {
                this.closeButton.style.background = 'rgba(255, 255, 255, 0.1)';
                this.closeButton.style.color = 'white';
            });
            
            this.closeButton.addEventListener('mouseleave', () => {
                this.closeButton.style.background = 'none';
                this.closeButton.style.color = 'rgba(255, 255, 255, 0.7)';
            });
            
            this.closeButton.addEventListener('click', () => this.hide());
            this.headerElement.appendChild(this.closeButton);
        }
        
        this.modal.appendChild(this.headerElement);
    }

    createContent() {
        this.contentElement = document.createElement('div');
        this.contentElement.className = 'modal-content';
        this.contentElement.style.cssText = `
            padding: 2rem;
            flex: 1;
            overflow: ${this.options.scrollable ? 'auto' : 'visible'};
            line-height: 1.6;
        `;
        
        this.modal.appendChild(this.contentElement);
    }

    createFooter() {
        this.footerElement = document.createElement('div');
        this.footerElement.className = 'modal-footer';
        this.footerElement.style.cssText = `
            padding: 1.5rem 2rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 0 0 ${this.options.borderRadius}px ${this.options.borderRadius}px;
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
        `;
        
        if (typeof this.options.footer === 'string') {
            this.footerElement.innerHTML = this.options.footer;
        } else if (this.options.footer instanceof HTMLElement) {
            this.footerElement.appendChild(this.options.footer);
        }
        
        this.modal.appendChild(this.footerElement);
    }

    setupEventHandlers() {
        // Backdrop click
        if (this.options.backdropClosable) {
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    if (this.options.onBackdropClick) {
                        this.options.onBackdropClick(e, this);
                    }
                    if (!this.options.persistent) {
                        this.hide();
                    }
                }
            });
        }
        
        // Keyboard events
        if (this.options.keyboard) {
            this.keyboardHandler = (e) => {
                if (e.key === 'Escape' && this.isVisible) {
                    if (!this.options.persistent) {
                        this.hide();
                    }
                }
            };
            document.addEventListener('keydown', this.keyboardHandler);
        }
    }

    getModalWidth() {
        switch (this.options.size) {
            case 'small': return '400px';
            case 'medium': return '600px';
            case 'large': return '800px';
            case 'fullscreen': return '100vw';
            default: return '600px';
        }
    }

    applyPosition() {
        switch (this.options.position) {
            case 'top':
                this.overlay.style.alignItems = 'flex-start';
                this.overlay.style.paddingTop = '5vh';
                break;
            case 'bottom':
                this.overlay.style.alignItems = 'flex-end';
                this.overlay.style.paddingBottom = '5vh';
                break;
            case 'center':
            default:
                this.overlay.style.alignItems = 'center';
                break;
        }
    }

    getInitialTransform() {
        switch (this.options.animation) {
            case 'slideUp': return 'translateY(50px)';
            case 'slideDown': return 'translateY(-50px)';
            case 'slideLeft': return 'translateX(50px)';
            case 'slideRight': return 'translateX(-50px)';
            case 'scale': return 'scale(0.8)';
            case 'fade': return 'scale(1)';
            default: return 'translateY(50px)';
        }
    }

    onInit() {
        this.isVisible = false;
        this.originalContent = this.element.innerHTML;
        
        // Move original content to modal
        if (this.originalContent && this.contentElement) {
            this.contentElement.innerHTML = this.originalContent;
        }
        
        // Remove original element from DOM
        if (this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        
        this.element = this.modal;
    }

    show() {
        if (this.isVisible) return;
        
        this.isVisible = true;
        document.body.style.overflow = 'hidden';
        
        // Show overlay
        this.overlay.style.opacity = '1';
        this.overlay.style.visibility = 'visible';
        
        // Animate modal
        setTimeout(() => {
            this.modal.style.transform = 'translateY(0) translateX(0) scale(1)';
        }, 10);
        
        if (this.options.onShow) {
            this.options.onShow(this);
        }
        
        // Focus management
        this.previousActiveElement = document.activeElement;
        if (this.closeButton) {
            this.closeButton.focus();
        }
    }

    hide() {
        if (!this.isVisible) return;
        
        this.isVisible = false;
        
        // Animate modal out
        this.modal.style.transform = this.getInitialTransform();
        this.overlay.style.opacity = '0';
        
        setTimeout(() => {
            this.overlay.style.visibility = 'hidden';
            document.body.style.overflow = '';
            
            // Restore focus
            if (this.previousActiveElement) {
                this.previousActiveElement.focus();
            }
        }, this.options.animationDuration);
        
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
        if (this.contentElement) {
            if (typeof content === 'string') {
                this.contentElement.innerHTML = content;
            } else if (content instanceof HTMLElement) {
                this.contentElement.innerHTML = '';
                this.contentElement.appendChild(content);
            }
        }
    }

    setHeader(header) {
        this.options.header = header;
        if (this.headerContent) {
            if (typeof header === 'string') {
                this.headerContent.innerHTML = header;
            } else if (header instanceof HTMLElement) {
                this.headerContent.innerHTML = '';
                this.headerContent.appendChild(header);
            }
        }
    }

    setFooter(footer) {
        this.options.footer = footer;
        if (this.footerElement) {
            if (typeof footer === 'string') {
                this.footerElement.innerHTML = footer;
            } else if (footer instanceof HTMLElement) {
                this.footerElement.innerHTML = '';
                this.footerElement.appendChild(footer);
            }
        }
    }

    destroy() {
        if (this.keyboardHandler) {
            document.removeEventListener('keydown', this.keyboardHandler);
        }
        
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }
        
        document.body.style.overflow = '';
        
        super.destroy();
    }

    // Static factory methods
    static create(options = {}) {
        const element = document.createElement('div');
        return new GlassModal(element, options);
    }

    static createAlert(title, message, onConfirm) {
        const modal = GlassModal.create({
            size: 'small',
            header: title,
            closeButton: true,
            footer: `<button class="liquid-glass-button btn-primary">OK</button>`
        });
        
        modal.setContent(`<p>${message}</p>`);
        
        const okButton = modal.footerElement.querySelector('.liquid-glass-button');
        okButton.addEventListener('click', () => {
            if (onConfirm) onConfirm();
            modal.hide();
        });
        
        return modal;
    }

    static createConfirm(title, message, onConfirm, onCancel) {
        const modal = GlassModal.create({
            size: 'small',
            header: title,
            closeButton: true,
            persistent: true
        });
        
        modal.setContent(`<p>${message}</p>`);
        
        const footer = document.createElement('div');
        footer.innerHTML = `
            <button class="liquid-glass-button btn-outline cancel-btn">Cancel</button>
            <button class="liquid-glass-button btn-primary confirm-btn">Confirm</button>
        `;
        modal.setFooter(footer);
        
        const cancelBtn = footer.querySelector('.cancel-btn');
        const confirmBtn = footer.querySelector('.confirm-btn');
        
        cancelBtn.addEventListener('click', () => {
            if (onCancel) onCancel();
            modal.hide();
        });
        
        confirmBtn.addEventListener('click', () => {
            if (onConfirm) onConfirm();
            modal.hide();
        });
        
        return modal;
    }

    static createForm(title, fields, onSubmit) {
        const modal = GlassModal.create({
            header: title,
            scrollable: true,
            closeButton: true
        });
        
        const form = document.createElement('form');
        form.style.cssText = 'display: flex; flex-direction: column; gap: 1rem;';
        
        fields.forEach(field => {
            const wrapper = document.createElement('div');
            wrapper.innerHTML = `
                <label style="display: block; margin-bottom: 0.5rem; color: rgba(255, 255, 255, 0.9);">
                    ${field.label}
                </label>
                <input 
                    type="${field.type || 'text'}" 
                    name="${field.name}"
                    placeholder="${field.placeholder || ''}"
                    required="${field.required || false}"
                    style="
                        width: 100%;
                        padding: 0.75rem;
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        border-radius: 8px;
                        background: rgba(255, 255, 255, 0.1);
                        color: white;
                        backdrop-filter: blur(10px);
                    "
                />
            `;
            form.appendChild(wrapper);
        });
        
        modal.setContent(form);
        
        const footer = document.createElement('div');
        footer.innerHTML = `
            <button type="button" class="liquid-glass-button btn-outline cancel-btn">Cancel</button>
            <button type="submit" class="liquid-glass-button btn-primary submit-btn">Submit</button>
        `;
        modal.setFooter(footer);
        
        const cancelBtn = footer.querySelector('.cancel-btn');
        const submitBtn = footer.querySelector('.submit-btn');
        
        cancelBtn.addEventListener('click', () => modal.hide());
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            if (onSubmit) onSubmit(data);
            modal.hide();
        });
        
        return modal;
    }
}

// Export for both CommonJS and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GlassModal;
} else if (typeof window !== 'undefined') {
    window.GlassModal = GlassModal;
}