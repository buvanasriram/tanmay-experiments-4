class Form {

  constructor() {
    this.name= createInput("").attribute("placeholder", "name");
    this.age= createInput("").attribute("placeholder", "age");
    this.email= createInput("").attribute("placeholder", "email");

    this.playBtn = createButton('Play');
    this.bgBtn=createButton("Change Background")
    this.leaderBoardBtn=createButton("Leader Board")
    
    this.greeting = createElement('h2');
    this.title = createElement('h2');

  }
  hide(){
    this.greeting.hide();
    this.playBtn.hide();
    this.name.hide();
    this.age.hide();
    this.email.hide();
    this.title.hide();
  }

  display(){
    this.bgBtn.mousePressed(()=> {
      if (whichBg===1) {
        whichBg = 2;
        backgroundImg = backgroundImg2;
      }
      else {
        whichBg = 1;
        backgroundImg = backgroundImg1;
      }
    });    
    this.title.html("new Game");
    this.title.position(displayWidth/2 - 50, 0);

    this.name.position(displayWidth/2 - 40 , displayHeight/2 - 80);
    this.age.position(displayWidth/2 - 40 , displayHeight/2 - 120);
    this.email.position(displayWidth/2 - 40 , displayHeight/2 - 160);
    
    this.playBtn.position(displayWidth/2 + 30, displayHeight/2);
    this.bgBtn.position(displayWidth-100,0)
    this.leaderBoardBtn.position(50,20); 
    
    this.playBtn.mousePressed(()=>{
      this.name.hide();
      this.age.hide();
      this.email.hide();
      this.playBtn.hide();

      var playerIndex = "players/player" + maxId;
      var curDate = new Date();
      database.ref(playerIndex).set({
        name:this.name.value(),
        age:this.age.value(),
        email:this.email.value(),
        date:curDate.getDate() + "/" + curDate.getMonth() + "/" + curDate.getFullYear(),
        score:0
      });
      //console.log(this.name.value()+this.age.value()+this.email.value())
      
      this.greeting.html("Welcome to the game " + this.name.value())
      this.greeting.position(displayWidth/2 - 70, displayHeight/4);
      gameState2 = "play"
    });


   
    this.leaderBoardBtn.mousePressed(()=>{ 
      playersRef.orderByChild("score").limitToLast(2).on("value",(data) => { 
         allPlayers = data.val();
         console.log(allPlayers); 
         if(showLeaderBoard){
            showLeaderBoard = false;
         } else{ 
            showLeaderBoard = true; 
         } 
      }) 
    });
    

  }
  updateScore(finalScore){ 
    var playerIndex = "players/player" + maxId; 
    database.ref(playerIndex).update({ score:finalScore }) 
  }
}

