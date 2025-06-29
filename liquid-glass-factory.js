class LiquidGlassFactory {
    constructor() {
        this.components = new Map();
        this.globalOptions = {
            blur: 25,
            opacity: 0.15,
            borderRadius: 16,
            animationDuration: 300,
            scale: 1.05,
            color: 'rgba(255, 255, 255, 0.1)'
        };
        
        this.componentClasses = {
            button: GlassButton,
            card: GlassCard,
            modal: GlassModal,
            navbar: GlassNavbar,
            tooltip: GlassTooltip
        };
        
        this.autoInit();
    }

    // Set global options for all components
    setGlobalOptions(options) {
        this.globalOptions = { ...this.globalOptions, ...options };
        
        // Update existing components
        this.components.forEach(component => {
            if (component.update) {
                component.update(this.globalOptions);
            }
        });
    }

    // Create a new component
    create(type, element, options = {}) {
        const ComponentClass = this.componentClasses[type];
        
        if (!ComponentClass) {
            throw new Error(`Unknown component type: ${type}`);
        }
        
        const mergedOptions = { ...this.globalOptions, ...options };
        const component = new ComponentClass(element, mergedOptions);
        
        // Store component with unique ID
        const id = this.generateId();
        this.components.set(id, {
            id,
            type,
            component,
            element: element || component.element
        });
        
        return { component, id };
    }

    // Get component by ID
    get(id) {
        const item = this.components.get(id);
        return item ? item.component : null;
    }

    // Remove component by ID
    remove(id) {
        const item = this.components.get(id);
        if (item) {
            if (item.component.destroy) {
                item.component.destroy();
            }
            this.components.delete(id);
            return true;
        }
        return false;
    }

    // Get all components of a specific type
    getAllByType(type) {
        const components = [];
        this.components.forEach(item => {
            if (item.type === type) {
                components.push(item.component);
            }
        });
        return components;
    }

    // Destroy all components
    destroyAll() {
        this.components.forEach(item => {
            if (item.component.destroy) {
                item.component.destroy();
            }
        });
        this.components.clear();
    }

    // Auto-initialize components from DOM
    autoInit() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeFromDOM();
        });
        
        // If DOM is already loaded
        if (document.readyState === 'loading') {
            // DOM not ready yet
        } else {
            this.initializeFromDOM();
        }
    }

    initializeFromDOM() {
        // Initialize buttons
        this.initButtons();
        
        // Initialize cards
        this.initCards();
        
        // Initialize modals
        this.initModals();
        
        // Initialize navbars
        this.initNavbars();
        
        // Initialize tooltips
        this.initTooltips();
    }

    initButtons() {
        const buttons = document.querySelectorAll('[data-glass-button]');
        
        buttons.forEach(button => {
            const options = this.parseDataAttributes(button, 'button');
            this.create('button', button, options);
        });
    }

    initCards() {
        const cards = document.querySelectorAll('[data-glass-card]');
        
        cards.forEach(card => {
            const options = this.parseDataAttributes(card, 'card');
            this.create('card', card, options);
        });
    }

    initModals() {
        const modals = document.querySelectorAll('[data-glass-modal]');
        
        modals.forEach(modal => {
            const options = this.parseDataAttributes(modal, 'modal');
            this.create('modal', modal, options);
        });
    }

    initNavbars() {
        const navbars = document.querySelectorAll('[data-glass-navbar]');
        
        navbars.forEach(navbar => {
            const options = this.parseDataAttributes(navbar, 'navbar');
            this.create('navbar', navbar, options);
        });
    }

    initTooltips() {
        const tooltips = document.querySelectorAll('[data-tooltip], [title]');
        
        tooltips.forEach(element => {
            const content = element.getAttribute('data-tooltip') || element.getAttribute('title');
            if (content) {
                const options = {
                    content: content,
                    placement: element.getAttribute('data-placement') || 'top',
                    trigger: element.getAttribute('data-trigger') || 'hover'
                };
                
                // Remove title to prevent browser tooltip
                if (element.hasAttribute('title')) {
                    element.removeAttribute('title');
                }
                
                this.create('tooltip', element, options);
            }
        });
    }

    parseDataAttributes(element, componentType) {
        const options = {};
        const prefix = `data-glass-${componentType}-`;
        
        Array.from(element.attributes).forEach(attr => {
            if (attr.name.startsWith(prefix)) {
                const key = attr.name.replace(prefix, '').replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                let value = attr.value;
                
                // Parse boolean values
                if (value === 'true') value = true;
                else if (value === 'false') value = false;
                
                // Parse numeric values
                else if (!isNaN(value) && value !== '') value = Number(value);
                
                // Parse JSON values
                else if (value.startsWith('{') || value.startsWith('[')) {
                    try {
                        value = JSON.parse(value);
                    } catch (e) {
                        // Keep as string if JSON parsing fails
                    }
                }
                
                options[key] = value;
            }
        });
        
        return options;
    }

    generateId() {
        return 'lg_' + Math.random().toString(36).substr(2, 9);
    }

    // Utility methods for creating specific components
    button(element, options = {}) {
        return this.create('button', element, options);
    }

    card(element, options = {}) {
        return this.create('card', element, options);
    }

    modal(element, options = {}) {
        return this.create('modal', element, options);
    }

    navbar(element, options = {}) {
        return this.create('navbar', element, options);
    }

    tooltip(element, options = {}) {
        return this.create('tooltip', element, options);
    }

    // Quick creation methods
    createButton(text, onClick, options = {}) {
        const button = document.createElement('button');
        button.textContent = text;
        
        const mergedOptions = { ...options, onClick };
        const { component } = this.create('button', button, mergedOptions);
        
        return component;
    }

    createCard(content, options = {}) {
        const card = document.createElement('div');
        card.innerHTML = content;
        
        const { component } = this.create('card', card, options);
        
        return component;
    }

    createModal(content, options = {}) {
        const modal = document.createElement('div');
        modal.innerHTML = content;
        
        const { component } = this.create('modal', modal, options);
        
        return component;
    }

    createNavbar(items, options = {}) {
        const navbar = document.createElement('nav');
        
        const mergedOptions = { ...options, items };
        const { component } = this.create('navbar', navbar, mergedOptions);
        
        return component;
    }

    createTooltip(element, content, options = {}) {
        const mergedOptions = { ...options, content };
        const { component } = this.create('tooltip', element, mergedOptions);
        
        return component;
    }

    // Convenience methods for common patterns
    createAlertModal(title, message, onConfirm) {
        return GlassModal.createAlert(title, message, onConfirm);
    }

    createConfirmModal(title, message, onConfirm, onCancel) {
        return GlassModal.createConfirm(title, message, onConfirm, onCancel);
    }

    createFormModal(title, fields, onSubmit) {
        return GlassModal.createForm(title, fields, onSubmit);
    }

    // Component queries
    findBySelector(selector) {
        const elements = document.querySelectorAll(selector);
        const components = [];
        
        this.components.forEach(item => {
            if (Array.from(elements).includes(item.element)) {
                components.push(item.component);
            }
        });
        
        return components;
    }

    findByType(type) {
        return this.getAllByType(type);
    }

    // Event system
    on(event, callback) {
        if (!this.eventListeners) {
            this.eventListeners = new Map();
        }
        
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        
        this.eventListeners.get(event).push(callback);
    }

    off(event, callback) {
        if (!this.eventListeners || !this.eventListeners.has(event)) return;
        
        const listeners = this.eventListeners.get(event);
        const index = listeners.indexOf(callback);
        
        if (index > -1) {
            listeners.splice(index, 1);
        }
    }

    emit(event, data) {
        if (!this.eventListeners || !this.eventListeners.has(event)) return;
        
        this.eventListeners.get(event).forEach(callback => {
            callback(data);
        });
    }

    // Plugin system
    registerComponent(name, componentClass) {
        this.componentClasses[name] = componentClass;
    }

    // Statistics
    getStats() {
        const stats = {
            total: this.components.size,
            byType: {}
        };
        
        this.components.forEach(item => {
            if (!stats.byType[item.type]) {
                stats.byType[item.type] = 0;
            }
            stats.byType[item.type]++;
        });
        
        return stats;
    }
}

// Create global instance
const LiquidGlass = new LiquidGlassFactory();

// Export for both CommonJS and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LiquidGlass, LiquidGlassFactory };
} else if (typeof window !== 'undefined') {
    window.LiquidGlass = LiquidGlass;
    window.LiquidGlassFactory = LiquidGlassFactory;
}