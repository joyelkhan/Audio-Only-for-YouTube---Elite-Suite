# Testing Guide - Audio Visualization Player Button

## Quick Start

### 1. Load the Extension

#### Chrome/Edge
1. Open `chrome://extensions/` (or `edge://extensions/`)
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select the extension folder: `AUDIO ONLY FOR YOUTUBE™ - ELITE EDITION`
5. Extension should appear in your extensions list

#### Firefox
1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on**
3. Navigate to the extension folder
4. Select `manifest.json`
5. Extension loads temporarily

### 2. Test the Button

1. **Open YouTube**: Navigate to https://www.youtube.com
2. **Play a video**: Click any video to open the player
3. **Wait for button**: Look in the bottom-right controls (~1 second)
4. **Locate button**: Find the waveform icon (🎵) next to CC/Settings
5. **Click to toggle**: Click once to activate audio visualization

## Expected Behavior

### ✅ On Video Load
```
[0s]   Video page loads
[0.5s] YouTube player initializes
[1s]   Button appears in controls
[1s]   Button shows white animated waveform
```

### ✅ On Button Click (Activate)
```
[0ms]   Click detected
[10ms]  Button turns blue
[100ms] Video disappears
[200ms] Audio visualization appears
[300ms] Toast shows "Audio Visualization ON"
[2s]    Toast fades out
```

### ✅ On Button Click (Deactivate)
```
[0ms]   Click detected
[10ms]  Button turns white
[100ms] Audio visualization disappears
[200ms] Video reappears
[300ms] Toast shows "Audio Visualization OFF"
[2s]    Toast fades out
```

### ✅ On Navigation
```
[0s]   Click new video link
[0.5s] YouTube navigates (SPA)
[1s]   Button re-appears in new video
[1s]   Button state reflects current mode
```

## Testing Checklist

### Basic Functionality
- [ ] Button appears on video page
- [ ] Button is in the correct position (right controls)
- [ ] Button has waveform icon
- [ ] Icon is animated (bars bouncing)
- [ ] Clicking toggles audio visualization
- [ ] Toast notification appears on toggle
- [ ] Button state persists across toggles

### Visual States
- [ ] **Inactive**: White icon, animated bars
- [ ] **Active**: Blue icon, static bars
- [ ] **Hover**: Opacity increases, slight scale
- [ ] **Focus**: Blue outline visible (keyboard nav)
- [ ] **Click**: Smooth transition between states

### Navigation & Persistence
- [ ] Button appears on first video load
- [ ] Button re-appears when navigating to new video
- [ ] Button state persists across navigation
- [ ] Button works on YouTube Music
- [ ] Button works on embedded videos

### Integration
- [ ] Clicking activates AudioOnlyController
- [ ] Video canvas is hidden when active
- [ ] Audio visualization appears when active
- [ ] Skin manager applies correct skin
- [ ] Audio processor connects to video element

### Accessibility
- [ ] Button has proper ARIA label
- [ ] Button has tooltip on hover
- [ ] Button is keyboard accessible (Tab to focus)
- [ ] Button can be activated with Enter/Space
- [ ] Screen reader announces button state
- [ ] Focus indicator is visible

### Responsive Design
- [ ] Button works on desktop (1920x1080)
- [ ] Button works on laptop (1366x768)
- [ ] Button works on tablet (768x1024)
- [ ] Button scales appropriately
- [ ] Toast notification is readable on all sizes

### Edge Cases
- [ ] Button handles rapid clicking
- [ ] Button works with slow internet
- [ ] Button works when player loads slowly
- [ ] Button works after YouTube updates
- [ ] Button doesn't break other controls
- [ ] Button doesn't interfere with fullscreen
- [ ] Button works in theater mode

### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Edge (latest)
- [ ] Firefox (latest)
- [ ] Opera (if applicable)

## Console Checks

Open browser console (F12) and look for these messages:

### ✅ Expected Console Output
```
[AudioOnly] Elite Controller initialized
[PlayerButton] Initializing button injector
[PlayerButton] Injecting button into player controls
[PlayerButton] Button injected successfully
[PlayerButton] Button clicked
[AudioOnly] Activating surgical audio mode with visualizations
[AudioOnly] Video canvas hidden, UI preserved
```

### ❌ Error Messages to Watch For
```
[PlayerButton] Controls container not found
[PlayerButton] Max retries reached, stopping
[PlayerButton] Controller not found
```

