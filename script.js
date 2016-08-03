const g =
{
	_:
	{
		a: function (_)
		{
			let a = g._.i (_);
				a.i = _.i || g.i[_.a.i[0]];
				a.loop = _.loop || false;
				a.period = _.period || _.a.period;
				a.s = _.s || 0;
				a.time = _.time || 0;

				a.animate = function ()
				{
					if (a.onlyone ())
					{
						a.time += g.tick;
						if (a.time > a.period)
						{
							a.time = 0;
							a.i = g.i[a.a.i[a.s]];
							a.s = (a.s + 1 > a.a.i.length) ? 0 : a.s + 1;
							if (!a.loop && a.s == 0) { delete g.o[a.id]; } else
							{
								delete g.o[a.id];
								g.c = g._.a (_);
							}
						}

					}
				}

				a.onlyone = function ()
				{
					let s = 0;
					for (let id in g.o)
					{
						if (id == a.id) { s++ }
						if (s > 1) { return false; }
					}
					return true;
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
			box.d ();
			return box;
		},

		i: function (_)
		{
			let i = g._.o (_);
				i.h = g.get.h (_);
				i.hide = _.hide || false;
				i.i = _.i;
				i.texture = _.texture || false;
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
					if (i.i && !i.hide)
					{
						let hwxy = g.get.hwxy (i);
						if (i.texture)
						{
							let texture = g.g.c.createPattern (i.i, 'repeat');
							g.g.c.fillStyle = texture;
							g.g.c.fillRect (hwxy.x, hwxy.y, hwxy.w, hwxy.h);
						} else
						{
							g.g.c.drawImage (i.i, hwxy.x, hwxy.y, hwxy.w, hwxy.h);
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
				room.texture = 0;
				room.textured = false;
				room.type = 'room';
				room.z = 0;
				room.zen = false;

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

				room.change = function (e)
				{
					if (e.wheelDelta > 0)
					{
						room.texture += (room.texture > 0) ? -1 : 0;
					} else
					{
						room.texture += (room.texture < Object.keys (g.i).length - 1) ? 1 : 0;
					}
				}

				room.creating = function (e)
				{
					if (room.create)
					{
						let box = room.box[room.box.length - 1];
							box.h = Math.abs (box.y - e.y / g.g.height);
							box.w = Math.abs (box.x - e.x / g.g.width);
							box.i = g.get.inum (room.texture);
							box.texture = room.textured;
						room.texturing (true);
						g.g.clear ();
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

						//debug
						let b = room.box[room.box.length - 1];
						let box = {h: b.h, w: b.w, x: b.x, y: b.y };
							box.i = g.get.inumname (room.texture);
							box.texture = room.textured;
							box.zen = room.zen;
						g.log = g.get.json (box);
					}
				}

				room.keydown = function (e)
				{
					switch (e.keyCode)
					{
						case 66: if (room.invert) room.begin_create (); break;
						case 82: if (!room.invert) room.begin_create (); break;
						case 84: room.textured = !room.textured; break;
						case 90: room.zen = !room.zen; break;
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

				room.texturing = function (debug)
				{
					if (debug)
					{
						let box = room.box[room.box.length - 1];
							box.texture = room.textured;
						g.c = g._.i (box);
					} else
					{
						for (let box of room.box)
						{
							if (box.i)
							{
								g.c = g._.i (box);
							}
						}
					}
				}

				room.wheel = function (e)
				{
					room.change (e);
					room.creating (e);
				}

			room.d ();
			room.texturing ();
			return room;
		},

		u: function (_)
		{
			let u = g._.i (_);
				u.control = _.control || 'auto';
				u.key = { d: 0, l: 0, r: 0, u: 0 }
				u.moved = false;
				u.get = {move: function () {return u.move;}}
				u.speed = _.speed || 0.005;
				u.tsearch0 = g.time;
				u.tsearch = _.tsearch || 1000 * g.get.r ();
				u.vx = _.x || u.x;
				u.vy = _.y || u.y;
				u.z0 = _.z || 0;

				u.autoz = function ()
				{
					if (1)
					{
						for (let id in g.o)
						{
							let o = g.o[id];
							if (o.zen)
							{
								if (g.get.in (o, u))
								{
									if (u.y + u.h > o.y + o.h)
									{
										u.z = o.z;
									} else
									{
										u.z = u.z0;
									}
								}
							}
						}
					}
				}

				u.automove = function ()
				{
					if (u.control == 'auto')
					{
						if (g.time - u.tsearch0 > u.tsearch)
						{
							u.tsearch0 = g.time;
							u.vx = g.get.r ();
							u.vy = g.get.r ();
						}
					}
				}

				u.goto = function (x, y)
				{
					let v = {};
						v.x = x - u.xk * u.w;
						v.y = y - u.yk * u.h;
						u.moved = true;
					return v;
				}

				u.keymove = function (x, y)
				{
					if (u.control == 'keyboard')
					{
						let vx = u.vx;
						let vy = u.vy;
						vx += (u.key.l) ? -u.speed : 0;
						vx += (u.key.r) ? u.speed : 0;
						vy += (u.key.d) ? u.speed : 0;
						vy += (u.key.u) ? -u.speed : 0;

					 if (!g.get.pinblock (vx + u.xk * u.w, vy + u.yk * u.h) && g.get.pinroom (vx + u.xk * u.w, vy + u.yk * u.h))
					 {
						u.vx = vx;
						u.vy = vy;
					 }
					}
				}

				u.keydown = function (e)
				{
					if (u.control == 'keyboard')
					{
						switch (e.keyCode)
						{
							case 65: u.key.l = 1; break;
							case 68: u.key.r = 1; break;
							case 83: u.key.d = 1; break;
							case 87: u.key.u = 1; break;
						}
					}
				}

				u.keyup = function (e)
				{
					if (u.control == 'keyboard')
					{
						switch (e.keyCode)
						{
							case 65: u.key.l = 0; break;
							case 68: u.key.r = 0; break;
							case 83: u.key.d = 0; break;
							case 87: u.key.u = 0; break;
						}
					}
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
							}
						}	else
						{
							u.moved = false;
						}
					}
				}

				u.reaction = function ()
				{
					for (let id in g.o)
					{
						let o = g.o[id];
						if (o.type == 'hero' && g.get.in (u, o))
						{
							g.log = 'hi';
						}
					}
				},

				u.tick = function ()
				{
					u.automove ();
					u.autoz ();
					u.keymove ();
					u.move ();
					//u.reaction ();
					u.zone ();
				}

				u.zone = function ()
				{
					for (let id in g.o)
					{
						let o = g.o[id];
						if (o) if (o.inact)
						{
							let x = (u.x + u.xk * u.w) * g.g.width;
							let y = (u.y + u.yk * u.h) * g.g.height;
							if (g.get.pin (o, { x: x, y: y }))
							{
								o.inact ();
							}
						}
					}
				}

			return u;
		}
	},

	a:
	{
		black:
		{
			step: { i: ['blackstep0', 'blackstep1'], period: 100 }
		},
		hero:
		{
			color: { i: ['hero', 'hero_red'], period: 100 }
		},
		linda: { i: ['linda', 'linda2'], period: 500 }
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
			window.onwheel = g.u;
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

		id: function (o) { return (o.id) ? o.id : g.id++ },

		in: function (A, B)
		{
			let a = g.get.hwxy (A);
			let b = g.get.hwxy (B);
			return ((Math.abs (a.x - b.x + 0.5 * (a.w - b.w)) <= 0.5 * Math.abs (a.w + b.w)) &&
								(Math.abs (a.y - b.y + 0.5 * (a.h - b.h)) <= 0.5 * Math.abs (a.h + b.h)));
		},

		inum (n)
		{
			let i = 0;
			for (let id in g.i)
			{
				if (i == n) { return g.i[id]; }
				i++;
			}
		},

		inumname (n)
		{
			let i = 0;
			for (let id in g.i)
			{
				if (i == n) { return 'g.i.' + id; }
				i++;
			}
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

		json: function (o)
		{
			let r = '';
			let t = JSON.stringify (o);
			for (let i in t)
			{
				let l = t[i];
				if (l != '"') { r += l; }
			}
			return r;
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

	id: 0,

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

	tick: 30,

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
		if (e.type == 'tick') g.g.d ();
	},

	wipe: function ()
	{
		g.o = {};
		g.g.clear ();
		window.document.body.style.cursor = 'default';
	}
}

g.get.i = [ '_', 'bar', 'black', 'blackstep0', 'blackstep1', 'button0', 'button1', 'button2', 'city', 'dump', 'exit', 'exit1', 'foobar', 'grass', 'hero', 'hero_red', 'hero_green', 'linda', 'linda2', 'metrodoor', 'musicant', 'pillar', 'road', 'roadh', 'roadv', 'shadow', 'stantion201', 'start', 'tree', 'wall' ];

window.onload = g.l;

g.s.bar = function (p)
{
	g.wipe ();
	window.document.body.style.background = 'url("data/bar.png")';

	g.c = g._.room
	({
		box:
		[
			//foobar
			{h:0.15,w:0.23,x:0.76,y:0.2,i:g.i.foobar,texture:false,z:2,zen:true},
			{h:0.12,w:0.22,x:0.77,y:0.19,i:g.i._,texture:false,zen:false},

			//door
			{h:0.19,inact: function () {g.s.city ({x: 0.6, y: 0.2 });},w:0.06,x:0.46,y:0.01,i:g.i._,texture:false,zen:false},

			//room
			{h:0.79,w:0.98,x:0.01,y:0.2,i:g.i._,texture:false,zen:false}
		],
		debug: false
	});

	g.c = g._.block
	({
		box:
		[
			//barblock
			{h:0.03,w:0.23,x:0.76,y:0.32,i:g.i._,texture:false,zen:false},
			{h:0.22,w:0.04,x:0.74,y:0.13,i:g.i._,texture:false,zen:false},

			//scene
			{h:0.26,w:0.02,x:0.32,y:0.47,i:g.i._,texture:false,zen:false},
			{h:0.07,w:0.09,x:0.24,y:0.46,i:g.i._,texture:false,zen:false},
			{h:0.13,w:0.06,x:0.2,y:0.33,i:g.i._,texture:false,zen:false},
			{h:0.05,w:0.2,x:0.00,y:0.32,i:g.i._,texture:false,zen:false},
			{h:0.09,w:0.23,x:0.01,y:0.79,i:g.i._,texture:false,zen:false},
			{h:0.23,w:0.02,x:0.23,y:0.65,i:g.i._,texture:false,zen:false},
			{h:0.08,w:0.11,x:0.23,y:0.65,i:g.i._,texture:false,zen:false}
		],
		debug: false
	});

	g.c = g._.u ({ control: 'auto', h: 0.22, i: g.i.black, speed: 0.005, step: g.a.black.step, tsearch: 500, wk: 0.42, x: 0.8, xk: 0.5, y: 0.25, yk: 1, z: 1 });

	g.c = g._.u ({ control: 'auto', h: 0.22, i: g.i.linda, speed: 0.005, step: g.a.black.step, tsearch: 500, wk: 0.67, x: 0.2, xk: 0.5, y: 0.5, yk: 1, z: 1 });

	g.c = g._.u ({ control: 'keyboard', h: 0.2, i: g.i.hero, id: 'hero', wk: 0.42, x: p.x, xk: 0.5, y: p.y, yk: 1, z: 1 });
}

g.s.down = function (p)
{
	g.wipe ();
	window.document.body.style.background = 'url("data/down.png")';

	g.c = g._.room
	({
		box:
		[
			//city
			{h:0.03,inact:function(){g.s.city({x:0.75,y:0.1});},w:0.37,x:0.34,y:0.96,i:g.i._,texture:false,zen:false},

			//dump
			{h:0.03,inact:function(){g.s.dump({x:0.2,y:0.9});},w:0.37,x:0.34,y:0.01,i:g.i._,texture:false,zen:false},

			//room
			{h:0.98,w:0.37,x:0.34,y:0.01,i:g.i._,texture:false,zen:false},
			{h:0.2,w:0.33,x:0.01,y:0.7,i:g.i._,texture:false,zen:false},
			{h:0.22,w:0.08,x:0.26,y:0.48,i:g.i._,texture:false,zen:false}
		],
		debug: false
	});

	g.c = g._.block
	({
		box:
		[
		],
		debug: true
	});

	g.c = g._.u ({ control: 'keyboard', h: 0.1, i: g.i.hero, id: 'hero', wk: 0.42, x: p.x, xk: 0.5, y: p.y, yk: 1, z: 1 });
}

g.s.dump = function (p)
{
	g.wipe ();
	window.document.body.style.background = 'url("data/dump.png")';

	g.c = g._.room
	({
		box:
		[
			//city
			{h:0.29,inact:function(){g.s.city({x:0.05,y:0.2});},w:0.01,x:0.98,y:0.69,i:g.i._,texture:false,zen:false},

			//room
			{h:0.79,w:0.98,x:0.01,y:0.19,i:g.i._,texture:false,zen:false}
		],
		debug: false
	});

	g.c = g._.block
	({
		box:
		[
		],
		debug: true
	});

	g.c = g._.u ({ control: 'keyboard', h: 0.1, i: g.i.hero, id: 'hero', wk: 0.42, x: p.x, xk: 0.5, y: p.y, yk: 1, z: 1 });
}

g.s.city = function (p)
{
	g.wipe ();
	window.document.body.style.background = 'url("data/city.png")';

	g.c = g._.room
	({
		box:
		[
			//bar
			{h:0.14,inact: function () {g.s.bar ({x:0.55,y:0.2});}, w:0.04,x:0.55,y:0.01,i:g.i._,texture:false,zen:false},

			//down
			{h:0.03,inact:function(){g.s.down({x:0.5,y:0.95});},w:0.15,x:0.7,y:0.02,i:g.i._,texture:false,zen:false},

			//dump
			{h:0.37,inact:function(){g.s.dump({x:0.9,y:0.8});},w:0.02,x:0.01,y:0.19,i:g.i._,texture:false,zen:false},

			//metro
			{h:0.14,w:0.1,x:0.54,y:0.3,i:g.i.metrodoor,texture:false,z:2,zen:true},
			{h:0.02,inact:function(){g.s.metro ({x:0.76,y:0.57});},w:0.07,x:0.55,y:0.42,i:g.i._,texture:false,zen:false},

			//streets
			{h:0.41,w:0.98,x:0.01,y:0.15,i:g.i._,texture:false,zen:false},
			{h:0.43,w:0.39,x:0.1,y:0.56,i:g.i._,texture:false,zen:false},
			{h:0.14,w:0.15,x:0.7,y:0.01,i:g.i._,texture:false,zen:false}
		],
		debug: false
	});

	g.c = g._.block
	({
		box:
		[
			//dump
			{h:0.04,w:0.07,x:0.01,y:0.15,i:g.i._,texture:false,zen:false},

			//close
			{h:0.21,w:0.01,x:0.93,y:0.15,i:g.i._,texture:false,zen:false},
			{h:0.02,w:0.05,x:0.94,y:0.34,i:g.i._,texture:false,zen:false},

			//metro
			{h:0.06,w:0.02,x:0.535,y:0.38,i:g.i._,texture:false,zen:false},
			{h:0.06,w:0.02,x:0.62,y:0.38,i:g.i._,texture:false,zen:false},
			{h:0.03,w:0.1,x:0.54,y:0.36,i:g.i._,texture:false,zen:false},

			//water
			{h:0.19,w:0.13,x:0.22,y:0.7,i:g.i._,texture:false,zen:false}
		],
		debug: true
	});

	g.c = g._.u ({ control: 'keyboard', h: 0.1, i: g.i.hero, id: 'hero', wk: 0.42, x: p.x, xk: 0.5, y: p.y, yk: 1, z: 1 });
}

g.s.l = function ()
{
	g.s.bar ({x:0.55,y:0.2});
}

g.s.menu = function (p)
{
	g.wipe ();
	window.document.body.style.background = 'url("data/metro.png")';

	g.c = g._.room
	(
		{
			box:
			[
				//room
				{h:0.18,w:0.98,x:0.01,y:0.56,i:g.i._,texture:false,zen:false},

				//pillars
				{h:0.62,w:0.04,x:0.27,y:0.05,i:g.i.pillar,texture:false,z:2,zen:true},
				{h:0.62,w:0.04,x:0.66,y:0.05,i:g.i.pillar,texture:false,z:2,zen:true}
			],
			debug: false
		}
	);

	g.c = g._.block
	(
		{
			box:
			[
				//bench
				{h:0.02,w:0.15,x:0.4,y:0.56,i:g.i._,texture:false,zen:false},

				//pillars
				{h:0.04,w:0.06,x:0.65,y:0.64,i:g.i._,texture:false,zen:false},
				{h:0.04,w:0.06,x:0.26,y:0.64,i:g.i._,texture:false,zen:false},
				{h:0.03,w:0.44,x:0.27,y:0.53,i:g.i._,texture:false,zen:false}
			]
		}
	);

	g.c = g._.b
	({
		act: function () { g.s.metro ({x: 0.47, y: 0.65}); },
		cursor: true,
		h: 0.11,
		i: g.i.stantion201, i1: g.i.start, i2: g.i.button2,
		in: function ()
		{
			g.c = g._.i ({h:0.45,w:0.23,x:0.36,y:0.29,i:g.i.shadow,id:'shadow',texture:false,z:2});
		},
		out: function ()
		{
			delete g.o.shadow;
		},
		w: 0.11,
		x: 0.42,
		y: 0.29,
		z: 2
	});

	g.c = g._.b ({ act: function () { window.close (); }, cursor: true, h: 0.048, i: g.i.exit, i1: g.i.exit1, wk: 2.625, x: 0.84, y: 0.124, z: 2 });

	g.c = g._.u ({ control: 'auto', h: 0.15, i: g.i.black, speed: 0.005, step: g.a.black.step, tsearch: 500, wk: 0.42, x: 0.35, xk: 0.5, y: 0.6, yk: 1, z: 1 });
}

g.s.metro = function (p)
{
	g.wipe ();
	window.document.body.style.background = 'url("data/metro.png")';

	g.c = g._.room
	(
		{
			box:
			[
				//door city
				{h:0.17,inact:function(){g.s.city({x:0.63,y:0.45});},w:0.17,x:0.79,y:0.2,i:g.i._,texture:false,zen:false},

				//pillars
				{h:0.62,w:0.04,x:0.27,y:0.05,i:g.i.pillar,texture:false,z:2,zen:true},
				{h:0.62,w:0.04,x:0.66,y:0.05,i:g.i.pillar,texture:false,z:2,zen:true},

				//room
				{h:0.18,w:0.98,x:0.01,y:0.56,i:g.i._,texture:false,zen:false},
				{h:0.2,w:0.17,x:0.79,y:0.37,i:g.i._,texture:false,zen:false},

				//stantion 201
				{h:0.11,w:0.11,x:0.42,y:0.29,i:g.i.stantion201,texture:false,zen:false}
			],
			debug: false
		}
	);

	g.c = g._.block
	(
		{
			box:
			[
				//bench
				{h:0.02,w:0.15,x:0.4,y:0.56,i:g.i._,texture:false,zen:false},

				//pillars
				{h:0.04,w:0.06,x:0.65,y:0.64,i:g.i._,texture:false,zen:false},
				{h:0.04,w:0.06,x:0.26,y:0.64,i:g.i._,texture:false,zen:false},
				{h:0.03,w:0.44,x:0.27,y:0.53,i:g.i._,texture:false,zen:false}
			],
			debug: true
		}
	);

	g.c = g._.b ({ act: function () { window.close (); }, cursor: true, h: 0.048, i: g.i.exit, i1: g.i.exit1, wk: 2.625, x: 0.84, y: 0.124, z: 2 });

	g.c = g._.u ({ control: 'passive', h: 0.15, i: g.i.musicant, type: 'npc', wk: 0.68, x: 0.29, xk: 0.5, y: 0.68, yk: 1, z: 2, zen: true });

	g.c = g._.u ({ control: 'keyboard', h: 0.15, i: g.i.hero, id: 'hero', wk: 0.42, x: p.x, xk: 0.5, y: p.y, yk: 1, z: 1 });
}

g.s.test = function ()
{
	g.wipe ();

	g.c = g._.room
	(
		{
			box:
			[
				{h:0.62,w:0.42,x:0.27,y:0.24,i:g.i.grass,texture:true},
				{h:0.38,w:0.23,x:0.69,y:0.38,i:g.i.grass,texture:true},
				{h:0.26,w:0.23,x:0.69,y:0.75,i:g.i.grass,texture:true},

				{h:0.14,w:0.22,x:0.18,y:0.73,i:g.i.roadh,texture:false},
				{h:0.14,w:0.18,x:0,y:0.73,i:g.i.roadh,texture:false},

				{h:0.3,wk:0.83,x:0.59,y:0.5,i:g.i.tree,texture:false,z:2,zen:true},
				{h:0.3,wk:0.83,x:0.36,y:0.37,i:g.i.tree,texture:false,z:2,zen:true},

				{h:0.03,inact:function(){g.s.menu();},w:0.23,x:0.69,y:0.96,i:g.i._,texture:false}
			],
			debug: true
		}
	);

	g.c = g._.block
	(
		{
			box:
			[
				{h:0.15,w:0.31,x:0.69,y:0.24,i:g.i.road,texture:true},
				{h:0.64,w:0.08,x:0.92,y:0.38,i:g.i.road,texture:true},
				{h:0.74,w:0.27,x:0,y:0,i:g.i.road,texture:true},
				{h:0.26,w:0.73,x:0.27,y:0,i:g.i.road,texture:true},

				{h:0.16,w:0.69,x:0,y:0.86,i:g.i.wall,texture:true},
				{h:0.15,w:0.02,x:0.4,y:0.74,i:g.i.wall,texture:true},

				{h:0.03,w:0.02,x:0.41,y:0.65,i:g.i._,texture:false,zen:false},
				{h:0.03,w:0.02,x:0.64,y:0.78,i:g.i._,texture:false,zen:false}
			],
			debug: true
		}
	);

	g.c = g._.u ({ control: 'auto', h: 0.15, i: g.i.black, speed: 0.002, step: g.a.black.step, tsearch: 3000, wk: 0.42, x: 0.35, xk: 0.5, y: 0.77, yk: 1, z: 1, zen: true });

	g.c = g._.u ({ control: 'auto', h: 0.15, i: g.i.black, speed: 0.001, step: g.a.black.step, tsearch: 5000, wk: 0.42, x: 0.35, xk: 0.5, y: 0.77, yk: 1, z: 1, zen: true });

	g.c = g._.u ({ control: 'keyboard', h: 0.15, i: g.i.hero, wk: 0.42, x: 0.1, xk: 0.5, y: 0.8, yk: 1, z: 1 });

	g.c = g._.a ({ a: g.a.linda, h: 0.15, loop: true, wk: 0.67, x: 0.35, y: 0.6, z: 2, zen: true });

	g.g.d ();
}