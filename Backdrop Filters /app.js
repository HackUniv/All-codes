const rootElement = document.querySelector(':root');
const filters = document.querySelectorAll('.Filter');
const filterTrigger = document.querySelectorAll('.Header input');
let filterZIndex = 0;
let previousTouch = undefined;

function updateElementPosition(element, event) {
  let movementX, movementY;

  if (event.type === 'touchmove') {
    const touch = event.touches[0];
    movementX = previousTouch ? touch.clientX - previousTouch.clientX : 0;
    movementY = previousTouch ? touch.clientY - previousTouch.clientY : 0;
    console.log('touch', { movementX: movementX, newX: touch.clientX, oldX: previousTouch && previousTouch.clientX });
    previousTouch = touch;
  } else {
    movementX = event.movementX;
    movementY = event.movementY;
  }
  
  const elementY = parseInt(element.style.top || 0) + movementY;
  const elementX = parseInt(element.style.left|| 0) + movementX;

  element.style.top = elementY + "px";
  element.style.left = elementX + "px";
}

function startDrag(element, event) {
  updateZIndex(element);
  const updateFunction = (event) => updateElementPosition(element, event);
  const stopFunction = () => stopDrag({update: updateFunction, stop: stopFunction});
  document.addEventListener("mousemove", updateFunction);
  document.addEventListener("touchmove", updateFunction);
  document.addEventListener("mouseup", stopFunction);
  document.addEventListener("touchend", stopFunction);
}

function stopDrag(functions) {
  previousTouch = undefined;
  document.removeEventListener("mousemove", functions.update);
  document.removeEventListener("touchmove", functions.update);
  document.removeEventListener("mouseup", functions.stop);
  document.removeEventListener("touchend", functions.stop);
}

function updateZIndex(element) {
  element.style.zIndex = filterZIndex;
  filterZIndex++;
}

function inputHandler(event) {
  const unit = event.target.name === 'blur' ? 'px' :
               event.target.name === 'hue-rotate' ? 'deg' : '%';
  const value = `${event.target.value}${unit}`;
  rootElement.style.setProperty(`--filter-${event.target.name}`, value);
}

filterTrigger.forEach(trigger => {
  trigger.addEventListener('change', (event) => {
    const filter = document.querySelector(`.Filter[data-filter-name="${event.target.dataset.filterName}"]`);
    if (event.currentTarget.checked) {
      filter.removeAttribute("hidden");
      updateZIndex(filter);
    } else {
      filter.setAttribute("hidden", "");
    }
  })
});

filters.forEach(filter => {
  const inputElement = filter.querySelector('input');
  const lensElement = filter.querySelector('.Filter-lens');
  const startFunction = (event) => startDrag(filter, event);
  
  filter.style.top = `0px`;
  filter.style.left = `0px`;
  
  lensElement.addEventListener("mousedown", startFunction);
  lensElement.addEventListener("touchstart", startFunction);
  inputElement.addEventListener('input', inputHandler);
});