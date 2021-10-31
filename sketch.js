var mario,mario_standingImg,mario_runningImg,mario_collidedImg,ground,groundImg,bg,bgImg,coin,coinImg
var enemy,enemyImg,mushroom,mushroomImg,obstacle,obstacleImg,enemyKill,brickImg,restart,restartImg
var totalCoins = 0
var m=120;
var turn =3;
var distance=0;
var enemyGroup,enemyKillGroup
var gameState="play"

function preload(){
  mario_standingImg=loadAnimation("mario00.png")
  mario_runningImg=loadAnimation("mario03.png","mario01.png")
  mario_collidedImg=loadAnimation("collided.png")
  groundImg=loadImage("ground2.png")
  bg=loadImage("bg.png")
  obstacleImg=loadAnimation("obstacle1.png","obstacle2.png","obstacle3.png","obstacle4.png")
  enemyImg=loadImage("enemy.png")
  brickImg=loadImage("brick.png")
  coinImg=loadImage("coin.png")
  restartImg=loadImage("restart.png")

 /* gameSound= loadSound("mariogame.mp3")
  jump=loadSound("jump.mp3")
  coin=loadSound("coin.mp3")
  die=loadSound("die.mp3")
 // doorway=loadSound("doorway.wav")*/

}

function setup(){
  createCanvas(windowWidth,windowHeight)
  
  mario=createSprite(10,height-150,20,20)
  mario.addAnimation("standing",mario_standingImg)
  mario.addAnimation("running",mario_runningImg)
  mario.addAnimation("collided",mario_collidedImg)
  mario.setCollider("rectangle",0,3,20,25)
  
  ground=createSprite(0,height-130,width*4,20)
  ground.visible=false

  restart=createSprite(width/2,height/2)
  restart.addImage(restartImg)
  restart.visible=false
  
  enemyGroup=createGroup()
  enemyKillGroup=createGroup()
  brickGroup=createGroup()
  coinGroup=createGroup()
  obstacleGroup=createGroup()
  
  gameState="play"
 // gameSound.play();
}

function draw()
{
    background(bg)
  
   if(gameState==="play")
    {
      if (frameCount % round(frameRate()) === 0 && m > -1) {
    
        m --;
       
      }
      camera.position.x=mario.x+350
      ground.x=mario.x
      mario.collide(ground)
      console.log(distance)
      if(keyIsDown(RIGHT_ARROW))
      {
        mario.changeAnimation("running",mario_runningImg)
        mario.x=mario.x+20
        distance++;
      }
      else
      {
        mario.changeAnimation("standing",mario_standingImg)
      }

      if(keyIsDown(LEFT_ARROW))
      {
        mario.changeAnimation("running",mario_runningImg)
        mario.x=mario.x-5
        distance--;
      }
      else
      {
        mario.changeAnimation("standing",mario_standingImg)
      }

      if(keyDown("space")&&mario.y>=717)
      {
        mario.velocityY=mario.velocityY-10
        //jump.play()
      }
      
      mario.velocityY=mario.velocityY+0.5

      var r =Math.round(random(1,2))
      if(frameCount%100===0)
      {
        if(r===1)
        spawnBricks()
        else
        spawnObstacles()
      }
      spawnEnemies()
      if(enemyKillGroup.isTouching(mario))
      {
        enemyGroup.destroyEach()
      }
      
      if(brickGroup.isTouching(mario))
      {
        spawnCoins();
        brickGroup.destroyEach();
        coin.velocityY=-5
        coin.lifetime=10
        totalCoins=totalCoins+1
        //coin.play();
      }
      if( distance>=1000 && m>0)
      {
        gameState="end";
        castle=createSprite(mario.x-250,mario.y);
        castle.addImage("castle.png")
        fill("black")
        textSize(30)
        text("You Won",castle.x-100,height-50);
        //doorway.play()
      }
      
      if(enemyGroup.isTouching(mario)||obstacleGroup.isTouching(mario)||m===0)
      {
        
        gameState="end";
        mario.changeAnimation("collided",mario_collidedImg);
        turn=turn-1
        fill("black")
        textSize(30)
        text("GAME OVER",mario.x-100,height-200);
        restart.x=mario.x
        restart.visible=true
       // die.play()
      }
      if(turn===0)
      {
        gameState="end"
        fill("black")
        textSize(15)
        text("GAME OVER!!!",mario.x-100,height-200);
        text("BETTER LUCK NEXT TIME!!!",mario.x-100,height-250);
      }
  }
    
  if(gameState==="end")
  {
    
    mario.velocityY=0
    distance=0
    brickGroup.destroyEach();
    enemyGroup.destroyEach();
    obstacleGroup.destroyEach();
    
  }
  if(mousePressedOver(restart))
  {
    reset();
  }
  drawSprites()
  fill("black")
  textSize(20)
  text("Coins: "+totalCoins,mario.x-180,50)
  text("Time: "+m,mario.x-300,50)
  
}

function reset()
{
  gameState="play";
  mario.changeAnimation("standing",mario_standingImg);
  restart.visible=false
  totalCoins=0
 
  m=120
}
function spawnEnemies(){
  if(frameCount%400===0){
  enemy=createSprite(width,height-136,20,20)
  enemy.velocityX=-1
  enemy.addImage(enemyImg)
  enemy.scale=0.2
  enemyKill=createSprite(enemy.x,enemy.y-35,20,5)
  enemyKill.visible=false
  enemy.setCollider("rectangle",-10,-50,100,100)
  enemy.lifetime=width
  enemyKill.lifetime=width
  enemyKill.velocityX=-1
  enemyGroup.add(enemy)
  enemyKillGroup.add(enemyKill)

  }
}
function spawnBricks(){
  
    brick1=createSprite(mario.x+200,height-230,20,20)
    brick1.addImage(brickImg)
    brick1.scale=0.8
    //brick1.velocityX=-3
    
    brickGroup.add(brick1)
    //coinGroup.add(coin)

}
function spawnObstacles(){
  
    obstacle=createSprite(mario.x+400,height-160,20,10)
    obstacle.addAnimation("plant",obstacleImg)
    obstacle.scale=0.75
    obstacleGroup.add(obstacle)
  
}
function spawnCoins()
{
  coin=createSprite(mario.x,mario.y-20,10,10)
  coin.addImage(coinImg)
  coin.scale=0.05
}