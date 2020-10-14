//Create variables here
var dog,dogImg,dogImg1;
var database
var foodS,foodStock;
var btnFeed,btnAddFeed;
var fedTime,lastFed;

var garden,washroom,bedroom,database;
var gameState,readState;

function preload()
{
  //load images here
  dogImg=loadImage("images/dogImg.png");
  dogImg1=loadImage("images/dogImg1.png");
  garden=loadImage("images/Garden.png");
  washroom=loadImage("images/Wash Room.png");
  bedroom=loadImage("images/Bed Room.png");
}

function setup() {
  database=firebase.database();
  createCanvas(600, 500);

  foodObj= new Food();
  foodObj.getfoodStock();
  
  dog=createSprite(250,300,150,150);
  dog.addImage(dogImg);
  dog.scale=0.1;

  foodStock=database.ref('Food')
  foodStock.on("value",readStock);
  textSize(20);

  btnFeed=createButton("FEED THE DOG");
  btnFeed.position(600,100);
  btnFeed.mousePressed(feedDog);

  btnAddFeed=createButton("ADD FEED");
  btnAddFeed.position(800,100);
  btnAddFeed.mousePressed(addFood);

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  })
  
}


function draw() {  
  background(46,139,87);
  currentTime=hour();

  //add styles here
  /*fill(255,255,254);
  stroke("purple");
  text("FOOD REMAINING: "+foodS,170,200);
  textSize(15);
  text("NOTE: PRESS UP_ARROW TO FEED MILK!",110,10,350,20);
*/
foodObj.display();
foodObj.updateFoodStock(foodS);
database.ref("FeedTime").on("value",(data)=>{
  lastFed=data.val();
})

fill(255,255,254);
stroke("purple");
textSize(15);
if(lastFed>=12){
  text("LAST FEED: "+lastFed%12+ "PM",350,30);
}else if(lastFed==0){
text("LAST FEED: 12 AM",350,30);
}else{
  text("LAST FEED :",lastFed+"AM",350,30);
}

if(currentTime==(lastFed)+1){
  update("Playing");
  foodObj.garden();
}else if(currentTime==(lastFed)+2){
  update("Sleeping");
  foodObj.bedroom();
}else if(currentTime>(lastFed+2)&& currentTime<=(lastFed+4)){
  update("Bathing");
  foodObj.washroom();
}else{
  update("Hungry");
  foodObj.display();
}
    if(gameState!="Hungry"){
       btnFeed.hide(); 
       btnAddFeed.hide(); 
       dog.remove();
       }
       else{
          btnFeed.show();
           btnAddFeed.show(); 
           dog.addImage(dogImg1);
       }    
}


function readStock(data){
  foodS=data.val();
  console.log(foodS);
  foodObj.updateFoodStock();
}

/*function writeStock(x){
  if(x<=0){
    x=0;
  } else{
    x=x-1;
  }
  database.ref('/').update({
    Food:x
  })
}*/

function feedDog(){
  
  dog.addImage(dogImg1);
  foodObj.updateFoodStock(foodObj.getfoodStock()-1);

  database.ref('/').update({
    Food: foodObj.getfoodStock(),
    FeedTime : hour()
  })
}

function addFood(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
function update(state){
  database.ref('/').update({
    gameState: state
  })
}


