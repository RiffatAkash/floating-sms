
/*creative by purplepatch*/

function loadImages(){
	for( var i=0; i<bgs.length; i++ ) {
		var img = new Image();
		img.src = bgs[i];
		ddef.box.imgs.push( img )
	}
}


function initIFrame ( )
{
    events();
  	dragLoop()
  	loadImages();
  	prepBox();
    setCss();
    goOut();
    screenCanvas();
    loop();
    initDrag();
    initAnim();
    onResize();
    o.container.style.top = ddef.topY + "px";
    setTimeout( function(){
	    ddef.animInt = setInterval(function(){
	    	console.log("explodeAd");
	    	explodeAd();
	    }, 1800);
    }, 500);

    var maz = (ddef.screen.w < ddef.screen.h) ? ddef.screen.w : ddef.screen.h;
    ad_s = 0.35 * maz / 150;
    if(ad_s>1) ad_s = 1;
  }

  function events(){
    ddef.screen.w = _window.innerWidth;
    ddef.screen.h = _window.innerHeight;
    _window.addEventListener('resize', onResize);
  }

  var ad_s = 1;

  function onResize(){
  	var w = _window.innerWidth;
  	var h = _window.innerHeight;
    var c = ddef.canvas;

    c.width = w;
    c.height = h;
    c.style.width = w;
    c.style.height = h;
    ddef.screen.w = w;
    ddef.screen.h = h;


    ddef.topY = _window.innerHeight * 0.5;

  }

  function screenCanvas()
  {
    var c = document.createElement("canvas");
    c.width = _window.innerWidth;
    c.height = _window.innerHeight;
    c.style.width = _window.innerWidth;
    c.style.height = _window.innerHeight;
    c.style.position = "fixed";
    c.style.zIndex = 9999998;
    c.style.top = "0px";
    c.style.bottom = "0px";
    c.style.left = "0px";
    c.style.right = "0px";
    c.style.pointerEvents = "none";

    ddef.canvas = c;
    ddef.ctx = c.getContext("2d");

    var body = _document.getElementsByTagName("body")[0];
    body.appendChild(c);
  }

  function initCircles()
  {
    for(var i=0; i<ddef.circles.amm; i++){
      ddef.circles.list.push( {} );
      createCircle(i);
    }
  }

  function showCTA(){
      gsap.set(o.cta, {opacity: 1, scale: 0, transformOrigin: "50% 90%"})
      gsap.to(o.cta, 0.35, {delay: 0.7, scale: 1, ease: Back.easeOut, transformOrigin: "50% 90%", onComplete: function(){
	    gsap.to(o.cta, 0.35, { scale: 0.9, ease: Power1.easeInOut, yoyo: true, repeat: -1, repeatDelay: 0.05, })
      }})
  }
  
  function hideBTN(){
  	  gsap.to(o.shake_text, 0.35, {scale: 0, ease: Back.easeIn, transformOrigin: "50% 85%", onComplete: function(){
        if(ddef.shakeTl) ddef.shakeTl.kill();
      }})
  }



  function initAnim()
  {
    CustomEase.create("e0", "M0,0 C0.128,0.572 0.263,0.926 0.518,1 0.678,1.046 0.838,1 1,1");
    gsap.set(o.wrapper, {scale: 1, x: 0, y: 0, transformOrigin: "50% 50%"});
    gsap.from(o.wrapper, 0.75, {delay: 0.1, rotation: 180, scale: 0, ease: "e0", onStart: function(){
    }, onComplete: function(){}})
    setTimeout(startSpawn, 1000);
  }

  function startSpawn(){
    initCircles();
    if(ddef.box.cur == 0){
	    var dx = 6;
	    gsap.set(o.shake_text, { scale: 1.1, transformOrigin: "50% 90%" })
	    gsap.to(o.shake_text, 1, { delay: 0.0, opacity: 1 })
	    ddef.shakeTl = gsap.to(o.shake_text, 0.35, { scale: 0.95, ease: Power1.easeInOut, yoyo: true, repeat: -1, repeatDelay: 0.05, })
  	}
  }

  function createCircle( index )
  {
    var x0 = ddef.screen.x + ddef.w*(0.5 + 0.3 * ( 0.5 - Math.random() ) );
    var y0 = ddef.screen.y + ddef.h*(0.5 + 0.3 * ( 0.5 - Math.random() ) );
    var r = ddef.w*0.75;
    var a = Math.random() * 2 * Math.PI;

    var dx = ddef.drag.dx;
    var dy = ddef.drag.dy;
    var max = 20;
    if( dx > max ) dx = max;
    if( dy > max ) dy = max;
    if( dx < -max ) dx = -max;
    if( dy < -max ) dy = -max;

    var e1 = gsap.parseEase("power1.in");
    var e2 = gsap.parseEase("power1.out");
    var ee = e1;
    if(Math.random()>0.5){
      e1=e2;
      e2=ee;
    }

    var col = ddef.col[ Math.floor( Math.random() * ddef.col.length ) ];
    var c = {
      active: false,
      color: col,
      live: 0,
      dur: 0.6 + 1.4 * Math.random(),
      posStart: {
        x: x0,
        y: y0,
      },
      e1: e1,
      e2: e2,
      force: {
        x0: -dx*0.5,
        y0: -dy*0.5, 
        x: 0,
        y: 0,
      },
      posEnd: {
        x: x0 + r * Math.cos(a),
        y: y0 + r * Math.sin(a)
      },
      s0: 13 + 13 * Math.random(),
      pos: {x: 0, y: 0},
      s: 0,
      tl: null,
      index: index,
    }


    gsap.to(c, c.dur * 0.2, {s: c.s0, ease: Power2.easeOut, onComplete: function(){
    	 gsap.to(c, c.dur * 0.8, {s: 0, ease: Power1.easeIn});
    }});

    c.tl = gsap.to(c, c.dur, {live: 1, ease: Linear.easeNone, onStart: function(){  //Power1.easeOut
      c.active = true;
    }, onComplete: function(){
      c.active = false;
      if(!ddef.adEnd) createCircle( index );
    }})

    ddef.circles.list[ index ] = c;
  }

  function calc(d, index, mode){
    d.force.x += d.force.x0;
    d.force.y += d.force.y0;
    d.force.x0 *= 0.98;
    d.force.y0 *= 0.98;

    if(mode == 0){
      var val = d.live;
      var v1 = d.e1(val);
      var v2 = d.e2(val);
      d.pos.x = d.posStart.x + (d.posEnd.x - d.posStart.x) * (v1);
      d.pos.y = d.posStart.y + (d.posEnd.y - d.posStart.y) * (v2);
    } else {
    }
  }


  function draw(d, index, mode){
    var x = d.pos.x + d.force.x;
    var y = d.pos.y + d.force.y;

    ddef.ctx.fillStyle = d.color;

	ddef.ctx.beginPath();
	ddef.ctx.rect(x, y, d.s, d.s);
	ddef.ctx.fill();

    // console.log("draw", d.force.x)
  }

  function loop()
  {
    requestAnimFrame(loop);
    ddef.ctx.clearRect(0, 0, ddef.screen.w, ddef.screen.h)

    if( !ddef.closed ) {
      dragLoop();
    } 

    particleLoop();
    boxLoop();
  }

  function prepBox(){
  	var w = ddef.box.w;
  	var h = ddef.box.h;
  	var v_amm = Math.round( 6 + 6 * Math.random() )
  	var h_left = h;
  	var h_sum = 0;

  	CustomEase.create("nEase", 
  	"M0,0,C0.242,0,0.241,-0.68,0.358,-0.652,0.786,-0.548,0.94,0.891,1,1");
  	ddef.nEase = gsap.parseEase("nEase");
  	CustomEase.create("nEase2", 
  	"M0,0,C0.128,0.572,0.311,1.416,0.566,1.49,0.726,1.536,0.786,1,1,1");
  	ddef.nEase2 = gsap.parseEase("nEase2");

  	CustomEase.create("pEase", 
  	"M0,0,C0.322,0,0.359,0.377,0.488,0.704,0.554,0.871,0.648,1.129,0.77,1.144,0.854,1.154,0.886,1,1,1");
  	ddef.pEase = gsap.parseEase("pEase");

  	CustomEase.create("pEase2", 
  	"M0,0 C0.24,0 0.331,0.03 0.418,0.154 0.568,0.368 0.607,0.901 0.778,1.01 0.888,1.08 0.94,1 1,1 ");
  	ddef.pEase2 = gsap.parseEase("pEase2");

  	CustomEase.create("custom", "M0,0,C0.247,0,0.378,0.174,0.548,0.388,0.742,0.633,0.758,1,1,1");

  	var count = 0;

  	for(var i=0; i<v_amm; i++){

  		var h_cur = h_left / (v_amm - i) * ( 0.5+1*Math.random() );
  		if(i==v_amm-1) h_cur = h - h_sum;
  		h_left += -h_cur;

  		var h_amm = Math.round( 4 + 4 * Math.random() )
  		var w_left = w;
  		var w_sum = 0;
  		for(var j=0; j<h_amm; j++){
	  		var w_cur = w_left / (h_amm - j) * ( 0.5+1*Math.random() );
	  		if(j==h_amm-1) w_cur = w - w_sum;
	  		w_left += -w_cur;
  			// console.log(w_cur);
  			createBox( {count: count, i: i, j: j, w: w_cur, h: h_cur, x: w_sum, y: h_sum } );
  			w_sum += w_cur;
  			count++;
  		}
  		h_sum += h_cur;
  	}
  }

  function createBox(d)
  {
  	var dx = - d.x + ddef.w*0.4;
  	var dy = ddef.h*0.4 -d.y;
  	var rot = 10 * (0.5 - Math.random());

  	var box = {
  		x: d.x,
  		y: d.y,
  		dx: dx,
  		dy: dy,
  		w: d.w,
  		h: d.h,
  		life: 0,
  		active: false,
  		tl: null,
  		s: 0,
  		r: rot,
  		img_id: ddef.box.cur,
  		img_changed: false,
  	}

  	var dur = 0.3 + 0.7 * Math.random();
  	dur = 0.7 * (0.8 + 0.2 * Math.random());

  	var ease = "back.in";
  	var x = d.x + d.w/2;
  	var y = d.y + d.h/2;
  	var dist = Math.sqrt( Math.pow(x-ddef.w/2, 2) + Math.pow(y-ddef.h/2, 2) );
  	var delay = dist/ddef.w;

	ddef.points.push({x: x, y: y});

  	box.tl = gsap.to(box, dur, {delay: delay, life: 1, ease: "none", onStart: function(){
  		box.active = true;
  	}, onUpdate: function(ev){
  		var val = this.targets()[0].life;
  		var v1 = ddef.nEase( 1 - val )
  		var v1b = ddef.nEase2( 1 - val )
  		var v2 = Back.easeIn( 1 - val )

  		box.s = Power0.easeNone( val*1 );
  		if(box.s > 1) box.s = 1;

  		box.r = rot * Power1.easeOut( 1 - val );
  		box.dx = dx * v1;
  		box.dy = dy * v1;
  	}})

  	ddef.box.list.push( box );
  }

  function drawPoints(){
  	for(var i=0; i<ddef.points.length; i++){
  		var p = ddef.points[i];
		ddef.ctx.beginPath();
		ddef.ctx.rect(p.x, p.y, 10, 10);
		ddef.ctx.stroke();
  	}
  }

  function explodeAd(mode){
  	for(var i=0; i<ddef.box.list.length; i++){
	  	explodeBox(i, mode);
  	}
  }

  function explodeBox(i, mode){

  	var dx = - 1 * ddef.screen.w * Math.random() + (1-ddef.screen.x/ddef.screen.w)*ddef.screen.w;
  	var dy = - 1 * ddef.screen.h * Math.random() + (1-ddef.screen.y/ddef.screen.h)*ddef.screen.h;
  	var r = 5*(0.5 - Math.random())

	var dur = 0.3 + 0.3 * Math.random();

	if(mode != "close")
  {

		var item = ddef.box.list[i];
		explodeAnim( item );

	} else {
	  	clearInterval( ddef.animInt );
		var dur = 0.5 + 0.5 * Math.random();
		gsap.to(ddef.box.list[i], dur, { dx: dx, dy: dy, r: r, s: 0, ease: Power3.easeOut, onComplete: function(){
	  		ddef.box.list[i].active = false;
	  	} })
	}
  }


  function explodeAnim( item ){
  	var dur = 0.35 + 0.1 * Math.random();
  	var counter = {val: 0};

	var cx = ddef.screen.x + ddef.w/2;
	var cy = ddef.screen.y + ddef.h/2;

	var x = ddef.screen.x + item.x + item.w/2;
	var y = ddef.screen.y + item.y + item.h/2;

	var dx = x - cx;
	var dy = y - cy;

	var xSign = Math.sign(dx);
	var ySign = Math.sign(dy);
	var dist = Math.sqrt( dx*dx + dy*dy );
	var pwr = 900 / dist;
	if(pwr > 30) pwr = 30;

	var delay = 1/pwr;

	var rx = 100 * ( 0.5 - Math.random() )
	var ry = 100 * ( 0.5 - Math.random() )

	var nx = xSign * ( pwr + 100 ) + rx;
	var ny = ySign * ( pwr + 100 ) + ry;

	var r = 10 * ( 0.5 - Math.random() );


  	gsap.to(counter, dur, {delay: delay, val: 1, ease: "power1.out", onUpdate: function(){

  		var val = counter.val;

  		item.dx = nx * val;
  		item.dy = ny * val;

  		item.r = r * val;

  	}, onComplete: function(){
  		var sign = Math.sign(r);
  		var nr = r + sign * 10 * (0.5 + 0.5 * Math.random())
  		var deg = nr * 180 / Math.PI;
  		var dal = deg % 360;
  		var ndeg = deg - dal;
  		var nrad = ndeg * Math.PI / 180;
  		// console.log( nrad )
  		gsap.to(item, dur*0.8, {dx: 0, dy: 0, r: nrad, ease: "custom", onUpdate: function(){
			if( !item.img_changed && this.ratio > 0.5 ){
				item.img_id++;
				if(item.img_id >= bgs.length) item.img_id = 0;
				item.img_changed = true;
			}
  		}, onComplete: function(){
	  		item.img_changed = false;
  		}});
  	}})
  }

  function boxLoop()
  {

  	for(var i=0; i<ddef.box.list.length; i++){
  		if(ddef.box.list[i].active){
	  		var d = ddef.box.list[i];

	  		var cx = d.w/2*(1-d.s);
	  		var cy = d.h/2*(1-d.s);

	  		var w = d.w;
	  		var h = d.h;

	  		var x = d.x + ddef.screen.x + cx + d.dx;
	  		var y = d.y + ddef.screen.y + cy + d.dy;

	  		var xs = d.x;
	  		var ys = d.y;

	  		var s = 1;

	  		ddef.ctx.setTransform(d.s, 0, 0, d.s, x+d.w/2, y+d.h/2); 
	    	ddef.ctx.rotate(d.r);

	  		ddef.ctx.drawImage(ddef.box.imgs[d.img_id], xs*s, ys*s, w*s, h*s, -d.w/2, -d.h/2, w, h)
	  	}

  	}
  	ddef.ctx.setTransform(1,0,0,1,0,0); 		
  }

  function dragLoop(){
    ddef.drag.dx = ddef.drag.lx - ddef.drag.x;
    ddef.drag.dy = ddef.drag.ly - ddef.drag.y;
    ddef.drag.lx = ddef.drag.x;
    ddef.drag.ly = ddef.drag.y;

    var maxRot = 30;
    ddef.can.rot = ddef.drag.dx;
    var dr = ddef.can.rot - ddef.can.drot;
    ddef.can.drot += dr/2;
    var rot = ddef.can.drot;

    if(rot > maxRot) rot = maxRot;
    if(rot < -maxRot) rot = -maxRot;

    var val = rot/maxRot;
    var sign = Math.sign(val);
    var ease = Power1.easeIn( Math.abs(val) );
    var res = maxRot * ease * sign;
    //
    gsap.set(o.wrapper, {rotation: res})

    // get x y of can
    var style = getComputedStyle( o.container );
    var l = parseFloat( style.getPropertyValue("left") );
    var t = parseFloat( style.getPropertyValue("top") );
    ddef.screen.x = l;
    ddef.screen.y = t;
  }

  function particleLoop(){

    // calc and draw circles
    for(var i=0; i<ddef.circles.list.length; i++){
      if( ddef.circles.list[i].active ){
        var d = ddef.circles.list[i];
        calc(d, i, 0);
        draw(d, i, 0);
      }
    }

    // calc and draw circles #2
    for(var i=0; i<ddef.circles2.list.length; i++){
      if( ddef.circles2.list[i].active ){
        var d = ddef.circles2.list[i];
        calc(d, i, 1);
        draw(d, i, 1);
      }
    }
  }


