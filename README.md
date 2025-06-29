# 🌊 Liquid Glass

> Apple-inspired glass morphism components for modern web applications

[![Pure JavaScript](https://img.shields.io/badge/Pure-JavaScript-yellow.svg)](https://github.com/serhatsayat/liquid-glass-js)
[![Zero Dependencies](https://img.shields.io/badge/Zero-Dependencies-green.svg)](https://github.com/serhatsayat/liquid-glass-js)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/serhatsayat/liquid-glass-js/blob/main/LICENSE)

Create stunning glass effects with backdrop blur, transparency, and fluid animations. No dependencies, pure JavaScript.

## ✨ Features

- 🎨 **Glass Morphism** - Authentic Apple-style glass effects
- 🧩 **Modular Components** - Button, Card, Modal, Navbar, Tooltip
- ⚡ **Zero Dependencies** - Pure JavaScript & CSS
- 📱 **Responsive** - Works on all devices
- 🚀 **Performance** - Smooth 60fps animations
- ♿ **Accessible** - ARIA support & keyboard navigation

## 🚀 Quick Start

### 1. Include Files

```html
<!-- Core Library -->
<script src="utils/base-component.js"></script>
<script src="components/button.js"></script>
<script src="components/card.js"></script>
<script src="components/modal.js"></script>
<script src="components/navbar.js"></script>
<script src="components/tooltip.js"></script>
<script src="liquid-glass-factory.js"></script>

<!-- Styles -->
<link rel="stylesheet" href="liquid-glass.css">
<link rel="stylesheet" href="styles/button.css">
<link rel="stylesheet" href="styles/card.css">
<link rel="stylesheet" href="styles/navbar.css">
<link rel="stylesheet" href="styles/modal.css">
```

### 2. Auto-Initialize (Easiest)

```html
<!-- Auto-initialize with data attributes -->
<button data-glass-button data-variant="primary">Auto Button</button>
<div data-glass-card data-variant="elevated">Auto Card</div>
<span data-tooltip="Help text">Tooltip</span>
```

### 3. JavaScript API (Advanced)

```javascript
// Create components programmatically
const button = LiquidGlass.createButton('Click Me', () => {
    alert('Clicked!');
}, { variant: 'primary' });

const card = LiquidGlass.createCard('<h3>Title</h3><p>Content</p>', {
    variant: 'elevated',
    clickable: true
});

// Show modals
const modal = LiquidGlass.createAlertModal('Success!', 'Action completed');
modal.show();
```

## 📋 Components

### 🔘 Buttons
```javascript
// Factory methods
const btn1 = LiquidGlass.createButton('Primary', onClick);
const btn2 = GlassButton.createFloating('Float', onClick);
const btn3 = GlassButton.createWithIcon('📧', 'Send', onClick);

// Variants: primary, secondary, outline, ghost
// Sizes: small, medium, large
// Effects: morphing, floating, pulse
```

### 🗃️ Cards
```javascript
// Simple card
const card = LiquidGlass.createCard('<h3>Title</h3><p>Content</p>');

// With header/footer
const advanced = GlassCard.createWithHeader(
    '<h2>Header</h2>',
    '<p>Content</p>',
    '<button>Action</button>'
);

// Variants: default, elevated, flat, outlined
// Effects: morphing, floating, pulse
```

### 🪟 Modals
```javascript
// Alert modal
LiquidGlass.createAlertModal('Title', 'Message').show();

// Confirm modal
LiquidGlass.createConfirmModal('Sure?', 'Delete item?', onYes, onNo).show();

// Form modal
LiquidGlass.createFormModal('Contact', [
    { name: 'email', label: 'Email', type: 'email', required: true }
], onSubmit).show();
```

### 🧭 Navigation
```javascript
// Create navbar
const navbar = LiquidGlass.createNavbar([
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { 
        label: 'More', 
        type: 'dropdown',
        items: [
            { label: 'Docs', href: '/docs' },
            { label: 'Contact', href: '/contact' }
        ]
    }
]);

document.body.appendChild(navbar.element);
```

### 💬 Tooltips
```javascript
// Simple tooltip
new GlassTooltip(element, { content: 'Help text' });

// Auto-initialize all
GlassTooltip.initializeAll('[data-tooltip]');
```

## ⚙️ Configuration

### Global Settings
```javascript
// Set options for all components
LiquidGlass.setGlobalOptions({
    blur: 25,
    borderRadius: 20,
    animationDuration: 400,
    scale: 1.05
});
```

### Component Options
```javascript
const button = LiquidGlass.createButton('Text', onClick, {
    variant: 'primary',    // primary, secondary, outline, ghost
    size: 'medium',        // small, medium, large
    loading: false,        // show loading spinner
    disabled: false,       // disable interactions
    morphing: false,       // shape-shifting animation
    floating: false,       // gentle floating animation
    pulse: false          // pulsing glow effect
});
```

## 🎨 Styling

### Data Attributes (Auto-Init)
```html
<!-- Button variants -->
<button data-glass-button data-variant="primary">Primary</button>
<button data-glass-button data-size="large">Large</button>
<button data-glass-button data-morphing="true">Morphing</button>

<!-- Card variants -->
<div data-glass-card data-variant="elevated">Elevated Card</div>
<div data-glass-card data-floating="true">Floating Card</div>

<!-- Tooltips -->
<span data-tooltip="Tooltip text" data-placement="top">Hover me</span>
```

### CSS Classes (Manual)
```css
/* Apply glass effect manually */
.my-element {
    backdrop-filter: blur(25px);
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
}
```

## 🎯 Examples

### Complete Button Example
```html
<button id="my-button">Click Me</button>

<script>
const button = new GlassButton(document.getElementById('my-button'), {
    variant: 'primary',
    size: 'large',
    morphing: true,
    onClick: (e, btn) => {
        btn.setLoading(true);
        setTimeout(() => btn.setLoading(false), 2000);
    }
});
</script>
```

### Interactive Card
```html
<div id="my-card">
    <h3>Interactive Card</h3>
    <p>Click me for actions</p>
</div>

<script>
const card = new GlassCard(document.getElementById('my-card'), {
    variant: 'elevated',
    clickable: true,
    floating: true,
    onClick: () => alert('Card clicked!')
});
</script>
```

### Dynamic Modal
```javascript
function showUserProfile(userId) {
    const modal = GlassModal.create({
        header: 'User Profile',
        size: 'large'
    });
    
    modal.setContent(`
        <div class="profile">
            <img src="/api/users/${userId}/avatar" alt="Avatar">
            <h3>Loading user data...</h3>
        </div>
    `);
    
    modal.show();
    
    // Load user data
    fetch(`/api/users/${userId}`)
        .then(r => r.json())
        .then(user => {
            modal.setContent(`
                <div class="profile">
                    <img src="${user.avatar}" alt="Avatar">
                    <h3>${user.name}</h3>
                    <p>${user.email}</p>
                </div>
            `);
        });
}
```

## 🎪 Demo

- **Live Demo**: Open `index.html` - Main showcase
- **Full Components**: Open `demo-modular.html` - All components with examples

## 🌐 Browser Support

| Browser | Version |
|---------|---------|
| Chrome  | 76+     |
| Firefox | 103+    |
| Safari  | 9+      |
| Edge    | 79+     |

*Requires `backdrop-filter` support for glass effects*

## 📱 Mobile Support

All components are responsive and touch-friendly:
- Adaptive sizing on small screens
- Touch gesture support
- Mobile-optimized animations
- Reduced motion respect

## ♿ Accessibility

- ARIA labels and roles
- Keyboard navigation (Tab, Enter, Esc)
- Screen reader support
- High contrast mode support
- Reduced motion preferences

## 🚀 Performance

- Hardware acceleration enabled
- Smooth 60fps animations
- Efficient DOM manipulation
- Memory leak prevention
- Mobile performance optimized

## 📚 API Reference

### Factory Methods
```javascript
LiquidGlass.createButton(text, onClick, options)
LiquidGlass.createCard(content, options)
LiquidGlass.createModal(content, options)
LiquidGlass.createNavbar(items, options)
LiquidGlass.createTooltip(element, content, options)

// Alert/Confirm helpers
LiquidGlass.createAlertModal(title, message, onOk)
LiquidGlass.createConfirmModal(title, message, onYes, onNo)
LiquidGlass.createFormModal(title, fields, onSubmit)
```

### Component Management
```javascript
// Get components
LiquidGlass.findByType('button')
LiquidGlass.findBySelector('.my-buttons')

// Global settings
LiquidGlass.setGlobalOptions({ blur: 30 })

// Statistics
LiquidGlass.getStats() // { total: 5, byType: { button: 2, card: 3 } }

// Cleanup
LiquidGlass.destroyAll()
```

## 📄 License

MIT License - Free for personal and commercial use.

## 🤝 Contributing

Contributions welcome! Please check out the issues page.

---

**Made with ❤️ for beautiful web experiences**

> Ready to create stunning glass interfaces? Download and start building today!