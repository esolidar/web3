if(!self.define){let e,s={};const n=(n,c)=>(n=new URL(n+".js",c).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(c,a)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let t={};const r=e=>n(e,i),d={module:{uri:i},exports:t,require:r};s[i]=Promise.all(c.map((e=>d[e]||r(e)))).then((e=>(a(...e),t)))}}define(["./workbox-6316bd60"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/SVXhYWFfzTImDnHzwB2ev/_buildManifest.js",revision:"901d58758b4d7d1f7f9a6e70c9224ee0"},{url:"/_next/static/SVXhYWFfzTImDnHzwB2ev/_middlewareManifest.js",revision:"fb2823d66b3e778e04a3f681d0d2fb19"},{url:"/_next/static/SVXhYWFfzTImDnHzwB2ev/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/147-6449eeed9275c994.js",revision:"6449eeed9275c994"},{url:"/_next/static/chunks/362-799c6592a8bddc57.js",revision:"799c6592a8bddc57"},{url:"/_next/static/chunks/369-cdf6556d2beda152.js",revision:"cdf6556d2beda152"},{url:"/_next/static/chunks/455-74e4f40975ffa1b9.js",revision:"74e4f40975ffa1b9"},{url:"/_next/static/chunks/508-cdd75d065bad5adb.js",revision:"cdd75d065bad5adb"},{url:"/_next/static/chunks/553-255b7213ad2b912e.js",revision:"255b7213ad2b912e"},{url:"/_next/static/chunks/648-f7f336f4603b605b.js",revision:"f7f336f4603b605b"},{url:"/_next/static/chunks/669-608d9da07d3ba490.js",revision:"608d9da07d3ba490"},{url:"/_next/static/chunks/714-fdaaaa41eed37098.js",revision:"fdaaaa41eed37098"},{url:"/_next/static/chunks/716-147cf6a6de239ab1.js",revision:"147cf6a6de239ab1"},{url:"/_next/static/chunks/773-1b5d3b0d8db35f67.js",revision:"1b5d3b0d8db35f67"},{url:"/_next/static/chunks/803-c25b2e9a35d7ec94.js",revision:"c25b2e9a35d7ec94"},{url:"/_next/static/chunks/807-4933ddc4702b1e29.js",revision:"4933ddc4702b1e29"},{url:"/_next/static/chunks/894.1d453c233c9d153f.js",revision:"1d453c233c9d153f"},{url:"/_next/static/chunks/938-a0a9c3f97eb19bfb.js",revision:"a0a9c3f97eb19bfb"},{url:"/_next/static/chunks/framework-75db3117d1377048.js",revision:"75db3117d1377048"},{url:"/_next/static/chunks/main-e3f824348245487f.js",revision:"e3f824348245487f"},{url:"/_next/static/chunks/pages/404-1fad15852953ee76.js",revision:"1fad15852953ee76"},{url:"/_next/static/chunks/pages/_error-05780d4e12a40463.js",revision:"05780d4e12a40463"},{url:"/_next/static/chunks/pages/_layout-727800ec710e0f22.js",revision:"727800ec710e0f22"},{url:"/_next/static/chunks/pages/discover-c117018f326fea54.js",revision:"c117018f326fea54"},{url:"/_next/static/chunks/pages/discover/%5Bid%5D-73bff3e6fda2925e.js",revision:"73bff3e6fda2925e"},{url:"/_next/static/chunks/pages/how-it-works-203577676c6af364.js",revision:"203577676c6af364"},{url:"/_next/static/chunks/pages/index-3cff6662a1d15bd6.js",revision:"3cff6662a1d15bd6"},{url:"/_next/static/chunks/pages/miguel-d70f948c054a45aa.js",revision:"d70f948c054a45aa"},{url:"/_next/static/chunks/pages/sweepstake-6b69856ea375cfce.js",revision:"6b69856ea375cfce"},{url:"/_next/static/chunks/pages/sweepstake/%5Bid%5D-4658f60778913145.js",revision:"4658f60778913145"},{url:"/_next/static/chunks/pages/sweepstake/mintform-cf7f7ff8711a64fb.js",revision:"cf7f7ff8711a64fb"},{url:"/_next/static/chunks/pages/sweepstake/mydonations-add7750d7cd5ff63.js",revision:"add7750d7cd5ff63"},{url:"/_next/static/chunks/pages/sweepstake/mysweepstakes-316609bc8242bd2a.js",revision:"316609bc8242bd2a"},{url:"/_next/static/chunks/pages/sweepstake/rolemanager-10e454f20794a3a2.js",revision:"10e454f20794a3a2"},{url:"/_next/static/chunks/polyfills-5cd94c89d3acac5f.js",revision:"99442aec5788bccac9b2f0ead2afdd6b"},{url:"/_next/static/chunks/webpack-b5f967058aa27404.js",revision:"b5f967058aa27404"},{url:"/_next/static/css/7c21cdac3808b6fb.css",revision:"7c21cdac3808b6fb"},{url:"/favicon.ico",revision:"58094639e375cb1df33d14fe99f11964"},{url:"/icons/icon-128x128.png",revision:"cb50ffe6e7a4b7cc904ccfd7ece13b35"},{url:"/icons/icon-144x144.png",revision:"b29ea0047112cf43d3fec2646a8995cb"},{url:"/icons/icon-152x152.png",revision:"ddcf6a004c83424d0d4b226c15aa39cc"},{url:"/icons/icon-16x16.png",revision:"9ac8c0a24529b31b215a4cdc8e4cc22d"},{url:"/icons/icon-192x192.png",revision:"2bc326c73e3021b02810cf2be46d73e4"},{url:"/icons/icon-32x32.png",revision:"04340be6081fcda5213dd6fe687e593a"},{url:"/icons/icon-384x384.png",revision:"ae0ab53eb4caa5a6e331c4dc2c648e2e"},{url:"/icons/icon-512x512.png",revision:"88e7fc694747690c2af40a9afaf36599"},{url:"/icons/icon-72x72.png",revision:"8f71f9903517e4701d4d6c5409c89ccf"},{url:"/icons/icon-96x96.png",revision:"0d5f5c26eade1e42025c15437fec26aa"},{url:"/manifest.json",revision:"9edbdeffe52cabdb0f6dc6ea26978d82"},{url:"/sw.js.map~Stashed changes",revision:"46f5bf971661bb3f4c8df70a83534908"},{url:"/vercel.svg",revision:"4b4f1876502eb6721764637fe5c41702"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:n,state:c})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
