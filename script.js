/* -------- Live Clock -------- */
const liveClock = document.getElementById('live-clock');
const liveSub = document.getElementById('live-sub');
const set24Btn = document.getElementById('set-24');
const set12Btn = document.getElementById('set-12');
let use24 = true;

function pad(n){ return n.toString().padStart(2,'0'); }

function updateClock(){
  const now = new Date();
  let h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
  if(!use24){
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    liveClock.textContent = `${pad(h)}:${pad(m)}:${pad(s)} ${ampm}`;
  } else {
    liveClock.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
  }
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  liveSub.textContent = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
}
setInterval(updateClock, 1000);
updateClock();

set24Btn.addEventListener('click', ()=>{
  use24 = true;
  set24Btn.classList.add('primary');
  set12Btn.classList.remove('primary');
  updateClock();
});
set12Btn.addEventListener('click', ()=>{
  use24 = false;
  set12Btn.classList.add('primary');
  set24Btn.classList.remove('primary');
  updateClock();
});

/* -------- Stopwatch -------- */
const swDisplay = document.getElementById('sw-display');
const swStartBtn = document.getElementById('sw-start');
const swStopBtn = document.getElementById('sw-stop');
const swResetBtn = document.getElementById('sw-reset');

let swRunning=false, swStartTime=0, swElapsed=0, swTimerId;

/* Helper to highlight the clicked stopwatch button */
function highlightSWButton(clickedBtn){
  [swStartBtn, swStopBtn, swResetBtn].forEach(btn=>{
    btn.classList.remove('primary');
  });
  clickedBtn.classList.add('primary');
}

function formatStopwatch(ms){
  const totalCentis = Math.floor(ms/10);
  const centis = totalCentis % 100;
  const totalSec = Math.floor(totalCentis/100);
  const sec = totalSec % 60;
  const min = Math.floor(totalSec/60);
  return `${pad(min)}:${pad(sec)}.${pad(centis)}`;
}

function swTick(){
  const now = performance.now();
  swDisplay.textContent = formatStopwatch(swElapsed + (now - swStartTime));
  swTimerId = requestAnimationFrame(swTick);
}

swStartBtn.addEventListener('click', ()=>{
  if(!swRunning){
    swRunning=true;
    swStartTime = performance.now();
    swTimerId = requestAnimationFrame(swTick);
    swStartBtn.disabled = true;
    swStopBtn.disabled = false;
  }
  highlightSWButton(swStartBtn);
});

swStopBtn.addEventListener('click', ()=>{
  if(swRunning){
    swRunning=false;
    cancelAnimationFrame(swTimerId);
    swElapsed += performance.now() - swStartTime;
    swStartBtn.disabled = false;
    swStopBtn.disabled = true;
  }
  highlightSWButton(swStopBtn);
});

swResetBtn.addEventListener('click', ()=>{
  swRunning=false;
  cancelAnimationFrame(swTimerId);
  swElapsed=0;
  swStartTime=0;
  swDisplay.textContent='00:00.00';
  swStartBtn.disabled=false;
  swStopBtn.disabled=true;
  highlightSWButton(swResetBtn);
});