/////////////////////// D R A G /////////////////////////////



  /// DRAG ///

  function initDrag(){
    var dragAmm = 0;
    var dex = 0;
    var dey = 0;
    var cx = 0;
    var cy = 0;
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    // dragElement( o.container );
    dragElement( o.dragEl );

    function dragElement(elmnt) {
        elmnt.onmousedown = dMouseDown;
        // var el = o.container;
        var el = elmnt;
        el.ontouchstart = dTouchDown;

      function dMouseDown(e){
        e = e || _window.event;
        e.preventDefault();
        gsap.to(o.sc_wrapper, 0.2, {scale: 1.1, ease: Power1.easeOut})

        pos3 = e.clientX;
        pos4 = e.clientY;

        dragMouseDown(e);
      }
      function dTouchDown(e){
        e = e || _window.event;
        e.preventDefault();

        gsap.to(o.sc_wrapper, 0.2, {scale: 1.1, ease: Power1.easeOut})

        pos3 = e.touches[0].clientX;
        pos4 = e.touches[0].clientY;

        dragMouseDown(e);
      }

      function dragMouseDown(e) {
        dragAmm = 0;
        _document.onmouseup = closeDragElement;
        _document.ontouchend = closeDragElement;
        _document.onmousemove = mouseDrag;
        _document.ontouchmove = touchDrag;
      }

      function mouseDrag(e){
        e = e || _window.event;
        // e.preventDefault();
        elementDrag(e, true);
      }

      function touchDrag(e){
        e.stopImmediatePropagation();
        
        elementDrag(e, false);

      }

      var sPos = {x: 0, y: 0};
      var cPos = {x: 0, y: 0};

      function elementDrag(e, isMouse) {
        dragAmm++;
        var clientX = (isMouse) ? e.clientX : e.touches[0].clientX;
        var clientY = (isMouse) ? e.clientY : e.touches[0].clientY;

        pos1 = pos3 - clientX;
        pos2 = pos4 - clientY;
        pos3 = clientX;
        pos4 = clientY;

        cPos.x += sPos.x - pos1;
        cPos.y += sPos.y - pos2;

        var x = cPos.x;
        var y = cPos.y;

        ddef.drag.x = x;
        ddef.drag.y = y;
        var yy = ddef.topY;
        o.container.style.right = 14-x + "px";
        o.container.style.top = yy+y + "px";
      }

      function closeDragElement(e) {
        if(dragAmm <= 2 && click == 0){
          // console.log("CTA")

          ddef.box.cur++;
          	ctaFunction();

          click = 1;
          setTimeout(function(){ click = 0 }, 1000)
        } else {
        	if(click == 0){
          		// startEvent("drag");
        	}
        }

        gsap.to(o.sc_wrapper, 0.25, {scale: 1, ease: Power1.easeOut})
        _document.onmouseup = null;
        _document.onmousemove = null;
        _document.ontouchend = null;
        _document.ontouchmove = null;

      }
      var click = 0;

    }
  }