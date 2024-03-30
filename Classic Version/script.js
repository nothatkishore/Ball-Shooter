const canvas = document.querySelector('canvas');

const context = canvas.getContext('2d');


canvas.width = innerWidth;
canvas.height = innerHeight;

class Player
{
    constructor(radius, color)
    {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.radius = 30;
        this.color = 'blue';
    }

    draw()
    {
        context.beginPath();    //This is used before drawing any shapes
        context.arc(this.x, this.y, this.radius, 0, 2*Math.PI, false); //This is used to draw circles
        context.fillStyle = this.color;  //This is used to choose fill color
        context.fill(); //This is used to fill the shape will specified color
    }
}

const p1 = new Player(); //This is an object for player
p1.draw();

class Projectile
{
    constructor(x, y, velocity)
    {
        this.x = x;
        this.y = y;
        this.radius = 10;
        this.color = 'red';
        this.velocity = velocity;
    }

    draw()
    {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
    }

    update()    //This function is used to make the circle move with particular velocity.
    {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }

}


class Enemy
{
    constructor(x, y, radius, color, velocity)
    {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocity = velocity;
    }

    draw()
    {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = 'green';
        context.fill();
    }

    update()
    {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }

}

const enemies = []

function spawn_enemies()
{
    setInterval(() =>
    {
        const angle = Math.atan2(canvas.height/2 - y, canvas.width/2 - x);
        const velocity = {x : Math.cos(angle), y : Math.sin(angle)};
        const enemy = new Enemy(100, 100, 30, 'green', velocity);
        enemies.push(enemy);
    }, 1000)
}

const projectiles = []; //This list contains set of projectile points need to be targeted

function animate()  //This function is used to animate the process
{
    requestAnimationFrame(animate);
    context.clearRect(0, 0, canvas.width, canvas.height);
    p1.draw(); //This is used to draw the player
    projectiles.forEach((projectile) =>
    {
        projectile.update();
    })

    enemies.forEach((enemy) =>
    {
        enemy.update();
    });
}

addEventListener('click', (event) => 
{  
    const angle = Math.atan2((event.clientY - canvas.height/2), (event.clientX - canvas.width/2));
    const velocity = {x : Math.cos(angle), y : Math.sin(angle)};
    // const velocity = {x : event.clientX - canvas.width/2, y : event.clientY - canvas.height/2};
    const projectile = new Projectile(canvas.width/2, canvas.height/2, velocity);
    projectiles.push(projectile);

}); 
animate(); 
spawn_enemies();



