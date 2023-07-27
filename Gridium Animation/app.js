"use strict";

window.addEventListener("load", function () {
  let canv, ctx; // canvas and context
  let maxx, maxy; // canvas dimensions

  const NUM_ATOMS = 500; // base to calculate number of atoms. Actual number may differ
  const DIAMETER_RATIO = 0.6; // ratio particle diameter / distance between particle centers
  const REL_PHOTON_SPEED = 10; // speed in aDist / second
  const EMISSIVITY = 1.5; // average number of photons emitted during disintegration
  const PHOTON_TRAIL = 3; // in aDist;
  const DISAPPEAR_TIME = 1000; // average time for atom disappearance

  let aDist, aRadius; // actual distance between atoms centers, actual radius
  let pRadius; // radius of emited particle

  let pSpeed; // actual REL_PART_SPEED converted in pix / ms
  let pTrail; // actual PHOTON_TRAIL converted in pixels
  let tTrail;
  let numExploding;

  let nbx, nby;
  let offsX, offsY;
  let crystal, photons;

  // for animation
  let messages;

  // shortcuts for Math.
  const mrandom = Math.random;
  const mfloor = Math.floor;
  const mround = Math.round;
  const mceil = Math.ceil;
  const mabs = Math.abs;
  const mmin = Math.min;
  const mmax = Math.max;

  const mPI = Math.PI;
  const mPIS2 = Math.PI / 2;
  const mPIS3 = Math.PI / 3;
  const m2PI = Math.PI * 2;
  const m2PIS3 = (Math.PI * 2) / 3;
  const msin = Math.sin;
  const mcos = Math.cos;
  const matan2 = Math.atan2;

  const mhypot = Math.hypot;
  const msqrt = Math.sqrt;

  //------------------------------------------------------------------------

  function alea(mini, maxi) {
    // random number in given range
    if (typeof maxi == "undefined") return mini * mrandom(); // range 0..mini
    return mini + mrandom() * (maxi - mini); // range mini..maxi
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function intAlea(mini, maxi) {
    // random integer in given range (mini..maxi - 1 or 0..mini - 1)
    //
    if (typeof maxi == "undefined") return mfloor(mini * mrandom()); // range 0..mini - 1
    return mini + mfloor(mrandom() * (maxi - mini)); // range mini .. maxi - 1
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function distance(p0, p1) {
    return mhypot(p1.x - p0.x, p1.y - p0.y);
  } // distance

  //------------------------------------------------------------------------
  class Photon {
    constructor(atom, t) {
      this.atom = atom;
      this.c = atom.c; // initial position
      this.p = Object.assign({}, atom.c); // current position
      this.pkx = atom.kx; // previous kx and ky
      this.pky = atom.ky;
      this.tInit = t;
      const angle = alea(m2PI);
      this.sin = msin(angle) * pSpeed;
      this.cos = mcos(angle) * pSpeed;
      this.animState = 0;
      this.color = `hsl(${atom.hue} 100% 50%)`;
      this.trailingColor = `hsl(${atom.hue} 60% 30%)`;
    } // constructor

    animate(t) {
      const dt = t - this.tInit;
      switch (this.animState) {
        case 0:
          this.p.x = this.c.x + this.cos * dt;
          this.p.y = this.c.y + this.sin * dt;
          let kx = mround((this.p.x - offsX) / aDist);
          let ky = mround((this.p.y - offsY) / aDist);
          if (kx == this.atom.kx && ky == this.atom.ky) return; // no suicide !

          let currDist;
          while (mabs(this.pkx - kx) + mabs(this.pky - ky) > 1) {
            // check all atoms between previous and present positions (may be far !)
            /* try to move 1 cell in X and Y directions, and keep closest */
            let d1, d2;
            let currC = crystal[this.pky][this.pkx];
            if (currDist === undefined) currDist = this.distancePerp(currC.c);

            if (currDist < pRadius + aRadius && currC.animState == 0) {
              // hit !
              this.hitPosition = this.projection(currC.c);
              currC.disintegrate(t);
              this.animState = 15; // hit detected during too long step
              return;
            }
            // choose next
            let nkx = this.cos > 0 ? this.pkx + 1 : this.pkx - 1;
            if (nkx < 0 || nkx >= nbx) d1 = 1e99;
            else d1 = this.distancePerp(crystal[this.pky][nkx].c);
            let nky = this.sin > 0 ? this.pky + 1 : this.pky - 1;
            if (nky < 0 || nky >= nby) d2 = 1e99;
            else d2 = this.distancePerp(crystal[nky][this.pkx].c);
            if (d1 < d2) {
              // move in x
              currDist = d1;
              this.pkx = nkx;
            } else {
              currDist = d2;
              this.pky = nky;
            }
            if (currDist > 1e98) {
              this.animState = 10; // exceeded screen limits
              return;
            }
          } // while

          if (kx < 0 || kx >= nbx || ky < 0 || ky >= nby) {
            this.animState = 10; // exceeded screen limits
            return;
          }

          this.pkx = kx;
          this.pky = ky; // record for next step

          if (crystal[ky][kx].animState == 0) {
            if (
              distance(this.p, crystal[ky][kx].c) < aRadius + pRadius ||
              dt * pSpeed > this.distProjection(crystal[ky][kx].c)
            ) {
              this.hitPosition = this.p; // not always accurate, but who cares ?
              crystal[ky][kx].disintegrate(t);
              this.animState = 15;
              return;
            }
          }
          break;

        case 10:
          photons.splice(photons.indexOf(this), 1); // remove from list
          break;

        case 15:
          // play come animation
          this.animState = 10; // done
          break;
      } // switch (animState)
    } // animate

    distancePerp(p) {
      // calculates distance between point p and trajectory of this
      return (
        mabs((p.x - this.c.x) * this.sin - (p.y - this.c.y) * this.cos) / pSpeed
      );
    } // distancePerp

    distProjection(p) {
      /* may be < 0 si photon direction is oriented - always > 0 in this application */
      return (
        ((p.x - this.c.x) * this.cos + (p.y - this.c.y) * this.sin) / pSpeed
      );
    } // distProjection

    projection(p) {
      // calculates projection of point p on trajectory of this
      let dist = this.distProjection(p);
      return {
        x: this.c.x + (dist * this.cos) / pSpeed,
        y: this.c.y + (dist * this.sin) / pSpeed
      };
    } // projection

    draw(t) {
      if (this.animState != 0) return;
      let pStart = this.c;
      if (t - this.tInit > tTrail) {
        // full trail
        pStart = {
          x: this.p.x - this.cos * tTrail,
          y: this.p.y - this.sin * tTrail
        };
      }
      ctx.beginPath();
      ctx.moveTo(pStart.x, pStart.y);
      ctx.lineTo(this.p.x, this.p.y);
      ctx.lineWidth = 2;
      ctx.strokeStyle = this.trailingColor;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(this.p.x, this.p.y, pRadius, 0, m2PI);
      ctx.fillStyle = this.color;
      ctx.fill();
    } // draw
  } // Photon
  //------------------------------------------------------------------------
  //------------------------------------------------------------------------

  class Atom {
    constructor(kx, ky, t) {
      this.kx = kx;
      this.ky = ky;
      this.c = { x: kx * aDist + offsX, y: ky * aDist + offsY };
      this.animState = 0; // steady state, waiting for disintegration
      this.tInit = 0; // not used before disintegration
    } // constructor

    disintegrate(t) {
      this.hue = intAlea(360);
      this.tInit = t;
      for (let k = 0; k < mfloor(EMISSIVITY); ++k)
        photons.push(new Photon(this, t)); // integer part of emissivity
      if (alea(1) < EMISSIVITY - mfloor(EMISSIVITY))
        photons.push(new Photon(this, t)); // fractional part of emissivity
      this.animState = 1;
      ++numExploding;
    } // desintegrate

    draw(radius, color) {
      ctx.beginPath();
      ctx.arc(this.c.x, this.c.y, radius, 0, m2PI);
      ctx.fillStyle = color;
      ctx.fill();
    }

    animate(t) {
      const dt = t - this.tInit;
      const alpha = dt / DISAPPEAR_TIME;
      switch (this.animState) {
        case 0:
          this.draw(aRadius, "#888");
          break;

        case 1:
          if (alpha > 1) {
            --numExploding;
            this.animState = 5; // dead end - nothing more will happen to this atom
            return;
          }
          this.draw(
            aRadius * (1 - alpha),
            `hsl(${this.hue} 100% ${40 + 50 * alpha}%)`
          );

          break;
      } // switch
    } // animate
  } // class Atom
  //------------------------------------------------------------------------

  let animate;

  {
    // scope for animate

    let animState = 0;

    animate = function (tStamp) {
      let message;

      message = messages.shift();
      if (message && message.message == "reset") animState = 0;
      if (message && message.message == "click") animState = 0;
      window.requestAnimationFrame(animate);

      let t = performance.now();

      switch (animState) {
        case 0:
          if (startOver()) {
            ++animState;
          }
          break;

        case 1:
          crystal[mround(nby / 2)][mround(nbx / 2)].disintegrate(t);
          ++animState;
          break;

        case 2:
          ctx.fillStyle = "#000";
          ctx.fillRect(0, 0, maxx, maxy);
          crystal.forEach((row) => row.forEach((atom) => atom.animate(t)));
          photons.forEach((photon) => {
            photon.animate(t), photon.draw(t);
          });
          if (photons.length == 0 && !numExploding) animState++;
          break;
      } // switch
    }; // animate
  } // scope for animate

  //------------------------------------------------------------------------
  //------------------------------------------------------------------------

  function startOver() {
    // canvas dimensions

    maxx = window.innerWidth;
    maxy = window.innerHeight;

    canv.width = maxx;
    canv.height = maxy;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, maxx, maxy);

    aDist = msqrt(((maxx * maxy) / NUM_ATOMS) * alea(0.3, 1.25));
    nbx = mfloor((maxx - 10) / aDist + 1 - DIAMETER_RATIO);
    nby = mfloor((maxy - 10) / aDist + 1 - DIAMETER_RATIO);

    aRadius = (aDist * DIAMETER_RATIO) / 2;
    pRadius = mmax(3, aDist / 10);

    offsX = (maxx - aDist * (nbx - 1)) / 2;
    offsY = (maxy - aDist * (nby - 1)) / 2;
    let t = performance.now();
    crystal = new Array(nby)
      .fill(0)
      .map((v, ky) =>
        new Array(nbx).fill(0).map((v, kx) => new Atom(kx, ky, t))
      );
    photons = [];
    pSpeed = (REL_PHOTON_SPEED * aDist) / 1000;
    pTrail = PHOTON_TRAIL * aDist;
    tTrail = pTrail / pSpeed; // time before photon trail becomes full length
    numExploding = 0;
    return true;
  } // startOver

  //------------------------------------------------------------------------

  function mouseClick(event) {
    messages.push({ message: "click" });
  } // mouseClick

  //------------------------------------------------------------------------
  //------------------------------------------------------------------------
  // beginning of execution

  {
    canv = document.createElement("canvas");
    canv.style.position = "absolute";
    document.body.appendChild(canv);
    ctx = canv.getContext("2d");
    canv.setAttribute("title", "click me");
  } // création CANVAS
  canv.addEventListener("click", mouseClick);
  messages = [{ message: "reset" }];
  requestAnimationFrame(animate);
}); // window load listener
