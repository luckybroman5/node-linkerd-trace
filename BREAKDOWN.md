### Breakdown

This document will attempt to describe and explain the algorithm that is happening here:


```
const ByteBuffer = require('bytebuffer');

// Either compresses, or checksums 3 strings using bitwise operators
public traceToLinkerdPackedHeader():string{
  let flagBytes = [0, 0, 0, 0, 0, 0, 0, 6]; // Some form of hardcoded signature that gets placed at the end of the string every time

  // All that ByteBuffer is doing here, is basically concat'ing 4 arrays together.
  // Assuming thtat the valuse of spanId, parentId, and traceId are utf8 encoded at runitme, not much magic, yet...
  let serialized = ByteBuffer.concat([this.getByteArray(this.traceId.spanId),this.getByteArray(this.traceId.parentId), this.getByteArray(this.traceId.traceId), flagBytes]);

  // Just returns the concatenated bits into base64..
  return serialized.toBase64();
}

// Takes a presumably utf8 string, and returns an array of integers.
private getByteArray(id: string ){
  let array = Buffer.from(id, 'utf8'); // Does nothing.. Maybe for debugging??
  let byteArray  = [];
  for (let i = 0; i < 16; i = i + 2) { // Assumes that the id is no longer than 32 chars. `Buffer.from()` basically returns HEX values in an array, and each index is 1 char from the string.. The odd thing here, is that it's skipping all odd i's
    let parsed = parseInt(id.slice(i, i + 2), 16); // takes all odd indexes of the hex version of the id string
    parsed = parsed & 255; // Does an anding opperation here. Effectively saying that the character in the id string can't be greater than 255.. it is 256 for example, it will get turned to a 1.. or more accurately a binary 1: 00000001 (assuming the right endian-ness)
            
    if (parsed > 127) { // Checks to see if after the anding above, the value is greater than 127, or greater than binary 00001111
      // This next bit first AND's the parsed output, doing something similar in the first and where it basically subtracts 127 from the number if it's over 127
      // then the next bit (^) is doing an XOR operation. So if parsed was 00001111 then XOR'ed with 127 (01111111), the resulting binary number would be: 01110000 (112 decimal)
      // After that, it will times 112 by negaive 1
      // Then it will sub -1 from -112 resulting in -113
      parsed = -((parsed & 127) ^ 127) - 1;
    }
            
    byteArray.push(parsed); // This just adds the parsed output to the results
  }

  return byteArray;
}
```

#### Conclusion

If I had to take a guess if this were a checksum or compression, I'd have to say checksum. My reasoning is that becuase the loop is discarding every othr character of the id's, information is lost there. However it wouldn't be the first time I didn't understand a compression algo, and bitwise operators are used heavily for them...