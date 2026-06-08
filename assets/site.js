(function(){
  const canvas = document.getElementById('heroCanvas');
  if(!canvas) return;

  const ctx = canvas.getContext('2d');

  let w = 0;
  let h = 0;
  let dpr = 1;
  let t = 0;
  let particles = [];

  const TAU = Math.PI * 2;

  function resize(){
    dpr = Math.min(2, window.devicePixelRatio || 1);

    w = canvas.clientWidth || innerWidth;
    h = canvas.clientHeight || innerHeight;

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    particles = Array.from({length:180}, () => ({
      a: Math.random() * TAU,
      r: .05 + Math.random() * .45,
      s: .2 + Math.random() * .8,
      h: 180 + Math.random() * 180,
      p: Math.random() * TAU
    }));
  }

  function draw(){
    t += 0.006;

    ctx.clearRect(0,0,w,h);

    const cx = w / 2;
    const cy = h / 2;
    const R = Math.min(w,h) * .42;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    for(let i = 0; i < particles.length; i++){
      const p = particles[i];
      const a = p.a + t * p.s;
      const rr = R * (.14 + p.r + .035 * Math.sin(t * 3 + p.p));

      const x = cx + Math.cos(a) * rr;
      const y = cy + Math.sin(a) * rr;

      ctx.fillStyle = `hsla(${(p.h + t * 180 + i) % 360},100%,70%,.62)`;
      ctx.beginPath();
      ctx.arc(x,y,1.2 + Math.sin(t * 4 + p.p) * .6,0,TAU);
      ctx.fill();

      if(i % 3 === 0){
        ctx.strokeStyle = `hsla(${(p.h + t * 120) % 360},100%,70%,.18)`;
        ctx.lineWidth = .8;
        ctx.beginPath();
        ctx.moveTo(cx,cy);
        ctx.quadraticCurveTo(
          cx + Math.cos(a + .7) * rr * .35,
          cy + Math.sin(a + .7) * rr * .35,
          x,
          y
        );
        ctx.stroke();
      }
    }

    for(let k = 0; k < 7; k++){
      ctx.strokeStyle = `hsla(${190 + k * 28 + t * 90},100%,72%,${.08 + k * .015})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx,cy,R * (.22 + k * .105),0,TAU);
      ctx.stroke();
    }

    ctx.restore();

    requestAnimationFrame(draw);
  }

  addEventListener('resize', resize);

  resize();
  draw();
})();
