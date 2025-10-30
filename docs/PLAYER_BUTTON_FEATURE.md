# YouTube Player Control Bar Button - Audio Visualization Toggle

## Overview

This feature adds a **custom Audio Visualization button** directly into YouTube's native video player control bar, positioned alongside the CC (subtitles), settings, and fullscreen buttons in the bottom-right corner.

## Features

### 🎯 Native Integration
- **Seamless placement**: Button appears in YouTube's `.ytp-right-controls` container
- **Matches YouTube's design**: Uses the same styling, sizing, and hover effects as native controls
- **Persistent across navigation**: Automatically re-injects when navigating between videos (YouTube SPA behavior)

### 🎨 Visual Design
- **Animated waveform icon**: 5-bar equalizer with smooth animations
- **Active state indicator**: Changes to YouTube's blue accent color (#3ea6ff) when audio visualization is active
- **Hover effects**: Smooth opacity and scale transitions
- **Accessibility**: Includes ARIA labels and keyboard focus states

### ⚡ Functionality
- **One-click toggle**: Click to activate/deactivate audio visualization mode
- **Toast notifications**: Brief confirmation messages when toggling
- **State synchronization**: Button reflects the current audio visualization state
- **Smart initialization**: Waits for YouTube player to fully load before injection

## Technical Implementation

### File Structure

```
content-scripts/
├── player-button-injector.js    # Main injection logic
└── player-button.css            # Button styling
```

### How It Works

#### 1. Player Detection
```javascript
getControlsContainer() {
    return document.querySelector('.ytp-right-controls');
}
```
Locates YouTube's right controls container where CC, settings, and fullscreen buttons live.

#### 2. Button Injection
The button is created and inserted before the settings button:
```javascript
const settingsButton = controlsContainer.querySelector('.ytp-settings-button');
controlsContainer.insertBefore(this.button, settingsButton);
```

#### 3. Icon Design
Custom SVG with 5 animated bars creating a waveform effect:
- Each bar has different animation timing (0.8s - 1.3s)
- Bars animate height and Y position for a "bouncing" effect
- Animations pause when audio visualization is active

#### 4. State Management
- Communicates with `AudioOnlyController` to toggle audio mode
- Updates button appearance based on active state
- Shows toast notifications for user feedback

### Key Classes

#### `PlayerButtonInjector`
Main class that handles:
- Player detection and retry logic (max 20 retries, 500ms intervals)
- Button creation and injection
- Click event handling
- Navigation detection for YouTube SPA
- State synchronization

### CSS Styling

#### Button States
- **Default**: White icon, 90% opacity
- **Hover**: 100% opacity, 1.05x scale
- **Active**: Blue icon (#3ea6ff), paused animations
- **Focus**: Blue outline for keyboard navigation

#### Responsive Design
- Desktop: 48x48px button
- Mobile: 40x40px button
- Toast notifications scale appropriately

## Integration with Existing Features

### Works With
- ✅ `AudioOnlyController` - Toggles audio visualization mode
- ✅ `SkinManager` - Activates user's preferred visualization skin
- ✅ `AudioProcessor` - Connects to video element for audio analysis
- ✅ `VisualizationEngine` - Renders the visual effects

### Load Order
1. `controller.js` initializes first
2. `player-button-injector.js` waits for controller
3. Button injector waits for YouTube player to load
4. Button is injected into controls

## User Experience

### First-Time Use
1. User opens a YouTube video
2. Custom button appears in player controls after ~1 second
3. Button shows animated waveform icon
4. Clicking activates audio visualization
5. Button turns blue to indicate active state
6. Toast notification confirms activation

### Navigation
- Button automatically re-appears on new videos
- State persists across navigation
- No manual re-initialization needed

## Browser Compatibility

- ✅ Chrome/Edge (Manifest V3)
- ✅ Firefox (with Manifest V3 support)
- ✅ All modern browsers supporting SVG animations

## Accessibility

- **ARIA labels**: `aria-label="Toggle Audio Visualization"`
- **ARIA pressed state**: `aria-pressed="true/false"`
- **Keyboard navigation**: Full keyboard support with visible focus states
- **Screen readers**: Properly announced button state

## Performance

- **Minimal overhead**: Only runs on YouTube video pages
- **Efficient detection**: Uses MutationObserver for navigation
- **Smart retry**: Stops after 20 attempts (10 seconds)
- **No polling**: Event-driven architecture

## Customization Options

### Icon Customization
Modify the SVG in `getButtonIcon()` method:
```javascript
getButtonIcon() {
    return `<svg>...</svg>`;
}
```

### Position Customization
Change insertion point in `injectButton()`:
```javascript
// Insert before settings button (default)
controlsContainer.insertBefore(this.button, settingsButton);

// Or insert at the end
controlsContainer.appendChild(this.button);
```

### Styling Customization
Edit `player-button.css`:
- Change colors
- Adjust sizes
- Modify animations
- Update hover effects

## Troubleshooting

### Button Not Appearing
1. Check browser console for errors
2. Verify YouTube player is fully loaded
3. Check if `.ytp-right-controls` exists
4. Ensure content script is injected

### Button Disappears on Navigation
- This is handled automatically
- Check MutationObserver is working
- Verify navigation detection logic

### Button Not Responding
- Ensure `AudioOnlyController` is initialized
- Check click event handler
- Verify controller methods are accessible

## Future Enhancements

### Potential Additions
- [ ] Customizable button position
- [ ] Multiple icon styles
- [ ] Keyboard shortcut display
- [ ] Settings submenu
- [ ] Animation speed control
- [ ] Color theme options

## Code Example

### Basic Usage
```javascript
// Button is automatically initialized
// Access via global instance
window.playerButtonInjector

// Manually trigger injection
window.playerButtonInjector.injectButton();

// Update button state
window.playerButtonInjector.updateButtonState();

// Destroy button
window.playerButtonInjector.destroy();
```

## Testing Checklist

- [ ] Button appears on video page load
- [ ] Button positioned correctly in controls
- [ ] Click toggles audio visualization
- [ ] Active state shows blue color
- [ ] Toast notification appears
- [ ] Button persists on navigation
- [ ] Hover effects work smoothly
- [ ] Keyboard navigation works
- [ ] Mobile responsive
- [ ] Dark theme compatible

## Credits

- **Design**: Matches YouTube's native control design system
- **Icon**: Custom animated waveform SVG
- **Integration**: Seamless injection into YouTube's player

---

**Version**: 1.0.0  
**Last Updated**: October 30, 2024  
**Author**: Abu Naser Khan
