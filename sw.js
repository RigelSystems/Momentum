if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const l=e||("document"in self?document.currentScript.src:"")||location.href;if(s[l])return;let o={};const c=e=>i(e,l),t={module:{uri:l},exports:o,require:c};s[l]=Promise.all(n.map((e=>t[e]||c(e)))).then((e=>(r(...e),o)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/AboutView-962sErtF.js",revision:null},{url:"assets/AboutView-CSIvawM9.css",revision:null},{url:"assets/ChecklistsView-C1ABa2WQ.js",revision:null},{url:"assets/HabitsView-DFfvAQaj.css",revision:null},{url:"assets/HabitsView-DyylJ_pH.js",revision:null},{url:"assets/HabitView-BMnSpNIg.js",revision:null},{url:"assets/index-Dsxgj5Vz.js",revision:null},{url:"assets/index-JOahqLBd.css",revision:null},{url:"assets/VSpacer-Cb7FdSrp.css",revision:null},{url:"assets/VSpacer-DAAV8FB5.js",revision:null},{url:"favicon.ico",revision:"1ba2ae710d927f13d483fd5d1e548c9b"},{url:"icons/icons8-check-192x192.png",revision:"f27804a616ee17e553111ed2658c8153"},{url:"icons/icons8-check-512x512.png",revision:"9b05aa0fae327afaede8a202f08e4014"},{url:"index.html",revision:"549fb99b1c23816059528c43532f19f1"},{url:"registerSW.js",revision:"cc3d0f5882bcfb8992fdb2ec5d54e115"},{url:"icons/icons8-check-192x192.png",revision:"f27804a616ee17e553111ed2658c8153"},{url:"icons/icons8-check-512x512.png",revision:"9b05aa0fae327afaede8a202f08e4014"},{url:"manifest.webmanifest",revision:"bdf0684459e28ae0fde5e8578407b6a7"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
