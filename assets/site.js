(function(){
  const TAU = Math.PI * 2;

  function setupAmbient(){
    const canvas = document.getElementById('ambientCanvas');
    if(!canvas) return;

    const ctx = canvas.getContext('2d');

    let w = 0;
    let h = 0;
    let dpr = 1;
    let t = 0;
    let particles = [];

    function resize(){
      dpr = Math.min(2, window.devicePixelRatio || 1);

      w = window.innerWidth;
      h = window.innerHeight;

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);

      ctx.setTransform(dpr,0,0,dpr,0,0);

      particles = Array.from({length:220}, () => ({
        a:Math.random()*TAU,
        r:.05+Math.random()*.55,
        s:.12+Math.random()*.70,
        hue:170+Math.random()*220,
        p:Math.random()*TAU
      }));
    }

    function drawMiniRosace(x,y,s,hue,alpha){
      ctx.save();
      ctx.translate(x,y);
      ctx.rotate(t*.9+hue);
      ctx.globalCompositeOperation = 'lighter';

      const g = ctx.createRadialGradient(0,0,0,0,0,s*5);

      g.addColorStop(0,'rgba(255,255,255,.96)');
      g.addColorStop(.22,`hsla(${hue},100%,78%,${alpha})`);
      g.addColorStop(.56,`hsla(${hue+80},100%,66%,${alpha*.35})`);
      g.addColorStop(1,'rgba(0,0,0,0)');

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0,0,s*5,0,TAU);
      ctx.fill();

      for(let i=1;i<=3;i++){
        ctx.strokeStyle = `hsla(${hue+i*50},100%,75%,${alpha*.30})`;
        ctx.lineWidth = .55;
        ctx.beginPath();
        ctx.arc(0,0,s*(.8+i*.85),0,TAU);
        ctx.stroke();
      }

      for(let p=0;p<6;p++){
        const a = p * TAU / 6;

        ctx.strokeStyle = `hsla(${hue+p*40},100%,75%,${alpha*.22})`;
        ctx.beginPath();
        ctx.arc(Math.cos(a)*s,Math.sin(a)*s,s*.86,0,TAU);
        ctx.stroke();
      }

      ctx.restore();
    }

    function draw(){
      t += .006;

      ctx.clearRect(0,0,w,h);

      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w,h) * .55;

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      const aura = ctx.createRadialGradient(cx,cy,0,cx,cy,R*1.22);

      aura.addColorStop(0,'rgba(255,215,90,.09)');
      aura.addColorStop(.22,'rgba(72,245,255,.12)');
      aura.addColorStop(.50,'rgba(120,255,159,.08)');
      aura.addColorStop(.78,'rgba(255,85,203,.08)');
      aura.addColorStop(1,'rgba(0,0,0,0)');

      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(cx,cy,R*1.22,0,TAU);
      ctx.fill();

      for(let k=0;k<9;k++){
        ctx.strokeStyle = `hsla(${185+k*27+t*70},100%,70%,${.055+k*.010})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx,cy,R*(.16+k*.10),0,TAU);
        ctx.stroke();
      }

      for(let i=0;i<particles.length;i++){
        const p = particles[i];
        const pulse = (Math.sin(t*p.s+p.p)+1)/2;
        const a = p.a + t*p.s*.18;
        const rr = R*(.08+p.r*pulse);

        const x = cx + Math.cos(a)*rr;
        const y = cy + Math.sin(a)*rr;

        if(i%2===0){
          ctx.strokeStyle = `hsla(${p.hue+t*110},100%,70%,.10)`;
          ctx.lineWidth = .65;

          ctx.beginPath();
          ctx.moveTo(cx,cy);
          ctx.quadraticCurveTo(
            cx + Math.cos(a+.9)*rr*.38,
            cy + Math.sin(a+.9)*rr*.38,
            x,
            y
          );
          ctx.stroke();
        }

        drawMiniRosace(x,y,1.35,p.hue+t*130,.55);
      }

      ctx.restore();

      requestAnimationFrame(draw);
    }

    window.addEventListener('resize',resize);

    resize();
    draw();
  }

  function setupHeliosPanels(){
    const canvases = document.querySelectorAll('.helios-canvas');
    if(!canvases.length) return;

    canvases.forEach(canvas => {
      const ctx = canvas.getContext('2d');

      let w = 0;
      let h = 0;
      let dpr = 1;
      let t = 0;
      let points = [];

      const mode = canvas.dataset.mode || 'default';

      function resize(){
        const box = canvas.getBoundingClientRect();

        dpr = Math.min(2, window.devicePixelRatio || 1);

        w = Math.max(320, box.width);
        h = Math.max(320, box.height);

        canvas.width = Math.floor(w*dpr);
        canvas.height = Math.floor(h*dpr);

        ctx.setTransform(dpr,0,0,dpr,0,0);

        points = Array.from({length: mode === 'science' ? 150 : 190}, () => ({
          a:Math.random()*TAU,
          r:.10+Math.random()*.48,
          s:.12+Math.random()*.72,
          hue:170+Math.random()*220,
          p:Math.random()*TAU
        }));
      }

      function drawPhoton(x,y,s,hue,alpha){
        ctx.save();
        ctx.translate(x,y);
        ctx.rotate(t+hue);
        ctx.globalCompositeOperation = 'lighter';

        const glow = ctx.createRadialGradient(0,0,0,0,0,s*5);
        glow.addColorStop(0,'rgba(255,255,255,.98)');
        glow.addColorStop(.25,`hsla(${hue},100%,76%,${alpha})`);
        glow.addColorStop(.65,`hsla(${hue+95},100%,66%,${alpha*.28})`);
        glow.addColorStop(1,'rgba(0,0,0,0)');

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0,0,s*5,0,TAU);
        ctx.fill();

        for(let i=1;i<=4;i++){
          ctx.strokeStyle = `hsla(${hue+i*38},100%,75%,${alpha*.25})`;
          ctx.lineWidth = .6;
          ctx.beginPath();
          ctx.arc(0,0,s*(.6+i*.78),0,TAU);
          ctx.stroke();
        }

        for(let p=0;p<8;p++){
          const a = p * TAU / 8;

          ctx.strokeStyle = `hsla(${hue+p*28},100%,75%,${alpha*.18})`;
          ctx.beginPath();
          ctx.moveTo(0,0);
          ctx.lineTo(Math.cos(a)*s*3.4,Math.sin(a)*s*3.4);
          ctx.stroke();
        }

        ctx.restore();
      }

      function draw(){
        t += .007;

        ctx.clearRect(0,0,w,h);

        const cx = w/2;
        const cy = h/2;
        const R = Math.min(w,h)*.42;

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        const bg = ctx.createRadialGradient(cx,cy,0,cx,cy,R*1.5);
        bg.addColorStop(0,'rgba(255,215,90,.12)');
        bg.addColorStop(.22,'rgba(72,245,255,.18)');
        bg.addColorStop(.50,'rgba(120,255,159,.10)');
        bg.addColorStop(.78,'rgba(255,85,203,.10)');
        bg.addColorStop(1,'rgba(0,0,0,0)');

        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.arc(cx,cy,R*1.5,0,TAU);
        ctx.fill();

        for(let k=0;k<12;k++){
          ctx.strokeStyle = `hsla(${180+k*25+t*80},100%,72%,${.07+k*.010})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(cx,cy,R*(.14+k*.07),0,TAU);
          ctx.stroke();
        }

        for(let i=0;i<12;i++){
          const a = -Math.PI/2 + i*TAU/12 + t*.05;

          ctx.strokeStyle = `hsla(${i*30+t*70},100%,75%,.16)`;
          ctx.beginPath();
          ctx.moveTo(cx,cy);
          ctx.lineTo(cx+Math.cos(a)*R*.96,cy+Math.sin(a)*R*.96);
          ctx.stroke();
        }

        for(let i=0;i<points.length;i++){
          const p = points[i];
          const pulse = (Math.sin(t*p.s+p.p)+1)/2;
          const a = p.a + t*p.s*.20;
          const rr = R*(.12+p.r*pulse);

          const x = cx + Math.cos(a)*rr;
          const y = cy + Math.sin(a)*rr;

          if(i%3===0){
            ctx.strokeStyle = `hsla(${p.hue+t*95},100%,70%,.15)`;
            ctx.beginPath();
            ctx.moveTo(cx,cy);
            ctx.quadraticCurveTo(
              cx + Math.cos(a+.8)*rr*.45,
              cy + Math.sin(a+.8)*rr*.45,
              x,
              y
            );
            ctx.stroke();
          }

          drawPhoton(x,y,1.8,p.hue+t*120,.62);
        }

        const core = ctx.createRadialGradient(cx,cy,0,cx,cy,R*.14);
        core.addColorStop(0,'rgba(255,255,255,.98)');
        core.addColorStop(.25,'rgba(255,215,90,.95)');
        core.addColorStop(.68,'rgba(72,245,255,.28)');
        core.addColorStop(1,'rgba(0,0,0,0)');

        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(cx,cy,R*.14,0,TAU);
        ctx.fill();

        ctx.restore();

        requestAnimationFrame(draw);
      }

      window.addEventListener('resize',resize);

      resize();
      draw();
    });
  }

  setupAmbient();
  setupHeliosPanels();
})();
