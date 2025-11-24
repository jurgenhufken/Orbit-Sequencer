export function drawLeftLabels(p, anchors, leftScrollY, track, bpm){
  p.push();
  p.fill(220); p.noStroke(); p.textAlign(p.LEFT,p.TOP); p.textSize(14);
  p.text("Orbit Sequencer v4.1 (C-mode)",20,2);
  p.fill(180); p.textSize(12);

  function L(key, txt, val){
    const y = anchors[key].y - leftScrollY;
    p.text(txt, 20, y);
    if(val!==undefined) p.text(String(val), 260, y+6);
  }

  L("bpm","BPM", bpm);
  L("steps","Steps (N)", track.N);
  L("pulses","Pulses (K)", track.K);
  L("rotate","Rotate", track.euclidRot);
  L("speedMode","Speed mode", track.speedMode);
  L("speed","Speed ratio", track.speedRatio.toFixed(2));
  L("subdiv","Subdivision", track.subdivName);
  L("vol","Circle volume", track.volume.toFixed(2));
  L("sound","Circle sound", track.sound);
  L("offset","Orbit offset (deg)", track.orbitOffsetDeg);

  if(track.moon){
    L("moonEnabled","Moon enabled", track.moon.enabled?"on":"off");
    L("moonRatio","Moon ratio", track.moon.ratio.toFixed(2));
    L("moonDir","Moon dir", track.moon.direction>0?"with":"against");
    L("moonRadius","Moon radius", track.moon.radius);
    L("moonPendAmt","Moon pendulum amt", track.moon.radiusLfoAmt);
    L("moonPendSpeed","Moon pendulum spd", track.moon.radiusLfoSpeed.toFixed(2));
    L("moonSize","Moon size", track.moon.size);
    L("moonPulses","Moon pulses", track.moon.pulses);
    L("moonTrigOffset","Moon trig offset", track.moon.trigOffsetDeg);
    L("moonTouchTrig","Moon touch trig", track.moon.touchTrig?"on":"off");
    L("moonLevel","Moon level", track.moon.level.toFixed(2));
    L("moonBreathDepth","Moon breath depth", track.moon.breathDepth.toFixed(2));
    L("moonBreathSpeed","Moon breath speed", track.moon.breathSpeed.toFixed(2));
  }

  L("selVel","Step vel");
  L("selPitch","Step pitch");
  L("selRatchet","Step ratchet");
  L("selRepeat","Step repeat");
  L("selProb","Step prob (%)");
  L("selPan","Step pan");
  L("selDelay","Step delay send");
  L("selMicro","Step micro (ms)");
  L("selSwing","Step swing (%)");

  L("selRandVel","Rand vel");
  L("selRandPitch","Rand pitch");
  L("selRandTime","Rand time (ms)");

  p.pop();
}
