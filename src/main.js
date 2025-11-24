import { LEFT_W, CONTENT_X, DEFAULT_CANVAS_W,
         lanesY0, lanesCellW, lanesPadLeft, lanesPadRight,
         laneRows, rowH, SUBDIVS } from "./util/constants.js";
import { Transport } from "./engine/transport.js";
import { rebuildSteps, makeTrack, applyEuclid } from "./state/track.js";
import { getTargetSteps } from "./state/selection.js";
import { drawOrbits } from "./view/orbitView.js";
import { drawLanes } from "./view/lanesView.js";
import { drawVScrollbar, drawHScrollbar } from "./view/scrollbarsView.js";
import { drawLeftLabels } from "./view/leftPanelView.js";
import { createDom, refreshTrackSelect } from "./ui/domControls.js";
import { anchors, placeDom } from "./ui/domLayout.js";
import { AudioBus } from "./audio/audioBus.js";
import { fireStep, fireMoon } from "./engine/scheduler.js";

new p5((p)=>{

  let transport = new Transport();
  let audioCtx = null, bus = null;

  let tracks = [];
  let activeTrackIdx = 0;
  let selectedStep = 0;

  let leftScrollY=0, leftContentHeight=1360;
  let scrollX=0, scrollY=0, contentWidth=1200, contentHeight=1100;

  let laneDragging=false, dragRow=-1, dragStep=-1;
  let hbarDragging=false, hbarDragOffset=0, hbarGeom=null;

  let ui=null;
  let scope="Selected", rangeA=1, rangeB=8, showLanes=true;

  function ensureAudio(){
    if(!audioCtx){
      audioCtx = new (window.AudioContext||window.webkitAudioContext)();
      bus = new AudioBus(audioCtx);
      transport.attachAudioContext(audioCtx);
    }
  }

  function activeTrack(){ return tracks[activeTrackIdx]; }

  const api = {
    toggleRun(){
      ensureAudio();
      if(transport.running){
        transport.stop();
      } else {
        transport.start();
        tracks.forEach(t=>{
          t._lastPhase = undefined;
          if(t.moon) t.moon._wasTouch = false;
        });
      }
      ui.startBtn.html(transport.running? "Stop":"Start");
    },
    setBpm(v){ transport.setBpm(v); },
    setActiveTrack(i){ activeTrackIdx=i; refreshTrackSelect(ui,tracks,activeTrackIdx); syncTrackUI(); },
    addTrack(){
      const idx=tracks.length;
      const t=makeTrack(idx);
      const src = activeTrack();
      Object.assign(t, src);
      if(src.moon) t.moon = { ...src.moon };
      t.id=idx; t.radius = 210-idx*55;
      tracks.push(t);
      rebuildSteps(t, t.N); applyEuclid(t);
      activeTrackIdx=idx;
      refreshTrackSelect(ui,tracks,activeTrackIdx); syncTrackUI();
      updateContentSize();
    },
    removeTrack(){
      if(tracks.length<=1) return;
      tracks.pop();
      activeTrackIdx=Math.min(activeTrackIdx,tracks.length-1);
      refreshTrackSelect(ui,tracks,activeTrackIdx); syncTrackUI();
      updateContentSize();
    },
    setSteps(N){
      rebuildSteps(activeTrack(), N);
      ui.kSlider.attribute("max", N);
      ui.rotSlider.attribute("max", Math.max(0,N-1));
      applyEuclid(activeTrack()); syncTrackUI(); updateContentSize();
    },
    setPulses(K){ activeTrack().K=K; applyEuclid(activeTrack()); syncTrackUI(); },
    setRotate(R){ activeTrack().euclidRot=R; applyEuclid(activeTrack()); syncTrackUI(); },
    setSpeedMode(m){ activeTrack().speedMode=m; syncTrackUI(); },
    setSpeedRatio(r){ activeTrack().speedRatio=r; },
    setSubdiv(i){ activeTrack().subdivIndex=i; syncTrackUI(); },
    setVolume(v){ activeTrack().volume=v; },
    setSound(s){ activeTrack().sound=s; syncTrackUI(); },
    setOffset(o){ activeTrack().orbitOffsetDeg=o; },
    setShowLanes(v){ showLanes=v; updateContentSize(); },
    setScope(v){ scope=v; },
    setRange(a,b){ rangeA=a; rangeB=b; },
    setMoonEnabled(v){ activeTrack().moon.enabled = v; },
    setMoonRatio(v){ activeTrack().moon.ratio = v; },
    setMoonDirection(v){ activeTrack().moon.direction = v; },
    setMoonRadius(v){ activeTrack().moon.radius = v; },
    setMoonPendAmt(v){ activeTrack().moon.radiusLfoAmt = v; },
    setMoonPendSpeed(v){ activeTrack().moon.radiusLfoSpeed = v; },
    setMoonSize(v){ activeTrack().moon.size = v; },
    setMoonSizeLfo(v){ activeTrack().moon.sizeLfoAmt = v; },
    setMoonPulses(v){ activeTrack().moon.pulses = v; },
    setMoonTrigOffset(v){ activeTrack().moon.trigOffsetDeg = v; },
    setMoonTouchTrig(v){ activeTrack().moon.touchTrig = v; },
    setMoonLevel(v){ activeTrack().moon.level = v; },
    setMoonBreathDepth(v){ activeTrack().moon.breathDepth = v; },
    setMoonBreathSpeed(v){ activeTrack().moon.breathSpeed = v; },
    applyParam(key,val){
      const t=activeTrack();
      const targets=getTargetSteps(t,scope,selectedStep,rangeA-1,rangeB-1);
      targets.forEach(i=>t.steps[i][key]=val);
      syncSelectedUI();
    }
  };

  function syncTrackUI(){
    const t=activeTrack();
    ui.nSlider.value(t.N);
    ui.kSlider.value(t.K);
    ui.rotSlider.value(t.euclidRot);
    ui.speedMode.value(t.speedMode);
    ui.speedRatio.value(t.speedRatio);
    ui.subdiv.value(t.subdivIndex);
    ui.volSlider.value(t.volume);
    ui.soundSelect.value(t.sound);
    ui.offsetSlider.value(t.orbitOffsetDeg);

    if(t.moon){
      ui.moonEnabled.checked(t.moon.enabled);
      ui.moonRatio.value(t.moon.ratio);
      ui.moonDir.value(String(t.moon.direction));
      ui.moonRadius.value(t.moon.radius);
      ui.moonPendAmt.value(t.moon.radiusLfoAmt);
      ui.moonPendSpeed.value(t.moon.radiusLfoSpeed);
      ui.moonSize.value(t.moon.size);
      ui.moonSizeLfo.value(t.moon.sizeLfoAmt);
      ui.moonPulses.value(t.moon.pulses);
      ui.moonTrigOffset.value(t.moon.trigOffsetDeg);
      ui.moonTouchTrig.checked(t.moon.touchTrig);
      ui.moonLevel.value(t.moon.level);
      ui.moonBreathDepth.value(t.moon.breathDepth);
      ui.moonBreathSpeed.value(t.moon.breathSpeed);
    }

    if(t.speedMode==="hy" || t.speedMode==="physics"){
      ui.speedRatio.removeAttribute("disabled");
      ui.subdiv.attribute("disabled", true);
    } else {
      ui.speedRatio.attribute("disabled", true);
      ui.subdiv.removeAttribute("disabled");
    }

    ui.rangeStart.attribute("max", t.N);
    ui.rangeEnd.attribute("max", t.N);
    ui.rangeEnd.value(t.N);

    syncSelectedUI();
  }

  function syncSelectedUI(){
    const s=activeTrack().steps[selectedStep]; if(!s) return;
    ui.selVel.value(s.vel); ui.selPitch.value(s.pitch);
    ui.selRatchet.value(s.ratchet); ui.selRepeat.value(s.repeat);
    ui.selProb.value(s.prob); ui.selPan.value(s.pan);
    ui.selDelay.value(s.delaySend); ui.selMicro.value(s.microMs);
    ui.selSwing.value(s.swingPct);
    ui.selRandVel.value(s.randVel); ui.selRandPitch.value(s.randPitch);
    ui.selRandTime.value(s.randTimeMs);
    ui.selMute.checked(s.mute);
  }

  function updateContentSize(){
    const visibleW=p.width-CONTENT_X;
    const t=activeTrack();
    const lanesW=t.N*lanesCellW + lanesPadLeft + lanesPadRight;
    contentWidth=Math.max(visibleW, lanesW, 850);
    contentHeight= showLanes
      ? (lanesY0 + laneRows.length*rowH + 140)
      : 540;
    scrollX=p.constrain(scrollX,0,Math.max(0,contentWidth-visibleW));
    scrollY=p.constrain(scrollY,0,Math.max(0,contentHeight-p.height));
  }

  function maxLeftScrollY(){ return Math.max(0,leftContentHeight-p.height); }
  function maxScrollX(){ return Math.max(0, contentWidth-(p.width-CONTENT_X)); }
  function maxScrollY(){ return Math.max(0, contentHeight-p.height); }

  function screenToContent(mx,my){
    return { x: mx - CONTENT_X + scrollX, y: my + scrollY };
  }

  function lanesScreenY(){
    const h = laneRows.length*rowH + 20;
    const margin = 80;
    return Math.max(320, p.height - (h + margin));
  }

  function hitHbar(mx,my){
    if(!hbarGeom || !hbarGeom.ms) return false;
    const {barX,barW,barH} = hbarGeom;
    const barY=p.height-10;
    return mx>=barX && mx<=barX+barW && my>=barY && my<=barY+barH;
  }

  p.setup=()=>{
    p.createCanvas(window.innerWidth, window.innerHeight);
    p._CONTENT_X = CONTENT_X;
    tracks=[makeTrack(0)];
    rebuildSteps(tracks[0],8);
    applyEuclid(tracks[0]);

    ui=createDom(p, api);
    refreshTrackSelect(ui,tracks,activeTrackIdx);
    syncTrackUI();
    updateContentSize();
  };

  p.windowResized=()=>{
    p.resizeCanvas(window.innerWidth, window.innerHeight);
    updateContentSize();
    leftScrollY=p.constrain(leftScrollY,0,maxLeftScrollY());
  };

  p.draw=()=>{
    p.background(10);
    placeDom(ui,leftScrollY);

    const t=activeTrack();
    t.subdivName = SUBDIVS[t.subdivIndex]?.name ?? "1/16";
    drawLeftLabels(p, anchors, leftScrollY, t, transport.bpm);

    const T = transport.getT();
    tracks.forEach(tr=> tr._dt = p.deltaTime/1000);

    p.push();
    p.translate(CONTENT_X - scrollX, -scrollY);
    drawOrbits(p, tracks, activeTrackIdx, selectedStep, transport.bpm, T, transport.running,
      (ti,i)=>{
        ensureAudio();
        const tr=tracks[ti], st=tr.steps[i];
        if(audioCtx){
          bus.masterGain.gain.setTargetAtTime(tr.volume, audioCtx.currentTime, 0.01);
        } else {
          bus.masterGain.gain.value = tr.volume;
        }
        fireStep(audioCtx, bus, tr, st, i, transport.bpm);
      },
      (ti)=>{
        ensureAudio();
        const tr = tracks[ti];
        if(audioCtx){
          bus.masterGain.gain.setTargetAtTime(tr.volume, audioCtx.currentTime, 0.02);
        }
        fireMoon(audioCtx, bus, tr, transport.bpm);
      }
    );
    p.pop();

    if(showLanes){
      const ly = lanesScreenY();
      p.push();
      p.translate(CONTENT_X - scrollX, 0);
      drawLanes(p, activeTrack(), selectedStep, lanesPadLeft, ly);
      p.pop();
    }

    drawVScrollbar(p, LEFT_W-8, leftContentHeight, p.height, leftScrollY);
    drawVScrollbar(p, p.width-10, contentHeight, p.height, scrollY);
    hbarGeom = drawHScrollbar(p, CONTENT_X, p.height-10, contentWidth, p.width-CONTENT_X, scrollX);
  };

  p.mouseWheel=(e)=>{
    if(p.mouseX<LEFT_W){
      leftScrollY=p.constrain(leftScrollY+e.deltaY,0,maxLeftScrollY());
    } else {
      if(p.keyIsDown(p.SHIFT)) scrollX=p.constrain(scrollX+e.deltaY,0,maxScrollX());
      else scrollY=p.constrain(scrollY+e.deltaY,0,maxScrollY());
    }
    return false;
  };

  p.mousePressed=()=>{
    ensureAudio();
    if(hitHbar(p.mouseX,p.mouseY)){
      hbarDragging=true; hbarDragOffset=p.mouseX-hbarGeom.barX; return;
    }
    if(p.mouseX<CONTENT_X) return;

    const {x:mx,y:my}=screenToContent(p.mouseX,p.mouseY);

    const cx=(p.width-CONTENT_X)*0.55, cy=260;
    const d=p.dist(mx,my,cx,cy);
    let nearest=-1,best=1e9;
    for(let ti=0;ti<tracks.length;ti++){
      const diff=Math.abs(d-tracks[ti].radius);
      if(diff<best){best=diff; nearest=ti;}
    }
    if(nearest>=0){
      const tr=tracks[nearest];
      for(let i=0;i<tr.N;i++){
        const a=(p.TWO_PI/tr.N)*i + p.radians(tr.orbitOffsetDeg||0) - p.HALF_PI;
        const x=cx+tr.radius*p.cos(a), y=cy+tr.radius*p.sin(a);
        if(p.dist(mx,my,x,y)<20){
          activeTrackIdx=nearest; refreshTrackSelect(ui,tracks,activeTrackIdx); syncTrackUI();
          if(p.keyIsDown(p.ALT)) tr.steps[i].picked=!tr.steps[i].picked;
          else if(p.keyIsDown(p.SHIFT)) tr.steps[i].mute=!tr.steps[i].mute;
          else { tr.steps[i].on=!tr.steps[i].on; selectedStep=i; syncSelectedUI(); }
          return;
        }
      }
    }

    if(showLanes){
      const tr=activeTrack();
      const ly = lanesScreenY();
      const x0Screen = CONTENT_X - scrollX + lanesPadLeft;
      const w=tr.N*lanesCellW, h=laneRows.length*rowH;
      if(p.mouseX>=x0Screen && p.mouseX<=x0Screen+w && p.mouseY>=ly && p.mouseY<=ly+h){
        const i=Math.floor((p.mouseX-x0Screen)/lanesCellW);
        const r=Math.floor((p.mouseY-ly)/rowH);
        selectedStep=i; syncSelectedUI();
        if(p.keyIsDown(p.ALT)){ tr.steps[i].picked=!tr.steps[i].picked; return; }
        laneDragging=true; dragRow=r; dragStep=i;
        const mxLane = p.mouseX - CONTENT_X + scrollX;
        editLane(mxLane,p.mouseY);
        return;
      }
    }
  };

  p.mouseDragged=()=>{
    if(hbarDragging && hbarGeom && hbarGeom.ms){
      const {minX,maxX,barW,ms} = hbarGeom;
      const newBarX=p.constrain(p.mouseX-hbarDragOffset,minX,maxX);
      const tt=(newBarX-minX)/(maxX-minX);
      scrollX=tt*ms;
      return;
    }
    if(laneDragging){
      const mxLane = p.mouseX - CONTENT_X + scrollX;
      editLane(mxLane,p.mouseY);
    }
  };

  p.mouseReleased=()=>{
    hbarDragging=false; laneDragging=false; dragRow=-1; dragStep=-1;
  };

  function editLane(mx,my){
    const tr=activeTrack();
    const row=laneRows[dragRow], st=tr.steps[dragStep];
    if(!row || !st || row.type==="toggle") return;
    const x0=lanesPadLeft + dragStep*lanesCellW;
    const pr=p.constrain((mx-x0)/lanesCellW,0,1);
    let v=p.lerp(row.min,row.max,pr);
    if(row.type==="int") v=Math.round(v);
    st[row.key]=v;
    syncSelectedUI();
  }

});
