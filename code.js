var timeDomainCanvas;	
var frequencyCanvas;	
var visualizationCanvas;	
var audioContext;
var audioSource;
var analyser;
var frequencyData; 						
var timeDomainData;

$(document).ready(function() {
	timeDomainCanvas = document.getElementById("timeDomain");
	frequencyCanvas = document.getElementById("frequency");
	visualizationCanvas = document.getElementById("visualization");
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
		audioSource.loop = true;
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
	drawVisualization(time, visualizationCanvas);
}

function drawVisualization(time, canvas) {
	var canvasContext = canvas.getContext("2d");
	canvasContext.clearRect(0, 0, canvas.width, canvas.height);  
	var noiseFrequency = 2;

	var iters = 5+ myNoise3dx(0.0,0.0,time*0.01, noiseFrequency,6)*5;


	for(var past = 0; past <= 1; past+= 0.01) {
		for(var i=0 ; i < iters ; ++i) {
			var perc = i/iters;
			drawLine(time-past, visualizationCanvas, canvasContext, perc*Math.PI*2);

		}
	}
}

function getIndex(length, percentage) {
	return Math.round(percentage*(length-1));
}

function drawLine(time, canvas, canvasContext, angle) {
	var noiseFrequency = 20;

    var colorR = parseInt((myNoise3dx(time*0.1,0,0,1.0,1.0)*255)+'');
    var colorG = parseInt((myNoise3dx(0,time*0.1,0,1.0,1.0)*255)+'');
    var colorB = parseInt((myNoise3dx(0,0,time*0.1,1.0,1.0)*255)+'');
colorR = colorG = colorB = 255;
	canvasContext.lineWidth = 1;
	canvasContext.strokeStyle = 'rgba('+colorR+','+ colorG +','+colorB+',0.2)';
	canvasContext.beginPath();


	var first = true;
	var bump = canvas.height*0.4;
	var centerX = canvas.width/2;
	var centerY = canvas.height/2;
	var maxR = Math.max(canvas.width, canvas.height)/2.0;
	var timeMult = 10;
	var noiseAmp = 500;

	for (var t=0; t <= 1.00001; t+=0.008) {
		var v = timeDomainData ? timeDomainData[getIndex(timeDomainData.length, t)]/255 : 0;
		var n = myNoise3dx( time*0.01,t,v*0.01,noiseFrequency,6);
		var d = t * (maxR + noiseAmp*n);
		var x = centerX + d*Math.sin(t*timeMult+angle);
		var y = centerY + d*Math.cos(t*timeMult+angle);

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