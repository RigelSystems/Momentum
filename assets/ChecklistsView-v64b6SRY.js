import{p as I,m as w,ag as L,I as h,k as b,l as t,d as x,aH as A,aK as N,r as m,j as P,aI as T,_ as $,c as l,a as r,as as a,aL as S,a1 as V,aq as B,o as n,aB as F,ar as j,av as y,a9 as p,au as i,aC as k,aM as H,aN as M,aO as U,V as q}from"./index-HRozj1Y9.js";import{V as z}from"./VSpacer-DXw_GMyn.js";const D=I({start:Boolean,end:Boolean,...w(),...L()},"VListItemAction"),E=h()({name:"VListItemAction",props:D(),setup(o,e){let{slots:d}=e;return b(()=>t(o.tag,{class:["v-list-item-action",{"v-list-item-action--start":o.start,"v-list-item-action--end":o.end},o.class],style:o.style},d)),{}}}),K=x({name:"ChecklistsView",components:{PageHeader:A,ChecklistForm:N},setup(){const{getAccessTokenSilently:o,user:e}=T(),d=m(null),c=m([]),C=m(null),f=m(!0),g=async()=>{const u=await fetch("https://api.fordsdevelopment.co.uk/daily_discipline/checklists",{headers:{"Content-Type":"application/json",Authorization:`Bearer ${d.value}`}});if(u.ok){f.value=!1;const v=await u.json();c.value=v,console.log(c.value)}else{f.value=!1;const v=await u.json();C.value=v.error}},_=async()=>{d.value=await o()};return P(async()=>{await _(),g()}),{checklists:c}}}),O={class:"page-header"},R={class:"mb-4 text-high-emphasis opacity-60"},G={key:0},J={key:1},Q={key:2},W={key:3};function X(o,e,d,c,C,f){const g=B("PageHeader"),_=B("ChecklistForm");return n(),l(V,null,[r("div",O,[t(g,{title:"Checklists"})]),t(S,null,{default:a(()=>[(n(!0),l(V,null,F(o.checklists,s=>(n(),j(U,{key:s.id,to:`/checklists/${s.id}`},{append:a(({isSelected:u})=>[t(E,{class:"flex-column align-end"},{default:a(()=>[r("small",R,y(s.created_at),1),t(z),s.status==="not_started"?(n(),l("div",G,[e[1]||(e[1]=r("small",null,"Not Started - ",-1)),t(p,{color:"black-darken-3"},{default:a(()=>e[0]||(e[0]=[i("mdi mdi-thought-bubble-outline")])),_:1})])):k("",!0),s.status==="blocked"?(n(),l("div",J,[e[3]||(e[3]=r("small",null,"Blocked - ",-1)),t(p,{color:"red-darken-3"},{default:a(()=>e[2]||(e[2]=[i("mdi mdi-alert-octagon-outline")])),_:1})])):k("",!0),s.status==="in_progress"?(n(),l("div",Q,[e[5]||(e[5]=r("small",null,"In Progress - ",-1)),t(p,{color:"green-darken-3"},{default:a(()=>e[4]||(e[4]=[i("mdi mdi-hammer-screwdriver")])),_:1})])):k("",!0),s.status==="completed"?(n(),l("div",W,[e[7]||(e[7]=r("small",null,"Completed - ",-1)),t(p,{color:"green-darken-1"},{default:a(()=>e[6]||(e[6]=[i("mdi mdi-check-outline")])),_:1})])):k("",!0)]),_:2},1024)]),default:a(()=>[t(H,null,{default:a(()=>[i(y(s.name),1)]),_:2},1024),t(M,null,{default:a(()=>[i(y(s.description),1)]),_:2},1024)]),_:2},1032,["to"]))),128))]),_:1}),t(_,null,{trigger:a(({openDialog:s})=>[t(q,{density:"comfortable",variant:"tonal",text:"New Checklist",class:"mr-2",onClick:s},null,8,["onClick"])]),_:1})],64)}const ee=$(K,[["render",X]]);export{ee as default};
