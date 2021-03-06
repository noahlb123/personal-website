//animation class for pikacu
window.PikaAnimation = class PikaAnimation {

  constructor(canvas) {
    //init vars
    this.xPositions = [];
    this.yPositions = [];
    this.speed = [];
    this.raindropNumber = 300;
    this.dropColor = [];
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');

    //creates all the raindrops with properties
    for(var i = 0; i < this.raindropNumber; i++){
      this.xPositions.push(this.canvas.width * Math.random());
      this.yPositions.push(this.canvas.height * Math.random());
      this.speed.push(3 + 1.5 * Math.random());
      this.dropColor.push({green: Math.floor(160 * Math.random()), blue: 190});
    }
  }

  //makes two symmetrical lines
  sline(x1, y1, x2, y2, aos){
    var X1 = aos - x1;
    var X2 = aos - x2;
    //line 1
    this.ctx.beginPath();
    this.ctx.moveTo(x1 + 2*X1, y1);
    this.ctx.lineTo(x2 + 2*X2, y2);
    this.ctx.stroke();
    //line 2
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  };

  //Draws two ellipses symetrical across an axis of symmetry (aos)
  sellipse(x, y, w, h, aos){
    var X = aos-x;
    this.ctx.beginPath();
    this.halfEllipse(x, y, w, h, 0, 0, 2 * Math.PI);
    this.ctx.fill();
    this.halfEllipse(x + 2 * X, y, w, h, 0, 0, 2 * Math.PI);
    this.ctx.fill();
  };

  //for some reason javascript ellipses are twice the size of khan academy ellipses
  halfEllipse(x, y, xRadius, yRadius, rotation, startAngle, endAngle) {
    let factor = 2;
    this.ctx.ellipse(x, y, xRadius / factor, yRadius / factor, rotation, startAngle, endAngle);
  }

  //Draws Pikachu
  drawPika(pikax, pikay, pm){
    this.ctx.lineWidth = 0;
    this.ctx.fillStyle = "#FFD200";
    //body
    this.ctx.beginPath();
    this.halfEllipse(pikax, pikay, 150 * pm, 200 * pm, 0, 0, 2 * Math.PI);
    this.ctx.fill();
    //legs
    this.ctx.beginPath();
    this.sellipse(pikax - 40 * pm, pikay + 70 * pm, pm * 90, pm * 120, pikax);
    this.ctx.fill();
    //head
    this.ctx.beginPath();
    this.halfEllipse(pikax, pikay - 100 * pm, pm * 150, pm * 150, 0, 0, 2 * Math.PI);
    this.ctx.fill();
    //ears
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = '#FFD200';
    this.ctx.lineWidth = pm * 30;
    this.sline(pikax - pm * 20, pikay - pm * 120, pikax - pm * 100, pikay - pm * 180, pikax);
    //feet
    this.ctx.lineCap = 'square';
    this.sellipse(pikax-pm*45,pikay+pm*130,pm*60,pm*20,pikax);
    //arms
    this.ctx.fillStyle = '#FFE600';
    this.sellipse(pikax-70*pm,pikay,50*pm,pm*100,pikax);
    //cheeks
    this.ctx.fillStyle = '#FF0000';
    this.sellipse(pikax-55*pm,pikay-80*pm,pm*30,pm*40,pikax);
    //eyes
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = pm * 3;
    this.sline(pikax - 10 * pm, pikay - 105 * pm, pikax - 10, pikay - 105 * pm, pikax);
    //mouth
    this.ctx.strokeStyle = '#000';
    this.sline(pikax-10*pm, pikay-75*pm, pikax, pikay-80*pm, pikax);
    this.sline(pikax-15*pm, pikay-77.5*pm, pikax-10*pm, pikay-75*pm, pikax);
    //nose
    this.ctx.fillStyle = '#000';
    this.ctx.beginPath();
    this.halfEllipse(pikax, pikay-90*pm, pm*3, pm*3, 0, 0, 2 * Math.PI);
    this.ctx.fill();
  };

  //tells raindrops wether they can go in front of umbrella
  umbrellaMode(i){
    return(
      this.yPositions[i] >= this.canvas.height * (13 / 20) / 3 * this.speed[i] ||
      this.yPositions[i] >= this.canvas.height * (23 / 80) + 17 && this.xPositions[i] >= this.canvas.width * (9 / 40) && this.xPositions[i] <= this.canvas.width * (3 / 5)
    );
  };

  draw() {
    this.ctx.fillStyle = "#6893ff";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    //if mouse pressed, disabled for now
    if(false){
      this.xPositions.push(mouseX);
      this.yPositions.push(mouseY);
      this.speed.push(3 + 1.5 * Math.random());
      this.dropColor.push({green: Math.floor(160 * Math.random()), blue: 190});
    }
    //ground
    this.ctx.fillStyle = "#0050be";
    this.ctx.fillRect(0, this.canvas.height * (13 / 20), this.canvas.width, this.canvas.height / 2);
    this.drawPika(this.canvas.width / 2, (5 / 8) * this.canvas.height, this.canvas.width * (1 / 800));
    //unbrella handle
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect((2 / 5) * this.canvas.width, (3 / 10) * this.canvas.height + 18, 10, 140);
    //unbrella
    this.ctx.fillStyle = "#ff64c8";
    this.ctx.fillRect((9 / 40) * this.canvas.width, (3 / 10) * this.canvas.height + 17, 150, 15);

    //animating raindrops
    for (var i = 0; i < this.xPositions.length; i++) {
      //noStroke();
      this.ctx.beginPath();
      this.ctx.fillStyle = rgbToHex([0, this.dropColor[i].green, this.dropColor[i].blue]);
      this.halfEllipse(this.xPositions[i], this.yPositions[i], this.canvas.width * (1 / 40), this.canvas.width * (1 / 40), 0, 0, 2 * Math.PI);
      this.ctx.fill();
      if(this.umbrellaMode(i)){
        //this.ctx.fillStyle = "#0050be";
        //ellipse(xPositions[i], yPositions[i], 15, 15);
        this.yPositions[i] = 0;
        this.xPositions[i] = this.canvas.width * Math.random();
      }
      this.yPositions[i] += this.speed[i];
    }
  };
}
