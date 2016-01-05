ng.module('nougat.time')
.defines(function(){
	var time = ng.Class.extend({
		init: function() {
			this.last = this.now = this.timestamp();
			this.delta = 0;
		},
		timestamp: function() {
			var time = window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
			return time / 1000;
		},
		last: 0,
		now: 0,
		delta: 0,
		total: 0,
		step: 1 / 60,
		elapsed: 0,
		update: function() {
			this.last = this.now;
			this.now = this.timestamp();
			this.delta = this.now - this.last;
			this.elapsed += this.delta;
		}
	});

	ng.Time = new time();
});