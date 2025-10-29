# PowerShell script to create placeholder icon files
# These are minimal placeholders - replace with proper icons before publishing

$sizes = @(16, 32, 48, 128, 512)

Add-Type -AssemblyName System.Drawing

foreach ($size in $sizes) {
    $bitmap = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # Fill with red background
    $redBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 68, 68))
    $graphics.FillRectangle($redBrush, 0, 0, $size, $size)
    
    # Add white circle in center (simplified headphone representation)
    $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $margin = [int]($size * 0.2)
    $circleSize = $size - ($margin * 2)
    $graphics.FillEllipse($whiteBrush, $margin, $margin, $circleSize, $circleSize)
    
    # Add red circle in center (to create ring effect)
    $innerMargin = [int]($size * 0.35)
    $innerSize = $size - ($innerMargin * 2)
    $graphics.FillEllipse($redBrush, $innerMargin, $innerMargin, $innerSize, $innerSize)
    
    # Save
    $filename = "icon-$size.png"
    $bitmap.Save("$PSScriptRoot\$filename", [System.Drawing.Imaging.ImageFormat]::Png)
    
    Write-Host "Created $filename"
    
    # Cleanup
    $graphics.Dispose()
    $bitmap.Dispose()
    $redBrush.Dispose()
    $whiteBrush.Dispose()
}

Write-Host "`nPlaceholder icons created successfully!"
Write-Host "IMPORTANT: Replace these with professional icons before publishing."
