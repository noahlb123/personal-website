//convert rgb to dom string hex
window.rgbToHex = function rgbToHex(rgbArray) {
  let out = '#';
  for (let i = 0; i < rgbArray.length; i++) {
    let hex = rgbArray[i].toString(16);
    if (hex.length < 2) {
      hex = '0' + hex;
    }
    out += hex;
  }
  return out;
}
