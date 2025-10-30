# Player Button - Quick Reference Card

## 🚀 Quick Start

```javascript
// Button is auto-initialized
window.playerButtonInjector

// Manually trigger injection
window.playerButtonInjector.injectButton()

// Update button state
window.playerButtonInjector.updateButtonState()

// Destroy button
window.playerButtonInjector.destroy()
```

## 📍 DOM Selectors

```javascript
// Button element
document.getElementById('audio-viz-button')
document.querySelector('.audio-viz-button')

// Controls container
document.querySelector('.ytp-right-controls')

// Settings button (reference point)
document.querySelector('.ytp-settings-button')
```

## 🎨 CSS Classes

```css
/* Button */
.audio-viz-button          /* Base button */
.audio-viz-button.active   /* Active state */
.audio-viz-button:hover    /* Hover state */

/* Icon */
.audio-viz-icon            /* SVG container */
.audio-viz-icon-bars       /* Bars group */
.bar                       /* Individual bar */

/* Toast */
.audio-viz-toast           /* Notification */
.audio-viz-toast.show      /* Visible state */
```

## 🔧 Key Methods

```javascript
// PlayerButtonInjector class
init()                     // Initialize injector
waitForPlayer()            // Wait for YouTube player
getControlsContainer()     // Get controls element
injectButton()             // Create and inject button
getButtonIcon()            // Return SVG icon
handleButtonClick()        // Handle click event
updateButtonState()        // Update appearance
showNotification(msg)      // Show toast
setupNavigationListener()  // Watch for navigation
handleNavigation()         // Re-inject on nav
destroy()                  // Cleanup
```

## 📊 State Properties

```javascript
{
  button: HTMLElement,           // Button element
  isInjected: boolean,           // In DOM?
  retryCount: number,            // Attempts
  maxRetries: 20,                // Max attempts
  observer: MutationObserver     // Nav watcher
}
```

## ⚡ Events

```javascript
// Click event
button.addEventListener('click', handleButtonClick)

// Navigation detection
observer.observe(document.body, {
  childList: true,
  subtree: true
})
```

## 🎯 Integration Points

```javascript
// Controller
window.audioOnlyController.isActive
window.audioOnlyController.activateAudioMode()
window.audioOnlyController.deactivateAudioMode()

// Skin Manager
window.skinManager.getCurrentSkin()
window.skinManager.setSkin(skinId, container)

// Audio Processor
window.audioProcessor.connectToVideoElement(video)
window.audioProcessor.disconnect()
```

## 🔍 Debugging

```javascript
// Check if button exists
!!document.getElementById('audio-viz-button')

// Check controller
!!window.audioOnlyController

// Check controller state
window.audioOnlyController?.isActive

// Check controls container
!!document.querySelector('.ytp-right-controls')

// Force re-injection
window.playerButtonInjector.destroy()
window.playerButtonInjector.injectButton()
```

## 📏 Dimensions

```css
/* Desktop */
width: 48px
height: 48px

/* Mobile */
width: 40px
height: 40px

/* Icon */
viewBox: 0 0 36 36
```

## 🎨 Colors

```css
/* Inactive */
fill: #fff
opacity: 0.9

/* Active */
fill: #3ea6ff
opacity: 1

/* Hover */
opacity: 1
```

## ⏱️ Timings

```javascript
// Injection
checkInterval: 500ms
maxRetries: 20 (10 seconds)

// Re-injection
navigationDelay: 1000ms

// Toast
showDuration: 2000ms
fadeOut: 300ms
```

## 🔄 Animation Durations

```css
bar-1: 1.2s
bar-2: 1.0s
bar-3: 0.8s
bar-4: 1.1s
bar-5: 1.3s
```

## 📝 Console Messages

```javascript
// Success
'[PlayerButton] Initializing button injector'
'[PlayerButton] Injecting button into player controls'
'[PlayerButton] Button injected successfully'
'[PlayerButton] Button clicked'

// Errors
'[PlayerButton] Controls container not found'
'[PlayerButton] Max retries reached, stopping'
'[PlayerButton] Controller not found'
```

## 🛠️ Common Tasks

### Change Icon Color
```css
.audio-viz-button.active .bar {
    fill: #ff0000; /* Your color */
}
```

### Change Button Size
```css
.audio-viz-button {
    width: 56px;
    height: 56px;
}
```

### Change Position
```javascript
// End of controls
controlsContainer.appendChild(this.button)

// Before specific button
const targetBtn = document.querySelector('.ytp-fullscreen-button')
controlsContainer.insertBefore(this.button, targetBtn)
```

### Disable Animations
```css
.audio-viz-icon-bars .bar animate {
    display: none;
}
```

### Custom Toast Duration
```javascript
setTimeout(() => {
    toast.classList.remove('show')
    setTimeout(() => toast.remove(), 300)
}, 5000) // 5 seconds instead of 2
```

## 🐛 Common Issues

### Button Not Appearing
```javascript
// Check player loaded
!!document.querySelector('.ytp-right-controls')

// Check retry count
window.playerButtonInjector.retryCount

// Force injection
window.playerButtonInjector.injectButton()
```

### Button Not Responding
```javascript
// Check controller
!!window.audioOnlyController

// Check event listener
window.playerButtonInjector.button.onclick

// Manually toggle
window.audioOnlyController.toggleAudioMode(true)
```

### Button Duplicated
```javascript
// Remove duplicates
document.querySelectorAll('#audio-viz-button').forEach((btn, i) => {
    if (i > 0) btn.remove()
})
```

## 📦 Files

```
content-scripts/
├── player-button-injector.js  (8.5 KB)
└── player-button.css          (2.8 KB)

docs/
├── PLAYER_BUTTON_FEATURE.md
├── PLAYER_BUTTON_USER_GUIDE.md
├── BUTTON_PLACEMENT_DIAGRAM.md
└── BUTTON_FEATURE_README.md
```

## 🔗 Dependencies

```javascript
// Required
- AudioOnlyController
- YouTube player (.ytp-right-controls)

// Optional
- SkinManager
- AudioProcessor
- VisualizationEngine
```

## ✅ Testing Checklist

```
[ ] Button appears
[ ] Button positioned correctly
[ ] Click toggles mode
[ ] State persists
[ ] Toast shows
[ ] Keyboard works
[ ] Responsive
[ ] Accessible
```

## 📞 Support

- **Docs**: `docs/PLAYER_BUTTON_*.md`
- **Issues**: GitHub Issues
- **Code**: `content-scripts/player-button-*`

---

**Quick Tip**: Use browser DevTools to inspect the button element and test changes in real-time!
