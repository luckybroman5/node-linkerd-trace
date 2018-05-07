const ByteBuffer = require('bytebuffer');

const traceToLinkerdPackedHeader = (traceId) => {
  let flagBytes = [0, 0, 0, 0, 0, 0, 0, 6]; // The hardcoded end of the "serialized" array

  // Without seeing the input, my guess is this is something linkerd is using to keep track of where a request came from..
  // I am going to assume based off the TS typing that traceId contains two strings. the significance of "parentId" I'll take a wild guess and say that's where the request is coming from,
  // However that probably isn't a needed bit of information, as we can really just think of it as a string and nothing else.
  let serialized = ByteBuffer.concat([getByteArray(traceId.spanId), getByteArray(traceId.parentId), getByteArray(traceId.traceId), flagBytes]); // A long byte array with utf8 encoding

  return serialized.toBase64(); // A base64 encoded version of "serialized"
}

// It looks like this function is manually representing a string as an Array<string> of bytes, in an ascii encoding..
const getByteArray = (id) => {
  let array = Buffer.from(id, 'utf8'); // Does nothing... For debugging perhaps?
  let byteArray  = []; // results of function
  for (let i = 0; i < 16; i = i + 2) { // This is skipping every odd numbers, and the hardcoding of 16 must have some significance, and assumes some length
    let parsed = parseInt(id.slice(i, i + 2), 16); // taking every odd index of the string. the 16 radix gives away Hex
    parsed = parsed & 255; // AND bitwise operator.. every 1 in the binary representation of the integer remains a 1, where everything else turns to a 0, also would turn a number larger than 255 into 255
            
    if (parsed > 127) {
      parsed = -((parsed & 127) ^ 127) - 1; // trims the number to 
    }
            
    byteArray.push(parsed);
  }

  return byteArray;
}

const result = traceToLinkerdPackedHeader({
  traceId: 'hello',
  spanId: 'world',
  parentId: 'screens',
});

console.log(result);
