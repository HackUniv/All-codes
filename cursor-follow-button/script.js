const tracker = document.querySelector(".tracker");
document.body.addEventListener("mousemove", (e) => {
  tracker.style.left = `${e.clientX}px`;
  tracker.style.top = `${e.clientY}px`;
});
