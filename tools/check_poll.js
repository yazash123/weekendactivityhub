/* Checks the poll writes exactly {name, pid, clusters, risks, at} to poll-s6, keyed by pid,
   as the Firestore rules require. Serves the repo locally and swaps the Firebase SDK for
   tools/fakefirebase.js. Run from the repo root:  node tools/check_poll.js
   Needs Playwright (npm i -g playwright) and a Chromium it can find. */
const http=require('http'),fs=require('fs'),path=require('path');
const { chromium }=require('playwright');
const root=path.resolve(__dirname,'..');
const srv=http.createServer((q,r)=>{const p=path.join(root,decodeURIComponent(q.url.split(/[?#]/)[0]).replace(/\/$/,'/index.html'));fs.readFile(p,(e,b)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'content-type':p.endsWith('.js')?'text/javascript':'text/html; charset=utf-8'});r.end(b);});}).listen(0);
(async()=>{
  const port=srv.address().port,b=await chromium.launch(),fake=fs.readFileSync(path.join(__dirname,'fakefirebase.js'),'utf8');
  let bad=[];
  for(const vp of [{width:1440,height:900},{width:390,height:844}]){
    const ctx=await b.newContext({viewport:vp,hasTouch:vp.width<600,isMobile:vp.width<600}),p=await ctx.newPage(),errs=[];
    p.on('pageerror',e=>errs.push(e.message));
    await p.route(/firebase-firestore-compat\.js/,r=>r.fulfill({contentType:'text/javascript',body:''}));
    await p.route(/firebase-app-compat\.js/,r=>r.fulfill({contentType:'text/javascript',body:fake}));
    await p.goto(`http://localhost:${port}/`);await p.waitForTimeout(800);
    await p.fill('#pname','Test A');
    for(const sel of ['#fsc label','#fsr label']){const l=p.locator(sel).first();await l.scrollIntoViewIfNeeded();await (vp.width<600?l.tap():l.click());await p.waitForTimeout(300);}
    await p.click('#send');await p.waitForTimeout(800);
    const w=await p.evaluate(()=>window.__writes);
    const ok=w.length===1&&w[0].col==='poll-s6'&&JSON.stringify(Object.keys(w[0].data).sort())===JSON.stringify(['at','clusters','name','pid','risks'])
      &&w[0].id===w[0].data.pid&&w[0].data.name==='Test A'&&Number.isInteger(w[0].data.at)
      &&w[0].data.clusters.every(c=>['data','voters','kids','work','war','check'].includes(c))
      &&w[0].data.risks.every(r=>/^R(0[1-35-9]|1[0-24-5])$/.test(r))&&w[0].data.clusters.length>0&&w[0].data.risks.length>0;
    console.log(vp.width+'px', ok?'OK':'FAIL', JSON.stringify(w));
    if(!ok)bad.push(vp.width);if(errs.length){console.log('  script errors:',errs);bad.push('errors');}
    await ctx.close();
  }
  await b.close();srv.close();process.exit(bad.length?1:0);
})();
