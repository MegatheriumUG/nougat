ng.module('nougat.systems.collision')
.requires('ash')
.defines(function(){

ng.Systems.Collision = ng.Ash.System.extend({
	nodeList: null,
	collision: null,
	temp: null,
	init: function() {},
	addToEngine: function(engine) {
		this.nodeList = engine.getNodeList(ng.Nodes.Collision);
	},
	removeFromEngine: function(engine) {
		this.nodeList = null;
	},
	update: function() {
		for(var nodeA = this.nodeList.head; nodeA; nodeA = nodeA.next) {
			for(var nodeB = nodeA.next; nodeB; nodeB = nodeB.next) {
				this.checkCollision(nodeA, nodeB);
			}
		}
	},

	checkCollision(a, b) {
		this.getCollision(a, b);
		this.collisionResponses.slide();
	},

	checkAxis: function(axis, a, b) {

		var valA = b.position.position.getComponent(axis) - (a.position.position.getComponent(axis) + a.size.size.getComponent(axis));
		var valB = b.position.position.getComponent(axis) + b.size.size.getComponent(axis) - a.position.position.getComponent(axis);
		if(this.temp.vel.getComponent(axis) > 0) {
			this.temp.entry.setComponent(axis, valA);
			this.temp.exit.setComponent(axis, valB);
		}else{
			this.temp.entry.setComponent(axis, valB)
			this.temp.exit.setComponent(axis, valA);
		}

		if(this.temp.vel.getComponent(axis) == 0) {
			this.temp.entryAxis.setComponent(axis, -Infinity);
			this.temp.exitAxis.setComponent(axis, Infinity);
		}else{
			this.temp.entryAxis.setComponent(axis, this.temp.entry.getComponent(axis) / this.temp.vel.getComponent(axis));
			this.temp.exitAxis.setComponent(axis, this.temp.exit.getComponent(axis) / this.temp.vel.getComponent(axis));
		}
	}

	getCollision: function(a, b) {

		this.temp = {
			entry: new ng.Vector3(0, 0, 0),
			exit: new ng.Vector3(0, 0, 0),
			entryAxis: new ng.Vector3(0, 0, 0),
			exitAxis: new ng.Vector3(0, 0, 0),
			vel: b.velocity.velocity.sub(a.velocity.velocity);
		};

		//find entry and exit points
		for(var i = 0; i < 3; ++i)
			this.checkAxis(i, a, b);

		var entryTime = Math.max(this.temp.entryAxis.x, this.temp.entryAxis.y, this.temp.entryAxis.z);
		var exitTime = Math.min(this.temp.exitAxis.x, this.temp.exitAxis.y, this.temp.exitAxis.z);

		this.collision = {
			normal: new ng.Vector3(0, 0, 0),
			time: 1,
			a: a,
			b: b
		};

		if(entryTime > exitTime ||
			this.temp.entryAxis.x < 0 || this.temp.entryAxis.y < 0 || this.temp.entryAxis.z < 0 ||
			entryTime > 1) {
			//NO COLLISION
		}else{
			//COLLISION
			//calculate normal

			this.collision.time = entryTime;
			this.collision.remaining = 1 - entryTime;

			if(this.temp.entryAxis.x > this.temp.entryAxis.y ) {

				if(this.temp.entryAxis.x > this.temp.entryAxis.z) {
					if(this.temp.entry.x < 0)
						this.collision.normal.x = 1;
					else
						this.collision.normal.x = -1;
				}else{
					if(this.temp.entry.z < 0)
						this.collision.normal.z = 1;
					else
						this.collision.normal.z = -1;
				}
				
			}else{

				if(this.temp.entryAxis.y > this.temp.entryAxis.z) {
					if(this.temp.entry.y < 0 )
						this.collision.normal.y = 1;
					else
						this.collision.normal.y = -1;
				}else{
					if(this.temp.entry.z < 0)
						this.collision.normal.z = 1;
					else
						this.collision.normal.z = -1;
				}
			}
		}
	},
	collisionResponses: {
		normal: function(collision) {
			var collision = collision | this.collision;
			var a = collision.a;
			var b = collision.b;
			var time = collision.time;
			a.position.position.add(a.velocity.velocity.multiplyScalar(time));
			b.position.position.add(b.velocity.velocity.multiplyScalar(time));
			return collision;

		},
		deflect: function(collision) {

			collision = this.collisionResponses.normal(collision);
			if(collision.time == 1) return;

			var a = collision.a;
			var b = collision.b;
			var remaining = collision.remaining;
			var normal = collision.normal;
			a.velocity.velocity.multiplyScalar(remaining);
			b.velocity.velocity.multiplyScalar(remaining);
			if(Math.abs(normal.x) > 0.0001) {
				a.velocity.x *= -1;
				b.velocity.x *= -1;
			}
			if(Math.abs(normal.y) > 0.0001) {
				a.velocity.y *= -1;
				b.velocity.y *= -1;
			}
			if(Math.abs(normal.z) > 0.0001) {
				a.velocity.z *= -1;
				b.velocity.z *= -1;
			}
		},
		slide: function(collision) {
			collision = this.collisionResponses.normal(collision);
			if(collision.time == 1) return;
			
			var a = collision.a;
			var b = collision.b;
			var remaining = collision.remaining;
			var normal = collision.normal;
			var dotA = a.velocity.velocity.dot(normal) * remaining;
			var dotB = b.velocity.velocity.dot(normal) * remaining;
			a.velocity.velocity = normal.multiplyScalar(dotA);
			b.velocity.velocity = normal.multiplyScalar(dotB);

		}
	}
});

});