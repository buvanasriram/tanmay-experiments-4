class Zombie extends BaseClass {
    constructor(x, y,w,h){
      super(x,y,w,h);
      Matter.Body.setStatic(this.body, true)
      this.image = loadImage("sprites/monster.png");
      this.visibility = 255;
    }
    display(){
        if (this.body.speed < 3 ) {
            super.display();
          }
          else {
              World.remove(world,this.body);
              push();
              this.visibility = this.visibility-5;
              tint(255,this.visibility);
              image(this.image,this.body.position.x,this.body.position.y,50,50);
              pop();
            }
    }
    score() {
          if (this.visibility < 0 && this.visibility > -205) {
            score++;
          }
    }
  };
  