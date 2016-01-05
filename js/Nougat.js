//Nougat Engine

//Determine Browser Engine
window.Browser = {};
window.Browser.isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
// Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
window.Browser.isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
window.Browser.isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
    // At least Safari 3+: "[object HTMLElementConstructor]"
window.Browser.isChrome = !!window.chrome && !Browser.isOpera;              // Chrome 1+
window.Browser.isIE = /*@cc_on!@*/false || !!document.documentMode; // At least IE6

(function() {

window.ng = {
	version: '1',
	global: window,
	modules: {},
	agent: {},
	ready: false,
	loading: false,
	_current: null,
	_loadQueue: [],
	_waitForOnload: 0,
	lib: (window['NG_ROOT'] || 'js/'),
	nocache: '',


	$: function( selector ) {
		return selector.charAt(0) == '#'
		? document.getElementById(selector.substr(1))
		: document.getElementsByTagName( selector );
	},

	$new: function( name ) {
		return document.createElement(name);
	},

	$append: function(element, appendTo) {
		if(appendTo) {
			if(typeof appendTo == 'string')
				ng.$(appendTo).appendChild(element);
			else
				appendTo.appendChild(element);
		}
		else
			document.body.appendChild(element);
	},

	copy: function(object) {
		if(
           !object || typeof(object) != 'object' ||
           object instanceof HTMLElement ||
           object instanceof ng.Class
        ) {
            return object;
        }
        else if( object instanceof Array ) {
            var c = [];
            for( var i = 0, l = object.length; i < l; i++)
                c[i] = ng.copy(object[i]);
            return c;
        }
        else {
            var c = {};
            for( var i in object )
                c[i] = ng.copy(object[i]);
            return c;
        }
	},
	module: function(name) {
		if(ng._current)
			throw( "Module '" + ng._current.name + "' defines nothing");
		if(ng.modules[name] && ng.modules[name].body)
			throw("Module '" + name + "' is already defined");

		ng._current = {name: name, requires: [], loaded: false, body: null};
		ng.modules[name] = ng._current;
		ng._loadQueue.push(ng._current);
		ng._initDOMReady();
		return ng;
	},

	requires: function() {
		ng._current.requires = Array.prototype.slice.call(arguments);
		return ng;
	},

	defines: function(body) {
		name = ng._current.name;
		ng._current.body = body || function(){};
		ng._current = null;
		ng._execModules();
	},

	_execModules: function() {
		var modulesLoaded = false;
		for(var i = 0; i < ng._loadQueue.length; ++i) {
			var m = ng._loadQueue[i];
			var dependenciesLoaded = true;

			for(var j = 0; j < m.requires.length; ++j) {
				var name = m.requires[j];
				if(!ng.modules[name]) {
					dependenciesLoaded = false;
					ng._loadScript(name, m.name);
				} else if(!ng.modules[name].loaded)
					dependenciesLoaded = false;
			}

			if(dependenciesLoaded && m.body) {
				ng._loadQueue.splice(i, 1);
				m.loaded = true;
				m.body();
				modulesLoaded = true;
				i--;
			}
		}

		if(modulesLoaded)
			ng._execModules();
		else if(ng._waitForOnload == 0 && ng._loadQueue.length != 0) {
			var unresolved = [];
			for(var i = 0; i < ng._loadQueue.length; ++i) {
				var unloaded = [];
				var requires = ng._loadQueue[i].requires;
				for(var j = 0; j < requires.length; ++j) {
					var m = ng.modules[requires[j]];
					if(!m || !m.loaded)
						unloaded.push(requires[j]);
				}
				unresolved.push(ng._loadQueue[i].name + ' (requires: ' + unloaded.join(', ') + ')');
			}
			throw('Unresolved (circular?) dependencies. ' +
				  "Most likely there's a name/path mismatch for one of the listed modules:\n" +
				  unresolved.join('\n'));
		}

	},

	_DOMReady: function() {
		if(!ng.modules['dom.ready'.loaded]) {
			if(!document.body) {
				return setTimeout(ng._DOMReady, 13);
			}
			ng.modules['dom.ready'].loaded = true;
			ng._waitForOnload--;
			ng._execModules();
		}
		return 0;
	},
	_initDOMReady: function() {
		if(ng.modules['dom.ready']) return;

		ng._boot();

		ng.modules['dom.ready'] = {requires: [], loaded: false, body: null};
		ng._waitForOnload++;
		if(document.readyState == 'complete')
			ng._DOMReady();
		else {
			document.addEventListener( 'DOMContentLoaded', ng._DOMReady, false);
			window.addEventListener('load', ng._DOMReady, false);
		}
	},
	_boot: function() {
		ng.agent.pixelRatio = window.devicePixelRatio || 1;
		ng.agent.viewport = {
			width: window.innerWidth,
			height: window.innerHeight
		};
		ng.agent.screen = {
			width: window.screen.availWidth * ng.agent.pixelRatio,
			height: window.screen.availHeight * ng.agent.pixelRatio
		};
	},

	getCacheSuffix: function(){
      return ng.nocache ? ng.nocache : "";
    },

	_loadScript: function(name, requiredFrom) {
		ng.modules[name] = {name: name, requires: [], loaded: false, body: null};
		ng._waitForOnload++;

		var path = ng.lib + name.replace(/\./g, '/') + '.js' + ng.getCacheSuffix();
		var script = ng.$new('script');
		script.type = 'text/javascript';
		script.src = path;
		script.onload = function() {
			ng._waitForOnload--;
			ng._execModules();
		};
		script.onerror = function() {
			throw("Failed to load module '" + name + "' at " + path + ' required from ' + requiredFrom);
		}

		ng.$('head')[0].appendChild(script);
	},
	/**
		Checks if the element is an instance of class and returns it.
		Otherwise it checks if element is a class and creates an instance and returns it.
		Otherwise it checks if it is function returning one of the both and does the same with the returning element.
		
	**/
	getInstance: function(elem, class_) {
		class_ = class_ || ng.Class;
		var params = arguments.length > 2 ? arguments.slice(2) : null;
		if(typeof elem == 'function') {
			if(elem.constructor == class_)
				return new elem(params);
			else {
				var obj = new elem(params);
				if(obj instanceof class_)
					return obj;
				elem = elem(params);
			}

			if(!elem instanceof class_)
				return getInstance(elem, class_);
		}
		if(elem instanceof class_) return elem;
		return null;
	},

	getClass: function(elem) {
		if(typeof elem == 'function') {
			var obj = new elem();
			if(obj instanceof ng.Class) return elem;
		}else {
			if(elem instanceof ng.Class) return elem.constructor;
		}
	}
}

var initializing = false;
var fnTest = /xyz/.test(function(xyz){return xyz;}) ? /\bparent\b/ : /.*/;
var lastClassId = 0;

window.ng.Class = function(){};
var inject = function(prop) {
	var proto = this.prototype;
	var parent = {};
	for(var name in prop) {
		if(typeof(prop[name]) == 'function'
			&& typeof(proto[name]) == 'function'
			&& fnTest.test(prop[name])) {
			parent[name] = proto[name];
			proto[name] = (function(name, fn) {
				return function() {
					var tmp = this.parent;
					this.parent = parent[name];
					var ret = fn.apply(this, arguments);
					this.parent = tmp;
					return ret;
				};
			})(name, prop[name]);
		} else {
			proto[name] = prop[name];
		}
	}
};

window.ng.Class.property = function(prop, descriptor) {
	Object.defineProperty(this, prop, descriptor);
	return this[prop];
};

/**
	Finds out if a class is derived by a certain class

	Example:
	ng.SomeClass.is(ng.Class);
**/

window.ng.Class.is = function(class_) {
	return new this() instanceof class_;
};

/**
	Determines if all parameters share the same class
**/
window.ng.Class.sharedBy = function(){
	for(var i = 0; i < arguments.length; i++) {
		if(typeof arguments[i] == 'function') {
			if(!this.is(arguments[i])) return false;
		}else{
			if(!arguments[i].is(this)) return false;
		}
	}
	return true;
};

window.ng.Class.extend = function(className, prop) {
	if (!prop) {
		prop = className;
		className = null;
	}

	var parent = this.prototype;

	initializing = true;
	var prototype = new this();
	initializing = false;

	for(var name in prop) {
		if( typeof(prop[name]) == 'function' &&
			typeof(parent[name]) == 'function' &&
			fnTest.test(prop[name])) {
			prototype[name] = (function(name, fn) {
				return function() {
					var tmp = this.parent;
					this.parent = parent[name];
					var ret = fn.apply(this, arguments);
					this.parent = tmp;
					return ret;
				};
			})(name, prop[name]);
		} else {
			prototype[name] = prop[name];
		}
	}

	function Class() {
		/**

		**/
		this.is = function(check) {
			if(typeof check == 'function') {
				return this instanceof check;
			}
			if(this.constructor == check.constructor) return true;

			return false;
		};

		this.property = function(prop, descriptor) {
			Object.defineProperty(this, prop, descriptor);
			return this[prop];
		};

		if(!initializing) {
			//static instantiation
			if(this.staticInit) {
				var obj = this.staticInit.apply(this, arguments);
				if(obj) return obj;
			}
			for(p in this) {
				if(typeof(this[p] == 'object'))
					this[p] = ng.copy(this[p]); //deep copy
				else if(typeof(this[p] != 'function'))
					this[p] = this[p];
			}
			if(this.init) this.init.apply(this, arguments);
		}
		return this;
	} 

	Class.prototype = prototype;
	Class.prototype.constructor = Class;
	if (className) {
		Class.prototype.constructor.className = className;
		Class.className = className;
	}
	Class.extend = window.ng.Class.extend;
	Class.inject = inject;
	Class.property = window.ng.Class.property;
	Class.is = window.ng.Class.is;
	Class.sharedBy = window.ng.Class.sharedBy;
	Class.classId = prototype.classId = ++lastClassId;

	return Class;
};

Array.prototype.contains = function(elem) {
	return this.indexOf(elem) > -1;
}

Array.prototype.remove = function(elem) {
	var index = this.indexof(elem);
	if(index > -1) return this.splice(index, 1);
}

Array.prototype.for = function(callback) {
	for(var i = 0; i < this.length; ++i)
		callback(this[i], i);
}

String.prototype.replaceAll = function(find, replace) {
	return this.replace(new RegExp(find, 'g'), replace);
}

ng.Vector2 = THREE.Vector2;
ng.Vector3 = THREE.Vector3;
ng.Vector4 = THREE.Vector4;
ng.Box3 = THREE.Box3;
ng.Color = THREE.Color;
ng.Matrix4 = THREE.Matrix4;

ng.Signal = signals.Signal;

ng.Entities = {};
ng.Components = {};
ng.Nodes = {};
ng.Systems = {};
ng.Input = {};

ng.Loader = new (ng.Class.extend({
	cache: {},
	get: function(url) {
		if(this.cache[url]) return this.cache[url];
		var req = new XMLHttpRequest();
		req.open("GET", url, false);
		req.send(null);
		if(req.status == 200 || req.status == 304) {
			this.cache[url] = req.responseText;
			return req.responseText;
		}
		else
			throw 'File ' + url + ' not found';
	}
}))();

ng.loaded = new ng.Signal();
document.onload = function() {
	ng.loaded.dispatch();
};

Math.fract = function(x) {
	return x % 1;
}

Math.fastSin = function(x) {
	//Source: https://jsperf.com/native-sin-vs-approx-fast-sin
	var B = 1.2732395; // 4/pi
	var C = -0.40528473; // -4 / (pi²)
	                
	if (x > 0) {
	return B*x - C * x*x;
	}
	return B*x + C * x*x;
}

Math.lerp = function( min, max, x) {
	return (1 - x) * min + x * max;
}

ng.Random = {
	seed: 1,
	get: function(x) {
		if(x)
			this.seed = x;
		else
			x = this.seed++;

		var y = Math.fastSin(x) * 10000;
		return y - Math.floor(y);
	},
	noise: function(x) {
		var p = Math.floor(x);
		var f = Math.fract(x);
		var f = f * f *( 3 - 2 * f);
		var res = Math.lerp(this.get(p), this.get(p + 1), f);
		return res;
	},
	perlin: function(x) {
		var f = 1, a = 0.5;
		var r = 0;
		for(var i = 0; i < 8; i++) {
			r += this.noise(x * f) * a;
			a *= 0.5;
			f *= 0.5;
		}
		return r;
	}
};

ng.Input = new THREEx.InputState();

})();