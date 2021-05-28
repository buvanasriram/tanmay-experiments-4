class Ground {
    constructor(x,y,width,height) {
      var options = {
          isStatic: true
      }
      this.body = Bodies.rectangle(x,y,width,height,options);
      this.width = width;
      this.height = height;
      World.add(world, this.body);
      this.image = loadImage("sprites/wood1.png");
    }
    display(){
      var pos =this.body.position;
      push(); //new image for ground
      imageMode(CENTER);
      //fill("brown");
      image(this.image, pos.x, pos.y, this.width, this.height);
      pop();
    }
  };
