"use client";

import Script from "next/script";

const EMBED_ID = "vidalytics_embed_WMOUApNj8RxxY0PV";
const EMBED_BASE = "https://fast.vidalytics.com/embeds/fZx62yRf/WMOUApNj8RxxY0PV/";

/* Vidalytics loader, verbatim from the embed snippet — it injects the player into
   the div above once the loader script is on the page. */
const LOADER = `
(function (v, i, d, a, l, y, t, c, s) {
    y='_'+d.toLowerCase();c=d+'L';if(!v[d]){v[d]={};}if(!v[c]){v[c]={};}if(!v[y]){v[y]={};}var vl='Loader',vli=v[y][vl],vsl=v[c][vl + 'Script'],vlf=v[c][vl + 'Loaded'],ve='Embed';
    if (!vsl){vsl=function(u,cb){
        if(t){cb();return;}s=i.createElement("script");s.type="text/javascript";s.async=1;s.src=u;
        if(s.readyState){s.onreadystatechange=function(){if(s.readyState==="loaded"||s.readyState=="complete"){s.onreadystatechange=null;vlf=1;cb();}};}else{s.onload=function(){vlf=1;cb();};}
        i.getElementsByTagName("head")[0].appendChild(s);
    };}
    vsl(l+'loader.min.js',function(){if(!vli){var vlc=v[c][vl];vli=new vlc();}vli.loadScript(l+'player.min.js',function(){var vec=v[d][ve];t=new vec();t.run(a);});});
})(window, document, 'Vidalytics', '${EMBED_ID}', '${EMBED_BASE}');
`;

export default function VSL() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.10] bg-[#0E0D0C]">
      <div id={EMBED_ID} style={{ width: "100%", position: "relative", paddingTop: "66.67%" }} />
      <Script id="vidalytics-loader" strategy="afterInteractive">
        {LOADER}
      </Script>
    </div>
  );
}
