var pick = false;
const eps = document.querySelector('body').style;
eps.setProperty("--vol", '0.5' );

// SOUNDS
var s1 = elem('as1');
var s2 = elem('as2');
var s3 = elem('as3');
var s4 = elem('as4');
var s5 = elem('as5');
var s6 = elem('as6');

// FUNCTIONS 

// Short getElementById  
function elem(id){ return document.getElementById(id); }

// Check Audio
function isPlaying(aId) { return !aId.paused; }


// Pick String 
function pickString(thisString){
  if(pick == true) clickString(thisString);
}

// Click String
function clickString(thisString) {
  //reset
  if (isPlaying(window[thisString])) clearInterval(soundTimer); 
  window[thisString].pause();
  window[thisString].currentTime = 0; 
  elem(thisString).className = "string ";
    elem(thisString).offsetHeight; 
    elem(thisString).style.animation = null;
  //play
  window[thisString].play();
  elem('tuner-title').className='imgTitle';
  elem(thisString).classList.add('playing-sound');
  elem(thisString+'Note').className = "lightOn";
  elem(thisString+'Nota').className = "lightOn";
  //stop  
  var soundTimer = setInterval(function() {
    if (!isPlaying(window[thisString])) {
      if(window[thisString].loop != true){
        elem(thisString).className = "string";
        elem(thisString+'Note').className = "";
        elem(thisString+'Nota').className = "";
        if(document.querySelectorAll('.playing-sound').length==0){
          elem('tuner-title').classList.remove('imgTitle');
        }
      }
      clearInterval(soundTimer);
    }
  }, 200);
}

// Hold Sound
function holdSound(){
  if(s1.loop != true){
    s1.loop = s2.loop = s3.loop = s4.loop = s5.loop = s6.loop = true;
    elem('btnHold').className = "active";
  } else {
    s1.loop = s2.loop = s3.loop = s4.loop = s5.loop = s6.loop = false;
    elem('btnHold').className = "";
    s1.pause(); s2.pause(); s3.pause(); s4.pause(); s5.pause(); s6.pause(); 
    stopStrings();
  }
}

// Stop Strings
function stopStrings(){
  elem('tuner-title').className='';
  s1.pause(); s2.pause(); s3.pause(); s4.pause(); s5.pause(); s6.pause();
  var auxString = document.querySelectorAll('.playing-sound');  
  for (var x in auxString) {
    if(auxString[x]!==undefined){
      auxString[x].className = "string";
    }
  }
  var auxNote = document.querySelectorAll(".lightOn");
  for (x in auxNote) {
    if(auxNote[x]!==undefined){
      auxNote[x].className = "";
    }
  }
}

// Use Pick
function usePick(){
  if(elem('btnPick').className == ''){
    elem('btnPick').className = 'active';
    pick = true;
    elem('guitar-body').classList.add('pickActive');    
    elem('guitar-body').addEventListener('mousemove', pickChecked);   
  } else {
    elem('btnPick').className = '';
    pick = false;
    elem('guitar-body').classList.remove('pickActive');   
    elem('guitar-body').removeEventListener('mousemove', pickChecked);
  }
}

// Pick Checked
function pickChecked (event){
  var target = elem('move-pick');
  var xposition = (event.clientX - target.offsetLeft - target.offsetWidth/2);
  var yposition = (event.clientY - target.offsetTop - target.offsetHeight/2);
  target.style.transform = "translate("+ parseInt(xposition+40) + "px," + parseInt(yposition-40) + "px)";
  console.log(event);
}

// Set Volume
function setVolume(val) {
  eps.setProperty("--vol", val );
  elem('volume').nextElementSibling.innerText=val*10;
  var a = document.querySelectorAll('audio');
  for (var i = 0; i<a.length; i++){
    a[i].volume = val;
  }
}

// Change Guitar
function changeGuitar(id){
  stopStrings();
  elem('guitar-body').classList.toggle('e-classic');
  elem('guitar-body').classList.toggle('e-electric');
  var btns = document.querySelectorAll('.change-guitar');
  for (var i = 0; i<btns.length; i++) {
    btns[i].disabled=false;
  }
  elem(id).classList.add('active');
  elem(id).disabled=true;
  changeStrings();
}

// Chage Strings
function changeStrings() {
  if(elem('guitar-body').classList.contains('e-classic')) {
    s1.src="https://cdn.josetxu.com/audio/cgs-1.mp3";
    s2.src="https://cdn.josetxu.com/audio/cgs-2.mp3";
    s3.src="https://cdn.josetxu.com/audio/cgs-3.mp3";
    s4.src="https://cdn.josetxu.com/audio/cgs-4.mp3";
    s5.src="https://cdn.josetxu.com/audio/cgs-5.mp3";
    s6.src="https://cdn.josetxu.com/audio/cgs-6.mp3";
  } else {
    s1.src="https://cdn.josetxu.com/audio/egs-1.mp3";
    s2.src="https://cdn.josetxu.com/audio/egs-2.mp3";
    s3.src="https://cdn.josetxu.com/audio/egs-3.mp3";
    s4.src="https://cdn.josetxu.com/audio/egs-4.mp3";
    s5.src="https://cdn.josetxu.com/audio/egs-5.mp3";
    s6.src="https://cdn.josetxu.com/audio/egs-6.mp3";
  }
}