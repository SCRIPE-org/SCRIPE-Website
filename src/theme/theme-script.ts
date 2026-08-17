export const THEME_SCRIPT = `(function(){try{
var t=localStorage.getItem("scripe-theme");
var dark=t==="light"?false:t==="dark"?true:!matchMedia("(prefers-color-scheme: light)").matches;
var e=document.documentElement;
e.setAttribute("data-theme",dark?"dark":"light");
e.style.colorScheme=dark?"dark":"light";
var m=document.querySelector('meta[name="theme-color"]');
if(m)m.setAttribute("content",dark?"#0B0B0E":"#F1F2F2");
}catch(e){}})();`;
