var window = window;

var game =
{
	animate: function (o, a)
	{
		o.animation[a].time += game.window.tick;
		if (o.animation[a].time > o.animation[a].interval)
		{
			o.animation[a].time = 0;
			o.i = o.animation[a].i[o.animation[a].step];
			o.animation[a].step = (o.animation[a].step + 1 >= o.animation[a].i.length) ? 0 : o.animation[a].step + 1;
			game.draw ();
		}
	},

	canvas:
	{
		load: function ()
		{
			let canvas = window.document.createElement ('canvas');
			canvas.context = canvas.getContext ('2d');

			canvas.clear = function (color)
			{
				if (color)
				{
					game.player.background = color;
					canvas.context.fillStyle = color;
					canvas.context.fillRect (0, 0, canvas.width, canvas.height);
				} else
				{
					canvas.context.fillStyle = game.player.background;
					canvas.context.fillRect (0, 0, canvas.width, canvas.height);
				}
			}

			canvas.resize = function ()
			{
				canvas.height = window.innerHeight;
				canvas.width = window.innerWidth;
			}

			delete game.canvas;
			game.canvas = canvas;
			canvas.resize ();
			window.document.body.appendChild (canvas);
		}
	},

	create:
	{
		set button (o)
		{
			let button = o;
			button.f = o.f || function () {};
			button.id = game.set.id (o);
			button.mousein = false;
			button.z = game.set.z (o);

			button.draw = function ()
			{
				let context = game.canvas.context;
				context.imageSmoothingEnabled = o.aa || false;
				let hwxy = game.get.hwxy (button);
				context.drawImage (button.i, hwxy.x, hwxy.y, hwxy.w, hwxy.h);
			}

			button.mousedown = function (event)
			{
				if (game.get.mousein (button, event))
				{
					button.f ();
				}
			}

			button.mousemove = function (event)
			{
				if (game.get.mousein (button, event))
				{
					if (!button.mousein)
					{
						button.mousein = true;
						window.document.body.style.cursor = 'url(cursor_shoot.png) 9 9, pointer';
					}
				} else
				{
					if (button.mousein)
					{
						button.mousein = false;
						window.document.body.style.cursor = 'url(cursor.png) 4 0, default';
					}
				}
			}

			button.draw ();
			game.o[button.id] = button;
		},

		set cap (o)
		{
			let cap = o;
			cap.animation =
			{
				hit:
				{
					i: [game.i.cap_hit0, game.i.cap_hit1, game.i.cap_hit2],
					interval: 50,
					step: 0,
					time: 0
				},

				walk:
				{
					i: [game.i.cap_walk0, game.i.cap_walk1],
					interval: 75,
					step: 0,
					time: 0
				},
			}
			cap.enemy = true;
			cap.dmg = 0.005;
			cap.hp = 1;
			cap.i = o.i || game.i.cap;
			cap.id = game.set.id (o);
			cap.moved = false;
			cap.search_time0 = game.window.time;
			cap.search_time1 = 1000;
			cap.speed = 0.02;
			cap.time_hit0 = game.window.time;
			cap.time_hit1 = 300;
			cap.vx = game.o.hero.x;
			cap.vy = game.o.hero.y;
			cap.wk = 0.8;
			cap.xk = 0.5;
			cap.yk = -0.3;
			cap.z = game.set.z (o);

			cap.death = function ()
			{
				if (cap.hp <= 0)
				{
					delete game.o[cap.id];
					game.draw ();
				}
			}

			cap.draw = function ()
			{
				let context = game.canvas.context;
				context.imageSmoothingEnabled = o.aa || false;
				let hwxy = game.get.hwxy (cap);
				context.drawImage (cap.i, hwxy.x, hwxy.y, hwxy.w, hwxy.h);
			}
			
			cap.hit = function ()
			{


				if (Math.sqrt (Math.pow (cap.x - game.o.hero.x, 2) + Math.pow (cap.y - game.o.hero.y, 2)) < 0.3 * cap.h)
				{
					game.o.hero.hp = (game.o.hero.hp > 0) ? game.o.hero.hp - cap.dmg : game.o.hero.hp;

					game.animate (cap, 'hit');
					if (game.window.time - cap.time_hit0 > cap.time_hit1)
					{
						cap.time_hit0 = game.window.time;
						game.play = { src: 'hit.ogg' }
					}
				}
			}

			cap.move = function ()
			{
				if (Math.pow (cap.vx - cap.x, 2) + Math.pow (cap.vy - cap.y, 2) > 0.001 * cap.speed)
				{
					cap.moved = true;
					let r = Math.sqrt (Math.pow (cap.vx - cap.x, 2) + Math.pow (cap.vy - cap.y, 2));
					let r0 = 0.5 * cap.speed * r + game.r (0.001 * cap.speed, 0.1 * cap.speed);
					let r1 = r - r0;
					let rk = r0 / r1;
					let x = (cap.x + rk * cap.vx) / (1 + rk);
					let y = (cap.y + rk * cap.vy) / (1 + rk);
					cap.x = x;
					cap.y = y;
					game.draw ();
				} else
				{
					cap.moved = false;
					if (game.o.hero.hp > 0) 
					{
						game.draw ();
					}
				}
			}

			cap.search = function ()
			{
				if (game.window.time - cap.search_time0 > cap.search_time1)
				{
					cap.search_time0 = game.window.time;
					cap.search_time1 = game.r (100, 1000, true);
					cap.vx = game.o.hero.vx;
					cap.vy = game.o.hero.vy;
				}
			}

			cap.tick = function ()
			{
				cap.death ();
				cap.hit ();
				cap.move ();
				cap.search ();	
				cap.walk ();
				cap.zing ();
			}

			cap.walk = function ()
			{
				if (cap.moved)
				{
					game.animate (cap, 'walk');
				}
			}

			cap.zing = function ()
			{
				let h = game.get.hwxy (game.o.hero);
				let c = game.get.hwxy (cap);
				if (c.y + c.h > h.y + h.h)
				{
					if (cap.z == 1)
					{
						cap.z = 2;
					}
				} else
				{
					if (cap.z == 2)
					{
						cap.z = 1;
					}
				}
			}

			cap.draw ();
			game.o[cap.id] = cap;	
		},

		set control (o)
		{
			let control = o;
			control.f = o.f || function () {};
			control.id = game.set.id (o);

			control.keydown = function (event)
			{
				if (event.keyCode == control.key)
				{
					control.f ();
				}
			}

			game.o[control.id] = control;
		},

		set door (o)
		{
			let door = o;
			door.act = o.act || function () {};
			door.actived = o.actived || false;
			door.i = o.i || o.i0;
			door.i0 = o.i0;
			door.i1 = o.i1;
			door.id = game.set.id (o);
			door.inv = o.inv || false;
			door.use = o.use || function () {};
			door.z = game.set.z (o);

			door.active = function ()
			{
				if (game.get.in (game.o.hero, door))
				{
					if (!door.actived)
					{
						door.actived = true;
						door.i = door.i1;
						game.create.text = { c: '#fff', f: 'Courier New', id: 'tip' + door.id, s: '2em', t: door.tip, ta: 'center', x: 0.5, y: 0.95 }
						game.draw ();
						door.act ();
					}		
				} else
				{
					if (door.actived)
					{
						door.actived = false;
						door.i = door.i0;
						delete game.o['tip' + door.id];
						game.draw ();
					}
				}
			}

			door.draw = function ()
			{
				let context = game.canvas.context;
				let hwxy = game.get.hwxy (door);
				context.drawImage (door.i, hwxy.x, hwxy.y, hwxy.w, hwxy.h);
			}

			door.keydown = function (event)
			{
				switch (event.keyCode)
				{
					case 65: case 68: door.active (); break;
					case 83: if (door.inv) { door.active (); if (door.actived) { door.use (); } } break;
					case 87: if (!door.inv) { door.active (); if (door.actived) { door.use (); } } break;
				}
			}

			door.draw ();
			game.o[door.id] = door;
		},

		set hero (o)
		{
			let hero = o;
			hero.animation =
			{
				set animate (name)
				{
					hero.animation[name].time += game.window.tick;
					if (hero.animation[name].time > hero.animation[name].interval)
					{
						hero.animation[name].time = 0;
						hero.i = hero.animation[name].i[hero.animation[name].step];
						hero.animation[name].step = (hero.animation[name].step + 1 >= hero.animation[name].i.length) ? 0 : hero.animation[name].step + 1;
						game.draw ();
					}
				},

				down:
				{
					i: [game.i.jane_down_go0, game.i.jane_down_go1],
					interval: 75,
					step: 0,
					time: 0
				},

				left:
				{
					i: [game.i.jane_down_go0, game.i.jane_down_go1],
					interval: 75,
					step: 0,
					time: 0
				},

				right:
				{
					i: [game.i.jane_down_go0, game.i.jane_down_go1],
					interval: 75,
					step: 0,
					time: 0
				},

				up:
				{
					i: [game.i.jane_down_go0, game.i.jane_down_go1],
					interval: 75,
					step: 0,
					time: 0
				},
			}
			hero.h = o.h || 0.1;
			hero.hp = 1;
			hero.i = o.i || game.i.jane;
			hero.id = 'hero';
			hero.key = { attacks: 0, down: 0, left: 0, moves: 0, right: 0, up: 0 };
			hero.played = false;
			hero.room = o.room || { h: 1, show: true, w: 1, x: 0, y: 0 };
			hero.speed = o.speed || 0.004;
			hero.vx = o.x;
			hero.vy = o.y;
			hero.wk = o.wk || 0.4;
			hero.x = o.x || 0.5;
			hero.xk = o.xk || 0.5;
			hero.y = o.y || 0.5;
			hero.yk = o.yk || -1;
			hero.z = o.z || 1;

			hero.action = function ()
			{
				console.log ('e');
			}

			hero.death = function ()
			{
				if (hero.hp <= 0)
				{
					game.scene.gameover ();
				}
			}

			hero.draw = function ()
			{
				let context = game.canvas.context;
				context.imageSmoothingEnabled = o.aa || false;
				let hwxy = game.get.hwxy (hero);
				context.drawImage (hero.i, hwxy.x, hwxy.y, hwxy.w, hwxy.h);

				if (hero.room.show)
				{
					let hwxy = game.get.hwxy (hero.room);
					context.setLineDash([4, 4]);
					context.strokeStyle = '#fff';
					context.strokeRect (hwxy.x, hwxy.y, hwxy.w, hwxy.h);
				}
			}

			hero.go =
			{
				down: function ()
				{
					if (hero.key.down)
					{
						hero.vy += (hero.room.down ()) ? hero.speed : 0;
						if (Math.abs (hero.vx - hero.x) < Math.abs (hero.vy - hero.y)) hero.animation.animate = 'down';
					}
				},

				left: function ()
				{
					if (hero.key.left)
					{
						hero.vx -= (hero.room.left ()) ? hero.speed : 0;
						if (Math.abs (hero.vx - hero.x) >= Math.abs (hero.vy - hero.y)) hero.animation.animate = 'left';
					}
				},

				right: function ()
				{
					if (hero.key.right)
					{
						hero.vx += (hero.room.right ()) ? hero.speed : 0;
						if (Math.abs (hero.vx - hero.x) >= Math.abs (hero.vy - hero.y)) hero.animation.animate = 'right';
					}
				},

				up: function ()
				{
					if (hero.key.up)
					{
						hero.vy -= (hero.room.up ()) ? hero.speed : 0;
						if (Math.abs (hero.vx - hero.x) < Math.abs (hero.vy - hero.y)) hero.animation.animate = 'up';
					}
				},
			}

			hero.hit = function ()
			{
				if (hero.key.attacks)
				{
					game.animate (hero, 'hit');
				}
			}

			hero.keydown = function (event)
			{
				switch (event.keyCode)
				{
					case 65: hero.key.left = 1; break;
					case 68: hero.key.right = 1; break;
					case 83: hero.key.down = 1; break;
					case 87: hero.key.up = 1; break;
				}

				if (!hero.played && hero.key.moves > 0)
				{
					hero.played = true;
					game.play = { loop: true, soundtrack2: true, src: 'mac_active.ogg', volume: 0.15 }
				}
			}

			hero.keyup = function (event)
			{
				switch (event.keyCode)
				{
					case 65: hero.key.left = 0; break;
					case 68: hero.key.right = 0; break;
					case 83: hero.key.down = 0; break;
					case 87: hero.key.up = 0; break;
				}

				if (hero.played)
				{
					hero.played = false;
					if (game.soundtrack2) { game.soundtrack2.pause () };
				}
			}

			hero.move = function ()
			{
				if (Math.pow (hero.vx - hero.x, 2) + Math.pow (hero.vy - hero.y, 2) > 0.02 * hero.speed)
				{
					let r = Math.sqrt (Math.pow (hero.vx - hero.x, 2) + Math.pow (hero.vy - hero.y, 2));
					let r0 = hero.speed * hero.key.moves;
					let r1 = r - r0;
					let rk = r0 / r1;
					let x = (hero.x + rk * hero.vx) / (1 + rk);
					let y = (hero.y + rk * hero.vy) / (1 + rk);
					let h = game.get.hwxy (hero);
					hero.x = x;
					hero.y = y;
					hero.x = (hero.room.left ()) ? x : hero.x;
					hero.x = (hero.room.right ()) ? x : hero.x;
					hero.y = (hero.room.down ()) ? y : hero.y;
					hero.y = (hero.room.up ()) ? y : hero.y;
					game.draw ();
				}
			}

			hero.room.down = function ()
			{
				let h = game.get.hwxy (hero);
				let r = game.get.hwxy (hero.room);
				return (hero.vy * game.canvas.height - hero.yk * h.h + h.h < r.y + r.h);
			}

			hero.room.left = function ()
			{
				let h = game.get.hwxy (hero);
				let r = game.get.hwxy (hero.room);
				return (hero.vx * game.canvas.width - hero.xk * h.w > r.x);
			}

			hero.room.right = function ()
			{
				let h = game.get.hwxy (hero);
				let r = game.get.hwxy (hero.room);
				return (hero.vx * game.canvas.width - hero.xk * h.w + h.w < r.x + r.w);
			}

			hero.room.up = function ()
			{
				let h = game.get.hwxy (hero);
				let r = game.get.hwxy (hero.room);
				return (hero.vy * game.canvas.height - hero.yk * h.h > r.y);
			}

			hero.tick = function ()
			{
				hero.key.moves = hero.key.down + hero.key.left + hero.key.right + hero.key.up;
				hero.death ();
				hero.go.down ();
				hero.go.left ();
				hero.go.right ();
				hero.go.up ();
				hero.hit ();
				hero.move ();

			}

			hero.draw ();
			game.o[hero.id] = hero;
		},

		set hp (o)
		{
			let hp = o;
			hp.h = o.h || 0.05;
			hp.i = o.i || game.i.hp;
			hp.id = game.set.id (o);
			hp.wk = o.wk || 5;
			hp.x = o.x || 0.02;
			hp.y = o.y || 0.05;
			hp.z = game.set.z (o);

			hp.draw = function ()
			{
				let context = game.canvas.context;
				context.imageSmoothingEnabled = o.aa || false;
				let hwxy = game.get.hwxy (hp);
				let h = hp.i.naturalHeight;
				let w = hp.i.naturalWidth * hp.o.hp;
				context.drawImage (hp.i, 0, 0, w, h, hwxy.x, hwxy.y, hwxy.w * hp.o.hp, hwxy.h);
			}

			hp.draw ();
			game.o[hp.id] = hp;		
		},

		set katana (o)
		{
			let katana = o;
			katana.animation =
			{
				hit:
				{
					i: [game.i.katana0, game.i.katana1, game.i.katana2, game.i.katana3, game.i.katana2, game.i.katana1 ],
					interval: 75,
					step: 0,
					time: 0
				}
			}
			katana.dmg = 0.001;
			katana.i = o.i || game.i.katana0;
			katana.id = game.set.id (o);
			katana.time_hit0 = game.window.time;
			katana.time_hit1 = 300;
			katana.z = game.set.z (o);

			katana.draw = function ()
			{
				let context = game.canvas.context;
				context.imageSmoothingEnabled = o.aa || false;
				let hwxy = game.get.hwxy (katana);
				context.drawImage (katana.i, hwxy.x, hwxy.y, hwxy.w, hwxy.h);
			}

			katana.equip = function ()
			{
				katana.h = game.o.hero.h;
				katana.wk = 1.46;
				katana.x = game.o.hero.x;
				katana.xk = game.o.hero.xk;
				katana.y = game.o.hero.y;
				katana.yk = game.o.hero.yk;
				katana.z = game.o.hero.z + 1;
			}

			katana.hit = function ()
			{
				if (katana.hited)
				{
					for (let id in game.o)
					{
						let o = game.o[id];
						if (o.enemy)
						{
							if (Math.sqrt (Math.pow (game.o.hero.x - o.x, 2) + Math.pow (game.o.hero.x - o.x, 2)) < katana.h)
							{
								o.hp -= (o.hp >= 0) ? katana.dmg : 0;
								if (game.window.time - katana.time_hit0 > katana.time_hit1)
								{
									katana.time_hit0 = game.window.time;
									game.play = { src: 'katana.ogg' }
								}
							}
						}
					}
					katana.equip ();
					game.animate (katana, 'hit');
				}
			}

			katana.mousedown = function (event)
			{
				katana.hited = true;
			}

			katana.mouseup = function (event)
			{
				katana.hited = false;
			}

			katana.tick = function ()
			{
				katana.equip ();
				katana.hit ();
			}

			katana.draw ();
			katana.equip ();
			game.o[katana.id] = katana;		
		},

		set machine (o)
		{
			let machine = o;
			machine.act = o.act || function () {};
			machine.actived = o.actived || false;
			machine.i = o.i || o.i0;
			machine.i0 = o.i0;
			machine.i1 = o.i1;
			machine.id = game.set.id (o);
			machine.use = o.use || function () {};
			machine.z = game.set.z (o);

			machine.active = function ()
			{
				if (game.get.in (game.o.hero, machine))
				{
					if (!machine.actived)
					{
						machine.actived = true;
						machine.i = machine.i1;
						game.create.text = { c: '#fff', f: 'Courier New', id: 'tip' + machine.id, s: '2em', t: machine.tip, ta: 'center', x: 0.5, y: 0.95 }
						game.draw ();
						machine.act ();
					}		
				} else
				{
					if (machine.actived)
					{
						machine.actived = false;
						machine.i = machine.i0;
						delete game.o['tip' + machine.id];
						game.draw ();
					}
				}
			}

			machine.draw = function ()
			{
				let context = game.canvas.context;
				let hwxy = game.get.hwxy (machine);
				context.drawImage (machine.i, hwxy.x, hwxy.y, hwxy.w, hwxy.h);
			}

			machine.keydown = function (event)
			{
				switch (event.keyCode)
				{
					case 65: case 68: machine.active (); break;
					case 83: if (machine.actived) { machine.use (); } break;
				}
			}

			machine.draw ();
			game.o[machine.id] = machine;		
		},

		set sprite (o)
		{
			let sprite = o;
			sprite.id = game.set.id (o);
			sprite.z = game.set.z (o);

			sprite.draw = function ()
			{
				let context = game.canvas.context;
				context.imageSmoothingEnabled = o.aa || false;
				let hwxy = game.get.hwxy (sprite);
				context.drawImage (sprite.i, hwxy.x, hwxy.y, hwxy.w, hwxy.h);
			}

			sprite.draw ();
			game.o[sprite.id] = sprite;		
		},

		set text (o)
		{
			let text = o;
			text.id = game.set.id (o);
			text.t = o.t || 'text';
			text.x = o.x || 0;
			text.y = o.y || 0;
			text.z = game.set.z (o);

			text.draw = function ()
			{
				let context = game.canvas.context;
				context.imageSmoothingEnabled = o.aa || false;
				let x = game.get.x (text);
				let y = game.get.y (text);
				context.fillStyle = (text.c) ? text.c : context.fillStyle;
				context.font = (text.f && text.s) ? text.s + ' ' + text.f : context.font;
				context.textAlign = (text.ta) ? text.ta : context.textAlign;
				context.textBaseline = (text.tb) ? text.tb : context.textBaseline;
				context.fillText (text.t, x, y);
			}

			text.draw ();
			game.o[text.id] = text;
		},

		set timer (o)
		{
			let timer = o;
			timer.f = o.f;
			timer.id = game.set.id (o);
			timer.t = o.t;
			timer.time = game.window.time;

			timer.tick = function ()
			{
				timer.timeout ();
			}

			timer.timeout = function ()
			{
				if (game.window.time - timer.time >= timer.t)
				{
					delete game.o[timer.id];
					timer.f ();
				}
			}

			game.o[timer.id] = timer;
		}
	},

	draw: function ()
	{
		game.canvas.clear ();
		for (let z = 0; z <= game.z + 1; z++)
		{
			for (let id in game.o)
			{
				if (game.o[id].z == z)
				{
					game.o[id].draw ();
				}
			}
		}
	},

	get:
	{
		hwxy: function (o)
		{
			o.w = ((o.h) || (o.w)) ? o.w : o.i.naturalWidth / game.canvas.width;
			o.h = ((o.h) || (o.w)) ? o.h : o.i.naturalHeight / game.canvas.height;
			let hwxy = {};
			hwxy.h = (o.hk) ? o.hk * o.w * game.canvas.width : o.h * game.canvas.height;
			hwxy.w = (o.wk) ? o.wk * o.h * game.canvas.height : o.w * game.canvas.width;
			hwxy.x = (o.xk) ? o.x * game.canvas.width - o.xk * hwxy.w : o.x * game.canvas.width;
			hwxy.y = (o.yk) ? o.y * game.canvas.height - o.yk * hwxy.h : o.y * game.canvas.height;
			return hwxy;
		},

		in: function (A, B)
		{
			let a = game.get.hwxy (A);
			let b = game.get.hwxy (B);
			return ((a.x >= b.x) && (a.x <= b.x + b.w) && (a.y >= b.y) && (a.y <= b.y + b.h));
		},

		mousein: function (o, e)
		{
			let hwxy = game.get.hwxy (o);
			return (e.x >= hwxy.x && e.x <= hwxy.x + hwxy.w && e.y >= hwxy.y && e.y <= hwxy.y + hwxy.h);
		},

		x: function (o)
		{
			return o.x * game.canvas.width;
		},

		y: function (o)
		{
			return o.y * game.canvas.height;
		}
	},

	i: {},

	id: 0,

	load:
	{
		set i (o)
		{
			for (let id in o)
			{
				let image = new Image ();
				image.src = o[id];
				game.i[id] = image;
			}
		}
	},

	o: {},

	set play (o)
	{
		let audio = new Audio (o.src);
		audio.loop = o.loop || false;
		audio.volume = o.volume || 1;
		game.soundtrack = (o.soundtrack) ? audio : game.soundtrack;
		game.soundtrack2 = (o.soundtrack2) ? audio : game.soundtrack2;
		audio.play ();
	},

	player:
	{	
		back: function (name)
		{
			game.o.hero.hp = game.player.hp;
			if (game.player.scene[name])
			{
				game.o.hero.x = game.player.scene[name].x;
				game.o.hero.vx = game.player.scene[name].x;
				game.draw ();
			}		
		},
		background: '#000',
		hp: 1,
		exit: function (scene)
		{
			game.player.hp = game.o.hero.hp;
			game.player.scene[scene] = {};
			game.player.scene[scene].x = game.o.hero.x;
		},
		scene: {}
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

	run: function ()
	{
		game.window.load ();
		game.canvas.load ();
		game.scene.load ();
	},

	scene:
	{
		begin: function ()
		{
			game.wipe ('#000');
			game.play = { loop: true, soundtrack: true, src: 'ship.ogg ', volume: 0.1 };

			game.create.sprite = { h: 0.25, i: game.i.box_in, wk: 2.4, x: 0.5, xk: 0.5, y: 0.465 }

			game.create.hero = { room: { h: 0.098, show: false, wk: 5.74, x: 0.5, xk: 0.5, y: 0.6 }, x: 0.5, y: 0.5 }			

			game.create.machine = { act: function () { game.play = { src: 'mac_active.ogg', volume: 0.2 } }, actived: true, h: 0.1, i: game.i.mac_on, i0: game.i.mac_off, i1: game.i.mac_on, tip: 'Press S for use', use: function () { game.play = { src: 'mac.ogg', volume: 0.5 }; game.player.exit ('begin'); game.scene.mac (); }, wk: 0.85, x: 0.5, xk: 0.5, y: 0.5, yk: -1, z: 2 }

			game.create.door = { act: function () { game.play = { src: 'door_box_check.ogg', volume: 0.2 } }, h: 0.1, i0: game.i.door_box, i1: game.i.door_box, tip: 'Press W to open', use: function () { game.play = { src: 'door_box.ogg', volume: 0.5 }; game.player.exit ('begin'); game.scene.ship (); }, wk: 0.29, x: 0.5, xk: 10, y: 0.5, yk: -1, z: 1 }

			game.player.back ('begin');
			game.create.hp = { o: game.o.hero };
		},

		captain: function ()
		{
			game.wipe ('#000');
			game.create.sprite = { h: 1, i: game.i.captain_bridge, wk: 1.37, x: 0.5, xk: 0.5, y: 0 }

			game.create.door = { h: 0.11, i0: game.i.captain_door, i1: game.i.captain_door, inv: true, tip: ' ', use: function () {  game.player.exit ('captain'); game.scene.ship (); }, wk: 1.2, x: 0.5, xk: 0.5, y: 0.89, yk: 0, z: 0 }

			game.create.hero = { h: 0.1, i: game.i.jane_up, room: { h: 0.62, show: false, wk: 2.2, x: 0.5, xk: 0.5, y: 0.38  }, x: 0.5, y: 0.8 }

			game.create.katana = {}

			game.create.cap = { h: 0.15, id: 'cap', x: 0.7, xk: -4, y: 0.5, yk: 0.5, z: 1 }

			game.player.back ('captain');
			game.create.hp = { i: game.i.cap_hp, o: game.o.cap, wk: 5.7, x: 0.5, xk: 0.5, y: 0.02 }
			game.create.hp = { o: game.o.hero };
		},

		gameover: function ()
		{
			game.wipe ('#fff');
			game.create.control = { f: game.scene.intro, key: 32 }
			game.create.text = { c: '#000', f: 'Courier New', id: 'enter', s: '4em', t: 'GAME OVER', ta: 'center', x: 0.5, y: 0.5 }
			game.create.text = { c: '#f00', f: 'Courier New', id: 'enter', s: '2em', t: 'SPACE for RETURN', ta: 'center', x: 0.5, y: 0.95 }
		},

		intro: function ()
		{
			game.wipe ('#000');
			game.create.control = { f: game.scene.start, key: 32 }
			game.create.text = { c: '#f00', f: 'Courier New', id: 'enter', s: '2em', t: 'SPACE for SKIP', ta: 'center', x: 0.5, y: 0.95 }

			game.create.text = { c: '#fff', f: 'Courier New', s: '1.5em', t: 'Машины отняли у нас всё', x: 0.6, y: 0.7, }

			game.create.timer =
			{
				f: function () { game.create.text = { t: 'Работу', x: 0.2, y: 0.4 } },
				t: 2000
			}
			
			game.create.timer =
			{
				f: function () { game.create.text = { t: 'Деньги', x: 0.7, y: 0.1 } },
				t: 3000
			}

			game.create.timer =
			{
				f: function () { game.create.text = { f: 'Courier New', s: '3em', t: 'ВЛАСТЬ', x: 0.4, y: 0.45 } },
				t: 5000
			}

			game.create.timer =
			{
				f: function () { game.create.text = { c: '#f00', f: 'Courier New', s: '1.5em', t: 'Вам стоит потерпеть, миссис Норрис', x: 0.2, y: 0.6, } },
				t: 6000
			}

			game.create.timer =
			{
				f: function () { game.create.text = { c: '#0f0', t: 'Долой роботов!', x: 0.6, y: 0.2 } },
				t: 7000
			}

			let text = [ 'ха-ха, не может быть!', 'Пошел на #@!^&', 'Роботы - спасение человечества', 'Я на это не подписывался', 'Конец близок!', 'Проснитесь и пойте, мистер Фримен', 'Разве вы считали, что будет иначе?', 'Всё не так как кажется', 'Знал я одного парня, у него вместо рук R200 стоит', 'Человек не должен работать, это прерогатива машин', 'Смерть', 'Энди, ты уже третий раз за неделю ночуешь у нас, верно?', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Роботы классные. Они не плачут, не страдают. Они ничего не чувствуют.', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Робот нарушил первый закон. Правда или вымысел?', 'Смерть', 'Смерть', 'Кто-то следит за мной. Нет, это не болезнь. Я точно знаю!', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Настоящая еда для настоящих людей', 'Смерть', 'Они прилетели за нами, я точно их видела', 'Смерть', 'Смерть', 'Мы были лишь переходным звеном к доминации механизмов', 'Смерть', 'Люди, изобретающие двигатели, ещё не перевелись.', 'Смерть', 'Современные технологии делают людей всё более слабоумными.', 'Смерть', 'Смерть', 'Смерть', 'Хотел бы и я быть роботом', 'Смерть', 'Ты всю жизнь ощущал, что мир не в порядке', 'Смерть', 'Мы, сами того не осознавая, дали жизнь целому поколению приборов, которые уже настолько совершенны, что вот-вот начнут обходиться без нас.', 'Смерть', 'Смерть', 'Следуй за белым кроликом', 'Человек слишком сложен, чтобы быть творением гения', 'Смерть', 'Смерть', 'Я нашла его, Барби', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Специально для TWG8', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Как вы узнали?', 'Не ясно, кто нанëс первый удар: мы или они, но вечный сумрак устроили люди', 'Смерть', 'Смерть', 'Смерть', '학교다닐때 하던 메이크업 톡톡', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Я не сказал что будет легко. Я лишь обещал открыть правду', 'Смерть', 'Смерть', 'Счастье — в неведении', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Знать путь и идти по нему — не одно и то же', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Я люблю тебя', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Ты просто знаешь это', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Время всегда против нас', 'Смерть', 'Смерть', 'Неприятно думать, что тобой манипулируют', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть', 'Смерть' ];
			let time = 7000;
			for (let i = 0; i < text.length; i++)
			{
				time += 200/(0.1 * i + 1);
				game.create.timer =
				{
					f: function () { game.create.text = { c: game.r ('color'), t: text[i], x: game.r (), y: game.r () } },
					t: time
				}
			}

			game.create.timer =
			{
				f: function () { game.scene.start () },
				t: 14000
			}
		},

		load: function ()
		{
			game.scene.captain ();
		},

		mac: function ()
		{
			game.wipe ();
			game.create.sprite = { h: 1, i: game.i.mac, wk: 1.6, x: 0.5, xk: 0.5, y: 0 };
			game.create.button = { f: game.scene.begin, h: 0.04, i: game.i.mac_folder, wk: 1, x: 0.43, xk: 0.5, y: 0.34 };
		},

		ship: function ()
		{
			game.wipe ('#58f');
			game.play = { loop: true, soundtrack: true, src: 'sea.ogg ', volume: 0.1 };

			game.create.sprite = { h: 0.8, i: game.i.ship, wk: 2.7, x: 0.5, xk: 0.5, y: 0.2 }

			game.create.hero = { h: 0.05, room: { h: 0.048, show: false, wk: 28, x: 0.5, xk: 0.5, y: 0.55  }, x: 0.63, y: 0.5 }

			game.create.door = { act: function () { game.play = { src: 'door_box_check.ogg', volume: 0.2 } }, h: 0.05, i0: game.i.door_box, i1: game.i.door_box, tip: 'Home, sweet home', use: function () { game.play = { src: 'door_box.ogg', volume: 0.5 }; game.player.exit ('ship'); game.scene.begin (); }, wk: 0.29, x: 0.5, xk: -17.5, y: 0.545, yk: 0, z: 0 }

			game.create.door = { h: 0.06, i0: game.i.door_ship, i1: game.i.door_ship, tip: 'Captain bridge', use: function () { game.player.exit ('ship'); game.scene.captain (); }, wk: 0.7, x: 0.5, xk: 10, y: 0.542, yk: 0, z: 1 }

			game.player.back ('ship');
			game.create.hp = { o: game.o.hero };
		},

		start: function ()
		{
			game.wipe ();
			game.play = { loop: true, soundtrack: true, src: 'main.ogg ', volume: 0.5 };

			game.create.sprite = { aa: true, h: 0.5, i: game.i.logo, wk: 0.63, x: 0.5, xk: 0.5, y: 0.3, yk: 0.5 };
			game.create.button = { f: game.scene.begin, h: 0.02, i: game.i.enter, wk: 5, x: 0.5, xk: 0.5, y: 0.6 };

			let enter =
			{
				f: function ()
				{
					game.create.text = { c: '#f00', f: 'Courier New', id: 'enter', s: '2em', t: 'WARNING', ta: 'center', x: 0.5, y: 0.95 };
					game.create.timer =
					{
						f: function ()
						{
							delete game.o['enter'];
							game.draw ();
							game.create.timer = enter;
						},
						t: 300
					}
				},
				t: 500
			}
			game.create.timer = enter;

		}
	},

	set:
	{
		id: function (o)
		{
			let id = (o.id) ? o.id : game.id++;
			return id;
		},

		z: function (o)
		{
			let z = (o.z) ? o.z : 0;
			game.z = (z > game.z) ? z : game.z;
			return z;
		}
	},

	soundtrack: { pause: function () { return; } },
	soundtrack2: { pause: function () { return; } },

	update: function (event)
	{
		for (let id in game.o)
		{
			for (let name in game.o[id])
			{
				if (name == event.type)
				{
					game.o[id][name] (event);
				}
			}
		}
	},

	window:
	{
		load: function ()
		{
			window.onkeydown = game.update;
			window.onkeyup = game.update;
			window.onmousedown = game.update;
			window.onmousemove = game.update;
			window.onmouseup = game.update;
			window.onresize = game.window.resize;
			game.window.ontick = game.update;
		},

		resize: function ()
		{
			game.canvas.resize ();
			game.draw ();
		},

		set ontick (f)
		{
			game.window.clock = window.setInterval
			(
				function ()
				{
					f ({ type: 'tick' });
					game.window.time += game.window.tick;
				},
				game.window.tick
			);
		},

		tick: 35,

		time: 0
	},

	wipe: function (color)
	{
		game.o = {};
		game.canvas.clear (color);
		game.soundtrack.pause ();
		if (game.soundtrack2) game.soundtrack2.pause ();
		window.document.body.style.cursor = 'url(cursor.png) 4 0, default';
	},

	z: 0
}

game.load.i =
{
	box_in: 'box_in.png',

	cap: 'cap.png',
	cap_hp: 'cap_hp.png',
	cap_hit0: 'cap_hit0.png', cap_hit1: 'cap_hit1.png', cap_hit2: 'cap_hit2.png',
	cap_walk0: 'cap_walk0.png', cap_walk1: 'cap_walk1.png',

	captain_bridge: 'captain_bridge.png',
	captain_door: 'captain_door.png',

	door_box: 'door_box.png',
	door_ship: 'door_ship.png',

	enter: 'enter.png',

	hp: 'hp.png',

	jane: 'jane.png',
	jane_down: 'jane_down.png',
	jane_down_go0: 'jane_down_go0.png', jane_down_go1: 'jane_down_go1.png',
	jane_hit: 'jane_hit.png',
	jane_left: 'jane_left.png',
	jane_left_go0: 'jane_left_go0.png', jane_left_go1: 'jane_left_go1.png', jane_left_go2: 'jane_left_go2.png', jane_left_go3: 'jane_left_go3.png',
	jane_right: 'jane_right.png',
	jane_right_go0: 'jane_right_go0.png', jane_right_go1: 'jane_right_go1.png', jane_right_go2: 'jane_right_go2.png', jane_right_go3: 'jane_right_go3.png',
	jane_up: 'jane_up.png',
	jane_up_go0: 'jane_up_go0.png', jane_up_go1: 'jane_up_go1.png',
	
	katana0: 'katana0.png', katana1: 'katana1.png', katana2: 'katana2.png', katana3: 'katana3.png',

	logo: 'logo.png',
	
	mac: 'mac.png',
	mac_folder: 'mac_folder.png', 
	mac_off: 'mac_off.png',
	mac_on: 'mac_on.png',

	ship: 'ship.png'
}

window.onload = game.run;