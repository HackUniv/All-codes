const SVG_NS = "http://www.w3.org/2000/svg";
const MAX_FLOWER_AGE = 50;
const MAX_GROWTH_TICKS = 15;
const BRANCH_COLOR = "rgb(101, 67, 33)";
function shadeRGBColor(color, percent) {
  var f = color.split(","),
    t = percent < 0 ? 0 : 255,
    p = percent < 0 ? percent * -1 : percent,
    R = parseInt(f[0].slice(4)),
    G = parseInt(f[1]),
    B = parseInt(f[2]);
  return (
    "rgb(" +
    (Math.round((t - R) * p) + R) +
    "," +
    (Math.round((t - G) * p) + G) +
    "," +
    (Math.round((t - B) * p) + B) +
    ")"
  );
}

(() => {
  const maxDepth = 11, trunkWidth = 12;
  const branchShrinkage = 0.8;
  const maxAngleDelta = Math.PI / 2;
  const delay = 100;
  const svg = document.getElementById("svg");

  const scaleIncrement = 0.1;
  const flowerSize = 10.0;
  const dropIncrement = 2.0;
  const rotateIncrement = Math.PI * 2;

  let wind = 0;
  const windIncrement = 1;
  const maxWind = 2.0;

  const createFlower = ({ x, y, idx }) => {
    let telomeres = MAX_FLOWER_AGE;
    let growthPhase = 0;
    let attached = true;
    let hangPhase = 1;
    let scale = 0.5;
    let rotation = 0;
    const element = document.createElementNS(SVG_NS, "use");
    element.setAttribute("href", "#flower");
    element.setAttribute("style", "z-index: -1");

    const flower = {
      idx,

      grow() {
        growthPhase += 1;
        scale += scaleIncrement * Math.random();
      },

      drop() {
        y += dropIncrement * Math.random();
        x += dropIncrement * (Math.random() - 0.5) + wind;
        rotation += rotateIncrement * (Math.random() - 0.5);
      },

      transform() {
        const radius = scale * flowerSize / 2;
        element.setAttribute(
          "transform",
          `translate(${x - radius},${y - radius}) scale(${scale}) rotate(${rotation})`
        );
      },

      step() {
        if (y >= window.innerHeight - 2 * flowerSize) {
          telomeres -= 1;
        } else if (growthPhase >= MAX_GROWTH_TICKS) {
          if (attached) {
            attached = Math.random() < Math.pow(0.9999, hangPhase);
            hangPhase += 0.00001;
          } else {
            this.drop();
          }
        } else {
          this.grow();
        }

        this.transform();

        return telomeres;
      },

      delete() {
        svg.removeChild(element);
      }
    };

    flower.transform();

    // pick a random branch so it looks like the flowers are falling through them
    const { childNodes } = svg;
    const randomBranch =
      childNodes[Math.floor(Math.random() * childNodes.length)];
    svg.insertBefore(element, randomBranch);

    return flower;
  };

  const animateFlowers = branchEndings => {
    const branchesInUse = {};
    let flowers = [];

    const findFreeBranchIdx = () => {
      for (let i = 0; i < branchEndings.length; i++) {
        const idx = Math.floor(Math.random() * branchEndings.length);
        if (!branchesInUse[idx]) {
          branchesInUse[idx] = true;
          return idx;
        }
      }

      return -1;
    };

    const attachFlower = () => {
      const idx = findFreeBranchIdx();
      if (idx >= 0) {
        const branch = branchEndings[idx];
        flowers.push(createFlower(Object.assign({}, branch, { idx })));
      }
    };

    const tick = () => {
      flowers = flowers.reduce((acc, flower) => {
        if (flower.step() > 0) {
          return acc.concat([flower]);
        } else {
          console.log("deleting flower", flower.idx);
          flower.delete();
          delete branchesInUse[flower.idx];
          return acc;
        }
      }, []);

      Array(5).fill().forEach(() => {
        if (Math.random() < 0.02) {
          attachFlower();
        }
      });

      if (Math.random() < 0.02) {
        wind = Math.min(
          maxWind,
          wind + (Math.random() * 2 - 1) * windIncrement
        );
        wind = Math.max(-maxWind, wind);
      }

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const wrap = a => (Array.isArray(a) ? a : [a]);
  const flatten = a => {
    if (!Array.isArray(a)) {
      return a;
    }

    const [left, right] = a;
    return wrap(left).concat(wrap(right));
  };

  const drawBranch = (
    x1,
    y1,
    length,
    angle,
    depth,
    branchWidth,
    branchColor
  ) => {
    const x2 = x1 + length * Math.cos(angle);
    const y2 = y1 + length * Math.sin(angle);

    const line = document.createElementNS(SVG_NS, "line");
    const style = `stroke:${branchColor};stroke-width:${branchWidth};z-index:1;`;

    line.setAttribute("x1", x1);
    line.setAttribute("x2", x2);
    line.setAttribute("y1", y1);
    line.setAttribute("y2", y2);
    line.setAttribute("style", style);

    svg.appendChild(line);

    const newDepth = depth - 1;
    if (newDepth <= 0) {
      return Promise.resolve({ x: x2, y: y2 });
    }

    const newBranchWidth = branchWidth * branchShrinkage;
    const newBranchColor = shadeRGBColor(branchColor, 0.1);

    return Promise.map([-1, 1], direction => {
      const newAngle =
        angle + maxAngleDelta * (Math.random() * 0.5 * direction);
      const newLength =
        length * (branchShrinkage + Math.random() * (1.0 - branchShrinkage));

      return new Promise(resolve => {
        setTimeout(
          () =>
            resolve(
              drawBranch(
                x2,
                y2,
                newLength,
                newAngle,
                newDepth,
                newBranchWidth,
                newBranchColor
              )
            ),
          delay
        );
      });
    }).then(flatten);
  };

  const drawTree = (maxDepth, trunkWidth) => {
    return drawBranch(
      Math.floor(window.innerWidth / 2),
      Math.floor(window.innerHeight / 1.02),
      60,
      -Math.PI / 2,
      maxDepth,
      trunkWidth,
      BRANCH_COLOR
    );
  };

  const init = () => {
    svg.setAttribute("width", window.innerWidth);
    svg.setAttribute("height", window.innerHeight);
    drawTree(maxDepth, trunkWidth).then(animateFlowers);
  };

  init();
})();