## Manual Testing Steps

### Test 1: First Load
1. Open YouTube homepage
2. Click any video
3. Wait for player to load
4. **Verify**: Button appears in controls
5. **Verify**: Icon is white and animated

### Test 2: Activation
1. Click the button
2. **Verify**: Button turns blue
3. **Verify**: Video disappears
4. **Verify**: Audio visualization appears
5. **Verify**: Toast says "Audio Visualization ON"

### Test 3: Deactivation
1. Click the button again
2. **Verify**: Button turns white
3. **Verify**: Video reappears
4. **Verify**: Audio visualization disappears
5. **Verify**: Toast says "Audio Visualization OFF"

### Test 4: Navigation
1. Activate audio visualization
2. Click a related video
3. **Verify**: Button re-appears
4. **Verify**: Button is still blue (state persisted)
5. **Verify**: Audio visualization is still active

### Test 5: Keyboard Navigation
1. Press Tab until button is focused
2. **Verify**: Blue outline appears
3. Press Enter or Space
4. **Verify**: Audio visualization toggles
5. **Verify**: Button state updates

### Test 6: Rapid Clicking
1. Click button 5 times rapidly
2. **Verify**: No errors in console
3. **Verify**: Final state is correct
4. **Verify**: No duplicate buttons appear

### Test 7: YouTube Music
1. Navigate to https://music.youtube.com
2. Play any song
3. **Verify**: Button appears
4. **Verify**: All functionality works

### Test 8: Fullscreen
1. Click fullscreen button
2. **Verify**: Button is still visible
3. Click audio viz button
4. **Verify**: Toggle works in fullscreen
5. Exit fullscreen
6. **Verify**: Button still works

## Performance Testing

### Load Time
```bash
# Open browser console
# Navigate to YouTube video
# Check Performance tab

Expected:
- Button injection: < 1 second
- No layout shifts
- No performance warnings
```

### Memory Usage
```bash
# Open browser Task Manager (Shift+Esc in Chrome)
# Check extension memory usage

Expected:
- Minimal increase (< 5MB)
- No memory leaks on navigation
```

## Debugging Tips

### Button Not Appearing?
1. Check console for errors
2. Verify `.ytp-right-controls` exists:
   ```javascript
   document.querySelector('.ytp-right-controls')
   ```
3. Check if button was created:
   ```javascript
   document.getElementById('audio-viz-button')
   ```
4. Verify content script loaded:
   ```javascript
   window.playerButtonInjector
   ```

### Button Not Working?
1. Check controller exists:
   ```javascript
   window.audioOnlyController
   ```
2. Check controller state:
   ```javascript
   window.audioOnlyController.isActive
   ```
3. Manually trigger toggle:
   ```javascript
   window.audioOnlyController.toggleAudioMode(true)
   ```

### Button Disappeared?
1. Check if navigation occurred
2. Look for console errors
3. Manually re-inject:
   ```javascript
   window.playerButtonInjector.injectButton()
   ```

## Automated Testing (Optional)

### Using Playwright
```javascript
// test-button.spec.js
const { test, expect } = require('@playwright/test');

test('button appears on video page', async ({ page }) => {
  await page.goto('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  await page.waitForSelector('#audio-viz-button', { timeout: 5000 });
  const button = await page.$('#audio-viz-button');
  expect(button).toBeTruthy();
});

test('button toggles audio visualization', async ({ page }) => {
  await page.goto('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  await page.waitForSelector('#audio-viz-button');
  await page.click('#audio-viz-button');
  const isActive = await page.evaluate(() => {
    return window.audioOnlyController.isActive;
  });
  expect(isActive).toBe(true);
});
```

## Reporting Issues

If you find a bug, please report with:

1. **Browser**: Chrome/Edge/Firefox + version
2. **OS**: Windows/Mac/Linux
3. **Steps to reproduce**: Detailed steps
4. **Expected behavior**: What should happen
5. **Actual behavior**: What actually happened
6. **Console errors**: Any error messages
7. **Screenshots**: If applicable

## Success Criteria

✅ **All tests pass**
✅ **No console errors**
✅ **Button appears consistently**
✅ **Toggle works reliably**
✅ **State persists correctly**
✅ **No performance issues**
✅ **Accessible via keyboard**
✅ **Works on YouTube & YouTube Music**

---

**Ready to test!** 🚀

If all tests pass, the feature is ready for production use.
