# 📦 Installation Guide

## Audio Only for YouTube™ - Elite Edition

This guide will walk you through installing the extension in Chrome.

---

## 🚀 Quick Installation (5 minutes)

### Step 1: Prepare the Extension

1. **Download** or clone this repository to your computer
2. **Extract** the files if downloaded as a ZIP
3. **Note the folder location** - you'll need it in Step 3

### Step 2: Open Chrome Extensions Page

**Method A: Via Menu**
1. Click the three-dot menu (⋮) in the top-right corner of Chrome
2. Navigate to: **More Tools** → **Extensions**

**Method B: Via Address Bar**
1. Type `chrome://extensions/` in the address bar
2. Press Enter

### Step 3: Enable Developer Mode

1. Look for the **"Developer mode"** toggle in the top-right corner
2. **Turn it ON** (it should turn blue)
3. New buttons will appear: "Load unpacked", "Pack extension", "Update"

### Step 4: Load the Extension

1. Click the **"Load unpacked"** button
2. Navigate to the extension folder:
   ```
   AUDIO ONLY FOR YOUTUBE™ - ELITE EDITION
   ```
3. Select the folder and click **"Select Folder"** or **"Open"**

### Step 5: Verify Installation

✅ You should see the extension card appear with:
- Extension name: "Audio Only for YouTube™ - Elite Edition"
- Version: 1.0.0
- Status: Enabled (toggle should be ON)
- Icon: Red circular icon

### Step 6: Pin the Extension (Optional but Recommended)

1. Click the **puzzle piece icon** (🧩) in Chrome's toolbar
2. Find "Audio Only for YouTube™ - Elite Edition"
3. Click the **pin icon** (📌) next to it
4. The extension icon will now appear in your toolbar

---

## ✅ Testing the Installation

### Test 1: Open the Popup

1. Click the extension icon in your toolbar
2. You should see the popup interface with:
   - "Audio Only Elite" header
   - Status indicator
   - Toggle switch
   - Settings options

### Test 2: Try on YouTube

1. Navigate to any YouTube video (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)
2. Click the extension icon
3. Toggle the "Audio-Only Mode" switch to ON
4. The page should transform into the audio interface

### Test 3: Keyboard Shortcut

1. On a YouTube video page
2. Press `Ctrl+Shift+A` (Windows/Linux) or `Cmd+Shift+A` (Mac)
3. Audio mode should toggle on/off

---

## 🔧 Troubleshooting Installation

### Problem: "Load unpacked" button is grayed out

**Solution**: Make sure Developer mode is enabled (toggle in top-right)

### Problem: "Manifest file is missing or unreadable"

**Solution**: 
- Ensure you selected the correct folder containing `manifest.json`
- Check that all files were extracted properly
- Verify the folder structure matches the documentation

### Problem: Extension loads but doesn't work

**Solution**:
1. Check that the extension is enabled (toggle is ON)
2. Refresh any open YouTube tabs
3. Check Chrome version (must be 88+)
4. Look for errors in the extension details page

### Problem: Icons not showing

**Solution**:
- The placeholder icons need to be created
- See `icons/README.md` for instructions
- Extension will still work without proper icons

### Problem: "This extension may not be from the Chrome Web Store"

**Solution**: This is normal for unpacked extensions. Click "Keep" or dismiss the warning.

---

## 🔄 Updating the Extension

When you make changes to the extension code:

1. Go to `chrome://extensions/`
2. Find "Audio Only for YouTube™ - Elite Edition"
3. Click the **refresh icon** (🔄) on the extension card
4. Refresh any open YouTube tabs

---

## 🗑️ Uninstalling

If you want to remove the extension:

1. Go to `chrome://extensions/`
2. Find "Audio Only for YouTube™ - Elite Edition"
3. Click **"Remove"**
4. Confirm the removal

---

## 📋 System Requirements

### Minimum Requirements
- **Browser**: Chrome 88 or higher
- **OS**: Windows 7+, macOS 10.11+, Linux
- **RAM**: 4GB (recommended)
- **Storage**: ~5MB for extension files

### Recommended
- **Browser**: Latest version of Chrome
- **Connection**: Any (works offline once YouTube page loads)

---

## 🔐 Permissions Explained

The extension requests these permissions:

| Permission | Why It's Needed |
|------------|-----------------|
| `storage` | Save your settings and preferences |
| `activeTab` | Access the current YouTube tab |
| `scripting` | Inject the audio interface into YouTube |
| `https://*.youtube.com/*` | Only works on YouTube domains |

**Privacy Note**: This extension does NOT:
- ❌ Track your browsing history
- ❌ Collect personal data
- ❌ Send data to external servers
- ❌ Access non-YouTube websites

---

## 🌐 Browser Compatibility

### Fully Supported
- ✅ Google Chrome (88+)
- ✅ Microsoft Edge (88+, Chromium-based)
- ✅ Brave Browser
- ✅ Opera (Chromium-based)

### Not Supported
- ❌ Firefox (uses different extension API)
- ❌ Safari (uses different extension API)
- ❌ Internet Explorer (discontinued)

---

## 📞 Need Help?

If you encounter issues not covered here:

1. **Check the main README.md** for additional troubleshooting
2. **Open an issue** on GitHub with:
   - Your Chrome version
   - Operating system
   - Steps to reproduce the problem
   - Screenshots if applicable
3. **Email support**: feedback@audioonlyelite.com

---

## 🎉 You're All Set!

The extension is now installed and ready to use. Enjoy your distraction-free YouTube audio experience!

**Next Steps:**
- Customize settings in the popup
- Try the keyboard shortcut (`Ctrl+Shift+A`)
- Explore all the features
- Share with friends who need focus! 🎧

---

*Last updated: October 2025*
