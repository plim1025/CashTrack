(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{524:function(e,n,t){(function(e){(function(n,t){"use strict";var r="default"in t?t.default:t;function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function a(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?a(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function c(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}function l(e,n){return function(e){if(Array.isArray(e))return e}(e)||function(e,n){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e)){var t=[],r=!0,o=!1,a=void 0;try{for(var i,c=e[Symbol.iterator]();!(r=(i=c.next()).done)&&(t.push(i.value),!n||t.length!==n);r=!0);}catch(e){o=!0,a=e}finally{try{r||null==c.return||c.return()}finally{if(o)throw a}}return t}}(e,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}var u="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:void 0!==e?e:"undefined"!=typeof self?self:{};function s(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function f(e,n){return e(n={exports:{}},n.exports),n.exports}var p=f((function(e,n){var t=u&&u.__rest||function(e,n){var t={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&n.indexOf(r)<0&&(t[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(r=Object.getOwnPropertySymbols(e);o<r.length;o++)n.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(e,r[o])&&(t[r[o]]=e[r[o]])}return t};Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(e){var n=e.src,a=e.checkForExisting,i=void 0!==a&&a,c=t(e,["src","checkForExisting"]),l=r.useState(!0),u=l[0],s=l[1],f=r.useState(null),p=f[0],d=f[1];return r.useEffect((function(){if(o){if(i&&document.querySelectorAll('script[src="'+n+'"]').length>0)return void s(!1);var e=document.createElement("script");e.setAttribute("src",n),Object.keys(c).forEach((function(n){void 0===e[n]?e.setAttribute(n,c[n]):e[n]=c[n]}));var t=function(){s(!1)},r=function(e){d(e)};return e.addEventListener("load",t),e.addEventListener("error",r),document.body.appendChild(e),function(){e.removeEventListener("load",t),e.removeEventListener("error",r)}}}),[n]),[u,p]};var o="undefined"!=typeof window&&void 0!==window.document}));s(p);var d=s(f((function(e,n){Object.defineProperty(n,"__esModule",{value:!0}),n.default=p.default}))),h=function(e){var n={plaid:null,open:!1,onExitCallback:null};if("undefined"==typeof window||!window.Plaid)throw new Error("Plaid not loaded");var t,r,a,c,l=(t=e,r="publicKey",a="key",c={},delete Object.assign(c,t,o({},a,t[r]))[r],c);return n.plaid=window.Plaid.create(i({},l,{onExit:function(){l.onExit&&l.onExit.apply(l,arguments),n.onExitCallback&&n.onExitCallback()}})),{open:function(){n.plaid&&(n.open=!0,n.onExitCallback=null,n.plaid.open())},exit:function(e,t){n.open&&n.plaid?(n.onExitCallback=t,n.plaid.exit(e),e&&e.force&&(n.open=!1)):t&&t()},destroy:function(){n.plaid&&(n.plaid.destroy(),n.plaid=null)}}},y=function(){},b=function(e){var n=l(d({src:"https://cdn.plaid.com/link/v2/stable/link-initialize.js",checkForExisting:!0}),2),r=n[0],o=n[1],a=l(t.useState(null),2),c=a[0],u=a[1],s=l(t.useState(!1),2),f=s[0],p=s[1],b=(e.product||[]).slice().sort().join(",");return t.useEffect((function(){if(!r){if(!o&&window.Plaid){null!=c&&c.exit({force:!0},(function(){return c.destroy()}));var n=h(i({},e,{onLoad:function(){p(!0),e.onLoad&&e.onLoad()}}));return u(n),function(){return n.exit({force:!0},(function(){return n.destroy()}))}}console.error("Error loading Plaid",o)}}),[r,o,e.token,b]),{error:o,ready:!r||f,exit:c?c.exit:y,open:c?c.open:y}},m=function(e){var n=e.children,t=e.style,o=e.className,a=c(e,["children","style","className"]),l=b(i({},a)),u=l.error,s=l.open;return r.createElement("button",{disabled:Boolean(u),type:"button",className:o,style:i({padding:"6px 4px",outline:"none",background:"#FFFFFF",border:"2px solid #F1F1F1",borderRadius:"4px"},t),onClick:function(){return s()}},n)};m.displayName="PlaidLink",n.PlaidLink=m,n.usePlaidLink=b,Object.defineProperty(n,"__esModule",{value:!0})})(n,t(0))}).call(this,t(53))},588:function(e,n,t){"use strict";t.r(n);var r,o,a,i,c,l,u,s,f,p,d,h,y,b,m,v,w,g,x,E=t(0),O=t.n(E),k=t(524),j=t(5),S=t(9),P=t(51),D=function(e,n){return Object.defineProperty?Object.defineProperty(e,"raw",{value:n}):e.raw=n,e},T=function(e,n,t,r){return new(t||(t=Promise))((function(o,a){function i(e){try{l(r.next(e))}catch(e){a(e)}}function c(e){try{l(r.throw(e))}catch(e){a(e)}}function l(e){var n;e.done?o(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(i,c)}l((r=r.apply(e,n||[])).next())}))},C=function(e,n){var t,r,o,a,i={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return a={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function c(a){return function(c){return function(a){if(t)throw new TypeError("Generator is already executing.");for(;i;)try{if(t=1,r&&(o=2&a[0]?r.return:a[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,a[1])).done)return o;switch(r=0,o&&(a=[2&a[0],o.value]),a[0]){case 0:case 1:o=a;break;case 4:return i.label++,{value:a[1],done:!1};case 5:i.label++,r=a[1],a=[0];continue;case 7:a=i.ops.pop(),i.trys.pop();continue;default:if(!(o=i.trys,(o=o.length>0&&o[o.length-1])||6!==a[0]&&2!==a[0])){i=0;continue}if(3===a[0]&&(!o||a[1]>o[0]&&a[1]<o[3])){i.label=a[1];break}if(6===a[0]&&i.label<o[1]){i.label=o[1],o=a;break}if(o&&i.label<o[2]){i.label=o[2],i.ops.push(a);break}o[2]&&i.ops.pop(),i.trys.pop();continue}a=n.call(e,i)}catch(e){a=[6,e],r=0}finally{t=o=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,c])}}},L=j.a.div(r||(r=D(["\n    display: flex;\n    justify-content: center;\n    margin: 20px auto;\n    width: 100%;\n"],["\n    display: flex;\n    justify-content: center;\n    margin: 20px auto;\n    width: 100%;\n"]))),_=function(e){var n=Object(E.useContext)(P.a).refresh,t=Object(k.usePlaidLink)({token:e.token,onSuccess:function(e,t){return T(void 0,void 0,void 0,(function(){var r;return C(this,(function(o){switch(o.label){case 0:n("Fetching account information..."),o.label=1;case 1:return o.trys.push([1,3,,4]),[4,fetch("http://localhost:3000/api/plaid/set_account",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({publicToken:e,batchID:t.link_session_id,institution:t.institution.name,accounts:t.accounts})})];case 2:if(!o.sent().ok)throw Error("Bad response from server");return[3,4];case 3:throw r=o.sent(),Error("Error setting plaid account: "+r);case 4:return[2]}}))}))}}),r=t.open,o=t.ready,a=t.error;return O.a.createElement(L,null,O.a.createElement(S.a,{child:"+ Account",disabled:!o||null!==a,onClick:function(){return r()},variant:"primary",style:{maxWidth:600,width:"calc(100% - 40px)"}}))},A=t(96),I=t(97),z=function(e,n,t,r){return new(t||(t=Promise))((function(o,a){function i(e){try{l(r.next(e))}catch(e){a(e)}}function c(e){try{l(r.throw(e))}catch(e){a(e)}}function l(e){var n;e.done?o(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(i,c)}l((r=r.apply(e,n||[])).next())}))},F=function(e,n){var t,r,o,a,i={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return a={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function c(a){return function(c){return function(a){if(t)throw new TypeError("Generator is already executing.");for(;i;)try{if(t=1,r&&(o=2&a[0]?r.return:a[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,a[1])).done)return o;switch(r=0,o&&(a=[2&a[0],o.value]),a[0]){case 0:case 1:o=a;break;case 4:return i.label++,{value:a[1],done:!1};case 5:i.label++,r=a[1],a=[0];continue;case 7:a=i.ops.pop(),i.trys.pop();continue;default:if(!(o=i.trys,(o=o.length>0&&o[o.length-1])||6!==a[0]&&2!==a[0])){i=0;continue}if(3===a[0]&&(!o||a[1]>o[0]&&a[1]<o[3])){i.label=a[1];break}if(6===a[0]&&i.label<o[1]){i.label=o[1],o=a;break}if(o&&i.label<o[2]){i.label=o[2],i.ops.push(a);break}o[2]&&i.ops.pop(),i.trys.pop();continue}a=n.call(e,i)}catch(e){a=[6,e],r=0}finally{t=o=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,c])}}},N=function(e,n){return z(void 0,void 0,void 0,(function(){var t,r;return F(this,(function(o){switch(o.label){case 0:return o.trys.push([0,3,,4]),[4,fetch("http://localhost:3000/api/plaidAccount/"+e,{method:"PUT",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({name:n.name,hidden:n.hidden})})];case 1:if(!(t=o.sent()).ok)throw Error("Bad response from server");return[4,t.json()];case 2:return[2,o.sent()];case 3:throw r=o.sent(),Error("Error updating account: "+r);case 4:return[2]}}))}))},M=t(52),B=function(e,n){return Object.defineProperty?Object.defineProperty(e,"raw",{value:n}):e.raw=n,e},G=function(){return(G=Object.assign||function(e){for(var n,t=1,r=arguments.length;t<r;t++)for(var o in n=arguments[t])Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o]);return e}).apply(this,arguments)},U=function(e,n,t,r){return new(t||(t=Promise))((function(o,a){function i(e){try{l(r.next(e))}catch(e){a(e)}}function c(e){try{l(r.throw(e))}catch(e){a(e)}}function l(e){var n;e.done?o(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(i,c)}l((r=r.apply(e,n||[])).next())}))},H=function(e,n){var t,r,o,a,i={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return a={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function c(a){return function(c){return function(a){if(t)throw new TypeError("Generator is already executing.");for(;i;)try{if(t=1,r&&(o=2&a[0]?r.return:a[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,a[1])).done)return o;switch(r=0,o&&(a=[2&a[0],o.value]),a[0]){case 0:case 1:o=a;break;case 4:return i.label++,{value:a[1],done:!1};case 5:i.label++,r=a[1],a=[0];continue;case 7:a=i.ops.pop(),i.trys.pop();continue;default:if(!(o=i.trys,(o=o.length>0&&o[o.length-1])||6!==a[0]&&2!==a[0])){i=0;continue}if(3===a[0]&&(!o||a[1]>o[0]&&a[1]<o[3])){i.label=a[1];break}if(6===a[0]&&i.label<o[1]){i.label=o[1],o=a;break}if(o&&i.label<o[2]){i.label=o[2],i.ops.push(a);break}o[2]&&i.ops.pop(),i.trys.pop();continue}a=n.call(e,i)}catch(e){a=[6,e],r=0}finally{t=o=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,c])}}},J=function(e,n){var t={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&n.indexOf(r)<0&&(t[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(r=Object.getOwnPropertySymbols(e);o<r.length;o++)n.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(e,r[o])&&(t[r[o]]=e[r[o]])}return t},R=function(e,n){var t="function"==typeof Symbol&&e[Symbol.iterator];if(!t)return e;var r,o,a=t.call(e),i=[];try{for(;(void 0===n||n-- >0)&&!(r=a.next()).done;)i.push(r.value)}catch(e){o={error:e}}finally{try{r&&!r.done&&(t=a.return)&&t.call(a)}finally{if(o)throw o.error}}return i},K=Object(j.a)(I.a)(o||(o=B(["\n    margin: 0 auto;\n    margin-bottom: 20px;\n    max-width: 600px;\n    padding: 20px;\n    width: calc(100% - 40px);\n"],["\n    margin: 0 auto;\n    margin-bottom: 20px;\n    max-width: 600px;\n    padding: 20px;\n    width: calc(100% - 40px);\n"]))),W=j.a.div(a||(a=B([""],[""]))),q=j.a.div(i||(i=B(["\n    width: calc(100% - 160px);\n    &&& {\n        font-size: 1.25rem;\n        font-weight: 700;\n    }\n"],["\n    width: calc(100% - 160px);\n    &&& {\n        font-size: 1.25rem;\n        font-weight: 700;\n    }\n"]))),V=j.a.div(c||(c=B(["\n    &&& {\n        font-size: 16px;\n        opacity: 0.75;\n    }\n"],["\n    &&& {\n        font-size: 16px;\n        opacity: 0.75;\n    }\n"]))),Q=Object(j.a)(I.a.Body)(l||(l=B(["\n    font-size: 16px;\n    &&& {\n        line-height: inherit;\n        padding: 0px;\n    }\n"],["\n    font-size: 16px;\n    &&& {\n        line-height: inherit;\n        padding: 0px;\n    }\n"]))),X=Object(j.a)(I.a.Body)(u||(u=B(["\n    align-items: center;\n    cursor: pointer;\n    display: flex;\n    &&& {\n        padding: 10px 0;\n    }\n"],["\n    align-items: center;\n    cursor: pointer;\n    display: flex;\n    &&& {\n        padding: 10px 0;\n    }\n"]))),Y=j.a.div(s||(s=B(["\n    margin-left: 10px;\n    width: 100%;\n"],["\n    margin-left: 10px;\n    width: 100%;\n"]))),Z=j.a.div(f||(f=B(["\n    align-items: center;\n    display: flex;\n"],["\n    align-items: center;\n    display: flex;\n"]))),$=j.a.svg(p||(p=B(["\n    height: 16px;\n    width: 16px;\n"],["\n    height: 16px;\n    width: 16px;\n"]))),ee=j.a.div(d||(d=B([""],[""]))),ne=Object(j.a)((function(e){e.subtype;var n=J(e,["subtype"]);return O.a.createElement("div",G({},n))}))(h||(h=B(["\n    font-size: 12px;\n    opacity: 0.75;\n    text-transform: ",";\n"],["\n    font-size: 12px;\n    opacity: 0.75;\n    text-transform: ",";\n"])),(function(e){var n=e.subtype;return-1!==["cd","hsa","gic","ira","isa","keogh","lif","lira","lrsp","prif","qshr","rdsp","resp","rlif","rrif","rrsp","sarsep","sep ira","sipp","tfsa","ugma","utma"].indexOf(n)?"uppercase":"capitalize"})),te=j.a.div(y||(y=B(["\n    margin-left: auto;\n"],["\n    margin-left: auto;\n"]))),re=j.a.div(b||(b=B(["\n    align-items: center;\n    display: flex;\n"],["\n    align-items: center;\n    display: flex;\n"]))),oe=Object(j.a)(A.a.Group)(m||(m=B(["\n    flex: 1;\n"],["\n    flex: 1;\n"]))),ae=Object(j.a)(A.a.Label)(v||(v=B(["\n    font-size: 16px;\n    margin-bottom: 5px;\n"],["\n    font-size: 16px;\n    margin-bottom: 5px;\n"]))),ie=Object(j.a)(A.a.Control)(w||(w=B(["\n    align-items: center;\n    display: flex;\n    height: 30px;\n    &&& {\n        font-size: 16px;\n    }\n"],["\n    align-items: center;\n    display: flex;\n    height: 30px;\n    &&& {\n        font-size: 16px;\n    }\n"]))),ce=Object(j.a)(A.a.Check)(g||(g=B(["\n    margin: 0 20px;\n"],["\n    margin: 0 20px;\n"]))),le=j.a.div(x||(x=B(["\n    display: flex;\n    justify-content: flex-end;\n    margin-left: auto;\n"],["\n    display: flex;\n    justify-content: flex-end;\n    margin-left: auto;\n"]))),ue=function(e){var n=Object(E.useContext)(P.a),t=n.accounts,r=n.setAccounts,o=n.transactions,a=n.setTransactions,i=e.accounts.reduce((function(e,n){return e[n.batchID]=e[n.batchID]||[],e[n.batchID].push(n),e}),Object.create(null)),c=R(Object(E.useState)(""),2),l=c[0],u=c[1],s=R(Object(E.useState)({name:"",hidden:!1}),2),f=s[0],p=s[1];return O.a.createElement(O.a.Fragment,null,Object.keys(i).map((function(n){return O.a.createElement(K,{key:n},O.a.createElement(W,null,O.a.createElement(q,null,i[n][0].institution),O.a.createElement(V,null,"Last Updated"," ",(c=i[n].map((function(e){return e.lastUpdated})).reduce((function(e,n){return e<n?e:n})),d=new Date,h=new Date(c),(y=d.getTime()-h.getTime())<36e5?(s=Math.floor(y/6e4))+" minute"+(s>1?"s":"")+" ago":y<864e5?(s=Math.floor(y/36e5))+" hour"+(s>1?"s":"")+" ago":y<2592e6?(s=Math.floor(y/864e5))+" day"+(s>1?"s":"")+" ago":y<31536e6?(s=Math.floor(y/31536e6))+" month"+(s>1?"s":"")+" ago":"more than a year ago"))),O.a.createElement(Q,null,i[n].map((function(n){return O.a.createElement(O.a.Fragment,{key:n.id},O.a.createElement(X,{onClick:function(){return function(e){l===e.id?u(""):u(e.id),p({name:e.name,hidden:e.hidden})}(n)}},O.a.createElement($,{viewBox:"0 0 256 256",style:{transform:l===n.id?"rotate(180deg)":null}},O.a.createElement("polygon",{points:"225.813,48.907 128,146.72 30.187,48.907 0,79.093 128,207.093 256,79.093"})),O.a.createElement(Y,null,O.a.createElement(Z,null,O.a.createElement(ee,null,n.name," (...",n.mask,")"),O.a.createElement(te,null,Object(M.d)(n.balance))),O.a.createElement(ne,{subtype:n.subtype},"cash isa"===(i=n.subtype)?"cash ISA":"roth 401k"===i?"ROTH 401k":"simple ira"===i?"simple IRA":i))),l===n.id?O.a.createElement(A.a,null,O.a.createElement(re,null,O.a.createElement(oe,null,O.a.createElement(ae,null,"Name"),O.a.createElement(ie,{defaultValue:f.name,onChange:function(e){return p(G(G({},f),{name:e.target.value}))}})),O.a.createElement(ce,{checked:f.hidden,id:"hidden-switch",type:"switch",label:"Hidden",onChange:function(e){return p(G(G({},f),{hidden:e.target.checked}))}})),O.a.createElement(le,null,O.a.createElement(S.a,{child:"Cancel",onClick:function(){return u("")},size:"sm",variant:"secondary"}),O.a.createElement(S.a,{child:"Save",onClick:function(i){return function(n,i){return U(void 0,void 0,void 0,(function(){var c,l,s;return H(this,(function(p){switch(p.label){case 0:return n.preventDefault(),e.setLoading(!0),[4,N(i,f)];case 1:return c=p.sent(),r(t.map((function(e){return e.id===i?c:e}))),l=t.filter((function(e){return e.hidden&&e.id!==i})).map((function(e){return e.id})),f.hidden&&l.push(i),s=o.filter((function(e){return-1===l.indexOf(e.accountID)})),a(s),u(""),e.setLoading(!1),[2]}}))}))}(i,n.id)},size:"sm",variant:"primary",submit:!0,style:{marginLeft:10}}))):null);var i}))),O.a.createElement(S.a,{child:"Sign Out",variant:"danger",style:{position:"absolute",right:20},onClick:function(){return e.openAccountDeleteModal(n)}}));var c,s,d,h,y})))},se=t(581),fe=function(e,n,t,r){return new(t||(t=Promise))((function(o,a){function i(e){try{l(r.next(e))}catch(e){a(e)}}function c(e){try{l(r.throw(e))}catch(e){a(e)}}function l(e){var n;e.done?o(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(i,c)}l((r=r.apply(e,n||[])).next())}))},pe=function(e,n){var t,r,o,a,i={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return a={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function c(a){return function(c){return function(a){if(t)throw new TypeError("Generator is already executing.");for(;i;)try{if(t=1,r&&(o=2&a[0]?r.return:a[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,a[1])).done)return o;switch(r=0,o&&(a=[2&a[0],o.value]),a[0]){case 0:case 1:o=a;break;case 4:return i.label++,{value:a[1],done:!1};case 5:i.label++,r=a[1],a=[0];continue;case 7:a=i.ops.pop(),i.trys.pop();continue;default:if(!(o=i.trys,(o=o.length>0&&o[o.length-1])||6!==a[0]&&2!==a[0])){i=0;continue}if(3===a[0]&&(!o||a[1]>o[0]&&a[1]<o[3])){i.label=a[1];break}if(6===a[0]&&i.label<o[1]){i.label=o[1],o=a;break}if(o&&i.label<o[2]){i.label=o[2],i.ops.push(a);break}o[2]&&i.ops.pop(),i.trys.pop();continue}a=n.call(e,i)}catch(e){a=[6,e],r=0}finally{t=o=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,c])}}},de=function(e){var n=Object(E.useContext)(P.a),t=n.accounts,r=n.setAccounts;return O.a.createElement(se.a,{centered:!0,show:e.show},O.a.createElement(se.a.Body,null,O.a.createElement("div",null,"Are you sure you want to log out of this account?"),O.a.createElement("div",{style:{marginTop:10}},"Transactions from this account will be deleted")),O.a.createElement(se.a.Footer,null,O.a.createElement(S.a,{child:"Cancel",onClick:function(){return e.close()},variant:"secondary",size:"sm"}),O.a.createElement("br",null),O.a.createElement(S.a,{child:"Sign Out",onClick:function(){return fe(void 0,void 0,void 0,(function(){return pe(this,(function(n){switch(n.label){case 0:return e.setLoading(!0),[4,(o=e.batchID,z(void 0,void 0,void 0,(function(){var e;return F(this,(function(n){switch(n.label){case 0:return n.trys.push([0,2,,3]),[4,fetch("http://localhost:3000/api/plaidAccount/"+o,{method:"DELETE",credentials:"include"})];case 1:if(!n.sent().ok)throw Error("Bad response from server");return[3,3];case 2:throw e=n.sent(),Error("Error deleting accounts: "+e);case 3:return[2]}}))})))];case 1:return n.sent(),r(t.filter((function(n){return n.batchID!==e.batchID}))),e.setLoading(!1),e.close(),[2]}var o}))}))},variant:"danger",size:"sm"})))},he=t(27),ye=function(){return(ye=Object.assign||function(e){for(var n,t=1,r=arguments.length;t<r;t++)for(var o in n=arguments[t])Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o]);return e}).apply(this,arguments)},be=function(e,n,t,r){return new(t||(t=Promise))((function(o,a){function i(e){try{l(r.next(e))}catch(e){a(e)}}function c(e){try{l(r.throw(e))}catch(e){a(e)}}function l(e){var n;e.done?o(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(i,c)}l((r=r.apply(e,n||[])).next())}))},me=function(e,n){var t,r,o,a,i={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return a={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function c(a){return function(c){return function(a){if(t)throw new TypeError("Generator is already executing.");for(;i;)try{if(t=1,r&&(o=2&a[0]?r.return:a[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,a[1])).done)return o;switch(r=0,o&&(a=[2&a[0],o.value]),a[0]){case 0:case 1:o=a;break;case 4:return i.label++,{value:a[1],done:!1};case 5:i.label++,r=a[1],a=[0];continue;case 7:a=i.ops.pop(),i.trys.pop();continue;default:if(!(o=i.trys,(o=o.length>0&&o[o.length-1])||6!==a[0]&&2!==a[0])){i=0;continue}if(3===a[0]&&(!o||a[1]>o[0]&&a[1]<o[3])){i.label=a[1];break}if(6===a[0]&&i.label<o[1]){i.label=o[1],o=a;break}if(o&&i.label<o[2]){i.label=o[2],i.ops.push(a);break}o[2]&&i.ops.pop(),i.trys.pop();continue}a=n.call(e,i)}catch(e){a=[6,e],r=0}finally{t=o=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,c])}}},ve=function(e,n){var t="function"==typeof Symbol&&e[Symbol.iterator];if(!t)return e;var r,o,a=t.call(e),i=[];try{for(;(void 0===n||n-- >0)&&!(r=a.next()).done;)i.push(r.value)}catch(e){o={error:e}}finally{try{r&&!r.done&&(t=a.return)&&t.call(a)}finally{if(o)throw o.error}}return i},we=function(e,n){switch(n.type){case"SET_LOADING":return ye(ye({},e),{loading:n.loading});case"SET_TOKEN":return ye(ye({},e),{token:n.token});case"SHOW_ACCOUNT_DELETE_MODAL":return ye(ye({},e),{modal:{show:!0,batchID:n.batchID}});case"HIDE_ACCOUNT_DELETE_MODAL":return ye(ye({},e),{modal:{show:!1,batchID:""}});default:return e}};n.default=function(){var e=Object(E.useContext)(P.a).accounts,n=ve(Object(E.useReducer)(we,{loading:!1,token:"",modal:{show:!1,batchID:""}}),2),t=n[0],r=n[1];return Object(E.useEffect)((function(){be(void 0,void 0,void 0,(function(){var e,n,t;return me(this,(function(o){switch(o.label){case 0:return o.trys.push([0,3,,4]),[4,fetch("http://localhost:3000/api/plaid/create_link_token",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include"})];case 1:if(!(e=o.sent()).ok)throw Error("Bad response from server");return[4,e.json()];case 2:return n=o.sent(),r({type:"SET_TOKEN",token:n}),[3,4];case 3:throw t=o.sent(),Error("Error fetching link token: "+t);case 4:return[2]}}))}))}),[]),O.a.createElement(O.a.Fragment,null,O.a.createElement(_,{token:t.token}),O.a.createElement(ue,{setLoading:function(e){return r({type:"SET_LOADING",loading:e})},accounts:e,openAccountDeleteModal:function(e){return r({type:"SHOW_ACCOUNT_DELETE_MODAL",batchID:e})}}),O.a.createElement(de,{setLoading:function(e){return r({type:"SET_LOADING",loading:e})},show:t.modal.show,close:function(){return r({type:"HIDE_ACCOUNT_DELETE_MODAL"})},batchID:t.modal.batchID}),O.a.createElement(he.a,{backdrop:!0,show:t.loading}))}}}]);