console.clear();
const log = console.log.bind(console);

const svgns = "http://www.w3.org/2000/svg";

SVGElement.prototype.getTransformToElement =
  SVGElement.prototype.getTransformToElement || function (toElement) {
    return toElement.getScreenCTM().inverse().multiply(this.getScreenCTM());
  };

//
// RIPPLE
// ===========================================================================
class Ripple {
  element = document.createElementNS(svgns, "circle");

  constructor(x, y, public color) {
    const dx = x - offsetX;
    const dy = y - offsetY;

    const element = this.element;
    const radius = this.getRadius(dx, dy, phoneRect.width, phoneRect.height);

    rippleLayer.appendChild(element);

    element.setAttribute("r", 5);

    TweenLite.set(element, {
      transformOrigin: "center",
      fill: color,
      x: x,
      y: y,
    });

    TweenLite.to(element, rippleDuration, {
      scale: radius / 2,
      ease: Power1.easeIn,
      callbackScope: this,
      onComplete: this.removeRipple,
    });
  }

  getRadius(x, y, w, h) {
    const cx = w / 2;
    const cy = h / 2;
    const dx = x < cx ? w - x : x;
    const dy = y < cy ? h - y : y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  removeRipple() {
    TweenLite.set(background, { fill: this.color });
    rippleLayer.removeChild(this.element);
  }
}

//
// COLOR ITEM
// ===========================================================================
class ColorItem {
  itemElement = document.createElement("color-item");

  constructor(public color) {
    const itemElement = this.itemElement;
    colorPicker.appendChild(itemElement);

    TweenLite.set([itemElement], {
      backgroundColor: color,
      cursor: "pointer", // Set the cursor to pointer
    });

    // Add a click event listener to change the color on click
    itemElement.addEventListener("click", this.onClick.bind(this));
  }

  onClick() {
    const x = this.itemElement.getBoundingClientRect().left;
    const y = this.itemElement.getBoundingClientRect().top;

    const point = toLocal(x, y);
    const ripple = new Ripple(point.x, point.y, this.color);
  }
}

//
// RECTANGLE
// ===========================================================================
class Rectangle {
  constructor(public x = 0, public y = 0, public width = 0, public height = 0) {}
  contains(x, y) {
    if (this.width <= 0 || this.height <= 0) {
      return false;
    }
    if (x >= this.x && x < this.x + this.width) {
      if (y >= this.y && y < this.y + this.height) {
        return true;
      }
    }
    return false;
  }
}

//
// POLYGON
// ===========================================================================
class Polygon {
  constructor(public points) {}
  contains(x, y) {
    let inside = false;
    const points = this.points;
    const size = points.length / 2;

    for (let i = 0, j = size - 1; i < size; j = i++) {
      const xi = points[i * 2];
      const yi = points[i * 2 + 1];
      const xj = points[j * 2];
      const yj = points[j * 2 + 1];
      const intersect =
        (yi > y) !== (yj > y) &&
        x < ((xj - xi) * ((y - yi) / (yj - yi))) + xi;

      if (intersect) {
        inside = !inside;
      }
    }

    return inside;
  }
}

//
// GLOBAL TO LOCAL
// ===========================================================================
function globalToLocal(element, svg) {
  const pt = svg.createSVGPoint();
  return (x, y) => {
    pt.x = x;
    pt.y = y;
    const globalPoint = pt.matrixTransform(svg.getScreenCTM().inverse());
    const localMatrix = element.getTransformToElement(svg).inverse();
    return globalPoint.matrixTransform(localMatrix);
  };
}

const colors = [
  "#244191",
  "#e8405d",
  "#88d3e1",
];

const rippleDuration = 0.5;

const svg = document.querySelector("#phone-svg");
const background = document.querySelector("#background");
const colorPicker = document.querySelector("color-picker");
const rippleLayer = document.querySelector("#ripple-layer");
const phoneOutline = document.querySelector("#phone-outline");
const shadowColor = document.querySelector("#shadow-color");
const shadowBlur = document.querySelector("#shadow-blur");

// Convert path data to polygon points
const pathData = MorphSVGPlugin.pathDataToBezier(phoneOutline);
const contour = simplify(getContour(pathData, 50), 5, false);

const points = contour.reduce((res, pt) => {
  res.push(roundTo(pt.x, 3));
  res.push(roundTo(pt.y, 3));
  return res;
}, []);

const box1 = phoneOutline.getBBox();
const box2 = background.getBBox();

// Shapes for hit testing
const phoneRect = new Rectangle(box1.x, box1.y, box1.width, box1.height);
const colorRect = new Rectangle(box2.x, box2.y, box2.width, box2.height);
const phonePoly = new Polygon(points);

const toLocal = globalToLocal(background, svg);
const offsetX = phoneRect.x - colorRect.x;
const offsetY = phoneRect.y - colorRect.y;

const outlineAnimation = new TimelineLite()
  .to(phoneOutline, rippleDuration * 0.75, { opacity: 1, ease: Sine.easeInOut })
  .reverse();

const colorItems = colors.map((color) => new ColorItem(color));

TweenLite.set("color-item", { autoAlpha: 1 });
TweenLite.set("phone-container", { autoAlpha: 0, scale: 0.5 });

window.addEventListener("load", onLoad);
window.focus();

function onLoad() {
  TweenLite.to("phone-container", 0.55, { autoAlpha: 1, scale: 1 });
}

function roundTo(value, place = 0, base = 10) {
  const p = Math.pow(base, place);
  return Math.round(value * p) / p;
}