# Audio Visualization Button - User Guide

## What is it?

A **custom button** that appears in YouTube's video player controls, right next to the CC (subtitles), settings, and fullscreen buttons. It lets you toggle audio visualization mode with a single click!

## Where to Find It

Look in the **bottom-right corner** of any YouTube video player:

```
[Video Player]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                                    [🎵] [CC] [⚙️] [🔲]
                                     ↑
                              Audio Viz Button
```

## How to Use

### Activate Audio Visualization
1. Click the **waveform icon** button
2. Video disappears, audio visualization appears
3. Button turns **blue** to show it's active
4. You'll see a notification: "Audio Visualization ON"

### Deactivate Audio Visualization
1. Click the **blue waveform icon** button again
2. Video returns to normal
3. Button returns to **white**
4. You'll see a notification: "Audio Visualization OFF"

## Visual States

### Inactive (Default)
- **Icon**: White animated waveform
- **Animation**: Bars bounce continuously
- **Meaning**: Audio visualization is OFF

### Active
- **Icon**: Blue static waveform
- **Animation**: Bars stop moving
- **Meaning**: Audio visualization is ON

### Hover
- **Effect**: Button slightly enlarges
- **Opacity**: Increases to 100%
- **Meaning**: Ready to click

## Features

### ✨ Seamless Integration
- Looks and feels like a native YouTube button
- Matches YouTube's design language
- Works on all YouTube video pages

### 🎨 Visual Feedback
- Animated waveform icon
- Color changes when active
- Toast notifications for confirmation
- Smooth hover effects

### 🔄 Persistent
- Automatically appears on every video
- Remembers your preference
- Works when navigating between videos

### ⌨️ Accessible
- Works with keyboard navigation
- Screen reader friendly
- Clear visual focus states

## Tips & Tricks

### Quick Toggle
- **Keyboard**: Use `Ctrl+Shift+A` (or `Cmd+Shift+A` on Mac)
- **Mouse**: Click the button in the player
- **Both work together**: Choose your preferred method

### Best For
- 🎵 Music videos
- 🎙️ Podcasts
- 📻 Radio streams
- 🎸 Live performances
- 🎧 Audio-focused content

### Combine With
- **Background Play**: Keep audio playing when switching tabs
- **Data Saver**: Reduce bandwidth usage
- **Custom Skins**: Choose your favorite visualization style

## Troubleshooting

### Button Not Visible?
- **Wait a moment**: Button appears after player loads (~1 second)
- **Refresh page**: Sometimes helps if YouTube updates
- **Check extension**: Ensure extension is enabled

### Button Not Working?
- **Click again**: Sometimes needs a second click
- **Check console**: Press F12 and look for errors
- **Reload extension**: Disable and re-enable in browser

### Button Disappeared?
- **Navigate to new video**: Button will reappear
- **Check YouTube updates**: YouTube might have changed their player
- **Report issue**: Let us know on GitHub

## Customization

Want to customize the button? Check out:
- `content-scripts/player-button.css` - Change colors, sizes, animations
- `content-scripts/player-button-injector.js` - Modify icon or behavior

## Keyboard Shortcuts

| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| Toggle Audio Mode | `Ctrl+Shift+A` | `Cmd+Shift+A` |
| Open Options | `Ctrl+Shift+O` | `Cmd+Shift+O` |
| Open Extension | `Ctrl+Shift+E` | `Cmd+Shift+E` |

## FAQ

**Q: Does it work on YouTube Music?**  
A: Yes! The button appears on both YouTube and YouTube Music.

**Q: Can I move the button?**  
A: Currently it's fixed next to the settings button. Custom positioning coming soon!

**Q: Does it affect video playback?**  
A: No, it only hides the video display. Audio continues normally.

**Q: Can I change the icon?**  
A: Yes, by editing the `player-button-injector.js` file.

**Q: Does it work on mobile?**  
A: The extension works on desktop browsers. Mobile browser extensions have limited support.

**Q: Will it slow down YouTube?**  
A: No, it's very lightweight and only activates when needed.

## Support

- **Issues**: [GitHub Issues](https://github.com/joyelkhan/youtube-audio-player/issues)
- **Discussions**: [GitHub Discussions](https://github.com/joyelkhan/youtube-audio-player/discussions)
- **Email**: Contact the developer

## What's Next?

Future enhancements planned:
- Customizable button position
- Multiple icon styles
- Quick settings menu
- Animation controls
- Theme options

---

**Enjoy your audio visualization experience!** 🎵✨
