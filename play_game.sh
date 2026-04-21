#!/bin/bash

echo "🎮 Galaxy Defender - Space Shooter Game 🚀"
echo "=========================================="
echo ""
echo "To play the game:"
echo "1. Simply double-click the 'index.html' file"
echo "2. Or right-click and choose 'Open With' -> Your browser"
echo "3. Or drag and drop index.html into browser window"
echo ""
echo "📋 Game Controls:"
echo "   ← → Arrow Keys  : Move spaceship"
echo "   SPACEBAR        : Shoot lasers"
echo "   P               : Pause/Resume"
echo "   R               : Restart game"
echo ""
echo "🎯 Game Features:"
echo "   - Destroy alien ships for points"
echo "   - Collect power-ups (Health, Rapid Fire, Shield)"
echo "   - Level up as you progress"
echo "   - Beautiful space graphics and effects"
echo ""
echo "Enjoy the game! May the force be with you! ✨"

# Try to open the game automatically if on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    read -p "Would you like to open the game now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open index.html
    fi
fi