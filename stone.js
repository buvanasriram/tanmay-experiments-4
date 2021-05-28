class Stone extends BaseClass {
  constructor(x,y){
    super(x,y,50,50);
    Matter.Body.setStatic(this.body,true);
    this.body.label = 'stone'
    this.trajectory = []
    this.image = loadImage("sprites/stone.png");
    this.smokeImage = loadImage("sprites/smoke.png");
    
  }
  display() { // all new
      if (keyIsDown(RIGHT_ARROW) && angle < 0.6) {
        angle +=0.01; 
        Matter.Body.setAngle(this.body, angle)
      }; 
      if (keyIsDown(LEFT_ARROW) && angle > -1) {
          angle -=0.01;
          Matter.Body.setAngle(this.body, angle); 
      }
      if (this.body.velocity.x > 5 && this.body.position.x > 20) {
        var position = [this.body.position.x, this.body.position.y];
        this.trajectory.push(position);
      }
  
      for (var i = 0; i < this.trajectory.length; i++) {
        image(this.smokeImage, this.trajectory[i][0], this.trajectory[i][1], 5, 5);
      }
      super.display();
  }
}
