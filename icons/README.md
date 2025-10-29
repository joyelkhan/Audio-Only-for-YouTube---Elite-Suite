# Extension Icons

## Required Icon Sizes

The extension requires the following PNG icon sizes:
- `icon-16.png` (16x16 pixels)
- `icon-32.png` (32x32 pixels)
- `icon-48.png` (48x48 pixels)
- `icon-128.png` (128x128 pixels)
- `icon-512.png` (512x512 pixels)

## Creating Icons from SVG

A base SVG icon (`icon.svg`) has been provided. You can convert it to PNG using:

### Online Tools
- https://cloudconvert.com/svg-to-png
- https://svgtopng.com/

### Command Line (ImageMagick)
```bash
magick icon.svg -resize 16x16 icon-16.png
magick icon.svg -resize 32x32 icon-32.png
magick icon.svg -resize 48x48 icon-48.png
magick icon.svg -resize 128x128 icon-128.png
magick icon.svg -resize 512x512 icon-512.png
```

### Command Line (Inkscape)
```bash
inkscape icon.svg --export-filename=icon-16.png --export-width=16 --export-height=16
inkscape icon.svg --export-filename=icon-32.png --export-width=32 --export-height=32
inkscape icon.svg --export-filename=icon-48.png --export-width=48 --export-height=48
inkscape icon.svg --export-filename=icon-128.png --export-width=128 --export-height=128
inkscape icon.svg --export-filename=icon-512.png --export-width=512 --export-height=512
```

## Temporary Solution

For testing purposes, you can temporarily use placeholder images:
1. Create simple colored squares in any image editor
2. Name them according to the required sizes
3. Replace them with proper icons before publishing

## Design Guidelines

- **Theme**: Audio/headphones with sound waves
- **Colors**: Red (#ff4444) primary, white accents
- **Style**: Modern, minimalist, bold
- **Text**: "ELITE" badge for branding
