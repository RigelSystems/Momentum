if(!self.define){let s,e={};const i=(i,n)=>(i=new URL(i+".js",n).href,e[i]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=i,s.onload=e,document.head.appendChild(s)}else s=i,importScripts(i),e()})).then((()=>{let s=e[i];if(!s)throw new Error(`Module ${i} didn’t register its module`);return s})));self.define=(n,l)=>{const r=s||("document"in self?document.currentScript.src:"")||location.href;if(e[r])return;let t={};const o=s=>i(s,r),u={module:{uri:r},exports:t,require:o};e[r]=Promise.all(n.map((s=>u[s]||o(s)))).then((s=>(l(...s),t)))}}define(["./workbox-5ffe50d4"],(function(s){"use strict";self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"assets/AboutView-Bmjq7cT3.js",revision:null},{url:"assets/AboutView-CSIvawM9.css",revision:null},{url:"assets/ChecklistsView-BUBQbHXF.js",revision:null},{url:"assets/dateUtils-Cb7FdSrp.css",revision:null},{url:"assets/dateUtils-CX1VjYG8.js",revision:null},{url:"assets/Habit-BRdIBAW1.css",revision:null},{url:"assets/Habit-sr3DvrBK.js",revision:null},{url:"assets/HabitsView-05wDtwI4.js",revision:null},{url:"assets/HabitsView-B5kSQM80.css",revision:null},{url:"assets/HabitView-0fK7N_mT.js",revision:null},{url:"assets/index-Ckew-Owp.js",revision:null},{url:"assets/index-DGkUWAeL.css",revision:null},{url:"assets/NNotification-BLG5uUHU.js",revision:null},{url:"assets/NNotification-sqU1OKqW.css",revision:null},{url:"assets/requestApi-DdcRGtwD.js",revision:null},{url:"assets/TimelineView-BUvvGuDp.js",revision:null},{url:"favicon.ico",revision:"1ba2ae710d927f13d483fd5d1e548c9b"},{url:"icons/icons8-check-192x192.png",revision:"f27804a616ee17e553111ed2658c8153"},{url:"icons/icons8-check-512x512.png",revision:"9b05aa0fae327afaede8a202f08e4014"},{url:"index.html",revision:"310ed7168f6c1dd12f1fd8f093d89689"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"icons/icons8-check-192x192.png",revision:"f27804a616ee17e553111ed2658c8153"},{url:"icons/icons8-check-512x512.png",revision:"9b05aa0fae327afaede8a202f08e4014"},{url:"manifest.webmanifest",revision:"83af610ca7320f7f38bfe9c8df02aeaf"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html")))}));
