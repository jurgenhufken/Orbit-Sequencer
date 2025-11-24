import { laneRows, rowH, lanesCellW } from "../util/constants.js";

export function drawLanes(p, track, selectedStep, x0, y0){
  const w=track.N*lanesCellW;
  const h=laneRows.length*rowH+8;
  p.noStroke(); p.fill(18);
  p.rect(x0-10,y0-10,w+20,h+20,8);

  p.fill(200); p.textSize(10); p.textAlign(p.RIGHT,p.CENTER);
  for(let r=0;r<laneRows.length;r++) p.text(laneRows[r].label,x0-12,y0+r*rowH+rowH/2);
  p.textAlign(p.LEFT,p.CENTER);
  for(let r=0;r<laneRows.length;r++) p.text(laneRows[r].label,x0+w+8,y0+r*rowH+rowH/2);

  for(let i=0;i<track.N;i++){
    const cx=x0+i*lanesCellW;
    p.fill(140); p.textAlign(p.CENTER,p.CENTER); p.textSize(10);
    p.text(i+1,cx+lanesCellW/2,y0-2);

    for(let r=0;r<laneRows.length;r++){
      const row=laneRows[r], ry=y0+r*rowH, val=track.steps[i][row.key];
      p.stroke(40); p.fill(row.type==="toggle"?22:14);
      p.rect(cx,ry,lanesCellW-2,rowH-2,2);

      if(row.type==="toggle"){
        if(val){ p.noStroke(); p.fill(180); p.rect(cx+2,ry+2,lanesCellW-6,rowH-6,2); }
      } else if(row.type==="bar"){
        const pr=p.map(val,row.min,row.max,0,1); p.noStroke(); p.fill(0,180,255);
        p.rect(cx+2,ry+2,(lanesCellW-6)*pr,rowH-6,2);
      } else if(row.type==="dot"){
        const pr=p.map(val,row.min,row.max,0,1), dx=cx+3+pr*(lanesCellW-8);
        p.stroke(255,200,0); p.strokeWeight(2); p.point(dx,ry+rowH/2);
      } else if(row.type==="int"){
        p.noStroke(); p.fill(val>row.min?220:120); p.text(val,cx+lanesCellW/2,ry+rowH/2);
      }
    }

    if(track.steps[i].picked){
      p.noFill(); p.stroke(255,120,0); p.strokeWeight(2);
      p.rect(cx,y0-2,lanesCellW-2,h-6,4);
    }
    if(i===selectedStep){
      p.noFill(); p.stroke(255,200,0); p.strokeWeight(2);
      p.rect(cx,y0-2,lanesCellW-2,h-6,4);
    }
  }
}
