if(!self.define){let e,s={};const c=(c,n)=>(c=new URL(c+".js",n).href,s[c]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=c,e.onload=s,document.head.appendChild(e)}else e=c,importScripts(c),s()})).then((()=>{let e=s[c];if(!e)throw new Error(`Module ${c} didn’t register its module`);return e})));self.define=(n,a)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let t={};const o=e=>c(e,i),r={module:{uri:i},exports:t,require:o};s[i]=Promise.all(n.map((e=>r[e]||o(e)))).then((e=>(a(...e),t)))}}define(["./workbox-6316bd60"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/4TLoowqeIXiSZki_ajDY9/_buildManifest.js",revision:"231b4c74dbc6dd2e86af1ea63721c0d6"},{url:"/_next/static/4TLoowqeIXiSZki_ajDY9/_middlewareManifest.js",revision:"fb2823d66b3e778e04a3f681d0d2fb19"},{url:"/_next/static/4TLoowqeIXiSZki_ajDY9/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/165-07688f71af6841ea.js",revision:"07688f71af6841ea"},{url:"/_next/static/chunks/602-5f775678aa92c489.js",revision:"5f775678aa92c489"},{url:"/_next/static/chunks/669-608d9da07d3ba490.js",revision:"608d9da07d3ba490"},{url:"/_next/static/chunks/689-6762bf90ff9e38c1.js",revision:"6762bf90ff9e38c1"},{url:"/_next/static/chunks/750-e697850ca1b82dd2.js",revision:"e697850ca1b82dd2"},{url:"/_next/static/chunks/805-4c3243248e6efb27.js",revision:"4c3243248e6efb27"},{url:"/_next/static/chunks/framework-75db3117d1377048.js",revision:"75db3117d1377048"},{url:"/_next/static/chunks/main-6a2a0899ca86c32d.js",revision:"6a2a0899ca86c32d"},{url:"/_next/static/chunks/pages/404-bcc5d4326a20d978.js",revision:"bcc5d4326a20d978"},{url:"/_next/static/chunks/pages/_error-d419484d69bbcf53.js",revision:"d419484d69bbcf53"},{url:"/_next/static/chunks/pages/_layout-a8b75b512d9530a1.js",revision:"a8b75b512d9530a1"},{url:"/_next/static/chunks/pages/discover-9ddc63c1c9788224.js",revision:"9ddc63c1c9788224"},{url:"/_next/static/chunks/pages/discover/%5Bid%5D-f6f2a6a7116ca128.js",revision:"f6f2a6a7116ca128"},{url:"/_next/static/chunks/pages/how-it-works-cdddfb84d1bce9d9.js",revision:"cdddfb84d1bce9d9"},{url:"/_next/static/chunks/pages/index-9b3b4b1ac07b0c9d.js",revision:"9b3b4b1ac07b0c9d"},{url:"/_next/static/chunks/pages/miguel-c354306346a5dc6a.js",revision:"c354306346a5dc6a"},{url:"/_next/static/chunks/polyfills-5cd94c89d3acac5f.js",revision:"99442aec5788bccac9b2f0ead2afdd6b"},{url:"/_next/static/chunks/webpack-434fefa8f39d8fbc.js",revision:"434fefa8f39d8fbc"},{url:"/_next/static/css/bc7ba21483d1db4f.css",revision:"bc7ba21483d1db4f"},{url:"/favicon.ico",revision:"4ff59fef4ad8bd2547e3db47bac48f20"},{url:"/icons/icon-128x128.png",revision:"cb50ffe6e7a4b7cc904ccfd7ece13b35"},{url:"/icons/icon-144x144.png",revision:"b29ea0047112cf43d3fec2646a8995cb"},{url:"/icons/icon-152x152.png",revision:"ddcf6a004c83424d0d4b226c15aa39cc"},{url:"/icons/icon-16x16.png",revision:"9ac8c0a24529b31b215a4cdc8e4cc22d"},{url:"/icons/icon-192x192.png",revision:"2bc326c73e3021b02810cf2be46d73e4"},{url:"/icons/icon-32x32.png",revision:"04340be6081fcda5213dd6fe687e593a"},{url:"/icons/icon-384x384.png",revision:"ae0ab53eb4caa5a6e331c4dc2c648e2e"},{url:"/icons/icon-512x512.png",revision:"88e7fc694747690c2af40a9afaf36599"},{url:"/icons/icon-72x72.png",revision:"8f71f9903517e4701d4d6c5409c89ccf"},{url:"/icons/icon-96x96.png",revision:"0d5f5c26eade1e42025c15437fec26aa"},{url:"/manifest.json",revision:"284c31abb607d2f89e2f707939be1dfb"},{url:"/sw.js.map~Stashed changes",revision:"46f5bf971661bb3f4c8df70a83534908"},{url:"/vercel.svg",revision:"4b4f1876502eb6721764637fe5c41702"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:c,state:n})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
