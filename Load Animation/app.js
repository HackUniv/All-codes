import Splitting from "https://cdn.skypack.dev/splitting";

Splitting();

let el = document.body;
el.addEventListener("click", function (e) {
  el.hidden = true;
  requestAnimationFrame(() => {
    el.hidden = false;
  });
});
