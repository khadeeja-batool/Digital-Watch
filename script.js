/* -------------------- Live Clock -------------------- */
const liveClock = document.getElementById('live-clock');
const liveSub = document.getElementById('live-sub');
const set24Btn = document.getElementById('set-24');
const set12Btn = document.getElementById('set-12');

let use24 = true;
function pad(n, width=2){ return String(n).padStart(width, '0'); }
function formatTime(date){
  const h = date.getHours(), m = date.getMinutes(), s = date.getSeconds();
  if(use24){ return `${pad(h)}:${pad(m)}:${pad(s)}`; }
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hh = ((h + 11) % 12) + 1;
  return `${pad(hh)}:${pad(m)}:${pad(s)} ${ampm}`;
}
function formatSub(date){
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${dayNames[date.getDay()]}, ${monthNames[date.getMonth()]} ${date.getDate()}`;
}
function updateClock(){
  const now = new Date();
  liveClock.textContent = formatTime(now);
  liveSub.textContent = formatSub(now);
}
setInterval(updateClock, 1000); updateClock();

function setFormat(v24){
  use24 = !!v24;
  set24Btn.classList.toggle('primary', use24);
  set12Btn.classList.toggle('primary', !use24);
  updateClock();
}
set24Btn.addEventListener('click', ()=> setFormat(true));
set12Btn.addEventListener('click', ()=> setFormat(false));
setFormat(true);

/* -------------------- Stopwatch -------------------- */
const swDisplay = document.getElementById('sw-display');
const swStartBtn = document.getElementById('sw-start');
const swStopBtn = document.getElementById('sw-stop');
const swResetBtn = document.getElementById('sw-reset');

let swRunning = false, swStartTime = 0, swElapsed = 0, swTimerId = null;
function formatStopwatch(ms){
  const totalCentis = Math.floor(ms/10);
  const centis = totalCentis % 100;
  const totalSeconds = Math.floor(totalCentis/100);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds/60);
  return `${pad(minutes)}:${pad(seconds)}.${pad(centis)}`;
}
function swTick(){
  const now = performance.now();
  const delta = now - swStartTime + swElapsed;
  swDisplay.textContent = formatStopwatch(Math.floor(delta));
  swTimerId = requestAnimationFrame(swTick);
}

// new helper: highlight whichever stopwatch button you clicked
function highlightButton(clickedBtn) {
  [swStartBtn, swStopBtn, swResetBtn].forEach(btn=>{
    btn.classList.remove('primary');
  });
  clickedBtn.classList.add('primary');
}

swStartBtn.addEventListener('click', ()=>{
  if(!swRunning){
    swRunning = true;
    swStartTime = performance.now();
    swTimerId = requestAnimationFrame(swTick);
    swStartBtn.textContent = 'Running';
    swStartBtn.disabled = true;
    swStopBtn.disabled = false;
  }
  highlightButton(swStartBtn);
});
swStopBtn.addEventListener('click', ()=>{
  if(swRunning){
    swRunning = false;
    cancelAnimationFrame(swTimerId);
    const now = performance.now();
    swElapsed += (now - swStartTime);
    swStartBtn.textContent = 'Start';
    swStartBtn.disabled = false;
    swStopBtn.disabled = true;
  }
  highlightButton(swStopBtn);
});
swResetBtn.addEventListener('click', ()=>{
  if(swRunning){ cancelAnimationFrame(swTimerId); swRunning = false; }
  swStartBtn.textContent = 'Start';
  swStartBtn.disabled = false;
  swStopBtn.disabled = true;
  swElapsed = 0;
  swStartTime = 0;
  swDisplay.textContent = '00:00.00';
  highlightButton(swResetBtn);
});
swStopBtn.disabled = true;

document.addEventListener('keydown', (e)=>{
  if(e.key.toLowerCase() === 's'){
    if(swRunning) swStopBtn.click(); else swStartBtn.click();
  }
});
