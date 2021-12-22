class Ant {
  constructor(tileNumber, screenLength, randomStart) {
    this.randomStart = randomStart;
    this.positioner = 0;
    this.tileNumber = tileNumber;
    this.screenLength = screenLength;
    this.moving = false;
    this.memoryX = [];
    this.memoryY = [];
    this.gX = null;
    this.gY = null;

    if (this.tileNumber % 2 !== 0) {
        this.positioner = 0;
    } else {
        this.positioner = (this.screenLength / this.tileNumber)/2;
    }

    if (this.randomStart) {
        this.x = (this.screenLength / this.tileNumber) * Math.floor(this.tileNumber * Math.random());
        this.y = (this.screenLength / this.tileNumber) * Math.floor(this.tileNumber * Math.random());
    } else {
        this.x = this.screenLength / 2 + this.positioner;
        this.y = this.screenLength / 2 + this.positioner;
    }
  }
};

window.AntAnimation = class AntAnimation {

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.lineWidth = 1;
    this.screenLength = this.canvas.height;
    this.tileNumber = (5 / 6) * this.screenLength;
    this.antNumber = 200;
    this.antSize = 10;
    this.grid = false;
    this.refresh = false;
    this.randomStart = true;
    this.array = [0, 0, 0, 2, 2, 2, 3, 3, 4, 6];
    this.antSettings = {
      line: {active: true, r: 200, g: 200, b: 200},
      ball: {active: false, r: 0, g: 0, b: 0, size: 2}
    };
    this.ants = [];
    this.tiles = [];
    this.fillTiles(this.tiles);
    this.ctx.fillStyle = "#fff";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for(var i = 0; i < this.antNumber; i ++){
        this.ants.push(new Ant(
          this.tileNumber,
          this.screenLength,
          this.randomStart
        )
      );
    }
  }

  //for some reason javascript ellipses are twice the size of khan academy ellipses
  halfEllipse(x, y, xRadius, yRadius) {
    let factor = 2;
    this.ctx.ellipse(x, y, xRadius / factor, yRadius / factor, 0, 0, 2 * Math.PI);
  }

  sortValue(a, b){
      return(a - b);
  };

  search(array, target){
      var max = array.length - 1;
      var min = 0;
      while(max >= min){
          if(array[Math.floor((max + min) / 2)] > target){
              max = Math.floor((max + min) / 2);
          }
          else if(array[Math.round((max + min) / 2)] < target){
              min = Math.floor((max + min) / 2);
          }
          else{
              return(Math.floor((max + min) / 2));
          }
      }
      println("ERROR: ID in " + array.name + " not found");
      return(-1);
  };

  removeDupes(array){
      var badIndexs = [];
      var currentIndex = 0;
      var subjectIndex = 1;
      for(var i = 0; i < array.length; i++){
          while(array[currentIndex] === array[subjectIndex]){
              badIndexs.push(subjectIndex);
              subjectIndex++;
          }
          currentIndex = subjectIndex;
          subjectIndex ++;
      }
      for(var i = 0; i < badIndexs.length; i++){
          array.splice(badIndexs[i], 1);
      }
      return(array);
  };

  betterRandom(min, max, blacklist) {
      let difference = blacklist.length + 1;
      var temp = Math.floor(difference * Math.random() - 1);
      var newMin = 0;
      var newMax = 0;
      if(temp >= 0){
          newMin = blacklist[temp] + 1;
      }
      else{
          newMin = min;
      }
      if(temp + 1 < blacklist.length){
          newMax = blacklist[temp + 1] - 0.01;
      }
      else{
          newMax = max;
      }
      let diff = newMax - newMin;
      return(newMin + diff * Math.random());
  };

  moveDirection(ant, angle){
      ant.x += Math.cos(angle);
      ant.y += -Math.sin(angle);
  };

  aviodWalls(ant){
      if(ant.x > 0 && ant.x < this.screenLength && ant.y < this.screenLength && ant.y > 0){
          this.moveDirection(ant, 360 * Math.random());
      }
      else if(ant.x < 0){
          this.moveDirection(ant, 0);
      }
      else if(ant.x > screenLength){
          this.moveDirection(ant, 180);
      }
      else if(ant.y < 0){
          this.moveDirection(ant, 270);
      }
      else{
          this.moveDirection(ant, 90);
      }
  };

  goTo(x, y, ant){
      this.moveDirection(ant, Math.atan2(-(y - ant.y),(x - ant.x)));
  };

  goAway(x, y, ant){
      this.moveDirection(ant, Math.atan2(-(ant.y - y),(ant.x - x)));
  };

  fillTiles(array){
      var temp = [];
      let num = this.screenLength / (this.screenLength / this.tileNumber);
      while(array.length < num) {
          for(var w = 0; w < num; w++){
              temp.push({color: 255});
          }
          array.push(temp);
          temp = [];
      }
  };

  colorTiles(array){
      var row = 0;
      var i = 0;
      while(row < array.length){
          this.ctx.fillStyle = rgbToHex([
            array[i][row].color,
            array[i][row].color,
            array[i][row].color
          ]);
          this.ctx.fillRect(
            i * (this.screenLength / this.tileNumber),
            row * (this.screenLength / this.tileNumber),
            this.screenLength / this.tileNumber,
            this.screenLength / this.tileNumber
          );
          i++;
          if(i > this.screenLength / (this.screenLength / this.tileNumber) - 1){
              row++;
              i = 0;
          }
      }
  };

  chooseDestination(ant){
      if(ant.moving && ant.x <= ant.gX + 1 && ant.x >= ant.gX - 1 &&
          ant.y <= ant.gY + 1 && ant.y >= ant.gY - 1) {
          ant.moving = false;
          if(ant.x > 0 && ant.x <= this.screenLength && ant.y > 0 && ant.y <= this.screenLength){
              this.tiles[Math.floor(ant.x/(this.screenLength/this.tileNumber))][Math.floor(ant.y/(this.screenLength/this.tileNumber))].color = 0;
          }
          ant.memoryX.push(Math.floor(ant.x/(this.screenLength/this.tileNumber)));
          ant.memoryY.push(Math.floor(ant.y/(this.screenLength/this.tileNumber)));
      }
      else if(ant.moving === false){
          ant.moving = true;
          var randomNumber = Math.round(Math.random());
          if(randomNumber === 0){
          ant.gX = ant.x + (this.screenLength/this.tileNumber) * Math.round(2 * Math.random() - 1);
          ant.gY = ant.y + (this.screenLength/this.tileNumber)* Math.round(2 * Math.random() - 1);
          }
          else{
          ant.gY = ant.y + (this.screenLength/this.tileNumber) * Math.round(2 * Math.random() - 1);
          ant.gX = ant.x + (this.screenLength/this.tileNumber)* Math.round(2 * Math.random() - 1);
          }
      }
  };

  closest(ant, index){
      var closest = 10;
      for(var i = 0; i < ants.length; i++){
          if(closest > sqrt( sq(ants[i].x - ant.x) + sq(ants[i].y - ant.y))){
              closest = sqrt( sq(ants[i].x - ant.x) + sq(ants[i].y - ant.y));
          }
      }
      return(ants[closest]);
  };

  equalize(ant, index) {
      this.ctx.fillStyle = "#00F";
      this.halfEllipse(closest(ant, index).x, closest(ant, index).y, this.antSize, this.antSize);
      this.goAway(closest(ant, index).x, closest(ant, index).y, ant);
  };

  seperate(ant){
      var sumX = 0;
      var sumY = 0;
      for(var i = 0; i < ants.length; i++){
          sumX += ants[i].x;
          sumY += ants[i].y;
      }
      sumX -= ant.x;
      sumY -= ant.y;
      sumX /= ants.length - 1;
      sumY /= ants.length - 1;
      this.goAway(sumX, sumY, ant);
  };

  draw() {
      /*if(this.grid){
          this.colorTiles(tiles);
      }*/
      /*if(this.refresh){
          this.ctx.fillStyle = "#fff";
          this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      }*/
      for (var i = 0; i < this.ants.length; i++){
          this.chooseDestination(this.ants[i]);
          //moveDirection(ants[i], random(0, 360));
          //aviodWalls(ants[i]);
          this.goTo(
            this.ants[i].gX,
            this.ants[i].gY,
            this.ants[i]
          );
          //goAway(0, 0, ants[i]);
          //seperate(ants[i]);
          //equalize(ants[i], i);
          if(this.antSettings.line.active) {
              this.ctx.strokeStyle = rgbToHex([
                this.antSettings.line.r,
                this.antSettings.line.g,
                this.antSettings.line.b
              ]);
              this.ctx.beginPath();
              this.ctx.moveTo(this.ants[i].x, this.ants[i].y);
              this.ctx.lineTo(this.ants[i].gX, this.ants[i].gY);
              this.ctx.stroke();
          }
          if(this.antSettings.ball.active){
              this.ctx.strokeStyle = "#646464";
              this.ctx.fillStyle = rgbToHex([
                this.antSettings.ball.r,
                this.antSettings.ball.g,
                this.antSettings.ball.b
              ]);
              this.halfEllipse(
                this.ants[i].x,
                this.ants[i].y,
                this.antSettings.ball.size,
                this.antSettings.ball.size
              );
          }
      }
  };
}
