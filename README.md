```
                  .___               .__  .__        __                    .___          __                              
  ____   ____   __| _/____           |  | |__| ____ |  | __ ___________  __| _/        _/  |_____________    ____  ____  
 /    \ /  _ \ / __ |/ __ \   ______ |  | |  |/    \|  |/ // __ \_  __ \/ __ |  ______ \   __\_  __ \__  \ _/ ___\/ __ \ 
|   |  (  <_> ) /_/ \  ___/  /_____/ |  |_|  |   |  \    <\  ___/|  | \/ /_/ | /_____/  |  |  |  | \// __ \\  \__\  ___/ 
|___|  /\____/\____ |\___  >         |____/__|___|  /__|_ \\___  >__|  \____ |          |__|  |__|  (____  /\___  >___  >
     \/            \/    \/                       \/     \/    \/           \/                           \/     \/    \/ 
```

### What is this?

This is a non-type script version + cli verification tool of the following code:
```
const ByteBuffer = require('bytebuffer');

public traceToLinkerdPackedHeader():string{
  let flagBytes = [0, 0, 0, 0, 0, 0, 0, 6];
  let serialized = ByteBuffer.concat([this.getByteArray(this.traceId.spanId),this.getByteArray(this.traceId.parentId), this.getByteArray(this.traceId.traceId), flagBytes]);

  return serialized.toBase64();
}
private getByteArray(id: string ){
  let array = Buffer.from(id, 'utf8');
  let byteArray  = [];
  for (let i = 0; i < 16; i = i + 2) {
    let parsed = parseInt(id.slice(i, i + 2), 16);
    parsed = parsed & 255;
            
    if (parsed > 127) {
      parsed = -((parsed & 127) ^ 127) - 1;
    }
            
    byteArray.push(parsed);
  }

  return byteArray;
}

```

### What is the above code doing?

Well, that is somewhat of a complicated, but at a high level, it is taking 3 input strings (presumably in utf8 encoding, or a string verson of a bytestring), and performing either a checksum, or compression algorithm using [Bitwise Opperation](https://en.wikipedia.org/wiki/Bitwise_operation) to produce uniform base64 encoded string, spcific to linkerd.

For a raw breakdown of what the code is doing, see the `BREAKDOWN.md` doc.

### Usage

##### [Install NVM, NPM, Nodejs](https://github.com/creationix/nvm#install-script)

##### Install Node 8.X

```
nvm install 8
nvm alias default 8 # optional
```

##### Install This package (Start Here if you have npm and node installed)

```
npm install -g linkerd-trace

linkerd-trace
```

###### Above should run with default values and print more usage