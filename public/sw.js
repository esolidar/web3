if(!self.define){let e,s={};const n=(n,i)=>(n=new URL(n+".js",i).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(i,a)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let t={};const o=e=>n(e,c),r={module:{uri:c},exports:t,require:o};s[c]=Promise.all(i.map((e=>r[e]||o(e)))).then((e=>(a(...e),t)))}}define(["./workbox-6316bd60"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/chunks/127-ab394676896df4f3.js",revision:"ab394676896df4f3"},{url:"/_next/static/chunks/13-8d9de96fc3fd1f87.js",revision:"8d9de96fc3fd1f87"},{url:"/_next/static/chunks/177-909ce850beaedaa4.js",revision:"909ce850beaedaa4"},{url:"/_next/static/chunks/418-bf778f2956309861.js",revision:"bf778f2956309861"},{url:"/_next/static/chunks/534-0829c223bb0607d1.js",revision:"0829c223bb0607d1"},{url:"/_next/static/chunks/690-53dbaed34b2ef6ed.js",revision:"53dbaed34b2ef6ed"},{url:"/_next/static/chunks/framework-75db3117d1377048.js",revision:"75db3117d1377048"},{url:"/_next/static/chunks/main-6a2a0899ca86c32d.js",revision:"6a2a0899ca86c32d"},{url:"/_next/static/chunks/pages/404-bcc5d4326a20d978.js",revision:"bcc5d4326a20d978"},{url:"/_next/static/chunks/pages/_error-d419484d69bbcf53.js",revision:"d419484d69bbcf53"},{url:"/_next/static/chunks/pages/_layout-eb98ffd6b0b2654f.js",revision:"eb98ffd6b0b2654f"},{url:"/_next/static/chunks/pages/discover-5b269b57a81cd9ea.js",revision:"5b269b57a81cd9ea"},{url:"/_next/static/chunks/pages/discover/%5Bid%5D-95dfb1bcdfcbcaec.js",revision:"95dfb1bcdfcbcaec"},{url:"/_next/static/chunks/pages/how-it-works-cdddfb84d1bce9d9.js",revision:"cdddfb84d1bce9d9"},{url:"/_next/static/chunks/pages/index-aae763fabc0755ee.js",revision:"aae763fabc0755ee"},{url:"/_next/static/chunks/pages/miguel-729b397e90f2003a.js",revision:"729b397e90f2003a"},{url:"/_next/static/chunks/polyfills-5cd94c89d3acac5f.js",revision:"99442aec5788bccac9b2f0ead2afdd6b"},{url:"/_next/static/chunks/webpack-434fefa8f39d8fbc.js",revision:"434fefa8f39d8fbc"},{url:"/_next/static/css/1519262033c3c6d8.css",revision:"1519262033c3c6d8"},{url:"/_next/static/iCvJft109Opa1Kp9za7nP/_buildManifest.js",revision:"25ecddbf3ab31891a8fbd44a0408bec0"},{url:"/_next/static/iCvJft109Opa1Kp9za7nP/_middlewareManifest.js",revision:"fb2823d66b3e778e04a3f681d0d2fb19"},{url:"/_next/static/iCvJft109Opa1Kp9za7nP/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/favicon.ico",revision:"4ff59fef4ad8bd2547e3db47bac48f20"},{url:"/icons/icon-128x128.png",revision:"d626cfe7c65e6e5403bcbb9d13aa5053"},{url:"/icons/icon-144x144.png",revision:"e53a506b62999dc7a4f8b7222f8c5add"},{url:"/icons/icon-152x152.png",revision:"18b3958440703a9ecd3c246a0f3f7c72"},{url:"/icons/icon-16x16.png",revision:"83703514f19796ee15151e450984416d"},{url:"/icons/icon-192x192.png",revision:"27dc12f66697a47b6a8b3ee25ba96257"},{url:"/icons/icon-32x32.png",revision:"25e2c6ee34840568012b32e4314278df"},{url:"/icons/icon-384x384.png",revision:"a40324a3fde2b0b26eeffd4f08bf8be8"},{url:"/icons/icon-512x512.png",revision:"93d6e8e15cfa78dfee55446f607d9a28"},{url:"/icons/icon-72x72.png",revision:"f2ffc41b3482888f3ae614e0dd2f6980"},{url:"/icons/icon-96x96.png",revision:"fba02a40f7ba6fc65be8a2f245480f6d"},{url:"/manifest.json",revision:"284c31abb607d2f89e2f707939be1dfb"},{url:"/sw.js.map~Stashed changes",revision:"46f5bf971661bb3f4c8df70a83534908"},{url:"/vercel.svg",revision:"4b4f1876502eb6721764637fe5c41702"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:n,state:i})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
