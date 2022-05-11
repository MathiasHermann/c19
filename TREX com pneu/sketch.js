var corredor, corredorImg;
var egde;
var solo, imageSolo, soloInvisivel;
var nuvens, imageNuvens;
var pneu, pneu1, pneu2, pneu3, pneu4
var score = 0
var play = 1
var end = 0
var gameState = play
var pneuGp, nuvensGp
var record = 0
var restart, imageRestart
var gameOver, imageGameOver
var pulo, morte, pontos

//preload carrega as midías
function preload(){
  //animação do Trex
  corredorImg = loadImage('corredor.gif');
  // imagem nuvens
  imageNuvens = loadImage('cloud.png');

  //imagem do solo
  imageSolo = loadImage('ground2.png');
  
  // som do jogo
  pulo = loadSound('jump.mp3');
  morte = loadSound('die.mp3');
  pontos = loadSound('checkpoint.mp3');

  //imagem do cacto
  pneu1 = loadImage('pneu1.png');
  pneu2 = loadImage('pneu2.png');
  pneu3 = loadImage('pneu3.png');
  pneu4 = loadImage('pneu4.png');
  imageRestart = loadImage('restart.png');
  imageGameOver = loadImage('gameOver.png')
}
// Setup do Trex, bordas, solo e soloInvisivel
function setup(){
  
  createCanvas(windowWidth,windowHeight);
  
  egde = createEdgeSprites();
  
  corredor = createSprite(50, height-50, 20, 50);
  corredor.debug = false
  corredor.setCollider('rectangle', 0,0,100,300,180)
  //corredor.setCollider('circle',0,0,25)
  corredor.addAnimation('correndo', corredorImg);
  corredor.scale = 0.3;

  solo = createSprite(width/2, height-25, width, 2);
  solo.addImage('solo', imageSolo)
  
  soloInvisivel = createSprite(width/2, height-10 , width, 2)
  soloInvisivel.visible = false 

  pneusGp = new Group();
  nuvensGp = new Group();

  gameOver = createSprite(width/2,height-120,200,30)
  gameOver.addImage(imageGameOver)
  gameOver.scale = 0.7
  gameOver.visible = false
  restart = createSprite(width/2,height-80,200,30)
  restart.addImage(imageRestart)
  restart.scale = 0.7
  restart.visible = false
}

//draw faz o movimento, a ação do jogo
function draw(){
  background("white");
  if(corredor.isTouching(pneusGp)){
    gameState = end
    //morte.play();
  }

  if(gameState===play){
    score += Math.round (getFrameRate()/60)
    if (score%100===0&&score>0){
    //pontos.play();
    }
    if (touches.length>0||keyDown('space') && corredor.y > height-100) {
    corredor.velocityY = -12
    //pulo.play();
    touches = []
    }
    solo.velocityX = -(12+score/100)
    if (solo.x < 800){
    solo.x = solo.width/2
    }
    criandoNuvens(); 
    criandoPneus();
  }

  if(gameState===end){
    solo.velocityX=0;
    pneusGp.setVelocityXEach(0);
    nuvensGp.setVelocityXEach(0);
    pneusGp.setLifetimeEach(-1);
    nuvensGp.setLifetimeEach(-1);
    gameOver.visible = true
    restart.visible = true
    if (record<score){
      record = score
    }
    if (mousePressedOver(restart)){
      gameState = play;
      gameOver.visible = false
      restart.visible = false
      pneusGp.destroyEach();
      nuvensGp.destroyEach();
      score = 0;
    }
  }

  // coordenadas do mouse na tela
  text("X: "+mouseX+"  / Y: "+mouseY,mouseX,mouseY);
  
  // chamando a  função de gravidade
  gravidade();

  // colisão do trex com as bordas
  corredor.collide(soloInvisivel);
   
  // fazendo as nuvens aparecerem na tela

  textSize (18)
  fill ('black')
  text('record: '+record, width-110,height-155)
  text('score: '+score, width-110,height-175)

  drawSprites();

}
// função de gravidade
function gravidade(){
  corredor.velocityY += 0.5;

}

// função para criar as nuvens
function criandoNuvens(){
  if (frameCount % 80 === 0){
  nuvens = createSprite(width, random(height-180,height-100), 40, 10);
  nuvens.velocityX = -(3+score/100)
  nuvens.addImage(imageNuvens);
  nuvens.scale = random(0.7,1.4);
  nuvens.depth = corredor.depth -1;
  nuvens.lifetime = width/nuvens.velocityX
  nuvensGp.add(nuvens)

  }

}

function criandoPneus(){
  if (frameCount % 100 === 0){
    pneu = createSprite (width,height-30,50,50);
    pneu.velocityX = -(4+score/100)
    pneu.scale = 0.1 
    pneu.depth = corredor.depth
    pneu.lifetime = width/pneu.velocityX
    pneusGp.add(pneu)

    var sorteio = Math.round(random (1,4))
    switch (sorteio) {
      case 1:pneu.addImage(pneu1)
        break;
        case 2:pneu.addImage(pneu2)
        break;
        case 3:pneu.addImage(pneu3)
        break;
        case 4:pneu.addImage(pneu4)
        break;
    }


  }
}