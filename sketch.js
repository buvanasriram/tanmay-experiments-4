const Engine = Matter.Engine;
const World= Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world, database, form;
var box1, box2, zombie;
var backgroundImg,platform, boy;

var showLeaderBoard = false; 
var allPlayers;
var angle = -3.14/4;

// instead of sling, try machine gun / cannon ball or some such image(done)
// leaderboard(done)
// change bg img when button is clicked
// recreate right side after any hit on box1, box2, rightsling1, rightsling2, zombie
// finalise algo for stoneR hitting shield (events vs SAT)
// organise code and delete unneccessary stuff
// check gamestate end
// find new images for zombie and background
// what should happen when stoneL hits stoneR ? or vice versa
// how many stones does each side have?
// end game message?
// renamed catapult as cannon 

var gameState2= "start"
var score = 0;

var numHits2 = 0;

var shield = null;
var flagBoy = 0, flagBox1=0, flagBox2=0, flagZombie=0;
var collision1, collision2, collision3, collision4, collision5, collision6;

var maxId=0;
var whichBg=1; 
var numShields = 10; 
var hitsOnShield = 0;
var maxHitsOnShield = 3;

function preload() {
    backgroundImg1=loadImage("sprites/bg2.jpg") 
    backgroundImg2=loadImage("sprites/bg1.jpg") 
    backgroundImg = backgroundImg1;
}


function setup(){
    var canvas = createCanvas(displayWidth,displayHeight);
    
    engine = Engine.create();
    world = engine.world;
    
    database=firebase.database();
    playersRef = database.ref("players");
    playersRef.once("value",(data) => { maxId = data.numChildren() +1; })
    form=new Form();

    rand = Math.round(random(300,height-300));// generate random number to place the box2 (bottom one) 

    ground = new Ground(width/2,height,width,20); 

    // objects on the left side
    platform = new Ground(200, 455, 350, 270);
    boy = new Boy(100,250, 80,150);
    cannon = new Cannon(200,280,200,100);
    stoneL = new Stone(270,250);
  

    // create objects on the right side
    box1 = new Box(random(width/2, width-200),50,250,100);
    box2 = new Box(box1.body.position.x,160,250,100); 
    zombie = new Zombie(580,height-200, 100,200); 
    stoneR = new Stone(zombie.body.position.x-30,zombie.body.position.y-50);
    
    score = 0;
    Matter.Events.on(engine, 'collisionStart', collision);
  
}

function draw(){
    background(backgroundImg);
    Engine.update(engine);
    textSize(20);
    fill("white");
    if(showLeaderBoard){ 
        var dht = 80; 
        for(var plr in allPlayers){ 
            text(allPlayers[plr].name + ":" + allPlayers[plr].score,50,dht); 
            dht += 30;
         } 
    }

    if (gameState2==="start"){
        form.display();
    }
    else if(gameState2==="play"){
        form.hide();
        if (box2.body.position.y > rand) Matter.Body.setStatic(box2.body, true);
        
        text("Score: "+ score, width/2, 50)
        text("Hits On shield: " + hitsOnShield, 500,50);
        text("Max Hits allowed: "+ maxHitsOnShield, 500,70)
        text("Numhits event based: "+ numHits2, 500,90)
        noStroke();
        
        
        ground.display();

        // left side objects display
        platform.display();
        boy.display();
        cannon.display();
        stoneL.display();

       
        if (shield) shield.display();

        // right side objects display
        box1.display();
        box2.display();
        Matter.Body.setPosition(zombie.body, {x:box1.body.position.x+70, y:box1.body.position.y-145});
        if (stoneR.body.speed < 1)
            Matter.Body.setPosition(stoneR.body, {x:zombie.body.position.x-30,y:zombie.body.position.y-50});
        zombie.display();
        stoneR.display();

        checkForHitsOnRightSide();
       
        if (flagBox1 || flagBox2 || flagZombie){ 
            World.remove(world, box1.body);
            World.remove(world, box2.body);
            World.remove(world, zombie);
            World.remove(world, stoneR.body);

            setTimeout(rePositionAttack(), 10000);
            flagBox1= 0;
            flagBox2 = 0;
            flagZombie = 0;
        }

        checkForHitsOnLeftSide();

        if (flagBoy) gameState2 = "end"; 

        if (frameCount%200 === 0 && zombie.body.speed < 1) {
            Matter.Body.setPosition(stoneR.body, {x:zombie.body.position.x-30, y:zombie.body.position.y-50})
            Matter.Body.setStatic(stoneR.body, false);
            stoneR.trajectory = [];
            Matter.Body.applyForce(stoneR.body, stoneR.body.position, {x:-130, y:-150});
        }
        
        if (hitsOnShield > maxHitsOnShield && shield) {
            World.remove(world, shield.body);
            shield = null;
        }
    }
    else if (gameState2 === 'end') {
        text("game over", width/2, height/2)
        text("Score: "+ score, width/2, 50)
        text("Hits On shield: " + hitsOnShield, 500,50);
        text("Max Hits allowed: "+ maxHitsOnShield, 500,70)
        text("Numhits event based: "+ numHits2, 500,90)
        noStroke();
        ground.display();

        // left side objects display
        platform.display();
        boy.display();
        stoneL.display();
     
        if (shield) shield.display();

        // right side objects display
        box1.display();
        box2.display();
        zombie.display();
        stoneR.display();
    }
}
   
