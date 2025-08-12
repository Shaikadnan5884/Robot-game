const robot = document.getElementById('robot');
    const game = document.getElementById('game');
    const scoreElement = document.getElementById('score');
    const jumpSound = document.getElementById('jump-sound');

    let isJumping = false;
    let gravity = 2;
    let velocity = 0;
    let score = 0;
    let obstacleSpeed = 5;
    let gameOver = false;

    function jump() {
        if (!isJumping) {
            velocity = -20;
            isJumping = true;
            jumpSound.play();
        }
    }
    document.addEventListener('keydown', e => {
        if (e.code === 'Space' || e.code === 'ArrowUp') jump();
    });
    document.addEventListener('click', jump);

    function createObstacle() {
        const obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        obstacle.style.left = game.offsetWidth + 'px';
        game.appendChild(obstacle);

        function moveObstacle() {
            if (gameOver) {
                obstacle.remove();
                return;
            }

            let obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue('left'));
            if (obstacleLeft < -50) {
                obstacle.remove();
                score++;
                scoreElement.textContent = score;
                if (score % 5 === 0) {
                    obstacleSpeed += 1; // Increase speed
                }
            } else {
                obstacle.style.left = obstacleLeft - obstacleSpeed + 'px';
            }

            // Collision detection
            let robotRect = robot.getBoundingClientRect();
            let obsRect = obstacle.getBoundingClientRect();
            if (
                robotRect.left < obsRect.right &&
                robotRect.right > obsRect.left &&
                robotRect.bottom > obsRect.top
            ) {
                alert('Game Over! Score: ' + score);
                gameOver = true;
                window.location.reload();
            }

            requestAnimationFrame(moveObstacle);
        }
        moveObstacle();
    }

    function updateRobot() {
        let robotBottom = parseInt(window.getComputedStyle(robot).getPropertyValue('bottom'));
        velocity += gravity;
        robot.style.bottom = Math.max(0, robotBottom - velocity) + 'px';

        if (robotBottom <= 0) {
            isJumping = false;
            velocity = 0;
        }
        requestAnimationFrame(updateRobot);
    }

    updateRobot();
    setInterval(createObstacle, 2000);
