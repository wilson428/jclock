//method for drawing shadow in Raphael. A little simpler and cleaner than .glow()
Raphael.el.depth = function(z, shade) {
    z = (typeof z !== "undefined") ? z : 5;
    shade = (typeof shade !== "undefined") ? shade : '#999';
    for (var c = 0; c < z; c += 1) {
		this.clone().attr({ 'fill': shade }).transform("t" + (c + 1) + "," + (c + 1));
	}
	this.toFront();
};

//clock object 
var clock = function(paper, x, y, r) {
	//internal objects created in closure
	var hours = 12,
		minutes = 0,
		outer,
		inner,
		bighand,
		littlehand,
		numbers = paper.set(),
		ticks = paper.set(),
		dot,
		c = 0,
		w;
		
	//frame
	outer = paper.circle(x, y, r).attr({
		fill : '#FFFFFC',
		stroke: '#CCC',
		'stroke-width': 1
	}).depth(),//.glow({ 'offsetx' : 1, 'offsety': 1}),
	inner = paper.circle(x, y, r - 18).attr({
		fill : '#f3f7f2',
		stroke: '#87818c',
		'stroke-width': 4
	});
		
	//ticks + numbers
	for (; c < 60; c += 1) {
		w = (c % 5 === 0) ? 8 : 5;
		ticks.push(paper.path("M" + x + "," + (y - w) + "L" + x + "," + (y + w)).attr({ 'stroke-width' : (c % 5 === 0) ? '2px' : '1px' }).transform("r" + c * 6 + "t0," + (r - 32)));
	}
	for (c = 0; c < 12; c += 1) {
		numbers.push(paper.text(x + (r - 60) * Math.cos(Math.PI / 6 * (c - 2)), y + (r - 60) * Math.sin(Math.PI / 6 * (c - 2)), c + 1).attr({ 'font-size' : '30px', 'text-anchor' : 'middle' }));
	}

	//hands
	littlehand = paper.path("M" + x + "," + y + "L" + x + "," + (y - (r - 90))).attr({ 'stroke-width' : 6 });
	bighand = paper.path("M" + x + "," + y + "L" + x + "," + (y - (r - 50))).attr({ 'stroke-width' : 3 });
	dot = paper.circle(x, y, 6).attr({ fill: "#000" });
	
    var makeTime = function(h, m) {
		if (typeof h === "string") {
			//assume one argument in "1:55" format
			var hm = h.split(":");
			h = parseInt(hm[0], 10);
			m = (hm.length > 1) ? parseInt(hm[1], 10) : 0;
		} else {
			m = (typeof m !== "undefined") ? m : 0;
		}
		console.log(h, m);
        return {
            h: h,
            m: m
        };
    };
    
	//public methods
	return {
		getPieces: function() {
			return {
				frame: outer,
				face: inner,
				dot: dot,
				bighand: bighand,
				littlehand: littlehand,
				numbers: numbers,
				ticks: ticks
			};
		},
		setTime: function (h, m, duration) {
            var f = makeTime(h, m);
            h = f.h;
            m = f.m;

            var total_min = 60 * ((hours < h) ? (h - hours) : (12 + h - hours)) + m;
			duration = (typeof duration !== "undefined") ? duration : 0;
			//anything faster than 5ms / min defeats standard framerate
			if (duration > 0 && duration < total_min * 5) {
				duration = total_min * 5;
			}
			//update clock time				
			hours = h;
			minutes = m;
            h += m / 60;
            bighand.animate({transform: "r" + (60 * h + m) * 6 + "," + x + "," + y}, duration);			
			littlehand.animate({ transform: "r" + h * 30 + "," + x + "," + y}, duration);
		},
		getTime: function (fmt) {
			if (fmt && fmt[0] === "s") {
				return hours + ":" + (minutes < 10 ? "0" : "") + minutes;
			} else {
				return [hours, minutes];
			}
		},
        plot: function (h, m, obj) {
            var f = makeTime(h, m);
            h = f.h;
            m = f.m;        
            h += m / 60;
            
            if (typeof obj === "undefined") {
                obj = paper.circle(0, 0, 5).attr({ fill: "#F00", stroke: 0, opacity: 0.2 });
            }
            var angle = Math.PI / 6 * (h - 3);
            obj.transform("T" + (x + (r - 8) * Math.cos(angle)) + "," + (y + (r - 8) * Math.sin(angle)));
        }
	};
};