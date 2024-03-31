const canvas = document.querySelector('canvas');

const context = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

class Player 
{
    constructor() 
    {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.radius = 30;
        this.color = 'white';
    }

    draw() 
    {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        context.fillStyle = this.color;
        context.fill();
    }
}

const p1 = new Player();
p1.draw();

class Projectile 
{
    constructor(x, y, velocity) 
    {
        this.x = x;
        this.y = y;
        this.radius = 10;
        this.color = 'white';
        this.velocity = velocity;
    }

    draw() 
    {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
    }

    update() 
    {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

// 

class Enemy 
{
    constructor(x, y, radius, color, velocity) 
    {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocity = velocity;
        this.color = color;
    }

    draw() 
    {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        context.fillStyle = this.color;
        context.fill();
    }

    update() 
    {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

const enemies = [];

function spawn_enemies() 
{
    setInterval(() => 
    {
        const radius = Math.random() * ((30 - 10) + 10) ;

        const color = `hsl(${Math.random() * 360}, 50%, 50%)`;

        let x, y;

        if (Math.random() < 0.5) 
        {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        } 
        
        else 
        {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }

        const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
        const velocity = { x: Math.cos(angle), y: Math.sin(angle) };

        const enemy = new Enemy(x, y, radius, color, velocity);

        enemies.push(enemy);
    }, 1000);
}

const projectiles = [];

let animation_id;

function animate() 
{
    animation_id = requestAnimationFrame(animate);
    context.fillStyle = 'rgba(0,0,0,0.1)'
    context.fillRect(0, 0, canvas.width, canvas.height);
    p1.draw();
    projectiles.forEach((projectile, index) => 
    {
        projectile.update();

        if(projectile.x + projectile.radius < 0 || projectile.x - projectile.radius < 0 
        || projectile.y + projectile.radius < 0 || projectile.y - projectile.radius < 0)
        {
            setTimeout(()=>
            {
                projectiles.splice(index, 1);
            }, 0);
        }

    });

    enemies.forEach((enemy, eindex) => 
    {
        enemy.update();

        const distance = Math.hypot((p1.x - enemy.x), (p1.y - enemy.y));
        if(distance - p1.radius - enemy.radius < 1)
        {
            cancelAnimationFrame(animation_id);
        }

        projectiles.forEach((projectile, pindex) =>
        {
            const distance = Math.hypot((projectile.x - enemy.x), (projectile.y - enemy.y));

            if(distance - projectile.radius - enemy.radius < 1)
            {
                setTimeout(() =>
                {
                    enemies.splice(eindex, 1);
                    projectiles.splice(pindex, 1);
                }, 0)
            }
        });
    });
}

addEventListener('click', (event) => 
{
    console.log(projectiles);
    const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2);
    const velocity = { x: Math.cos(angle) * 5, y: Math.sin(angle) * 5 };
    const projectile = new Projectile(canvas.width / 2, canvas.height / 2, velocity);
    projectiles.push(projectile);
});

spawn_enemies();
animate();
