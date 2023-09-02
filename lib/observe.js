// https://libs.gullerya.com/object-observer/6.1.1/object-observer.min.js
// export{v as Observable,k as ObjectObserver};
const m="insert",x="update",E="delete",T="reverse",K="shuffle",c=Symbol.for("object-observer-meta-key-0"),$={async:1},N=o=>{if(!o||typeof o!="object")return null;const t={},e=[];for(const[r,n]of Object.entries(o))if(r==="path"){if(typeof n!="string"||n==="")throw new Error('"path" option, if/when provided, MUST be a non-empty string');t[r]=n}else if(r==="pathsOf"){if(o.path)throw new Error('"pathsOf" option MAY NOT be specified together with "path" option');if(typeof n!="string")throw new Error('"pathsOf" option, if/when provided, MUST be a string (MAY be empty)');t[r]=o.pathsOf.split(".").filter(Boolean)}else if(r==="pathsFrom"){if(o.path||o.pathsOf)throw new Error('"pathsFrom" option MAY NOT be specified together with "path"/"pathsOf" option/s');if(typeof n!="string"||n==="")throw new Error('"pathsFrom" option, if/when provided, MUST be a non-empty string');t[r]=n}else e.push(r);if(e.length)throw new Error(`'${e.join(", ")}' is/are not a valid observer option/s`);return t},Y=(o,t,e)=>{const r={};r[c]=t;for(const n in o)r[n]=g(o[n],n,t,e);return r},I=(o,t,e)=>{let r=o.length;const n=new Array(r);n[c]=t;for(let i=0;i<r;i++)n[i]=g(o[i],i,t,e);return n},B=(o,t)=>(o[c]=t,o),D=(o,t)=>{if(o===null)return t;let e=t;if(o.path){const r=o.path;e=t.filter(n=>n.path.join(".")===r)}else if(o.pathsOf){const r=o.pathsOf,n=r.join(".");e=t.filter(i=>(i.path.length===r.length+1||i.path.length===r.length&&(i.type===T||i.type===K))&&i.path.join(".").startsWith(n))}else if(o.pathsFrom){const r=o.pathsFrom;e=t.filter(n=>n.path.join(".").startsWith(r))}return e},R=(o,t)=>{try{o(t)}catch(e){console.error(`failed to notify listener ${o} with ${t}`,e)}},z=function(){const t=this.batches;this.batches=[];for(const[e,r]of t)R(e,r)},y=(o,t)=>{let e=o,r,n,i,l,h,s;const u=t.length;do{for(r=e.options.async,n=e.observers,s=n.length;s--;)if([i,l]=n[s],h=D(l,t),h.length)if(r){e.batches.length===0&&queueMicrotask(z.bind(e));let a;for(const p of e.batches)if(p[0]===i){a=p;break}a||(a=[i,[]],e.batches.push(a)),Array.prototype.push.apply(a[1],h)}else R(i,h);const f=e.parent;if(f){for(let a=0;a<u;a++){const p=t[a];t[a]=new b(p.type,[e.ownKey,...p.path],p.value,p.oldValue,p.object)}e=f}else e=null}while(e)},g=(o,t,e,r)=>r!==void 0&&r.has(o)?null:typeof o!="object"||o===null?o:Array.isArray(o)?new U({target:o,ownKey:t,parent:e,visited:r}).proxy:ArrayBuffer.isView(o)?new W({target:o,ownKey:t,parent:e}).proxy:o instanceof Date?o:new V({target:o,ownKey:t,parent:e,visited:r}).proxy,q=function(){const t=this[c],e=t.target,r=e.length-1;let n=e.pop();if(n&&typeof n=="object"){const l=n[c];l&&(n=l.detach())}const i=[new b(E,[r],void 0,n,this)];return y(t,i),n},H=function(){const t=this[c],e=t.target,r=arguments.length,n=new Array(r),i=e.length;for(let s=0;s<r;s++)n[s]=g(arguments[s],i+s,t);const l=Reflect.apply(e.push,e,n),h=[];for(let s=i,u=e.length;s<u;s++)h[s-i]=new b(m,[s],e[s],void 0,this);return y(t,h),l},G=function(){const t=this[c],e=t.target;let r,n,i,l,h;for(r=e.shift(),r&&typeof r=="object"&&(h=r[c],h&&(r=h.detach())),n=0,i=e.length;n<i;n++)l=e[n],l&&typeof l=="object"&&(h=l[c],h&&(h.ownKey=n));const s=[new b(E,[0],void 0,r,this)];return y(t,s),r},J=function(){const t=this[c],e=t.target,r=arguments.length,n=new Array(r);for(let s=0;s<r;s++)n[s]=g(arguments[s],s,t);const i=Reflect.apply(e.unshift,e,n);for(let s=0,u=e.length,f;s<u;s++)if(f=e[s],f&&typeof f=="object"){const a=f[c];a&&(a.ownKey=s)}const l=n.length,h=new Array(l);for(let s=0;s<l;s++)h[s]=new b(m,[s],e[s],void 0,this);return y(t,h),i},F=function(){const t=this[c],e=t.target;let r,n,i;for(e.reverse(),r=0,n=e.length;r<n;r++)if(i=e[r],i&&typeof i=="object"){const h=i[c];h&&(h.ownKey=r)}const l=[new b(T,[],void 0,void 0,this)];return y(t,l),this},P=function(t){const e=this[c],r=e.target;let n,i,l;for(r.sort(t),n=0,i=r.length;n<i;n++)if(l=r[n],l&&typeof l=="object"){const s=l[c];s&&(s.ownKey=n)}const h=[new b(K,[],void 0,void 0,this)];return y(e,h),this},L=function(t,e,r){const n=this[c],i=n.target,l=[],h=i.length,s=i.slice(0);if(e=e===void 0?0:e<0?Math.max(h+e,0):Math.min(e,h),r=r===void 0?h:r<0?Math.max(h+r,0):Math.min(r,h),e<h&&r>e){i.fill(t,e,r);let u;for(let f=e,a,p;f<r;f++)a=i[f],i[f]=g(a,f,n),f in s?(p=s[f],p&&typeof p=="object"&&(u=p[c],u&&(p=u.detach())),l.push(new b(x,[f],i[f],p,this))):l.push(new b(m,[f],i[f],void 0,this));y(n,l)}return this},C=function(t,e,r){const n=this[c],i=n.target,l=i.length;t=t<0?Math.max(l+t,0):t,e=e===void 0?0:e<0?Math.max(l+e,0):Math.min(e,l),r=r===void 0?l:r<0?Math.max(l+r,0):Math.min(r,l);const h=Math.min(r-e,l-t);if(t<l&&t!==e&&h>0){const s=i.slice(0),u=[];i.copyWithin(t,e,r);for(let f=t,a,p,O;f<t+h;f++)a=i[f],a&&typeof a=="object"&&(a=g(a,f,n),i[f]=a),p=s[f],p&&typeof p=="object"&&(O=p[c],O&&(p=O.detach())),!(typeof a!="object"&&a===p)&&u.push(new b(x,[f],a,p,this));y(n,u)}return this},Q=function(){const t=this[c],e=t.target,r=arguments.length,n=new Array(r),i=e.length;for(let w=0;w<r;w++)n[w]=g(arguments[w],w,t);const l=r===0?0:n[0]<0?i+n[0]:n[0],h=r<2?i-l:n[1],s=Math.max(r-2,0),u=Reflect.apply(e.splice,e,n),f=e.length;let a;for(let w=0,A;w<f;w++)A=e[w],A&&typeof A=="object"&&(a=A[c],a&&(a.ownKey=w));let p,O,j;for(p=0,O=u.length;p<O;p++)j=u[p],j&&typeof j=="object"&&(a=j[c],a&&(u[p]=a.detach()));const M=[];let d;for(d=0;d<h;d++)d<s?M.push(new b(x,[l+d],e[l+d],u[d],this)):M.push(new b(E,[l+d],void 0,u[d],this));for(;d<s;d++)M.push(new b(m,[l+d],e[l+d],void 0,this));return y(t,M),u},X=function(t,e){const r=this[c],n=r.target,i=t.length,l=n.slice(0);e=e||0,n.set(t,e);const h=new Array(i);for(let s=e;s<i+e;s++)h[s-e]=new b(x,[s],n[s],l[s],this);y(r,h)},Z={pop:q,push:H,shift:G,unshift:J,reverse:F,sort:P,fill:L,copyWithin:C,splice:Q},_={reverse:F,sort:P,fill:L,copyWithin:C,set:X};class b{constructor(t,e,r,n,i){this.type=t,this.path=e,this.value=r,this.oldValue=n,this.object=i}}class S{constructor(t,e){const{target:r,parent:n,ownKey:i,visited:l=new Set}=t;n&&i!==void 0?(this.parent=n,this.ownKey=i):(this.parent=null,this.ownKey=null),l.add(r);const h=e(r,this,l);l.delete(r),this.observers=[],this.revocable=Proxy.revocable(h,this),this.proxy=this.revocable.proxy,this.target=h,this.options=this.processOptions(t.options),this.options.async&&(this.batches=[])}processOptions(t){if(t){if(typeof t!="object")throw new Error(`Observable options if/when provided, MAY only be an object, got '${t}'`);const e=Object.keys(t).filter(r=>!(r in $));if(e.length)throw new Error(`'${e.join(", ")}' is/are not a valid Observable option/s`);return Object.assign({},t)}else return{}}detach(){return this.parent=null,this.target}set(t,e,r){let n=t[e];if(r!==n){const i=g(r,e,this);if(t[e]=i,n&&typeof n=="object"){const h=n[c];h&&(n=h.detach())}const l=n===void 0?[new b(m,[e],i,void 0,this.proxy)]:[new b(x,[e],i,n,this.proxy)];y(this,l)}return!0}deleteProperty(t,e){let r=t[e];if(delete t[e],r&&typeof r=="object"){const i=r[c];i&&(r=i.detach())}const n=[new b(E,[e],void 0,r,this.proxy)];return y(this,n),!0}}class V extends S{constructor(t){super(t,Y)}}class U extends S{constructor(t){super(t,I)}get(t,e){return Z[e]||t[e]}}class W extends S{constructor(t){super(t,B)}get(t,e){return _[e]||t[e]}}const v=Object.freeze({from:(o,t)=>{if(!o||typeof o!="object")throw new Error("observable MAY ONLY be created from a non-null object");if(o[c])return o;if(Array.isArray(o))return new U({target:o,ownKey:null,parent:null,options:t}).proxy;if(ArrayBuffer.isView(o))return new W({target:o,ownKey:null,parent:null,options:t}).proxy;if(o instanceof Date)throw new Error(`${o} found to be one of a non-observable types`);return new V({target:o,ownKey:null,parent:null,options:t}).proxy},isObservable:o=>!!(o&&o[c]),observe:(o,t,e)=>{if(!v.isObservable(o))throw new Error("invalid observable parameter");if(typeof t!="function")throw new Error(`observer MUST be a function, got '${t}'`);const r=o[c].observers;r.some(n=>n[0]===t)?console.warn("observer may be bound to an observable only once; will NOT rebind"):r.push([t,N(e)])},unobserve:(o,...t)=>{if(!v.isObservable(o))throw new Error("invalid observable parameter");const e=o[c].observers;let r=e.length;if(r){if(!t.length){e.splice(0);return}for(;r;)t.indexOf(e[--r][0])>=0&&e.splice(r,1)}}});class k{#t;#e;constructor(t){this.#t=t,this.#e=new Set,Object.freeze(this)}observe(t,e){const r=v.from(t);return v.observe(r,this.#t,e),this.#e.add(r),r}unobserve(t){v.unobserve(t,this.#t),this.#e.delete(t)}disconnect(){for(const t of this.#e)v.unobserve(t,this.#t);this.#e.clear()}}
//# sourceMappingURL=object-observer.min.js.map