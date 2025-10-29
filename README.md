# 🎧 Audio Only for YouTube™ - Elite Edition

> **Transform YouTube into a pure audio experience with stunning visualizations. Save bandwidth, battery, and your attention.**

A production-ready Chrome extension that converts YouTube videos into an elegant audio-only interface with **8 beautiful visualization skins**, eliminating visual distractions and optimizing performance.

---

## ✨ Features

### 🎨 **Audio Visualization Suite** ⭐ NEW!
- **8 Stunning Built-in Skins**: Spectrum Analyzer, Waveform, Particles, Nebula, Equalizer, Vintage CRT, Cyberpunk Grid, Ambient Colors
- **Real-time Audio Processing**: Web Audio API integration for live frequency analysis
- **Category-Based Organization**: Analytical, Ambient, Vintage, Futuristic, Organic
- **Intensity Levels**: Choose between low, medium, and high intensity visualizations
- **Live Preview Gallery**: See all skins in action before applying
- **Performance Optimized**: GPU-accelerated rendering at 60 FPS

### 🎵 **Elite Audio Interface**
- Beautiful, custom audio visualizations that react to your music
- Real-time frequency spectrum and waveform analysis
- Full playback controls (play/pause, seek, speed control)
- Seamless YouTube UI preservation

### 🚀 **Performance Optimization**
- **Bandwidth Saver**: Reduces data usage by blocking unnecessary video streams
- **Battery Efficient**: Minimizes CPU/GPU usage by disabling video rendering
- **Lightweight**: Minimal memory footprint

### 🎯 **Focus Mode**
- Hide video suggestions and recommendations
- Remove comments section
- Auto theater mode for cleaner layout
- Distraction-free listening experience

### ⌨️ **Keyboard Shortcuts**
- `Ctrl+Shift+A` (Windows/Linux) or `Cmd+Shift+A` (Mac) - Toggle audio-only mode

### 🎨 **Modern UI**
- Dark theme optimized for extended use
- Responsive design for all screen sizes
- Smooth animations and transitions
- Professional gradient styling

---

## 📦 Installation

1. **Download or Clone** this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **"Load unpacked"**
5. Select the extension folder
6. The extension is now installed! 🎉

---

## 🎮 Usage

### Quick Start

1. **Navigate** to any YouTube video
2. **Audio mode activates automatically** (if enabled in settings)
3. **Choose your visualization skin** from the options page
4. **Enjoy** your immersive audio-visual experience!

### Choosing a Visualization Skin

1. **Right-click** the extension icon → **Options**
2. Navigate to the **🎨 Audio Skins** tab
3. **Browse** skins by category (Analytical, Ambient, Vintage, Futuristic, Organic)
4. **Click** any skin to preview it live
5. **Click** "✓ Apply Skin" to activate across all YouTube tabs

### Available Skins

- **🌈 Spectrum Analyzer** - Rainbow frequency bars (Analytical, High)
- **📈 Waveform Display** - Real-time audio waves (Analytical, Medium)
- **✨ Audio Particles** - Dancing particles (Organic, Medium)
- **🌌 Cosmic Nebula** - Space-inspired visuals (Ambient, Low)
- **🎛️ Vintage Equalizer** - Retro equalizer bars (Vintage, High)
- **📺 Retro CRT** - Classic TV display (Vintage, Medium)
- **🔮 Cyberpunk Grid** - Futuristic hexagons (Futuristic, High)
- **🎨 Ambient Colors** - Soothing gradients (Ambient, Low)

### Settings

Access the options page to configure:
- ✅ **Enable Audio Mode** - Auto-activate on YouTube videos
- ✅ **Custom Audio Visualizations** - Show stunning visualizations
- ✅ **Preserve YouTube UI** - Keep all controls visible
- ✅ **Reduce Bandwidth Usage** - Optimize network usage (experimental)

### Keyboard Shortcut

Press `Ctrl+Shift+A` on any YouTube video page to instantly toggle audio-only mode.

### Pro Tips

