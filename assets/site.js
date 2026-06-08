(function(){
  const TAU = Math.PI * 2;

  function setupCanvas(canvas, mode){
    if(!canvas) return;

    const ctx = canvas.getContext('2d');

    let w = 0;
    let h = 0;
    let dpr = 1;
    let t = 0;
    let pts = [];

    function resize(){
      dpr = Math.min(2, window.devicePixelRatio || 1);

      w = canvas.clientWidth || innerWidth;
      h = canvas.clientHeight || innerHeight;

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);

      ctx.setTransform(dpr,0,0,dpr,0,0);

      pts = Array.from({length: mode === 'holo' ? 150 : 230}, () => ({
        a: Math.random() * TAU,
        r: .08 + Math.random() * .48,
        s: .18 + Math.random() * .76,
        hue: 170 + Math.random() * 210,
        p: Math.random() * TAU
      }));
    }

    function miniPhoton(x,y,s,hue,alpha){
      ctx.save();
      ctx.translate(x,y);
      ctx.rotate(t * 1.2 + hue);
      ctx.globalCompositeOperation = 'lighter';

      const g = ctx.createRadialGradient(0,0,0,0,0,s*4);

      g.addColorStop(0,'rgba(255,255,255,.95)');
      g.addColorStop(.22,`hsla(${hue},100%,78%,${alpha})`);
      g.addColorStop(.55,`hsla(${hue+80},100%,65%,${alpha*.35})`);
      g.addColorStop(1,'rgba(0,0,0,0)');

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0,0,s*4,0,TAU);
      ctx.fill();

      for(let i=1;i<=3;i++){
        ctx.strokeStyle = `hsla(${hue+i*50},100%,75%,${alpha*.32})`;
        ctx.lineWidth = .55;
        ctx.beginPath();
        ctx.arc(0,0,s*(.8+i*.8),0,TAU);
        ctx.stroke();
      }

      for(let p=0;p<6;p++){
        const a = p * TAU / 6;

        ctx.strokeStyle = `hsla(${hue+p*40},100%,75%,${alpha*.22})`;
        ctx.beginPath();
        ctx.arc(Math.cos(a)*s,Math.sin(a)*s,s*.85,0,TAU);
        ctx.stroke();
      }

      ctx.restore();
    }

    function draw(){
      t += .006;

      ctx.clearRect(0,0,w,h);

      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w,h) * (mode === 'holo' ? .43 : .50);

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      const aura = ctx.createRadialGradient(cx,cy,0,cx,cy,R*1.25);

      aura.addColorStop(0,'rgba(255,226,87,.10)');
      aura.addColorStop(.2,'rgba(71,247,255,.13)');
      aura.addColorStop(.5,'rgba(101,255,144,.08)');
      aura.addColorStop(.78,'rgba(255,62,207,.08)');
      aura.addColorStop(1,'rgba(0,0,0,0)');

      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(cx,cy,R*1.25,0,TAU);
      ctx.fill();

      for(let k=0;k<8;k++){
        ctx.strokeStyle = `hsla(${185+k*30+t*80},100%,70%,${.08+k*.014})`;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.arc(cx,cy,R*(.16+k*.105),0,TAU);
        ctx.stroke();
      }

      for(let i=0;i<12;i++){
        const a = -Math.PI/2 + i * TAU / 12 + t * .08;

        ctx.strokeStyle = `hsla(${i*30+t*90},100%,75%,.16)`;
        ctx.beginPath();
        ctx.moveTo(cx,cy);
        ctx.lineTo(cx+Math.cos(a)*R*.96,cy+Math.sin(a)*R*.96);
        ctx.stroke();
      }

      for(let i=0;i<pts.length;i++){
        const p = pts[i];
        const outward = (Math.sin(t*p.s+p.p)+1)/2;
        const a = p.a + t * p.s * .18;
        const rr = R * (.08 + p.r * outward);

        const x = cx + Math.cos(a) * rr;
        const y = cy + Math.sin(a) * rr;

        if(i % 2 === 0){
          ctx.strokeStyle = `hsla(${p.hue+t*120},100%,70%,.12)`;
          ctx.lineWidth = .7;

          ctx.beginPath();
          ctx.moveTo(cx,cy);
          ctx.quadraticCurveTo(
            cx + Math.cos(a+.9) * rr * .38,
            cy + Math.sin(a+.9) * rr * .38,
            x,
            y
          );
          ctx.stroke();
        }

        miniPhoton(x,y,mode === 'holo' ? 2.1 : 1.25,p.hue+t*160,.62);
      }

      for(let i=0;i<12;i++){
        const a = -Math.PI/2 + (i+.5) * TAU / 12 - t * .03;

        const glyph = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'][i];

        ctx.font = `${Math.max(18,R*.07)}px Georgia`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = `hsla(${i*30+t*60},100%,78%,.62)`;
        ctx.fillText(glyph,cx+Math.cos(a)*R*.92,cy+Math.sin(a)*R*.92);
      }

      const core = ctx.createRadialGradient(cx,cy,0,cx,cy,R*.11);

      core.addColorStop(0,'rgba(255,255,255,.98)');
      core.addColorStop(.28,'rgba(255,226,87,.92)');
      core.addColorStop(.72,'rgba(71,247,255,.20)');
      core.addColorStop(1,'rgba(0,0,0,0)');

      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx,cy,R*.12,0,TAU);
      ctx.fill();

      ctx.restore();

      requestAnimationFrame(draw);
    }

    addEventListener('resize',resize);

    resize();
    draw();
  }

  setupCanvas(document.getElementById('ambientCanvas'),'ambient');
  setupCanvas(document.getElementById('holoCanvas'),'holo');
})();
