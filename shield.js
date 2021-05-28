class Shield extends BaseClass {
    constructor(x,y){
      super(x,y,80,height-400);
      this.body.label = 'shield'
      this.image = loadImage("sprites/wood2.png");
    }
  }