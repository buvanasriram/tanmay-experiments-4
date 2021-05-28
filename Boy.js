class Boy extends BaseClass {
  constructor(x,y, w,h){ 
    super(x,y,w,h); 
    Matter.Body.setStatic(this.body, true) 
    this.image = loadImage("sprites/boy.png");
  }
}
