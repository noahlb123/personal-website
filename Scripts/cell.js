window.CellAnimation = class CellAnimation {

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.cellArray = [];
    this.memoryArray = [];
    this.animationPixles = [];
    this.animationRow = 0;
    this.rule = this.binaryArray(169, 8);
    this.screenLength = 100;
    this.arrayLength = Math.floor(this.canvas.width / 2);
    this.arrayHeight = this.canvas.height;
    this.cellDifference = Math.floor((this.arrayLength - this.screenLength)/2);
    this.resolution = (this.arrayHeight / this.screenLength);
    this.pixleX = 0;
    this.pixleY = 0;
    this.animationFrame = 0;
    this.pixleColor = null;

    //create first row of cells
    for(var o = 0; o < this.arrayLength-1; o++){
      this.cellArray.push(Math.round(Math.random()));
      this.memoryArray.push(0);
    }
    this.cellArray[Math.floor(this.arrayLength / 2)] = 1;

    //apply rule to each cell
    for(var i = 0; i < this.arrayHeight; i++){
      for(var x = 0; x < this.arrayLength; x++){
        for (let u = 0; u < 8; u++) {
          let ruleSpec = this.binaryArray(u, 3);
          if (this.cellArray[x-1] == ruleSpec[0] && this.cellArray[x] == ruleSpec[1] && this.cellArray[x+1] == ruleSpec[2]){
              this.memoryArray[x] = this.rule[u];
          }
        }
      }

      this.animationPixles.push([]);
      for(var w = 0; w < this.memoryArray.length; w++){
          this.cellArray[w] = this.memoryArray[w];
      }
      for(var w = this.cellDifference; w < this.cellDifference + this.screenLength; w++){
          this.animationPixles[this.animationRow].push(this.cellArray[w]);
      }
      this.animationRow++;
    }
  }

  //8 bit Binary converter
  binaryArray(decimalNumber, bitNumber){
      var binaryN = [];
      for(var i = 0; i < bitNumber; i++){
          binaryN.push(0);
      }
      for(var i = bitNumber-1; i >= 0; i--){
          if(decimalNumber - (2 ** i) >= 0){
              binaryN[i] = 1;
              decimalNumber = decimalNumber - (2 ** i);
          }
      }
      return(binaryN);
  };

  //render image
  draw() {
      for(var pixleY = this.animationFrame; pixleY < this.screenLength + this.animationFrame; pixleY++){

          //color pixles
          for(var pixleX = 0; pixleX < this.screenLength; pixleX++){
              if(this.animationPixles[pixleY][pixleX] == 1) {
                this.ctx.fillStyle = "#FFF";
              }
              else{
                this.ctx.fillStyle = "#000";
              }
              this.ctx.fillRect(pixleX * this.resolution,
                (pixleY - this.animationFrame) * this.resolution,
                this.resolution,
                this.resolution
              );
          }
      }
      //scroll
      this.animationFrame += 1;
      //loop
      if(this.animationFrame > this.arrayHeight - 300){
          this.animationFrame = 0;
      }
  };
}
