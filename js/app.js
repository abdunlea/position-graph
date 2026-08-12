// app.js - Main application logic and event handlers

// Get canvas elements
const xyCanvas = document.getElementById('xyCanvas');
const yCanvas = document.getElementById('yCanvas');
const xCanvas = document.getElementById('xCanvas');
const timeCanvas = document.getElementById('timeCanvas');

const xyCtx = xyCanvas.getContext('2d');
const yCtx = yCanvas.getContext('2d');
const xCtx = xCanvas.getContext('2d');
const timeCtx = timeCanvas.getContext('2d');

// Update info display
function updateInfo() {
    document.getElementById('posInfo').textContent = 
        `x: ${ball.x.toFixed(1)}m, y: ${ball.y.toFixed(1)}m`;
    document.getElementById('velInfo').textContent = 
        `vx: ${ball.vx.toFixed(1)}m/s, vy: ${ball.vy.toFixed(1)}m/s`;
    const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
    document.getElementById('speedInfo').textContent = `${speed.toFixed(1)} m/s`;
    document.getElementById('timeInfo').textContent = `${time.toFixed(2)} s`;
}

// Animation loop
function animate() {
    if (isAnimating) {
        updatePhysics();
    }
    
    drawXYGrid(xyCtx, xyCanvas);
    drawYPosition(yCtx, yCanvas);
    drawXPosition(xCtx, xCanvas);
    drawTimeGraph(timeCtx, timeCanvas, timeGraphMode);
    updateInfo();
    
    requestAnimationFrame(animate);
}

// Helper function to get mouse position relative to canvas
function getMousePos(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
}

// Launch ball with velocity from current position
function launchBall(targetX, targetY) {
    dragStartX = ball.x;
    dragStartY = ball.y;
    
    ball.x = targetX;
    ball.y = targetY;
    
    ball.vx = (ball.x - dragStartX) * 3;
    ball.vy = (ball.y - dragStartY) * 3;
    
    isAnimating = true;
    isDragging = false;
    
    xtTrail = [{ t: 0, x: ball.x }];
    ytTrail = [{ t: 0, y: ball.y }];
    xyTrail = [{ x: ball.x, y: ball.y }];
    time = 0;
}

// Mouse event handlers for XY canvas
xyCanvas.addEventListener('mousedown', (e) => {
    const mousePos = getMousePos(xyCanvas, e);
    const pos = canvasToPhysics(mousePos.x, mousePos.y, xyCanvas.width, xyCanvas.height);
    
    const dx = pos.x - ball.x;
    const dy = pos.y - ball.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < ball.radius * 2) {
        isDragging = true;
        isAnimating = false;
        dragStartX = ball.x;
        dragStartY = ball.y;
    } else {
        const targetX = Math.max(ball.radius, Math.min(10 - ball.radius, pos.x));
        const targetY = Math.max(ball.radius, Math.min(10 - ball.radius, pos.y));
        launchBall(targetX, targetY);
    }
});

xyCanvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const mousePos = getMousePos(xyCanvas, e);
        const pos = canvasToPhysics(mousePos.x, mousePos.y, xyCanvas.width, xyCanvas.height);
        
        ball.x = Math.max(ball.radius, Math.min(10 - ball.radius, pos.x));
        ball.y = Math.max(ball.radius, Math.min(10 - ball.radius, pos.y));
    }
});

function handleDragEnd() {
    if (isDragging) {
        ball.vx = (ball.x - dragStartX) * 3;
        ball.vy = (ball.y - dragStartY) * 3;
        isDragging = false;
        isAnimating = true;
        
        xtTrail = [{ t: 0, x: ball.x }];
        ytTrail = [{ t: 0, y: ball.y }];
        xyTrail = [{ x: ball.x, y: ball.y }];
        time = 0;
    }
}

xyCanvas.addEventListener('mouseup', handleDragEnd);
xyCanvas.addEventListener('mouseleave', handleDragEnd);

// Touch support
xyCanvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mousePos = getMousePos(xyCanvas, touch);
    const pos = canvasToPhysics(mousePos.x, mousePos.y, xyCanvas.width, xyCanvas.height);
    
    const dx = pos.x - ball.x;
    const dy = pos.y - ball.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < ball.radius * 2) {
        isDragging = true;
        isAnimating = false;
        dragStartX = ball.x;
        dragStartY = ball.y;
    } else {
        const targetX = Math.max(ball.radius, Math.min(10 - ball.radius, pos.x));
        const targetY = Math.max(ball.radius, Math.min(10 - ball.radius, pos.y));
        launchBall(targetX, targetY);
    }
});

xyCanvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (isDragging) {
        const touch = e.touches[0];
        const mousePos = getMousePos(xyCanvas, touch);
        const pos = canvasToPhysics(mousePos.x, mousePos.y, xyCanvas.width, xyCanvas.height);
        
        ball.x = Math.max(ball.radius, Math.min(10 - ball.radius, pos.x));
        ball.y = Math.max(ball.radius, Math.min(10 - ball.radius, pos.y));
    }
});

xyCanvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    handleDragEnd();
});

// Button event handlers
document.getElementById('resetBtn').addEventListener('click', resetSimulation);
document.getElementById('clearTrailBtn').addEventListener('click', clearTrails);

// Time graph mode buttons
document.getElementById('btnYT').addEventListener('click', () => {
    setTimeGraphMode('yt');
    document.querySelectorAll('.graph-btn').forEach(b => b.classList.remove('active-time'));
    document.getElementById('btnYT').classList.add('active-time');
});

document.getElementById('btnXT').addEventListener('click', () => {
    setTimeGraphMode('xt');
    document.querySelectorAll('.graph-btn').forEach(b => b.classList.remove('active-time'));
    document.getElementById('btnXT').classList.add('active-time');
});

document.getElementById('btnTX').addEventListener('click', () => {
    setTimeGraphMode('tx');
    document.querySelectorAll('.graph-btn').forEach(b => b.classList.remove('active-time'));
    document.getElementById('btnTX').classList.add('active-time');
});

// Start animation
animate();