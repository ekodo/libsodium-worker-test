function getEntropy() {
    var entropy = new Uint32Array(4096);
    window.crypto.getRandomValues(entropy);
    return entropy;
}

if (window.Worker) {
	var sodiumWorker = new Worker("worker.js");

    sodiumWorker.postMessage({
	    cmd: 'init-worker',
	    value: getEntropy()
    });

    sodiumWorker.onmessage = function (ev) {
        switch (ev.data.message) {
            case 'request-more-entropy':
                sodiumWorker.postMessage({
                    cmd: 'response-more-entropy',
                    value: getEntropy()
                });
                break;
            case 'worker-initialized':
                console.log("worker initialized");
                sodiumWorker.postMessage({
                    cmd: 'start-work'
                });
                break;
            case 'worker-completed':
                document.getElementById("result").innerHTML = ev.data.result;
                sodiumWorker.terminate();
                break;
        }
    };
}