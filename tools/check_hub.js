/* Since 24 Oct the poll is closed: the page opens straight at the activities.
   Checks that, at desktop and phone width: the hub shows, the poll form and the
   "Change my preferences" button don't, #map still opens the risk map to read, and
   there are no script errors. Run from the repo root:  node tools/check_hub.js */
const http=require('http'),fs=require('fs'),path=require('path');
const { chromium }=require('playwright');
const root=path.resolve(__dirname,'..'),shots=process.argv[2];
const srv=http.createServer((q,r)=>{const p=path.join(root,decodeURIComponent(q.url.split(/[?#]/)[0]).replace(/\/$/,'/index.html'));fs.readFile(p,(e,b)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'content-type':p.endsWith('.js')?'text/javascript':'text/html; charset=utf-8'});r.end(b);});}).listen(0);
(async()=>{
  const port=srv.address().port,b=await chromium.launch();let bad=[];
  for(const vp of [{width:1440,height:900},{width:390,height:844}]){
    const ctx=await b.newContext({viewport:vp}),p=await ctx.newPage(),errs=[];
    p.on('pageerror',e=>errs.push(e.message));
    await p.route(/gstatic|firebase/,r=>r.fulfill({contentType:'text/javascript',body:''}));
    await p.goto(`http://localhost:${port}/`);await p.waitForTimeout(800);
    const s=await p.evaluate(()=>({hub:!document.getElementById('hubv').hidden,poll:!document.getElementById('poll').hidden,
      toPoll:document.getElementById('toPoll').offsetParent!==null,hash:location.hash,
      acts:[].slice.call(document.querySelectorAll('#board .act')).filter(e=>e.offsetParent).length,
      sideways:document.documentElement.scrollWidth>innerWidth}));
    if(shots)await p.screenshot({path:path.join(shots,'hub-'+vp.width+'.png')});
    await p.goto(`http://localhost:${port}/#map`);await p.reload();await p.waitForTimeout(800);
    const m=await p.evaluate(()=>({poll:!document.getElementById('poll').hidden,read:document.getElementById('poll').classList.contains('read')}));
    const ok=s.hub&&!s.poll&&!s.toPoll&&s.hash==='#activities'&&s.acts===3&&!s.sideways&&m.poll&&m.read;
    console.log(vp.width+'px',ok?'OK':'FAIL',JSON.stringify(s),JSON.stringify(m));
    if(!ok)bad.push(vp.width);if(errs.length){console.log('  script errors:',errs);bad.push('errors');}
    await ctx.close();
  }
  await b.close();srv.close();process.exit(bad.length?1:0);
})();
