var visualizationCanvas;
var timeDomainCanvas;
var frequencyCanvas;
var audioContext;
var audioSource;
var analyser;
var frequencyData;
var timeDomainData;

$(document).ready(function() {
	visualizationCanvas = document.getElementById("visualization");
	timeDomainCanvas = document.getElementById("timeDomain");
	frequencyCanvas = document.getElementById("frequency");
	window.requestAnimationFrame(loop);

	$("#myFile").change(function (event){
		var file = $(this)[0].files[0];
		if (file) {
			var reader = new FileReader();
			reader.readAsArrayBuffer(file);
			reader.onload = function(e) {
				playSound(e.target.result);
			};
		}
	});
});

function playSound(data) {
	audioContext = new AudioContext();
	audioSource = audioContext.createBufferSource();
	analyser = audioContext.createAnalyser();
	audioSource.connect(analyser).connect(audioContext.destination);

	audioContext.decodeAudioData(data, function(buffer) {
		audioSource.buffer = buffer;
		audioSource.start(0);
	});

	frequencyData = new Uint8Array(analyser.frequencyBinCount);
	timeDomainData = new Uint8Array(analyser.frequencyBinCount);

	$("#myFile").remove();
}

function draw(time) {
    if(frequencyData) {
        analyser.getByteFrequencyData(frequencyData);
        drawArray(time, frequencyCanvas, frequencyData);
    }
    if(timeDomainData){
        analyser.getByteTimeDomainData(timeDomainData);
        drawArray(time, timeDomainCanvas, timeDomainData);
    }
    drawVisualization(time);
}

function drawVisualization(time) {
    var canvasContext = visualizationCanvas.getContext("2d");
    canvasContext.clearRect(0, 0, visualizationCanvas.width, visualizationCanvas.height);
    for(var past = 0; past <= 1; past+= 0.01) {
        drawLine(time-past, visualizationCanvas, canvasContext);
    }
}

function getIndex(length, percentage) {
    return Math.round(percentage*(length-1));
}

function drawLine(time, canvas, canvasContext) {
    canvasContext.beginPath();
    canvasContext.lineWidth = 1;
    canvasContext.strokeStyle = 'rgba(255,255,255,0.1)';

    var first = true;
    var bump = canvas.height*0.4;
    var noiseFrequency = 2;

    for (var t=0; t <= 1.00001; t+=0.001) {
        var d = timeDomainData ? timeDomainData[getIndex(timeDomainData.length, t)]/255 : 0;
        var x = t*canvas.width;
        var y = canvas.height/2 + bump* (myNoise3dx(t,d*0.1,time*0.2, noiseFrequency,6));

        if (first) {
            first = false;
            canvasContext.moveTo(x, canvas.height-y);
        } else {
            canvasContext.lineTo(x, canvas.height-y);
        }
    }
    canvasContext.stroke();
}

function drawArray(time, canvas, array) {
    var canvasContext = canvas.getContext("2d");
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvasContext.beginPath();
    canvasContext.lineWidth = 2;
    canvasContext.strokeStyle = '#fff';

    var first = true;
    for (var i=0; i < array.length; ++i) {
        var x = (i/array.length)*canvas.width;
        var y = (array[i]/255)*canvas.height;
        if (first) {
            first = false;
            canvasContext.moveTo(x, canvas.height-y);
        } else {
            canvasContext.lineTo(x, canvas.height-y);
        }
    }
    canvasContext.stroke();
}
