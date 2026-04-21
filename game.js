// Galaxy Defender Game Engine
document.addEventListener('DOMContentLoaded', function() {
    // Game variables
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const restartBtn = document.getElementById('restartBtn');
    const soundBtn = document.getElementById('soundBtn');
    const playAgainBtn = document.getElementById('playAgainBtn');
    const gameOverModal = document.getElementById('gameOverModal');
    
    // Game state
    let game = {
        running: false,
        paused: false,
        soundOn: true,
        score: 0,
        health: 100,
        level: 1,
        enemiesDestroyed: 0,
        keys: {}
    };
    
    // Player spaceship
    const player = {
        x: canvas.width / 2 - 25,
        y: canvas.height - 80,
        width: 50,
        height: 60,
        speed: 7,
        color: '#00ff9d',
        lasers: [],
        lastShot: 0,
        shotDelay: 300,
        rapidFire: false,
        shield: false,
        shieldTime: 0
    };
    
    // Enemies array
    let enemies = [];
    let powerUps = [];
    let stars = [];
    let explosions = [];
    
    // Initialize stars for background
    function initStars() {
        stars = [];
        for (let i = 0; i < 100; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                speed: Math.random() * 0.5 + 0.2,
                brightness: Math.random() * 0.5 + 0.5
            });
        }
    }
    
    // Draw player spaceship
    function drawPlayer() {
        ctx.save();
        
        // Draw shield if active
        if (player.shield && Date.now() - player.shieldTime < 5000) {
            ctx.beginPath();
            ctx.arc(player.x + player.width/2, player.y + player.height/2, 
                   Math.max(player.width, player.height)/2 + 10, 0, Math.PI * 2);
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
            ctx.fill();
            ctx.globalAlpha = 1;
        }
        
        // Spaceship body
        ctx.fillStyle = player.color;
        ctx.beginPath();
        ctx.moveTo(player.x + player.width/2, player.y);
        ctx.lineTo(player.x + player.width, player.y + player.height);
        ctx.lineTo(player.x, player.y + player.height);
        ctx.closePath();
        ctx.fill();
        
        // Cockpit
        ctx.fillStyle = '#00ccff';
        ctx.beginPath();
        ctx.arc(player.x + player.width/2, player.y + 15, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Engines
        ctx.fillStyle = '#ff5500';
        ctx.fillRect(player.x + 10, player.y + player.height, 10, 15);
        ctx.fillRect(player.x + player.width - 20, player.y + player.height, 10, 15);
        
        // Engine flames
        const flameHeight = 10 + Math.sin(Date.now() / 100) * 5;
        ctx.fillStyle = '#ffaa00';
        ctx.beginPath();
        ctx.moveTo(player.x + 15, player.y + player.height + 15);
        ctx.lineTo(player.x + 10, player.y + player.height + 15 + flameHeight);
        ctx.lineTo(player.x + 20, player.y + player.height + 15 + flameHeight);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(player.x + player.width - 15, player.y + player.height + 15);
        ctx.lineTo(player.x + player.width - 20, player.y + player.height + 15 + flameHeight);
        ctx.lineTo(player.x + player.width - 10, player.y + player.height + 15 + flameHeight);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }
    
    // Draw lasers
    function drawLasers() {
        for (let i = player.lasers.length - 1; i >= 0; i--) {
            const laser = player.lasers[i];
            ctx.fillStyle = laser.color || '#ff0000';
            ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
            
            // Update position
            laser.y -= laser.speed;
            
            // Remove if off screen
            if (laser.y < 0) {
                player.lasers.splice(i, 1);
            }
        }
    }
    
    // Create enemy
    function createEnemy() {
        const enemyTypes = [
            { width: 40, height: 40, color: '#ff5555', speed: 1 + game.level * 0.2, points: 10 },
            { width: 30, height: 30, color: '#ffaa00', speed: 1.5 + game.level * 0.2, points: 15 },
            { width: 50, height: 50, color: '#aa55ff', speed: 0.8 + game.level * 0.2, points: 20 }
        ];
        
        const type = Math.floor(Math.random() * enemyTypes.length);
        const enemy = {
            x: Math.random() * (canvas.width - enemyTypes[type].width),
            y: -enemyTypes[type].height,
            width: enemyTypes[type].width,
            height: enemyTypes[type].height,
            color: enemyTypes[type].color,
            speed: enemyTypes[type].speed,
            points: enemyTypes[type].points,
            health: 1
        };
        
        enemies.push(enemy);
    }
    
    // Draw enemies
    function drawEnemies() {
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            
            // Draw enemy ship
            ctx.fillStyle = enemy.color;
            ctx.beginPath();
            ctx.moveTo(enemy.x + enemy.width/2, enemy.y);
            ctx.lineTo(enemy.x + enemy.width, enemy.y + enemy.height);
            ctx.lineTo(enemy.x, enemy.y + enemy.height);
            ctx.closePath();
            ctx.fill();
            
            // Enemy details
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(enemy.x + enemy.width/2 - 5, enemy.y + 10, 10, 5);
            
            // Update position
            enemy.y += enemy.speed;
            
            // Remove if off screen
            if (enemy.y > canvas.height) {
                enemies.splice(i, 1);
            }
            
            // Check collision with player
            if (checkCollision(player, enemy)) {
                if (!player.shield || Date.now() - player.shieldTime > 5000) {
                    game.health -= 10;
                    updateHealthBar();
                    createExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2, enemy.color);
                }
                enemies.splice(i, 1);
                
                if (game.health <= 0) {
                    gameOver();
                }
            }
            
            // Check collision with lasers
            for (let j = player.lasers.length - 1; j >= 0; j--) {
                const laser = player.lasers[j];
                if (checkCollision(laser, enemy)) {
                    // Enemy hit
                    game.score += enemy.points;
                    game.enemiesDestroyed++;
                    updateScore();
                    createExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2, enemy.color);
                    enemies.splice(i, 1);
                    player.lasers.splice(j, 1);
                    
                    // Chance to drop power-up
                    if (Math.random() < 0.2) {
                        createPowerUp(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
                    }
                    break;
                }
            }
        }
    }
    
    // Create power-up
    function createPowerUp(x, y) {
        const types = [
            { type: 'health', color: '#ff4757', icon: '❤️' },
            { type: 'rapid', color: '#00d2ff', icon: '⚡' },
            { type: 'shield', color: '#00ff9d', icon: '🛡️' }
        ];
        
        const powerUpType = types[Math.floor(Math.random() * types.length)];
        powerUps.push({
            x: x,
            y: y,
            width: 30,
            height: 30,
            color: powerUpType.color,
            type: powerUpType.type,
            icon: powerUpType.icon,
            speed: 2
        });
    }
    
    // Draw power-ups
    function drawPowerUps() {
        for (let i = powerUps.length - 1; i >= 0; i--) {
            const p = powerUps[i];
            
            // Draw power-up
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.width/2, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw icon
            ctx.font = '16px Arial';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(p.icon, p.x, p.y);
            
            // Update position
            p.y += p.speed;
            
            // Check collision with player
            if (checkCollision(player, p)) {
                applyPowerUp(p.type);
                powerUps.splice(i, 1);
            }
            
            // Remove if off screen
            if (p.y > canvas.height) {
                powerUps.splice(i, 1);
            }
        }
    }
    
    // Apply power-up effect
    function applyPowerUp(type) {
        if (game.soundOn) {
            // Play power-up sound (simulated)
            console.log('Power-up collected:', type);
        }
        
        switch(type) {
            case 'health':
                game.health = Math.min(100, game.health + 30);
                updateHealthBar();
                break;
            case 'rapid':
                player.rapidFire = true;
                player.shotDelay = 100;
                setTimeout(() => {
                    player.rapidFire = false;
                    player.shotDelay = 300;
                }, 5000);
                break;
            case 'shield':
                player.shield = true;
                player.shieldTime = Date.now();
                setTimeout(() => {
                    player.shield = false;
                }, 5000);
                break;
        }
    }
    
    // Create explosion effect
    function createExplosion(x, y, color) {
        explosions.push({
            x: x,
            y: y,
            radius: 5,
            maxRadius: 30,
            color: color,
            life: 1.0
        });
    }
    
    // Draw explosions
    function drawExplosions() {
        for (let i = explosions.length - 1; i >= 0; i--) {
            const exp = explosions[i];
            
            ctx.save();
            ctx.globalAlpha = exp.life;
            ctx.fillStyle = exp.color;
            ctx.beginPath();
            ctx.arc(exp.x, exp.y, exp.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            
            exp.radius += 1;
            exp.life -= 0.05;
            
            if (exp.life <= 0) {
                explosions.splice(i, 1);
            }
        }
    }
    
    // Draw stars background
    function drawStars() {
        ctx.fillStyle = '#ffffff';
        for (const star of stars) {
            ctx.globalAlpha = star.brightness;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Move stars
            star.y += star.speed;
            if (star.y > canvas.height) {
                star.y = 0;
                star.x = Math.random() * canvas.width;
            }
        }
        ctx.globalAlpha = 1;
    }
    
    // Check collision between two objects
    function checkCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }
    
    // Update score display
    function updateScore() {
        document.getElementById('score').textContent = game.score;
        document.getElementById('enemies').textContent = game.enemiesDestroyed;
        
        // Level up every 100 points
        const newLevel = Math.floor(game.score / 100) + 1;
        if (newLevel > game.level) {
            game.level = newLevel;
            document.getElementById('level').textContent = game.level;
            
            // Increase enemy spawn rate
            if (game.running && !game.paused) {
                clearInterval(enemyInterval);
                enemyInterval = setInterval(createEnemy, Math.max(500, 1500 - game.level * 100));
            }
        }
    }
    
    // Update health bar
    function updateHealthBar() {
        const healthFill = document.getElementById('health-fill');
        const healthValue = document.getElementById('health-value');
        
        game.health = Math.max(0, Math.min(100, game.health));
        healthFill.style.width = game.health + '%';
        healthValue.textContent = game.health;
        
        // Change color based on health
        if (game.health > 60) {
            healthFill.style.backgroundColor = '#00ff9d';
        } else if (game.health > 30) {
            healthFill.style.backgroundColor = '#ffaa00';
        } else {
            healthFill.style.backgroundColor = '#ff4757';
        }
    }
    
    // Game over
    function gameOver() {
        game.running = false;
        clearInterval(enemyInterval);
        clearInterval(powerUpInterval);
        
        // Update final stats
        document.getElementById('finalScore').textContent = game.score;
        document.getElementById('finalLevel').textContent = game.level;
        document.getElementById('finalEnemies').textContent = game.enemiesDestroyed;
        
        // Show game over modal
        gameOverModal.style.display = 'flex';
    }
    
    // Shoot laser
    function shootLaser() {
        const now = Date.now();
        if (now - player.lastShot < player.shotDelay) return;
        
        player.lastShot = now;
        
        player.lasers.push({
            x: player.x + player.width/2 - 2,
            y: player.y,
            width: 4,
            height: 15,
            speed: 10,
            color: player.rapidFire ? '#00ffff' : '#ff0000'
        });
        
        if (player.rapidFire) {
            player.lasers.push({
                x: player.x + player.width/2 - 10,
                y: player.y,
                width: 4,
                height: 15,
                speed: 10,
                color: '#00ffff'
            });
            player.lasers.push({
                x: player.x + player.width/2 + 6,
                y: player.y,
                width: 4,
                height: 15,
                speed: 10,
                color: '#00ffff'
            });
        }
    }
    
    // Game loop
    function gameLoop() {
        if (!game.running || game.paused) return;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background
        drawStars();
        
        // Draw game objects
        drawLasers();
        drawEnemies();
        drawPowerUps();
        drawExplosions();
        drawPlayer();
        
        // Move player based on keys
        if (game.keys['ArrowLeft'] || game.keys['a'] || game.keys['A']) {
            player.x = Math.max(0, player.x - player.speed);
        }
        if (game.keys['ArrowRight'] || game.keys['d'] || game.keys['D']) {
            player.x = Math.min(canvas.width - player.width, player.x + player.speed);
        }
        if (game.keys[' '] || game.keys['Spacebar']) {
            shootLaser();
        }
    }
    
    // Initialize game
    function initGame() {
        // Reset game state
        game.score = 0;
        game.health = 100;
        game.level = 1;
        game.enemiesDestroyed = 0;
        game.running = true;
        game.paused = false;
        
        // Reset player
        player.x = canvas.width / 2 - 25;
        player.y = canvas.height - 80;
        player.lasers = [];
        player.rapidFire = false;
        player.shield = false;
        
        // Clear arrays
        enemies = [];
        powerUps = [];
        explosions = [];
        
        // Initialize stars
        initStars();
        
        // Update UI
        updateScore();
        updateHealthBar();
        
        // Hide game over modal
        gameOverModal.style.display = 'none';
        
        // Update button text
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i> PAUSE';
        
        // Start game loop
        if (gameLoopInterval) clearInterval(gameLoopInterval);
        gameLoopInterval = setInterval(gameLoop, 1000/60);
        
        // Start enemy spawner
        if (enemyInterval) clearInterval(enemyInterval);
        enemyInterval = setInterval(createEnemy, 1500);
        
        // Start power-up spawner
        if (powerUpInterval) clearInterval(powerUpInterval);
        powerUpInterval = setInterval(() => {
            if (Math.random() < 0.02 && game.running && !game.paused) {
                createPowerUp(Math.random() * (canvas.width - 30), -30);
            }
        }, 1000);
    }
    
    // Event listeners for keyboard
    window.addEventListener('keydown', function(e) {
        game.keys[e.key] = true;
        
        // Pause with P key
        if (e.key === 'p' || e.key === 'P') {
            togglePause();
        }
        
        // Restart with R key
        if (e.key === 'r' || e.key === 'R') {
            initGame();
        }
    });
    
    window.addEventListener('keyup', function(e) {
        game.keys[e.key] = false;
    });
    
    // Mobile touch controls elements
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');
    const fireBtn = document.getElementById('fireBtn');
    const mobilePauseBtn = document.getElementById('mobilePauseBtn');
    const mobileRestartBtn = document.getElementById('mobileRestartBtn');
    
    // Button event listeners
    startBtn.addEventListener('click', function() {
        if (!game.running) {
            initGame();
        }
    });
    
    pauseBtn.addEventListener('click', togglePause);
    
    restartBtn.addEventListener('click', initGame);
    
    soundBtn.addEventListener('click', function() {
        game.soundOn = !game.soundOn;
        soundBtn.innerHTML = game.soundOn ?
            '<i class="fas fa-volume-up"></i> SOUND ON' :
            '<i class="fas fa-volume-mute"></i> SOUND OFF';
    });
    
    playAgainBtn.addEventListener('click', function() {
        gameOverModal.style.display = 'none';
        initGame();
    });
    
    // Mobile touch controls event listeners
    // Left button
    leftBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        game.keys['ArrowLeft'] = true;
        this.style.transform = 'scale(0.9)';
    });
    
    leftBtn.addEventListener('touchend', function(e) {
        e.preventDefault();
        game.keys['ArrowLeft'] = false;
        this.style.transform = 'scale(1)';
    });
    
    leftBtn.addEventListener('mousedown', function() {
        game.keys['ArrowLeft'] = true;
        this.style.transform = 'scale(0.9)';
    });
    
    leftBtn.addEventListener('mouseup', function() {
        game.keys['ArrowLeft'] = false;
        this.style.transform = 'scale(1)';
    });
    
    leftBtn.addEventListener('mouseleave', function() {
        game.keys['ArrowLeft'] = false;
        this.style.transform = 'scale(1)';
    });
    
    // Right button
    rightBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        game.keys['ArrowRight'] = true;
        this.style.transform = 'scale(0.9)';
    });
    
    rightBtn.addEventListener('touchend', function(e) {
        e.preventDefault();
        game.keys['ArrowRight'] = false;
        this.style.transform = 'scale(1)';
    });
    
    rightBtn.addEventListener('mousedown', function() {
        game.keys['ArrowRight'] = true;
        this.style.transform = 'scale(0.9)';
    });
    
    rightBtn.addEventListener('mouseup', function() {
        game.keys['ArrowRight'] = false;
        this.style.transform = 'scale(1)';
    });
    
    rightBtn.addEventListener('mouseleave', function() {
        game.keys['ArrowRight'] = false;
        this.style.transform = 'scale(1)';
    });
    
    // Fire button
    fireBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        game.keys[' '] = true;
        this.style.transform = 'scale(0.9)';
    });
    
    fireBtn.addEventListener('touchend', function(e) {
        e.preventDefault();
        game.keys[' '] = false;
        this.style.transform = 'scale(1)';
    });
    
    fireBtn.addEventListener('mousedown', function() {
        game.keys[' '] = true;
        this.style.transform = 'scale(0.9)';
    });
    
    fireBtn.addEventListener('mouseup', function() {
        game.keys[' '] = false;
        this.style.transform = 'scale(1)';
    });
    
    fireBtn.addEventListener('mouseleave', function() {
        game.keys[' '] = false;
        this.style.transform = 'scale(1)';
    });
    
    // Mobile pause and restart buttons
    mobilePauseBtn.addEventListener('click', togglePause);
    mobileRestartBtn.addEventListener('click', initGame);
    
    // Detect touch device and adjust UI
    function detectTouchDevice() {
        return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    }
    
    // Initialize touch device detection
    if (detectTouchDevice()) {
        console.log('Touch device detected - enabling mobile controls');
        // Mobile controls are already shown via CSS media query
    }
    
    // Toggle pause function
    function togglePause() {
        if (!game.running) return;
        
        game.paused = !game.paused;
        pauseBtn.innerHTML = game.paused ? 
            '<i class="fas fa-play"></i> RESUME' : 
            '<i class="fas fa-pause"></i> PAUSE';
    }
    
    // Game intervals
    let gameLoopInterval;
    let enemyInterval;
    let powerUpInterval;
    
    // Initialize stars
    initGame();
    
    // Draw initial screen
    drawStars();
    drawPlayer();
    
    // Draw title on canvas
    ctx.font = 'bold 36px Orbitron';
    ctx.fillStyle = '#00ff9d';
    ctx.textAlign = 'center';
    ctx.fillText('GALAXY DEFENDER', canvas.width/2, canvas.height/2 - 50);
    
    ctx.font = '20px Roboto';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Click START GAME to begin!', canvas.width/2, canvas.height/2 + 20);
    
    ctx.font = '16px Roboto';
    ctx.fillText('Use ← → arrows to move, SPACE to shoot', canvas.width/2, canvas.height/2 + 60);
});