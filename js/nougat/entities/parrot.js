ng.module('nougat.entities.parrot')
.requires(
	'nougat.entities.sprite',
	'nougat.statemachine.state',
	'nougat.statemachine.statemachine')
.defines(function(){

ng.Entities.Bar = ng.Entity.extend({
	init: function(pos, size) {
		this.parent();
		this.add('pos', new ng.Components.Position(pos))
			.add('size', new ng.Components.Size2(size));
	}
})

ng.Entities.Parrot = ng.Entities.AnimatedSprite.extend({
	bar: null,
	init: function() {
		this.parent('img/parrot-spritesheet-2.png', 8, 5, 36);
		this.fsm = new ng.StateMachine();
		this.update.add(function() { this.fsm.update(); }, this);

		var idle = this.fsm.add('idle');
		idle.anim = this.animator.animator.add('idle', [0], 0.1, true);
		idle.toLeft = this.animator.animator.add('toLeft', [32, 33, 34], 0.1);
		idle.left = this.animator.animator.add('left', [35], 0.1, true);
		idle.toDefault = this.animator.animator.add('toDefault', [34, 33, 32], 0.1);
		idle.toLeft.finish.add(function(){
			this.animator.animator.play('left');
			idle.count = 0;
		}, this);
		idle.left.finish.add(function(){
			idle.count++;
			if(idle.count > 10 + Math.random() * 50)
				this.animator.animator.play('toDefault');
		}, this);
		idle.toDefault.finish.add(function(){
			idle.count = 0;
			this.animator.animator.play('idle');
		}, this);
		idle.anim.finish.add(function() {
			idle.count++;
			if(idle.count >= 10 + Math.random() * 10) {
				var rand = Math.random();
				if(rand < 0.1)
					this.fsm.change('crow');
				else if(rand < 0.2) {
					if(Math.random() < 0.5)
						this.fsm.change('stepRight');
					else
						this.fsm.change('stepLeft');
				}
				else if(rand < 0.3)
					this.fsm.change('blink');
				else if(rand < 0.4)
					this.fsm.change('scratch');
				else if(rand < 0.5)
					this.animator.animator.play('toLeft');
				else
					idle.count = 0;
			}
			
		}.bind(this));
		idle.enter = function() {
			idle.count = 0;
			this.animator.animator.play('idle');	
		}.bind(this);

		var blink = this.fsm.add('blink');
		blink.anim = this.animator.animator.add('blink', [1], 0.1);
		blink.anim.finish.add(function() {
			this.fsm.change('idle');
		}.bind(this));
		blink.enter = function() {
			this.animator.animator.play('blink');
		}.bind(this);


		var crow = this.fsm.add('crow');
		crow.start = this.animator.animator.add('crowStart', [2, 3], 1 / 8);
		crow.anim = this.animator.animator.add('crow', [4, 5], 1/8, true);
		crow.end = this.animator.animator.add('crowEnd', [4, 3, 2], 1/8);
		
		crow.start.finish.add(function() {
			this.animator.animator.play('crow');
		}.bind(this));
		crow.end.finish.add(function() {
			this.fsm.change('idle');
		}.bind(this));
		crow.anim.finish.add(function() {
			crow.count++;
			if(crow.count >= Math.floor(Math.random() * 10))
				this.animator.animator.play('crowEnd');
		}.bind(this));
		crow.enter = function() {
			crow.count = 0;
			this.animator.animator.play('crowStart');
			
		}.bind(this);

		var stepRight = this.fsm.add('stepRight');
		stepRight.anim = this.animator.animator.add('stepRight', [6, 7, 8, 9, 10, 11, 12, 13], 0.1);
		stepRight.anim.finish.add(function(){
			this.pos.x += 1;
			if(Math.random() < 0.3)
				this.fsm.change('idle');
			else
				this.fsm.change('stepRight');
		}.bind(this));
		stepRight.enter = function() {
			if(this.bar) {
				if(this.pos.x < (this.bar.pos.x + this.bar.size.x)){
					
					this.animator.animator.play('stepRight', true);
				}else
					this.fsm.change('idle');
			}else
				this.animator.animator.play('stepRight', true);
			
		}.bind(this);

		var stepLeft = this.fsm.add('stepLeft');
		stepLeft.anim = this.animator.animator.add('stepLeft', [13, 12, 11, 10, 9, 8, 7, 6], 0.1);
		stepLeft.anim.finish.add(function() {
			if(Math.random() < 0.3)
				this.fsm.change('idle');
			else
				this.fsm.change('stepLeft');
		}.bind(this));
		stepLeft.enter = function() {
			if(this.bar) {
				if(this.pos.x > this.bar.pos.x) {
					this.animator.animator.play('stepLeft', true);
					this.pos.x -= 1;
				}else
					this.fsm.change('idle');
			}else{
				this.animator.animator.play('stepLeft', true);
				this.pos.x -= 1;
			}
			
		}.bind(this);

		var scratch = this.fsm.add('scratch');
		scratch.start = this.animator.animator.add('scratchStart', [14, 15, 16, 17, 18], 0.1);
		scratch.anim1 = this.animator.animator.add('scratch1', [19, 20], 0.1, true);
		scratch.anim2 = this.animator.animator.add('scratch2', [21, 22], 0.1, true);
		scratch.end = this.animator.animator.add('scratchEnd', [23, 24, 25, 26, 27], 0.1);

		scratch.start.finish.add(function(){
			this.animator.animator.play('scratch1');
		}, this);
		scratch.anim1.finish.add(function(){
			scratch.count1++;
			if(scratch.count1 > 3 + Math.random() * 5) {
				if(Math.random() < 0.3)
					this.animator.animator.play('scratchEnd');
				else{
					scratch.count2 = 0;
					this.animator.animator.play('scratch2');
				}
			}
		}, this);
		scratch.anim2.finish.add(function(){
			scratch.count2++;
			if(scratch.count2 > 3 + Math.random() * 6) {
				if(Math.random() < 0.5)
					this.animator.animator.play('scratchEnd');
				else{
					scratch.count1 = 2;
					this.animator.animator.play('scratch1');
				}
			}
		}, this);
		scratch.end.finish.add(function() {
			this.fsm.change('idle');
		}, this);
		scratch.enter = function() {
			scratch.count1 = scratch.count2 = 0;
			this.animator.animator.play('scratchStart');
		}.bind(this);


		this.fsm.change('idle');

	}
})

});