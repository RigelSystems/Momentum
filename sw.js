if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(s[o])return;let l={};const t=e=>i(e,o),c={module:{uri:o},exports:l,require:t};s[o]=Promise.all(n.map((e=>c[e]||t(e)))).then((e=>(r(...e),l)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/AboutView-AEL0mKyj.js",revision:null},{url:"assets/AboutView-CSIvawM9.css",revision:null},{url:"assets/ChecklistsView-BzyWGuvQ.js",revision:null},{url:"assets/HabitsView-DpTfMT5Y.js",revision:null},{url:"assets/HabitsView-lwk_14bw.css",revision:null},{url:"assets/HabitView-CCrO7RXZ.js",revision:null},{url:"assets/index-C2TuexIu.css",revision:null},{url:"assets/index-zQFLINRz.js",revision:null},{url:"favicon.ico",revision:"1ba2ae710d927f13d483fd5d1e548c9b"},{url:"icons/icons8-check-192x192.png",revision:"f27804a616ee17e553111ed2658c8153"},{url:"icons/icons8-check-512x512.png",revision:"9b05aa0fae327afaede8a202f08e4014"},{url:"index.html",revision:"67eaaa6ed19e5ef069261bfbb72bdef7"},{url:"registerSW.js",revision:"cc3d0f5882bcfb8992fdb2ec5d54e115"},{url:"icons/icons8-check-192x192.png",revision:"f27804a616ee17e553111ed2658c8153"},{url:"icons/icons8-check-512x512.png",revision:"9b05aa0fae327afaede8a202f08e4014"},{url:"manifest.webmanifest",revision:"bdf0684459e28ae0fde5e8578407b6a7"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
