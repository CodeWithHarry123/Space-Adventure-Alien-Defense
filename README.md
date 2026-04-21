# Galaxy Defender - Space Shooter Game

An exciting HTML5 space shooter game built with pure JavaScript, HTML, and CSS. Defend Earth from alien invasion in this epic space battle!

## 🎮 Game Features

- **Beautiful Space Graphics**: Stunning visual effects with stars, explosions, and animated spaceships
- **Power-up System**: Collect health boosts, rapid fire, and shields
- **Progressive Difficulty**: Enemies get faster and more numerous as you level up
- **Score Tracking**: Track your score, enemies destroyed, and level progression
- **Responsive Design**: Works on desktop and tablet devices
- **Keyboard Controls**: Intuitive arrow key and spacebar controls

## 🚀 How to Play

1. **Move Spaceship**: Use `←` `→` arrow keys or `A` `D` keys
2. **Fire Lasers**: Press `SPACEBAR`
3. **Pause/Resume**: Press `P` key
4. **Restart Game**: Press `R` key

### Game Objectives:
- Destroy alien ships to earn points (10-20 points each)
- Avoid collisions with enemies (lose 10 health per hit)
- Collect power-ups for special abilities
- Survive as long as possible to achieve high scores

## 🎯 Power-ups

- **❤️ Health Boost**: Restores 30 health points
- **⚡ Rapid Fire**: Temporarily increases firing rate
- **🛡️ Shield**: Provides temporary invincibility

## 📁 Project Structure

```
├── index.html      # Main game HTML file
├── style.css       # Game styling and animations
├── game.js         # Game engine and logic
└── README.md       # This file
```

## 🖥️ Running the Game

Simply open `index.html` in any modern web browser (Chrome, Firefox, Edge, Safari).

### Quick Start with Python:
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

## 🎨 Technologies Used

- **HTML5 Canvas**: For game rendering
- **Vanilla JavaScript**: Game logic and mechanics
- **CSS3**: Modern styling with gradients and animations
- **Font Awesome**: Icons
- **Google Fonts**: Orbitron and Roboto fonts

## 🎯 Game Mechanics

- **Health System**: Start with 100 health, game over at 0
- **Scoring**: Earn points for each enemy destroyed
- **Level Progression**: Advance to next level every 100 points
- **Enemy AI**: Different enemy types with varying speeds and point values
- **Collision Detection**: Precise hit detection for lasers and enemies

## 📱 Mobile & Touchscreen Support

The game now includes full touchscreen controls for mobile devices:

### Mobile Features:
- **On-screen Touch Controls**: Left/Right movement buttons and Fire button
- **Responsive Design**: Automatically adjusts for mobile screens
- **Touch Gestures**: Works with both touch and mouse events
- **Mobile-Optimized UI**: Larger buttons for easy tapping

### How to Play on Mobile:
1. Open `index.html` on your mobile browser
2. Use the on-screen buttons:
   - **← Button**: Move spaceship left
   - **→ Button**: Move spaceship right
   - **FIRE Button**: Shoot lasers
   - **PAUSE/RESTART**: Game control buttons

### Browser Compatibility:
Tested and working on:
- Google Chrome 90+ (Desktop & Mobile)
- Mozilla Firefox 88+ (Desktop & Mobile)
- Safari 14+ (iOS & macOS)
- Microsoft Edge 90+ (Desktop & Mobile)

## 🛠️ Development

To modify the game:
1. Edit `game.js` for game logic changes
2. Modify `style.css` for visual changes
3. Update `index.html` for structural changes

### Key Variables to Tweak:
- Enemy spawn rate in `game.js`
- Player speed and laser properties
- Power-up drop chances
- Level difficulty scaling

## 📄 License

This game is created for educational and entertainment purposes. Feel free to modify and distribute.

## 👨‍💻 Creator

Made with ❤️ for an amazing gaming experience!

---

**Enjoy the game and may the force be with you!** 🚀✨