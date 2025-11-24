export function synthDrum(ctx, bus, kind, t0, vel, pitchSemi, panVal, delaySend, gateSec){
  const tone = Math.pow(2, pitchSemi/12);
  const panner = ctx.createStereoPanner();
  panner.pan.setValueAtTime(panVal, t0);

  const dry = ctx.createGain(); dry.gain.setValueAtTime(1.0, t0);
  const send = ctx.createGain(); send.gain.setValueAtTime(delaySend, t0);

  dry.connect(panner); panner.connect(bus.masterGain);
  send.connect(bus.delayNode);

  if(kind==="kick"){
    const osc = ctx.createOscillator(); const g = ctx.createGain();
    osc.type="sine";
    osc.frequency.setValueAtTime(90*tone, t0);
    osc.frequency.exponentialRampToValueAtTime(40*tone, t0+0.12);
    g.gain.setValueAtTime(0.9*vel, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0+0.18);
    osc.connect(g); g.connect(dry); g.connect(send);
    osc.start(t0); osc.stop(t0+0.25);
  } else if(kind==="snare"){
    const osc = ctx.createOscillator(); const g = ctx.createGain();
    osc.type="triangle"; osc.frequency.setValueAtTime(220*tone, t0);
    g.gain.setValueAtTime(0.25*vel, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0+0.10);
    osc.connect(g); g.connect(dry); g.connect(send);
    osc.start(t0); osc.stop(t0+0.12);
    noiseBurst(ctx, t0, 0.4*vel, 0.08, dry, send);
  } else if(kind==="hat"){
    noiseBurst(ctx, t0, 0.25*vel, 0.04, dry, send);
  } else if(kind==="moon"){
    const dur = Math.max(0.15, Math.min(0.6, gateSec || 0.35));
    const sz = Math.floor(ctx.sampleRate*dur);
    const buf = ctx.createBuffer(1, sz, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for(let i=0;i<sz;i++){
      const t = i/(sz-1 || 1);
      const env = Math.exp(-3*t);
      data[i] = (Math.random()*2-1)*env;
    }
    const src = ctx.createBufferSource(); src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(800*tone, t0);
    bp.Q.setValueAtTime(1.5, t0);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.35*vel, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0+dur);
    src.connect(bp); bp.connect(g); g.connect(dry); g.connect(send);
    src.start(t0); src.stop(t0+dur);
  } else {
    const osc = ctx.createOscillator(); const g = ctx.createGain();
    osc.type="square"; osc.frequency.setValueAtTime(500*tone, t0);
    g.gain.setValueAtTime(0.3*vel, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0+gateSec);
    osc.connect(g); g.connect(dry); g.connect(send);
    osc.start(t0); osc.stop(t0+gateSec);
  }
}

function noiseBurst(ctx, t0, amp, dur, dry, send){
  const sz = Math.floor(ctx.sampleRate*dur);
  const buf = ctx.createBuffer(1, sz, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for(let i=0;i<sz;i++) data[i]=Math.random()*2-1;
  const src = ctx.createBufferSource(); src.buffer=buf;
  const g = ctx.createGain();
  g.gain.setValueAtTime(amp, t0);
  g.gain.exponentialRampToValueAtTime(0.001, t0+dur);
  src.connect(g); g.connect(dry); g.connect(send);
  src.start(t0); src.stop(t0+dur);
}
