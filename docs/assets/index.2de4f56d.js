var H=Object.defineProperty;var I=Object.getOwnPropertySymbols;var U=Object.prototype.hasOwnProperty,z=Object.prototype.propertyIsEnumerable;var N=(a,r,c)=>r in a?H(a,r,{enumerable:!0,configurable:!0,writable:!0,value:c}):a[r]=c,k=(a,r)=>{for(var c in r||(r={}))U.call(r,c)&&N(a,c,r[c]);if(I)for(var c of I(r))z.call(r,c)&&N(a,c,r[c]);return a};import{d as O,r as L,a as Q,o as X,c as y,b as m,e as d,f as i,t as v,u,F as C,g as F,h as Z,w as ee,i as g,p as te,j as ie,k as ne,l as oe,s as se,m as ae}from"./vendor.9edb9e9c.js";const re=function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))h(o);new MutationObserver(o=>{for(const l of o)if(l.type==="childList")for(const e of l.addedNodes)e.tagName==="LINK"&&e.rel==="modulepreload"&&h(e)}).observe(document,{childList:!0,subtree:!0});function c(o){const l={};return o.integrity&&(l.integrity=o.integrity),o.referrerpolicy&&(l.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?l.credentials="include":o.crossorigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function h(o){if(o.ep)return;o.ep=!0;const l=c(o);fetch(o.href,l)}};re();var A="/assets/music/mixkit-rising-forest-471.mp3";var ce=(a,r)=>{const c=a.__vccOpts||a;for(const[h,o]of r)c[h]=o;return c};const p=a=>(te("data-v-6fc16a92"),a=a(),ie(),a),le={class:"grid"},ue={class:"headings",style:{"text-align":"center"}},me=g(" \u{1F3B5} Music: Off "),de=["checked"],pe=g("On "),he=p(()=>i("audio",{id:"exercise-audio",loop:""},[i("source",{src:A,type:"audio/mpeg"}),g(" Your browser does not support the audio element. ")],-1)),ve=p(()=>i("summary",null,"Routines",-1)),fe=p(()=>i("br",null,null,-1)),_e=["onClick"],ge={key:2},ke=p(()=>i("br",null,null,-1)),Se=["onClick"],ye=["onClick"],be=p(()=>i("summary",null,"Stats",-1)),xe=p(()=>i("br",null,null,-1)),Te=["onSubmit"],Re=p(()=>i("label",{for:"firstname"},[g(" Name "),i("input",{type:"text",id:"name",name:"name",placeholder:"Exercise Name or Break",required:""})],-1)),we=p(()=>i("label",{for:"firstname"},[g(" Seconds "),i("input",{type:"number",id:"time",name:"time",value:"15",step:"5",placeholder:"time",required:""})],-1)),Be=p(()=>i("button",null,"Add Timer",-1)),Ee=[Re,we,Be],Ie={class:"grid"},Ne=ne('<footer data-v-6fc16a92><small data-v-6fc16a92> music: <a href="https://mixkit.co/" target="_blank" rel="noopener" data-v-6fc16a92> Mixkit </a>, styles: <a href="https://picocss.com/" target="_blank" rel="noopener" data-v-6fc16a92> Pico </a>, scripts: <a href="https://github.com/vuejs/petite-vue" target="_blank" rel="noopener" data-v-6fc16a92> petite-vue </a>, made by: <a href="https://twitter.com/prikeshdexter" target="_blank" rel="noopener" data-v-6fc16a92> @prikeshdexter </a>, Source: <a href="https://github.com/prikeshsavla/bhel" target="_blank" rel="noopener" data-v-6fc16a92> Github </a></small></footer><audio id="exercise-audio" loop data-v-6fc16a92><source src="'+A+'" type="audio/mpeg" data-v-6fc16a92> Your browser does not support the audio element. </audio>',2),Le=O({setup(a){var w,B,E;function r(t){const n=Math.floor(t/60),s=t%60;return String(n).padStart(2,"0")+":"+String(s).padStart(2,"0")}const c=(t,n)=>{let s=new SpeechSynthesisUtterance;s.lang=navigator.language,o.volume=.1,s.rate=n,s.text=t,window.speechSynthesis.speak(s),setTimeout(()=>{o.volume=.4},500)},h=2;let o,l;L(""),L(0);let e=Q({activeTimer:{time:0,name:"Tap Start to Exercise"},totalTimeSpent:parseInt((w=window.localStorage.getItem("bhel-total-time-spent"))!=null?w:"0"),activeRoutine:(E=JSON.parse((B=window.localStorage.getItem("bhel-routine"))!=null?B:'{"exercises": []}'))!=null?E:{exercises:[]},routines:[{name:"Start Routine",exercises:[{name:"Start",time:7}]},{name:"Default Routine",exercises:[{name:"Forward Shoulder Rotation",time:15},{name:"Reverse Shoulder Rotation",time:15},{name:"Jumping Jacks",time:45},{name:"Butt Kicks",time:45},{name:"Break",time:15},{name:"Leg Raise",time:30},{name:"Break",time:15},{name:"Leg Scissors",time:30},{name:"Break",time:10},{name:"Knee High Crunches",time:30},{name:"Break",time:10},{name:"Plank",time:45},{name:"Break",time:10},{name:"Forward Lunges",time:45},{name:"Break",time:10},{name:"Wall Pushup Bicep",time:30},{name:"Break",time:10},{name:"Wall Pushup Tricep",time:30},{name:"Break",time:10}]},{name:"\u{1F195} New Routine",exercises:[]}],timeouts:[],music:!1});X(()=>{o=document.getElementById("exercise-audio")});const f=t=>{const n=document.getElementById("exercise-audio");if(t==="pause")n.pause();else if(e.music)switch(t){case"load":n.load();break;case"play":n.play();break}},P=()=>{e.music&&e.activeTimer.time>0?f("play"):f("pause")},$=y(()=>r(e.activeTimer.time)),D=y(()=>r(e.activeRoutine.exercises.reduce((t,n)=>t+n.time,0))),S=t=>{e.activeRoutine=k({},t),window.localStorage.setItem("bhel-routine",JSON.stringify(t))},V=()=>{var t=0;e.activeRoutine.exercises.forEach(n=>{e.timeouts.push(setTimeout(()=>T(k({},n)),t*1e3)),t+=n.time+h}),b(t),f("play")},b=t=>{e.timeouts.push(setTimeout(()=>o.volume=o.volume/2,t*1e3)),e.timeouts.push(setTimeout(()=>o.volume=o.volume/2,(t+h/2)*1e3)),e.timeouts.push(setTimeout(()=>{f("pause"),x()},(t+h)*1e3))},x=()=>{e.timeouts.forEach(t=>clearTimeout(t)),e.timeouts=[]},T=t=>{clearInterval(l),e.activeTimer=t;let n=e.activeTimer.time;c(t.name+` ${e.activeTimer.time} seconds`,1),l=setInterval(()=>{J(),e.activeTimer.time=n,n>0&&n<6&&c(String(n),2),--n<0&&(c("And Done",2),clearInterval(l))},1e3)},J=()=>{e.totalTimeSpent+=1,window.localStorage.setItem("bhel-total-time-spent",String(e.totalTimeSpent))},j=t=>{f("load"),f("play"),T(k({},t)),b(t.time)},q=t=>{var n=Object.values(e.activeRoutine.exercises);n.splice(t,1),e.activeRoutine.exercises=n,S(e.activeRoutine)},K=y(()=>r(e.totalTimeSpent)),W=()=>{clearInterval(l),e.activeTimer={time:0,name:"Tap Start to Exercise"},f("pause"),window.speechSynthesis.cancel(),x()},Y=t=>{const n={name:"",time:0};new FormData(t.target).forEach((s,_)=>{_==="name"&&(n.name=s.toString()),_==="time"&&(n.time=parseInt(s.toString()))}),R(n.name,n.time)},R=(t,n)=>{const s=e.activeRoutine.exercises[e.activeRoutine.exercises.length-1];s.name===t?e.activeRoutine.exercises[e.activeRoutine.exercises.length-1].time=s.time+n:e.activeRoutine.exercises.push({name:t,time:n}),S(e.activeRoutine)};return(t,n)=>(m(),d("section",null,[i("div",le,[i("article",null,[i("div",ue,[i("h1",null,v(u($)),1),i("h2",null,v(u(e).activeTimer.name),1)]),i("fieldset",null,[me,i("input",{type:"checkbox",onChange:P,id:"switch",checked:u(e).music,name:"switch",role:"switch"},null,40,de),pe]),i("footer",null,[u(e).timeouts.length===0?(m(),d("button",{key:0,onClick:V}," Start Routine (\u{1F4AA} "+v(u(D))+") ",1)):(m(),d("button",{key:1,class:"secondary",onClick:W},"Stop")),he,i("details",null,[ve,fe,(m(!0),d(C,null,F(u(e).routines,s=>(m(),d("button",{key:s.name,class:"secondary",type:"button",onClick:_=>S(s)},v(s.name),9,_e))),128))]),u(e).activeRoutine.exercises.length?(m(),d("details",ge,[i("summary",null," Routine Exercises ("+v(u(e).activeRoutine.exercises.length)+") ",1),ke,(m(!0),d(C,null,F(u(e).activeRoutine.exercises,(s,_)=>(m(),d("div",{key:s.name},[i("button",{class:"exercise contrast",onClick:G=>j(s)},[i("small",null,v(s.name)+" "+v(s.time)+"s",1)],8,Se),i("button",{class:"remove-exercise secondary",onClick:G=>q(_)}," \xD7 ",8,ye)]))),128))])):Z("",!0),i("details",null,[be,xe,i("small",null,"Overall Time Spent: "+v(u(K)),1)])])]),i("article",null,[i("form",{onSubmit:ee(Y,["prevent"])},Ee,40,Te),i("div",Ie,[i("button",{type:"button",onClick:n[0]||(n[0]=s=>R("Break",15))}," Add Break (15s) ")])])]),Ne]))}});var Ce=ce(Le,[["__scopeId","data-v-6fc16a92"]]);const Fe=i("div",{class:"headings",style:{"text-align":"center"}},[i("h1",null,"Bhel"),i("h4",null,"Your Light Exercise Timer \u{1F4AA}")],-1),Oe=O({setup(a){return(r,c)=>(m(),d("section",null,[Fe,oe(Ce)]))}}),M=new se;document.addEventListener("click",function a(){document.removeEventListener("click",a,!1),M.enable()},!1);document.addEventListener("touchstart",function a(){document.removeEventListener("touchstart",a,!1),M.enable()},!1);ae(Oe).mount("#app");
