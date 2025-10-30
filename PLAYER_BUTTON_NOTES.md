# Audio Visualization Player Button - Quick Notes

## What It Does
Adds a custom button to YouTube's video player that toggles audio visualization mode with one click.

## Button Location
**Left controls** - appears after the volume slider (not in the right controls with CC/settings)

## Icon Design
Simple wave path - clean and minimal, no complex animations

## How It Works
1. Waits for `.ytp-left-controls` to load
2. Creates button with wave SVG icon
3. Appends to end of left controls
4. Toggles `AudioOnlyController` on click
5. Shows toast notification
6. Re-injects on navigation

## Files
- `content-scripts/player-button-injector.js` - Main logic
- `content-scripts/player-button.css` - Styling
- `manifest.json` - Includes scripts

## Visual States
- **Inactive**: White wave icon
- **Active**: Blue wave icon (#3ea6ff)
- **Hover**: Opacity 100%, slight scale

## Testing
1. Load extension
2. Open YouTube video
3. Look for wave icon after volume slider
4. Click to toggle audio visualization
5. Button should turn blue when active

## Notes
- Simplified from original complex animated bars
- Moved from right controls to left controls
- Removed excessive documentation files
- Clean, minimal implementation
