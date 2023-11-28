
// Man
const startingRenderSrc = document.querySelector('#man').src;

let shirtMaskTarget = document.querySelector('#shirt-target');
let shirtColorBlock = document.querySelector('#shirt-color-block');
let colorInput = document.getElementById('input-color-shirt');
colorInput.addEventListener('change', (event) => {
  setColorLayer(event.target.value, 'shirt', shirtColorBlock);
});  
let optionsColor1 = document.querySelectorAll('.color-1 .preset');
optionsColor1.forEach(option => {
  option.addEventListener('click', ()=>{
    setColorLayer(option.dataset.color, 'shirt', shirtColorBlock);
  });
});
setShadowLayer(startingRenderSrc, shirtMaskTarget, 'shirt');

let pantsMaskTarget = document.querySelector('#pants-target');
let pantsColorBlock = document.querySelector('#pants-color-block');
let colorInput2 = document.getElementById('input-color-pants');
colorInput2.addEventListener('change', (event) => {
  setColorLayer(event.target.value, 'pants', pantsColorBlock);
}); 
let optionsColor2 = document.querySelectorAll('.color-2 .preset');
optionsColor2.forEach(option => {
  option.addEventListener('click', ()=>{
    setColorLayer(option.dataset.color, 'pants', pantsColorBlock);
  });
});
setShadowLayer(startingRenderSrc, pantsMaskTarget, 'pants');

// Woman
const startingRenderSrcW = document.querySelector('#woman').src;

let blouseMaskTarget = document.querySelector('#blouse-target');
let blouseColorBlock = document.querySelector('#blouse-color-block');
colorInput.addEventListener('change', (event) => {
  setColorLayer(event.target.value, 'blouse', blouseColorBlock);
});
optionsColor1.forEach(option => {
  option.addEventListener('click', ()=>{
    setColorLayer(option.dataset.color, 'blouse', blouseColorBlock);
  });
});
setShadowLayer(startingRenderSrcW, blouseMaskTarget, 'blouse');

let skirtMaskTarget = document.querySelector('#skirt-target');
let skirtColorBlock = document.querySelector('#skirt-color-block');
colorInput2.addEventListener('change', (event) => {
  setColorLayer(event.target.value, 'skirt', skirtColorBlock);
});
optionsColor2.forEach(option => {
  option.addEventListener('click', ()=>{
    setColorLayer(option.dataset.color, 'skirt', skirtColorBlock);
  });
});
setShadowLayer(startingRenderSrcW, skirtMaskTarget, 'skirt');


function setColorLayer(color, objName, targetClrBlock ){
  const selectedColor = color;
  const selectedColorRGB = hexToRgb(selectedColor);
  const xr = selectedColorRGB.r;
  const xg = selectedColorRGB.g;
  const xb = selectedColorRGB.b

  const shadowLayer = document.querySelector(`.shadows_${objName}`);
  shadowLayer.style.display = 'unset';
  shadowLayer.style.filter = 'drop-shadow(rgba(0, 0, 0, 1) 0px 0px 0px)';
  
  if ( isAchromatic(xr , xg, xb) ){
    if ( xr + xg + xb < 45 ) {
      shadowLayer.style.mixBlendMode = 'hard-light';
      shadowLayer.style.filter = 'drop-shadow(rgba(0, 0, 0, 0) 0px 0px 0px)';
    } else if( xr < 195 && xg < 195 && xb < 195 ) {
      shadowLayer.style.mixBlendMode = 'color-burn';
    } else {
      shadowLayer.style.mixBlendMode = 'normal';
    }
  } else {
    if ( xr + xg + xb < 45 ) {
      shadowLayer.style.mixBlendMode = 'hard-light';
    } else if( xr < 195 && xg < 195 && xb < 195 ) {
      shadowLayer.style.mixBlendMode = 'color-burn';
    } else {
      shadowLayer.style.mixBlendMode = 'multiply';
    };
  };

  targetClrBlock.style.backgroundColor = selectedColor;
}

function setShadowLayer(stRenderSrc, mskTarget, objName) {
  var img = new Image();
  img.src = stRenderSrc;
  img.crossOrigin = "";
  img.onload = function() {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
  
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const grayscale = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      data[i + 3] = 255 - grayscale;
    }
  
    ctx.putImageData(imageData, 0, 0);
    const newImg = new Image();
    newImg.src = canvas.toDataURL();
    mskTarget.appendChild(newImg);
    newImg.classList.add(`shadows_${objName}`);
  };
}

function isAchromatic(r, g, b) {
  const grayscale = 0.299 * r + 0.587 * g + 0.114 * b;

  // Check if the color is within a certain tolerance of grayscale
  const tolerance = 50;
  return Math.abs(r - grayscale) < tolerance &&
          Math.abs(g - grayscale) < tolerance &&
          Math.abs(b - grayscale) < tolerance;
}
  
function hexToRgb(hex) {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return { r, g, b };
}

var optionsbg = document.querySelectorAll('.option');
optionsbg.forEach(ele => {
  if (ele.dataset.color != null){
    ele.style.background = ele.dataset.color;
  } else {
    ele.style.background = 'linear-gradient(70deg, #3f87a6, #ebf8e1, #f69d3c, #561423)';
  }
});


function toggleMF(mf, fm){
  let mfTog = document.querySelectorAll(`.${mf}`);
  let fmTog = document.querySelectorAll(`.${fm}`);
  mfTog.forEach(mtog => {
    if(!mtog.classList.contains('active')){
      fmTog.forEach(wtog=>{
        wtog.classList.remove('active')
      })
      mtog.classList.add('active')
    }
  });
}
document.querySelector('.gender .man').addEventListener('click', ()=>{toggleMF('man', 'woman')});
document.querySelector('.gender .woman').addEventListener('click', ()=>{toggleMF('woman', 'man')});