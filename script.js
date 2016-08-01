const g =
{
	_:
	{
		a: function (_)
		{
			let a = g._.i (_);
				a.i = _.i || g.i[_.a.i[0]];
				a.period = _.period || _.a.period;
				a.s = _.s || 0;
				a.time = _.time || 0;

				a.animate = function ()
				{
					a.time += g.tick;
					if (a.time > a.period)
					{
						a.time = 0;
						a.i = g.i[a.a.i[a.s]];
						a.s = (a.s + 2 > a.a.i.length) ? 0 : a.s + 1;
						a.d ();
					}
				}

				a.tick = function ()
				{
					a.animate ();
				}

			a.d ();
			return a;
		},

		b: function (_)
		{
			let b = g._.i (_);
				b.act = _.act || function () {};
				b.i0 = b.i;
				b.i1 = _.i1;
				b.i2 = _.i2;
				b.in = _.in || function () {};
				b.out = _.out || function () {};
				b.over = false;

			b.action = function (e)
			{
				if (g.get.pin (b, e))
				{
					if (b.i2) { b.i = b.i2; b.d (); }
					b.act ();
				}
			}

			b.action_back = function (e)
			{
				if (b.i2) { b.i = b.i0; b.d (); }
			}

			b.mousedown = function (e)
			{
				b.action (e);
			}

			b.mousein = function (e)
			{
				if (g.get.pin (b, e))
				{
					if (!b.over)
					{
						b.over = true;
						if (b.cursor) { window.document.body.style.cursor = 'pointer'; }
						if (b.i1) { b.i = b.i1; b.d (); }
						b.in ();
					}
				} else
				{
					if (b.over)
					{
						b.over = false;
						if (b.cursor) { window.document.body.style.cursor = 'default'; }
						if (b.i1) { b.i = b.i0; b.d (); }
						b.out ();
					}
				}
			}

			b.mouseup = function (e)
			{
				b.action_back ();
			}

			b.mousemove = function (e)
			{
				b.mousein (e);
			}

			b.d ();
			return b;
		},

		block: function (_)
		{
			let block = g._.room (_);
				block.invert = _.invert || true;
				block.type = 'block';
			return block;
		},

		box: function (_)
		{
			let box = g._.i;

			return box;
		},

		i: function (_)
		{
			let i = g._.o (_);
				i.h = g.get.h (_);
				i.i = _.i;
				i.w = g.get.w (_);
				i.x = g.get.x (_);
				i.y = g.get.y (_);
				i.z = g.set.z (_);

				i.c = function ()
				{
					let hwxy = g.get.hwxy (i);
					g.g.c.clearRect (hwxy.x, hwxy.y, hwxy.w, hwxy.h);
				}

				i.d = function ()
				{
					if (i.i)
					{
						let hwxy = g.get.hwxy (i);
						g.g.c.drawImage (i.i, hwxy.x, hwxy.y, hwxy.w, hwxy.h);
						i.zen ();
					}
				}

				i.zen = function ()
				{
					for (let id in g.o)
					{
						let o = g.o[id];
						if (o.z > i.z)
						{
							if (g.get.in (i, o)) { o.d (); }
						} else
						{
							if (g.get.in (i, o))
							{
								let hwxy1 = g.get.hwxy (o);
								let hwxy0 = g.get.hwxy (i);
								g.g.c.drawImage (o.i, hwxy0.x, hwxy0.y, hwxy0.w, hwxy0.h);
								g.g.c.drawImage (i.i, hwxy1.x, hwxy1.y, hwxy1.w, hwxy1.h);
							}
						}
					}
				}

			i.d ();
			return i;
		},

		o: function (_)
		{
			let o = _;
				o.id = g.get.id (_);
			return o;
		},

		room: function (_)
		{
			let room = g._.o (_);
				room.box = _.box || [];
				room.create = false;
				room.debug = _.debug || false;
				room.invert = _.invert || false;
				room.type = 'room';
				room.z = 0;

				room.begin_create = function ()
				{
					if (room.debug)
					{
						room.create = true;
						let x = parseFloat ((room.xnow / g.g.width).toFixed (2));
						let y = parseFloat ((room.ynow / g.g.height).toFixed (2));
						room.box.push ({ h: 0.01, w: 0.01, x: x, y: y });
					}
				}

				room.creating = function (e)
				{
					if (room.create)
					{
						room.box[room.box.length - 1].h = Math.abs (room.box[room.box.length - 1].y - e.y / g.g.height);
						room.box[room.box.length - 1].w = Math.abs (room.box[room.box.length - 1].x - e.x / g.g.width);
						g.g.d ();
					}
				}

				room.d = function ()
				{
					if (room.debug)
					{
						for (let box of room.box)
						{
							let hwxy = g.get.hwxy (box);
							g.g.c.fillStyle = (room.invert) ? '#f00' : '#0f0';
							g.g.c.fillRect (hwxy.x, hwxy.y, hwxy.w, hwxy.h);
						}
					}
				}

				room.end_create = function (e)
				{
					if (room.create)
					{
						room.create = false;
						room.box[room.box.length - 1].h = parseFloat (Math.abs (room.box[room.box.length - 1].y - e.y / g.g.height).toFixed (2));
						room.box[room.box.length - 1].w = parseFloat (Math.abs (room.box[room.box.length - 1].x - e.x / g.g.width).toFixed (2));
						room.d ();
						g.log = room.box[room.box.length - 1];
					}
				}

				room.keydown = function (e)
				{
					g.log = e.keyCode;
					switch (e.keyCode)
					{
						case 66: if (room.invert) room.begin_create (); break;
						case 82: if (!room.invert) room.begin_create (); break;
					}
				}

				room.mousedown = function (e)
				{
					room.end_create (e);
				}

				room.mousemove = function (e)
				{
					room.xnow = e.x;
					room.ynow = e.y;
					room.creating (e);
				}

			room.d ();
			return room;
		},

		u: function (_)
		{
			let u = g._.i (_);
				u.control = _.control || 'auto';
				u.speed = _.speed || 0.01;
				u.vx = _.x || u.x;
				u.vy = _.y || u.y;

				u.goto = function (x, y)
				{
					let v = {};
						v.x = x - u.xk * u.w;
						v.y = y - u.yk * u.h;
					return v;
				}

				u.mouse = function (e)
				{
					if (u.control == 'mouse')
					{
						let v = u.goto (e.x / g.g.width, e.y / g.g.height);
						u.vx = v.x;
						u.vy = v.y;
					}
				}

				u.mousedown = function (e)
				{
					u.mouse (e);
				}

				u.move = function ()
				{
					let s = g.get.s ({ x: u.x, y: u.y }, { x: u.vx, y: u.vy });
					if (s)
					{
						let s0 = u.speed;
						let s1 = s - s0;
						if (s1 > 0)
						{
							s01 = s0 / s1;
							let x = (u.x + s01 * u.vx) / (1 + s01);
							let y = (u.y + s01 * u.vy) / (1 + s01);
							if (!g.get.pinblock (x + u.xk * u.w, y + u.yk * u.h) && g.get.pinroom (x + u.xk * u.w, y + u.yk * u.h))
							{
								u.c ();
								u.x = x;
								u.y = y;
								u.d ();
							}
						}
					}
				}

				u.tick = function ()
				{
					u.move ();
				}

			return u;
		}
	},

	a:
	{
		hero:
		{
			color: {i: ['hero', 'hero_red'], period: 100 }
		}
	},

	set c (_) { g.o[_.id] = _; },

	e:
	{
		l: function ()
		{
			window.onkeydown = g.u;
			window.onkeyup = g.u;
			window.onmousedown = g.u;
			window.onmousemove = g.u;
			window.onmouseup = g.u;
			window.onresize = g.g.resize;
			g.e.tick = g.u;
		},

		set tick (f)
		{
			window.setInterval (function () { f ({ type: 'tick' }); g.time += g.tick; }, g.tick);
		}
	},

	g: function ()
	{
		let c = window.document.createElement ('canvas');
			c.c = c.getContext ('2d');
			c.style.left = 0;
			c.style.position = 'absolute';
			c.style.top = 0;
			c.z = 0;

			c.clear = function ()
			{
				c.c.clearRect (0, 0, c.width, c.height);
			}

			c.d = function ()
			{
				c.clear ();
				for (let z = 0; z <= c.z; z++)
				{
					for (let id in g.o)
					{
						if (g.o[id].z == z)
						{
							g.o[id].d ()
						}
					}
				}
			}

			c.resize = function ()
			{
				c.height = window.innerHeight;
				c.width = window.innerWidth;
				c.d ();
			}

		delete g.g;
		g.g = c;
		g.g.resize ();
		window.document.body.appendChild (c);
	},

	get:
	{
		h: function (o) { return (o.hk) ? o.hk * o.w * g.g.width / g.g.height : o.h },

		hwxy: function (o)
		{
			let hwxy = {};
				hwxy.h = g.get.h (o) * g.g.height;
				hwxy.w = g.get.w (o) * g.g.width;
				hwxy.x = o.x * g.g.width;
				hwxy.y = o.y * g.g.height;
			return hwxy;
		},

		id: function (o) { return (o.id) ? o.id : Object.keys (g.o).length; },

		in: function (A, B)
		{
			let a = g.get.hwxy (A);
			let b = g.get.hwxy (B);
			return ((Math.abs (a.x - b.x + 0.5 * (a.w - b.w)) <= 0.5 * Math.abs (a.w + b.w)) &&
								(Math.abs (a.y - b.y + 0.5 * (a.h - b.h)) <= 0.5 * Math.abs (a.h + b.h)));
		},

		inblock: function (u)
		{
			for (let id in g.o)
			{
				let o = g.o[id];
				if (o.type == 'block')
				{
					for (let box of o.box)
					{
						if (g.get.in (u, box)) return true;
					}
				}
			}
			return false;
		},

		inroom: function (u)
		{
			for (let id in g.o)
			{
				let o = g.o[id];
				if (o.type == 'room')
				{
					for (let box of o.box)
					{
						if (g.get.in (u, box)) return true;
					}
				}
			}
			return false;
		},

		pin: function (o, p)
		{
			let hwxy = g.get.hwxy (o);
			return ((p.x >= hwxy.x) && (p.x <= hwxy.x + hwxy.w) && (p.y >= hwxy.y) && (p.y <= hwxy.y + hwxy.h));
		},

		pinblock: function (x, y)
		{
			for (let id in g.o)
			{
				let o = g.o[id];
				if (o.type == 'block')
				{
					for (let box of o.box)
					{
						if (g.get.pin (box, { x: x * g.g.width, y: y * g.g.height })) return true;
					}
				}
			}
			return false;
		},

		pinroom: function (x, y)
		{
			for (let id in g.o)
			{
				let o = g.o[id];
				if (o.type == 'room')
				{
					for (let box of o.box)
					{
						if (g.get.pin (box, { x: x * g.g.width, y: y * g.g.height })) return true;
					}
				}
			}
			return false;
		},

		r: function (a, b, c)
		{
			let r = Math.random ();

			if (a == 'color')
			{
				r = '#' + Math.floor (Math.random () * 16777215).toString (16);
			}

			if (a && b && !c)
			{
				r = Math.random () * (b - a) + a;
			}

			if (a && b && c)
			{
				r = Math.floor (Math.random () * (b - a + 1)) + a;
			}

			return r;
		},

		s: function (a, b) { return Math.sqrt (Math.pow (a.x - b.x, 2) + Math.pow (a.y - b.y, 2)); },

		set i (o)
		{
			let i = {};
			for (let id of o)
			{
				let image = new Image ();
					image.src = 'data/' + id + '.png';
				i[id] = image;
			}
			delete g.i;
			g.i = i;
		},

		w: function (o) { return (o.wk) ? o.wk * o.h * g.g.height / g.g.width : o.w },

		x: function (o) { return (o.xk) ? o.x - o.xk * o.w : o.x },

		y: function (o) { return (o.yk) ? o.y - o.yk * o.h : o.y },
	},

	l: function ()
	{
		g.g ();
		g.e.l ();
		g.s.l ();
	},

	set log (t) { window.console.log (t); },

	o: {},

	s: {},

	set:
	{
		z: function (o)
		{
			let z = (o.z) ? o.z : 0;
			g.g.z = (z > g.g.z) ? z : g.g.z;
			return z;
		}
	},

	tick: 35,

	time: 0,

	u: function (e)
	{
		for (let id in g.o)
		{
			for (let f in g.o[id])
			{
				if (f == e.type) { g.o[id][f] (e); }
			}
		}
	},

	wipe: function ()
	{
		g.o = {};
		g.g.clear ();
	}
}

g.get.i = [ 'hero', 'hero_red', 'hero_green' ];

window.onload = g.l;

g.s.l = function ()
{
	for (let i = 0; i <= 5; i++)
	{
		//g.c = g._.a ({ a: g.a.hero.color, h: 0.1, wk: 0.42, x: g.get.r (), y: g.get.r () });
	}

	//g.c = g._.b ({ act: function () { g.log = 'act'; }, cursor: true, h: 0.5, i: g.i.hero, i1: g.i.hero_red, i2: g.i.hero_green, wk: 0.42, x: 0.5, xk: 0.5, y: 0.5, yk: 0.5, z: 1 });

	g.c = g._.room ({ box: [{h: 0.28, w: 0.33, x: 0.33, y: 0.28}, {h: 0.2, w: 0.22, x: 0.38, y: 0.53}], debug: true });

	g.c = g._.block ({ box: [], debug: true });

	g.c = g._.u ({ control: 'mouse', h: 0.1, i: g.i.hero, wk: 0.42, x: 0.5, xk: 0.5, y: 0.5, yk: 1, z: 1});
}