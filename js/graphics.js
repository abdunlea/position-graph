// graphics.js - Drawing functions for all canvases

// Draw XY position grid
function drawXYGrid(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Grid lines
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 10; i++) {
        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(i * SCALE, 0);
        ctx.lineTo(i * SCALE, canvas.height);
        ctx.stroke();
        
        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, i * SCALE);
        ctx.lineTo(canvas.width, i * SCALE);
        ctx.stroke();
    }
    
    // Axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, canvas.height);
    ctx.stroke();
    
    // Labels
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.fillText('X (m)', canvas.width - 40, canvas.height - 10);
    ctx.fillText('Y (m)', 10, 20);
    
    // Draw trail
    if (xyTrail.length > 1) {
        ctx.strokeStyle = 'rgba(255, 107, 107, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < xyTrail.length; i++) {
            const pos = physicsToCanvas(xyTrail[i].x, xyTrail[i].y, canvas.height);
            if (i === 0) {
                ctx.moveTo(pos.x, pos.y);
            } else {
                ctx.lineTo(pos.x, pos.y);
            }
        }
        ctx.stroke();
    }
    
    // Draw ball
    const pos = physicsToCanvas(ball.x, ball.y, canvas.height);
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, ball.radius * SCALE, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw velocity vector
    if (isAnimating || isDragging) {
        const vx = isDragging ? (ball.x - dragStartX) * 3 : ball.vx;
        const vy = isDragging ? (ball.y - dragStartY) * 3 : ball.vy;
        
        ctx.strokeStyle = '#4CAF50';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        const endPos = physicsToCanvas(ball.x + vx * 0.5, ball.y + vy * 0.5, canvas.height);
        ctx.lineTo(endPos.x, endPos.y);
        ctx.stroke();
        
        // Arrow head
        const angle = Math.atan2(endPos.y - pos.y, endPos.x - pos.x);
        ctx.beginPath();
        ctx.moveTo(endPos.x, endPos.y);
        ctx.lineTo(endPos.x - 10 * Math.cos(angle - Math.PI / 6), endPos.y - 10 * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(endPos.x, endPos.y);
        ctx.lineTo(endPos.x - 10 * Math.cos(angle + Math.PI / 6), endPos.y - 10 * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
    }
}

// Draw X vs Time graph
function drawXTGraph(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Grid
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * 36);
        ctx.lineTo(canvas.width, i * 36);
        ctx.stroke();
    }
    
    // Axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, canvas.height);
    ctx.stroke();
    
    // Labels
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.fillText('Time (s)', canvas.width - 60, canvas.height - 10);
    ctx.fillText('X (m)', 10, 20);
    
    // Plot data
    if (xtTrail.length > 1) {
        ctx.strokeStyle = '#2196F3';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < xtTrail.length; i++) {
            const x = xtTrail[i].t * TIME_SCALE;
            const y = canvas.height - xtTrail[i].x * SCALE;
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        // Current point
        const lastPoint = xtTrail[xtTrail.length - 1];
        ctx.fillStyle = '#2196F3';
        ctx.beginPath();
        ctx.arc(lastPoint.t * TIME_SCALE, canvas.height - lastPoint.x * SCALE, 4, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Draw Y vs Time graph
function drawYTGraph(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Grid
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * 36);
        ctx.lineTo(canvas.width, i * 36);
        ctx.stroke();
    }
    
    // Axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, canvas.height);
    ctx.stroke();
    
    // Labels
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.fillText('Time (s)', canvas.width - 60, canvas.height - 10);
    ctx.fillText('Y (m)', 10, 20);
    
    // Plot data
    if (ytTrail.length > 1) {
        ctx.strokeStyle = '#FF5722';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < ytTrail.length; i++) {
            const x = ytTrail[i].t * TIME_SCALE;
            const y = canvas.height - ytTrail[i].y * SCALE;
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        // Current point
        const lastPoint = ytTrail[ytTrail.length - 1];
        ctx.fillStyle = '#FF5722';
        ctx.beginPath();
        ctx.arc(lastPoint.t * TIME_SCALE, canvas.height - lastPoint.y * SCALE, 4, 0, Math.PI * 2);
        ctx.fill();
    }
}