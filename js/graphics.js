// graphics.js - Drawing functions for all canvases

const AXIS_OFFSET = 30; // Offset for axes from edges

// Draw XY position grid (TOP RIGHT)
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
    
    // X-axis (bottom)
    ctx.beginPath();
    ctx.moveTo(AXIS_OFFSET, canvas.height - AXIS_OFFSET);
    ctx.lineTo(canvas.width, canvas.height - AXIS_OFFSET);
    ctx.stroke();
    
    // Y-axis (left)
    ctx.beginPath();
    ctx.moveTo(AXIS_OFFSET, 0);
    ctx.lineTo(AXIS_OFFSET, canvas.height - AXIS_OFFSET);
    ctx.stroke();
    
    // Labels
    ctx.fillStyle = '#666';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('x', canvas.width - 20, canvas.height - AXIS_OFFSET + 20);
    ctx.fillText('y', AXIS_OFFSET - 20, 20);
    
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
        
        const speed = Math.sqrt(vx * vx + vy * vy);
        if (speed > 0.1) {
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
}

// Draw Y Position (TOP LEFT - horizontal bar)
function drawYPosition(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Grid
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 10; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * SCALE);
        ctx.lineTo(canvas.width, i * SCALE);
        ctx.stroke();
    }
    
    // Current Y position as horizontal bar
    const yPos = canvas.height - ball.y * SCALE;
    ctx.strokeStyle = '#FF5722';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, yPos);
    ctx.lineTo(canvas.width, yPos);
    ctx.stroke();
    
    // Vertical axis
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(AXIS_OFFSET, 0);
    ctx.lineTo(AXIS_OFFSET, canvas.height);
    ctx.stroke();
    
    // Label
    ctx.fillStyle = '#666';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('y', AXIS_OFFSET - 20, 20);
    
    // Ball indicator
    ctx.fillStyle = '#FF5722';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, yPos, 10, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Trail dots
    if (ytTrail.length > 1) {
        ctx.fillStyle = 'rgba(255, 87, 34, 0.3)';
        for (let i = 0; i < ytTrail.length; i++) {
            const y = canvas.height - ytTrail[i].y * SCALE;
            ctx.beginPath();
            ctx.arc(canvas.width / 2, y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// Draw X Position (BOTTOM RIGHT - horizontal bar)
function drawXPosition(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Grid
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 10; i++) {
        ctx.beginPath();
        ctx.moveTo(i * SCALE, 0);
        ctx.lineTo(i * SCALE, canvas.height);
        ctx.stroke();
    }
    
    // Current X position as vertical bar
    const xPos = ball.x * SCALE;
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(xPos, 0);
    ctx.lineTo(xPos, canvas.height);
    ctx.stroke();
    
    // Horizontal axis
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - AXIS_OFFSET);
    ctx.lineTo(canvas.width, canvas.height - AXIS_OFFSET);
    ctx.stroke();
    
    // Label
    ctx.fillStyle = '#666';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('x', canvas.width - 20, canvas.height - AXIS_OFFSET + 20);
    
    // Ball indicator
    ctx.fillStyle = '#2196F3';
    ctx.beginPath();
    ctx.arc(xPos, canvas.height / 2, 10, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Trail dots
    if (xtTrail.length > 1) {
        ctx.fillStyle = 'rgba(33, 150, 243, 0.3)';
        for (let i = 0; i < xtTrail.length; i++) {
            const x = xtTrail[i].x * SCALE;
            ctx.beginPath();
            ctx.arc(x, canvas.height / 2, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// Draw Time Graph (BOTTOM LEFT - toggleable)
function drawTimeGraph(ctx, canvas, mode) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Grid
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 10; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * SCALE);
        ctx.lineTo(canvas.width, i * SCALE);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(i * SCALE, 0);
        ctx.lineTo(i * SCALE, canvas.height);
        ctx.stroke();
    }
    
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    if (mode === 'yt') {
        // Y vs Time
        // Horizontal axis
        ctx.beginPath();
        ctx.moveTo(AXIS_OFFSET, canvas.height - AXIS_OFFSET);
        ctx.lineTo(canvas.width, canvas.height - AXIS_OFFSET);
        ctx.stroke();
        
        // Vertical axis
        ctx.beginPath();
        ctx.moveTo(AXIS_OFFSET, 0);
        ctx.lineTo(AXIS_OFFSET, canvas.height - AXIS_OFFSET);
        ctx.stroke();
        
        // Labels
        ctx.fillStyle = '#666';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('t', canvas.width - 20, canvas.height - AXIS_OFFSET + 20);
        ctx.fillText('y', AXIS_OFFSET - 20, 20);
        
        if (ytTrail.length > 1) {
            ctx.strokeStyle = '#9C27B0';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let i = 0; i < ytTrail.length; i++) {
                const x = ytTrail[i].t * SCALE;
                const y = canvas.height - ytTrail[i].y * SCALE;
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
            
            const lastPoint = ytTrail[ytTrail.length - 1];
            ctx.fillStyle = '#9C27B0';
            ctx.beginPath();
            ctx.arc(lastPoint.t * SCALE, canvas.height - lastPoint.y * SCALE, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    } else if (mode === 'xt') {
        // X vs Time
        // Horizontal axis
        ctx.beginPath();
        ctx.moveTo(AXIS_OFFSET, canvas.height - AXIS_OFFSET);
        ctx.lineTo(canvas.width, canvas.height - AXIS_OFFSET);
        ctx.stroke();
        
        // Vertical axis
        ctx.beginPath();
        ctx.moveTo(AXIS_OFFSET, 0);
        ctx.lineTo(AXIS_OFFSET, canvas.height - AXIS_OFFSET);
        ctx.stroke();
        
        // Labels
        ctx.fillStyle = '#666';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('t', canvas.width - 20, canvas.height - AXIS_OFFSET + 20);
        ctx.fillText('x', AXIS_OFFSET - 20, 20);
        
        if (xtTrail.length > 1) {
            ctx.strokeStyle = '#9C27B0';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let i = 0; i < xtTrail.length; i++) {
                const x = xtTrail[i].t * SCALE;
                const y = canvas.height - xtTrail[i].x * SCALE;
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
            
            const lastPoint = xtTrail[xtTrail.length - 1];
            ctx.fillStyle = '#9C27B0';
            ctx.beginPath();
            ctx.arc(lastPoint.t * SCALE, canvas.height - lastPoint.x * SCALE, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    } else if (mode === 'tx') {
        // Time vs X
        // Horizontal axis
        ctx.beginPath();
        ctx.moveTo(AXIS_OFFSET, canvas.height - AXIS_OFFSET);
        ctx.lineTo(canvas.width, canvas.height - AXIS_OFFSET);
        ctx.stroke();
        
        // Vertical axis
        ctx.beginPath();
        ctx.moveTo(AXIS_OFFSET, 0);
        ctx.lineTo(AXIS_OFFSET, canvas.height - AXIS_OFFSET);
        ctx.stroke();
        
        // Labels
        ctx.fillStyle = '#666';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('x', canvas.width - 20, canvas.height - AXIS_OFFSET + 20);
        ctx.fillText('t', AXIS_OFFSET - 20, 20);
        
        if (xtTrail.length > 1) {
            ctx.strokeStyle = '#9C27B0';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let i = 0; i < xtTrail.length; i++) {
                const x = xtTrail[i].x * SCALE;
                const y = canvas.height - xtTrail[i].t * SCALE;
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
            
            const lastPoint = xtTrail[xtTrail.length - 1];
            ctx.fillStyle = '#9C27B0';
            ctx.beginPath();
            ctx.arc(lastPoint.x * SCALE, canvas.height - lastPoint.t * SCALE, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}