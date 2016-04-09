var c = 0;
var entropyBuffer=new Uint32Array(4096);
var newEntropyRequested = false;

onmessage = function (ev) {
    switch (ev.data.cmd) {
        case 'start-work':
            //here we do our crypto
            var res = sodium.to_hex(sodium.randombytes_buf(2063));
            self.postMessage({
                message: 'worker-completed',
                result: res
            });
            break;
        case 'init-worker':
            console.log("init")
            entropyBuffer = ev.data.value;
            self.postMessage({
                message: 'worker-initialized'
            });
            break;
        case 'response-more-entropy':
            entropyBuffer = ev.data.value;
            c = 0;
            newEntropyRequested = false;
            console.log("new entropy received");
            break;
    }
};

function getWorkerEntropy() {
    c++; //miss the first one
    if (c > 2048) {
        if (!newEntropyRequested) {
            console.log('request-more-entropy')
            self.postMessage({
                message: 'request-more-entropy'
            });
            newEntropyRequested = true;
        }
    }
    return entropyBuffer[c] >>> 0;
}
self.importScripts('sodium.js');