- **Match the Mood**: Choose skins that complement your content (EDM → Cyberpunk, Classical → Ambient)
- **Save Battery**: Use low-intensity skins (Ambient, Nebula) for longer sessions
- **Multiple Tabs**: Each tab can have a different visualization active
- **Live Preview**: Test animations before applying with the preview button

---

## 📁 Project Structure

```
audio-only-youtube-elite/
├── manifest.json                      # Extension configuration (Manifest V3)
├── icons/                             # Extension icons (16, 32, 48, 128, 512px)
├── _locales/                          # Internationalization
│   └── en/messages.json               # English translations
├── content-scripts/                   # Scripts injected into YouTube pages
│   ├── audio-processor.js             # ⭐ Web Audio API integration
│   ├── visualization-engine.js        # ⭐ 8 visualization skins
│   ├── skin-manager.js                # ⭐ Skin management system
│   ├── controller.js                  # Main orchestrator
│   ├── stream-manager.js              # Bandwidth optimization
│   ├── ui-manager.js                  # Interface controller
│   └── overrides.css                  # Custom styling
├── options/                           # ⭐ Options page (NEW)
│   ├── options.html                   # Settings & skin gallery
│   ├── options.css                    # Modern UI styling
│   ├── options.js                     # Settings management
│   └── skin-gallery.js                # Interactive skin browser
├── background/                        # Service worker
│   └── background.js                  # Background tasks & messaging
└── popup/                             # Extension popup UI
    ├── popup.html                     # Popup structure
    ├── popup.css                      # Popup styling
    └── popup.js                       # Popup logic
```

---

## 🛠️ Technical Details

### Architecture

**Manifest V3 Compliant**
- Modern service worker architecture
- Secure content security policy
- Efficient message passing system

**Modular Design**
- Separation of concerns (Controller, UI, Stream Management)
- Event-driven architecture
- Easy to maintain and extend

**Performance Optimized**
- Minimal DOM manipulation
- Efficient mutation observers
- Lazy loading and initialization

### Technologies

- **JavaScript ES6+** - Modern syntax and features
- **Web Audio API** - Real-time audio processing and frequency analysis
- **Canvas API** - GPU-accelerated visualization rendering
- **Chrome Extension APIs** - Storage, Tabs, Runtime, Commands
- **CSS3** - Animations, gradients, flexbox/grid
- **HTML5** - Semantic markup

### Browser Compatibility

- ✅ Chrome 88+
- ✅ Edge 88+ (Chromium-based)
- ✅ Brave
- ✅ Opera (Chromium-based)

---

## 🔧 Development

### Testing

1. Load the extension in developer mode
2. Navigate to YouTube
3. Open Chrome DevTools (F12)
4. Check console for `[AudioOnly]` logs

### Debugging

- **Content Script**: Page console on YouTube
- **Background Script**: `chrome://extensions/` → Service worker
- **Popup**: Right-click popup → Inspect

---

## 📋 Future Features

- [ ] Multiple language support
- [ ] Custom skin builder
- [ ] Audio quality selector
- [ ] Playlist support
- [ ] Statistics dashboard

---

## 🐛 Troubleshooting

### Common Issues

- **Extension not working?** Refresh the page after enabling
- **Audio not playing?** Check volume settings and browser console
- **Visualizations not showing?** Enable "Custom Audio Visualizations" in settings
- **Performance issues?** Try a lower intensity skin (Ambient, Nebula)

---

## 🤝 Contributing

Contributions are welcome! Fork the repository, create a feature branch, and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Abu Naser Khan**  
GitHub: [@joyelkhan](https://github.com/joyelkhan)

---

## ⚠️ Disclaimer

This extension is not affiliated with, endorsed by, or sponsored by YouTube or Google. YouTube is a trademark of Google LLC.

---

**Made with ❤️ for focused listening and stunning visualizations**

*Version 2.0.0 - Elite Edition with Audio Visualization Suite*

---

## 🎨 Learn More

For detailed information about the audio visualization system, see [AUDIO_VISUALIZATION_GUIDE.md](AUDIO_VISUALIZATION_GUIDE.md)

**GODMODE: ENABLED** 🚀✨
