export function drawVScrollbar(p, x, contentH, viewH, scrollY){
  const ms=Math.max(0, contentH-viewH);
  if(ms<=0) return;
  const barW=6, trackH=viewH-20;
  const barH=Math.max(30, trackH*(viewH/contentH));
  const barY=10+(trackH-barH)*(scrollY/ms);
  p.noStroke(); p.fill(40); p.rect(x,10,barW,trackH,3);
  p.fill(120); p.rect(x,barY,barW,barH,3);
}

export function drawHScrollbar(p, x0, y, contentW, viewW, scrollX){
  const ms=Math.max(0, contentW-viewW);
  if(ms<=0) return {hit:false};
  const trackW=viewW-40, barH=6;
  const barW=Math.max(40, trackW*(viewW/contentW));
  const minX=x0+20, maxX=minX+(trackW-barW);
  const barX=minX+(maxX-minX)*(scrollX/ms);
  p.noStroke(); p.fill(40); p.rect(minX,y,trackW,barH,3);
  p.fill(120); p.rect(barX,y,barW,barH,3);
  return {minX,maxX,barX,barW,barH,ms};
}
