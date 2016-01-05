//Fix Transparency

function Fixer() {
	var fixer = {};
	fixer.canvas = document.createElement("canvas");
	document.body.appendChild(fixer.canvas);
	fixer.context = fixer.canvas.getContext("2d");
	fixer.renderImage = function(src) {

		var image = new Image();
		image.onload = function() {

			fixer.context.clearRect(0, 0, fixer.canvas.width, fixer.canvas.height);
			fixer.canvas.width = image.width;
			fixer.canvas.height = image.height;
			fixer.context.drawImage(image, 0, 0, image.width, image.height);
			if(confirm('Wanna fix this?')) {
				fixer.fix();
			}
		};
		image.src = src;
		

	};
	fixer.loadImage = function(src) {
		//	Prevent any non-image file type from being read.
		if(!src.type.match(/image.*/)){
			console.log("The dropped file is not an image: ", src.type);
			return;
		}

		//	Create our FileReader and run the results through the render function.
		var reader = new FileReader();
		reader.onload = function(e){
			fixer.renderImage(e.target.result);
		};
		reader.readAsDataURL(src);
	};

	fixer.getPixel = function(data, x, y) {
		var id = y * fixer.canvas.width + x;
		var idx = id * 4;
		var pixel = {
			r: data[idx],
			g: data[idx+1],
			b: data[idx+2],
			a: data[idx+3]
		};
		return pixel;
	};

	fixer.setPixel = function(pixel, x, y, data) {
		var id = y * fixer.canvas.width + x;
		var idx = id * 4;
		data[idx] = pixel.r;
		data[idx+1] = pixel.g;
		data[idx+2] = pixel.b;
		data[idx+3] = pixel.a;
	}

	fixer.fix = function() {
		var imgData = fixer.context.getImageData( 0, 0, fixer.canvas.width, fixer.canvas.height);
		var data = imgData.data;
		var w = fixer.canvas.width, h = fixer.canvas.height;
		for(var x = 0; x < w; ++x )
			for(var y = 0; y < h; ++y) {

				var pixel = fixer.getPixel(data, x, y);

				tryNeighbour = function(nx, ny) {
					var neighbour = fixer.getPixel(data, nx, ny);
					if(neighbour.a == 0) return false;
					pixel.r = neighbour.r;
					pixel.g = neighbour.g;
					pixel.b = neighbour.b;
					return true;
				}
				if(pixel.a == 0) {
					var done = false;
					if(x > 0) 				done = tryNeighbour(x+1, y);
					if(!done && x < w-1) 	done = tryNeighbour(x-1, y);
					if(!done && y > 0) 		done = tryNeighbour(x, y-1);
					if(!done && y < h-1)	done = tryNeighbour(x, y+1);
					fixer.setPixel(pixel, x, y, data);
				}
			}

		imgData.data = data;
		fixer.context.putImageData(imgData, 0, 0);
	};

	var dropArea = document.createElement("div");
	document.body.appendChild(dropArea);
	dropArea.style.width = 200;
	dropArea.style.height = 200;
	dropArea.style.backgroundColor = "rgba(30, 30, 30, 1)";

	dropArea.addEventListener("dragover", function(e) {
		e.preventDefault();
	}, true);
	dropArea.addEventListener("drop", function(e) {
		e.preventDefault();
		fixer.loadImage(e.dataTransfer.files[0]);
	}, true);

};
window.onload = function() {
	Fixer();
};