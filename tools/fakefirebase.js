/* Stand-in for the Firebase app + Firestore compat SDK, for tools/check_poll.js only.
   Records every write in window.__writes so the test can see exactly what the page sends. */
(function(){
  window.__writes=[];
  var apps=[];
  function doc(col,id){return {set:function(d){window.__writes.push({col:col,id:id,data:JSON.parse(JSON.stringify(d))});return Promise.resolve();}};}
  var db={settings:function(){},collection:function(c){return {doc:function(id){return doc(c,id);}};}};
  window.firebase={apps:apps,initializeApp:function(c){apps.push(c);return {};},firestore:function(){return db;}};
})();
