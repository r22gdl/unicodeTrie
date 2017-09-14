/*byte ops with console.logs*/

var bytesPerSymbol = 5; // last byte reserved for is complete word

var getPadding = function _getPadding(byteLength, denotesWord) {
  var padding = [];
  var fullByte = 0xFF;
  var wordFlag = denotesWord ? 0x01 : 0x00;
  for(var i = byteLength; i < 4; i++){
    padding.push(fullByte);
  }
  padding.push(wordFlag);
  return padding;
};

var toByteArray = function _toByteArray(str) {
  var byteArray = [];
  var denotesWord = false;
  console.log('str: ', str);
  for (var i = 0; i < str.length; i++) {
    console.log('i: ', i);
    //character denotes word if it's last char in string
    denotesWord = (i === str.length - 1);
    if (str.charCodeAt(i) <= 0x7F) {
      console.log('str.charCodeAt(i) <= 0x7F');
      byteArray.push(str.charCodeAt(i));
      console.log('getPadding(1, denotesWord): ', getPadding(1, denotesWord));
      byteArray = byteArray.concat(getPadding(1, denotesWord));
      console.log('byteArray w/ padding', byteArray);
    } else {
      console.log('str.charCodeAt(i) > 0x7F');
      var h = encodeURIComponent(str.charAt(i)).substr(1).split('%').slice(1);
      console.log('h w/ slice(1): ', h);
      h = encodeURIComponent(str.charAt(i)).substr(1).split('%');
      console.log('h w/o slice: ', h);
      console.log('h.length: ', h.length);
      for (let j = 0; j < h.length; j++) {
        console.log('j: ', j);
        console.log('byteArray.push(parseInt(h[j], 16))');
        byteArray.push(parseInt(h[j], 16));
        console.log('byteArray: ', byteArray);
      }
      console.log('byteArray.concat(getPadding(h.length, denotesWord));')
      console.log('where h.length: ', h.length);
      console.log('denotesWord: ', denotesWord);
      console.log('getPadding(h.length, denotesWord): ', getPadding(h.length, denotesWord));
      byteArray = byteArray.concat(getPadding(h.length, denotesWord));
      console.log('byteArray w/ padding', byteArray);
    }
  }
  console.log('byteArray.length: ', byteArray.length);
  return byteArray;
};


var parse = function _parse(byteArray) {
  var str = '';
  console.log('byteArray.length: ', byteArray.length);
  for (var i = 0; i < byteArray.length; i++) {
    console.log('i: ', i);
    if ((i + 1)%bytesPerSymbol === 0) {
      console.log('5th byte');
    } else if (byteArray[i] <= 0x7f) {
      console.log('byteArray[i] <= 0x7f');
      if (byteArray[i] === 0x25) {
        str += '%25';
        console.log('byteArray[i] === 0x25');
      } else {
        console.log('byteArray[i] !== 0x25');
        str += String.fromCharCode(byteArray[i]);
      }
    } else if (byteArray[i] === 0xFF) {
      console.log('byteArray[i] === 0xFF');
      // do nothing
    } else if (byteArray[i] === 0x01) {
      console.log('byteArray[i] === 0x01');
      console.log('this node marks a word');
    } else {
      console.log('byteArray[i] > 0x7f');
      str += '%' + byteArray[i].toString(16).toUpperCase();
    }
  }
  console.log('str.length: ', str.length);
  return decodeURIComponent(str);
};