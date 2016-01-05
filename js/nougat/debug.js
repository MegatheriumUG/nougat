ng.module('nougat.debug')
.defines(function(){
	var debug = ng.Class.extend({
		text: '',
		init: function() {
			this.dom = ng.$('#debug');
			if(!this.dom) console.warn('No html element with id="debug" found!');
			if(this.dom) {
				this.output = ng.$new('div');
				this.pause = ng.$new('button');
				this.pause.innerHTML = 'Play';
				this.pause.addEventListener('click', function() {
					if(ng.game.playing)
					{
						ng.game.pause();
						this.pause.innerHTML = 'Play';
					}else{
						ng.game.play();
						this.pause.innerHTML = 'Pause';
					}
				}.bind(this));

				ng.$append(this.pause, this.dom);
				ng.$append(this.output, this.dom);
				
			}
		},
		addText: function(text) {
			if(this.text == '')
				this.setText(text);
			else
				this.setText(this.text + '<br>' + text);

		},
		setText: function(text) {
			this.text = text;
			text = text.replaceAll('\\[\\/\\]', '</span>');
			text = text.replaceAll('\\[', '<span class="');
			text = text.replaceAll('\\]', '">');
			this.output.innerHTML = text;
		}
	});

	ng.Debug = new debug();
});