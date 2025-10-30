# YouTube Player Button Placement Diagram

## Visual Layout

### Desktop View

```
┌────────────────────────────────────────────────────────────────────┐
│                        YouTube Video Player                         │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                                                              │  │
│  │                                                              │  │
│  │                      VIDEO CONTENT                           │  │
│  │                  (or Audio Visualization)                    │  │
│  │                                                              │  │
│  │                                                              │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ ▶️ ⏮️ ⏭️  ━━━━━●━━━━━━━━  0:45 / 3:24  🔊 ━━●━  [🎵][CC][⚙️][🔲]│
│  │                                                     ↑           │
│  │                                            Audio Viz Button     │
│  └─────────────────────────────────────────────────────────────┘  │
│                         Player Controls                             │
└────────────────────────────────────────────────────────────────────┘
```

### Control Bar Breakdown

```
Left Controls          Progress Bar           Volume      Right Controls
┌──────────┐     ┌────────────────────┐    ┌──────┐   ┌─────────────────┐
│ ▶️ ⏮️ ⏭️  │     │ ━━━━━●━━━━━━━━     │    │ 🔊 ━● │   │ [🎵][CC][⚙️][🔲] │
└──────────┘     └────────────────────┘    └──────┘   └─────────────────┘
                                                              ↑
                                                        Our Custom Button
```

### Right Controls Detail

```
┌─────────────────────────────────────────┐
│  Audio Viz    CC      Settings  Theater │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐│
│  │  🎵  │  │  CC  │  │  ⚙️  │  │  🔲  ││
│  └──────┘  └──────┘  └──────┘  └──────┘│
│     ↑                                    │
│  Our Button                              │
└─────────────────────────────────────────┘
```

## Button States

### Inactive State (Default)
```
┌──────────┐
│    🎵    │  ← White, animated waveform
│  ▂▄▆▄▂  │     Bars bouncing
└──────────┘
```

### Active State
```
┌──────────┐
│    🎵    │  ← Blue (#3ea6ff), static
│  ▂▄▆▄▂  │     Bars frozen
└──────────┘
```

### Hover State
```
┌──────────┐
│    🎵    │  ← Slightly larger (1.05x)
│  ▂▄▆▄▂  │     100% opacity
└──────────┘     Cursor: pointer
```

## DOM Structure

```html
<div class="ytp-right-controls">
  
  <!-- Our Custom Button (INJECTED) -->
  <button id="audio-viz-button" 
          class="ytp-button audio-viz-button"
          aria-label="Toggle Audio Visualization"
          title="Toggle Audio Visualization">
    <svg class="audio-viz-icon" viewBox="0 0 36 36">
      <g class="audio-viz-icon-bars">
        <rect class="bar bar-1">...</rect>
        <rect class="bar bar-2">...</rect>
        <rect class="bar bar-3">...</rect>
        <rect class="bar bar-4">...</rect>
        <rect class="bar bar-5">...</rect>
      </g>
    </svg>
  </button>
  
  <!-- YouTube's Native Buttons -->
  <button class="ytp-subtitles-button">...</button>
  <button class="ytp-settings-button">...</button>
  <button class="ytp-size-button">...</button>
  <button class="ytp-fullscreen-button">...</button>
  
</div>
```

## Injection Process

```
Step 1: Wait for YouTube Player
┌─────────────────────────────┐
│ Document loads              │
│ YouTube player initializes  │
│ Wait for .ytp-right-controls│
└─────────────────────────────┘
              ↓
Step 2: Create Button Element
┌─────────────────────────────┐
│ Create <button> element     │
│ Add classes & attributes    │
│ Insert SVG icon             │
│ Attach click handler        │
└─────────────────────────────┘
              ↓
Step 3: Insert into DOM
┌─────────────────────────────┐
│ Find .ytp-settings-button   │
│ Insert before settings btn  │
│ Button appears in controls  │
└─────────────────────────────┘
              ↓
Step 4: Update State
┌─────────────────────────────┐
│ Check AudioOnlyController   │
│ Update button appearance    │
│ Ready for user interaction  │
└─────────────────────────────┘
```

## Responsive Behavior

### Desktop (> 768px)
```
Button Size: 48x48px
Icon Size: 36x36px
Spacing: Standard YouTube spacing
```

### Mobile (≤ 768px)
```
Button Size: 40x40px
Icon Size: 30x30px
Spacing: Compact
```

## Z-Index Layering

```
Layer 5: Toast Notification (z-index: 9999)
         ┌──────────────────────┐
         │ Audio Visualization  │
         │        ON            │
         └──────────────────────┘

Layer 4: (unused)

Layer 3: (unused)

Layer 2: (unused)

Layer 1: Button (z-index: 100)
         ┌──────┐
         │  🎵  │
         └──────┘

Layer 0: YouTube Controls (default)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Click Flow

```
User Clicks Button
       ↓
handleButtonClick()
       ↓
Check AudioOnlyController
       ↓
   ┌─────────┴─────────┐
   ↓                   ↓
Active?            Inactive?
   ↓                   ↓
Deactivate         Activate
   ↓                   ↓
   └─────────┬─────────┘
             ↓
    updateButtonState()
             ↓
    showNotification()
             ↓
         Complete
```

## CSS Selectors

### Target Elements
```css
/* Button container */
.ytp-right-controls

/* Our button */
#audio-viz-button
.audio-viz-button

/* Icon elements */
.audio-viz-icon
.audio-viz-icon-bars
.bar

/* States */
.audio-viz-button.active
.audio-viz-button:hover
.audio-viz-button:focus-visible

/* Toast */
.audio-viz-toast
.audio-viz-toast.show
```

## Animation Timeline

### Inactive State (Continuous)
```
Bar 1: 1.2s cycle
Bar 2: 1.0s cycle
Bar 3: 0.8s cycle
Bar 4: 1.1s cycle
Bar 5: 1.3s cycle

Each bar oscillates:
Height: min → max → min
Y-pos: high → low → high
```

### Activation Transition
```
0ms:   Click detected
10ms:  Button state changes
100ms: Color transitions to blue
200ms: Animations pause
300ms: Toast appears
2000ms: Toast fades out
2300ms: Toast removed
```

## Accessibility Tree

```
<button> "Toggle Audio Visualization"
  ├─ role: button
  ├─ aria-label: "Toggle Audio Visualization"
  ├─ aria-pressed: "false" | "true"
  ├─ title: "Toggle Audio Visualization"
  └─ focusable: true
```

---

**Note**: All measurements and positions are approximate and may vary slightly based on YouTube's current design.
