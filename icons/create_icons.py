#!/usr/bin/env python3
"""
Simple icon generator for Chrome extension
Creates placeholder PNG icons in required sizes
"""

try:
    from PIL import Image, ImageDraw
    print("✓ PIL/Pillow is installed")
except ImportError:
    print("✗ PIL/Pillow not found. Installing...")
    import subprocess
    subprocess.check_call(['pip', 'install', 'Pillow'])
    from PIL import Image, ImageDraw

import os

# Icon sizes required by Chrome
SIZES = [16, 32, 48, 128, 512]

# Colors
RED = (255, 68, 68)
WHITE = (255, 255, 255)

def create_icon(size):
    """Create a simple circular icon"""
    # Create image with red background
    img = Image.new('RGBA', (size, size), RED)
    draw = ImageDraw.Draw(img)
    
    # Draw white circle (headphone ring)
    margin = int(size * 0.15)
    draw.ellipse([margin, margin, size-margin, size-margin], fill=WHITE)
    
    # Draw red inner circle
    inner_margin = int(size * 0.3)
    draw.ellipse([inner_margin, inner_margin, size-inner_margin, size-inner_margin], fill=RED)
    
    return img

def main():
    print("\n🎧 Audio Only for YouTube - Icon Generator\n")
    print("=" * 50)
    
    # Get script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    for size in SIZES:
        filename = f"icon-{size}.png"
        filepath = os.path.join(script_dir, filename)
        
        print(f"Creating {filename}...", end=" ")
        
        try:
            icon = create_icon(size)
            icon.save(filepath, 'PNG')
            print(f"✓ Created ({os.path.getsize(filepath)} bytes)")
        except Exception as e:
            print(f"✗ Failed: {e}")
    
    print("=" * 50)
    print("\n✅ Icon generation complete!")
    print("\nNext steps:")
    print("1. Go to chrome://extensions/")
    print("2. Click 'Load unpacked'")
    print("3. Select the extension folder")
    print("\n🎉 Your extension is ready to load!\n")

if __name__ == "__main__":
    main()
