import { phaseAt, omegaForTrack } from "../engine/orbitPhase.js";

export function drawOrbits(p, tracks, activeTrack, selectedStep, bpm, T, running, fireStepCb, fireMoonCb){
  const cx = (p.width - p._CONTENT_X)*0.55;
  const cy = 260;

  tracks.forEach((t, ti)=>{
    const R=t.radius;
    p.stroke(70); p.strokeWeight(2); p.noFill();
    p.circle(cx,cy,R*2);

    const omega = omegaForTrack(t, bpm);
    const phase = phaseAt(t, bpm, T);
    const prevT = Math.max(0, T - 1/60);
    const prevPhase = (omega*prevT + p.radians(t.orbitOffsetDeg||0))%(p.TWO_PI);

    if(running){
      for(let i=0;i<t.N;i++){
        const target=(p.TWO_PI/t.N)*i + p.radians(t.orbitOffsetDeg||0);
        if(crossed(prevPhase,phase,target)) fireStepCb(ti,i);
      }

      const m = t.moon;
      if(typeof fireMoonCb === "function" && ti===activeTrack && m && m.enabled){
        const pulsesInt = Math.floor(m.pulses||0);
        if(pulsesInt>0){
          const ratio = m.ratio || 1;
          const dir = m.direction || 1;
          const offRad = p.radians(m.trigOffsetDeg||0);
          const moonPhaseNowRaw = (phase * ratio * dir) % p.TWO_PI;
          const moonPhasePrevRaw = (prevPhase * ratio * dir) % p.TWO_PI;
          const moonPhaseNow = (moonPhaseNowRaw - offRad + p.TWO_PI)%p.TWO_PI;
          const moonPhasePrev = (moonPhasePrevRaw - offRad + p.TWO_PI)%p.TWO_PI;
          for(let k=0;k<pulsesInt;k++){
            const target = (p.TWO_PI * k)/pulsesInt;
            if(crossed(moonPhasePrev, moonPhaseNow, target)){
              fireMoonCb(ti);
              break;
            }
          }
        }
      }
    }

    for(let i=0;i<t.N;i++){
      const a=(p.TWO_PI/t.N)*i + p.radians(t.orbitOffsetDeg||0) - p.HALF_PI;
      const x=cx+R*p.cos(a), y=cy+R*p.sin(a);

      if(t.steps[i].flash>0) t.steps[i].flash--;
      const stepSize=p.map(t.steps[i].vel,0.05,1.0,8,22);

      if(!t.steps[i].on){ p.fill(30); p.stroke(90); }
      else if(t.steps[i].mute){ p.fill(50); p.stroke(140); }
      else if(t.steps[i].flash>0){ p.fill(0,255,180); p.stroke(0,255,180); }
      else { p.fill(190); p.stroke(230); }

      if(t.steps[i].picked){ p.stroke(255,120,0); p.strokeWeight(3); }
      const isActive=(ti===activeTrack);
      p.strokeWeight((isActive && i===selectedStep)?3:2);
      if(isActive && i===selectedStep) p.stroke(255,200,0);
      p.circle(x,y,stepSize);

      p.fill(t.steps[i].on?220:90); p.noStroke();
      p.textAlign(p.CENTER,p.CENTER); p.textSize(10);
      p.text(i+1,x,y-stepSize*0.9);
    }

    const phA=phase - p.HALF_PI;
    const headX = cx+R*p.cos(phA), headY = cy+R*p.sin(phA);
    p.fill(ti===activeTrack?0:80,200,255); p.noStroke();
    p.circle(headX, headY, 9);

    if(ti===activeTrack && t.moon && t.moon.enabled){
      const m = t.moon;
      const baseR = m.radius || 26;
      const pendAmt = m.radiusLfoAmt || 0;
      const pendSpd = m.radiusLfoSpeed || 0;
      const pend = pendAmt ? Math.sin(T * p.TWO_PI * pendSpd) * pendAmt : 0;
      const moonOrbitR = baseR + pend;

      const baseSize = m.size || 9;
      const sizeAmt = m.sizeLfoAmt || 0;
      const sizeSpd = m.sizeLfoSpeed || 0;
      const sizeLfo = sizeAmt ? Math.sin(T * p.TWO_PI * sizeSpd + 1.3) * sizeAmt : 0;
      const moonSize = Math.max(2, baseSize + sizeLfo);

      const ratio = m.ratio || 1;
      const dir = m.direction || 1;
      const trigOff = p.radians(m.trigOffsetDeg||0);
      const moonPhase = (phase * ratio * dir) % p.TWO_PI;
      const mxDir = Math.cos(moonPhase - p.HALF_PI);
      const myDir = Math.sin(moonPhase - p.HALF_PI);
      const moonX = headX + moonOrbitR*mxDir;
      const moonY = headY + moonOrbitR*myDir;

      p.stroke(60); p.noFill();
      p.circle(headX, headY, moonOrbitR*2);
      p.stroke(120,200,255);
      p.line(headX,headY,moonX,moonY);
      p.noStroke(); p.fill(0,200,255);
      p.circle(moonX,moonY,moonSize);

      const pulsesInt = Math.floor(m.pulses||0);
      if(pulsesInt>0){
        p.stroke(180,220,255);
        for(let k=0;k<pulsesInt;k++){
          const ang = trigOff + (p.TWO_PI * k)/pulsesInt;
          const txDir = Math.cos(ang - p.HALF_PI);
          const tyDir = Math.sin(ang - p.HALF_PI);
          const r0 = moonOrbitR-5;
          const r1 = moonOrbitR+5;
          const x0 = headX + r0*txDir;
          const y0 = headY + r0*tyDir;
          const x1 = headX + r1*txDir;
          const y1 = headY + r1*tyDir;
          p.line(x0,y0,x1,y1);
        }
      }

      if(m.touchTrig){
        const d = p.dist(cx,cy,moonX,moonY);
        const onCircle = Math.abs(d - R) < 6;
        const wasOn = m._wasTouch || false;
        if(onCircle && !wasOn && typeof fireMoonCb === "function"){
          fireMoonCb(ti);
        }
        m._wasTouch = onCircle;
      }
    }
  });
}

function crossed(prev,curr,target){
  if(prev<=curr) return prev<target && target<=curr;
  return prev<target || target<=curr;
}