function keyPressed (){
    if (keyCode === 32 && gameState2 === "play") {
        Matter.Body.setStatic(stoneL.body, true)
        stoneL.trajectory = [];
        Matter.Body.setPosition(stoneL.body, {x:270,y:250})
    }

    if (keyCode === DOWN_ARROW && gameState2 === "play") {
        var velocity = p5.Vector.fromAngle(angle);
        velocity.mult(20);
        Matter.Body.setStatic(stoneL.body, false);
        Matter.Body.setVelocity(stoneL.body, { x: velocity.x, y: velocity.y });   
    }

    if (keyCode === 83 && gameState2 === "play" ) {// Letter 's' for shield
        if (shield === null && numShields > 0) 
        {
            shield = new Shield(300,250);
            numShields--;
            hitsOnShield = 0;
        }
    }
}


function collision(event) {
    var pairs = event.pairs;
    for (var i= 0; i < pairs.length; i++) {
      var labelA = pairs[i].bodyA.label;
      var labelB = pairs[i].bodyB.label;
      if ((labelA === 'stone' && labelB === 'shield') ||
      (labelA === 'shield' && labelB === 'stone') ) {
        numHits2++;
      }
    }
}

function checkForHitsOnRightSide() {
    // stoneL hits box1 and box2 10 points
    collision1 = Matter.SAT.collides(stoneL.body, box1.body);
    if (collision1.collided) flagBox1 = 1;
    if (flagBox1) {
        score += 10;
    }
    collision2 = Matter.SAT.collides(stoneL.body, box2.body);
    if (collision2.collided) flagBox2 = 1;
    if (flagBox2) {
        score += 10;
    }
    //stoneL hits zombie , 100 points
    collision3 = Matter.SAT.collides(stoneL.body, zombie.body);
    if (collision3.collided) flagZombie = 1;
    if (flagZombie === 1) {
        Matter.Body.setStatic(zombie.body, false);
        score = score + 100;
    }
    
}

function checkForHitsOnLeftSide() {
    // stoneR hits boy game over
    collision4 = Matter.SAT.collides(stoneR.body, boy.body);
    if (collision4.collided) flagBoy = 1;
    if (flagBoy === 1) {
        Matter.Body.setStatic(boy.body, false);
    }
    
    // stoneR hits shield, if hits are more than maxhits shield is wasted
    if (shield) {
        collision6 = Matter.SAT.collides(stoneR.body, shield.body);
        if (collision6.collided) {
            hitsOnShield++; 
        }
        if (hitsOnShield > maxHitsOnShield) {
            World.remove(world, shield);
            shield = null;
        }
    }

}

function rePositionAttack() {
    rand = Math.round(random(300,height-300));
    
    box1 = new Box(random(width/2, width-200),50,250,100); 
    box2 = new Box(box1.body.position.x,160,250,100); 
    
    zombie = new Zombie(580,height-200, 100,200); 
    stoneR = new Stone(900,10);
    
}