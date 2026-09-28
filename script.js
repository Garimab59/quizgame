const questions=[
{c:"EDITING",q:"Choose the grammatically correct sentence.",o:["Neither of the two proposals are acceptable.","Neither of the two proposals is acceptable.","Neither of the two proposal is acceptable.","Neither of two proposals are acceptable."],a:1,e:"‘Neither’ is singular and takes ‘is’ in formal standard English."},
{c:"TENSE & ASPECT",q:"By the time the committee arrived, the researchers ______ the data for three hours.",o:["analysed","had been analysing","have analysed","were analysed"],a:1,e:"Past perfect continuous shows an activity continuing up to another past event."},
{c:"MODALS",q:"You ______ have informed the authorities earlier; the delay caused serious complications.",o:["must","should","would","can"],a:1,e:"‘Should have + past participle’ expresses an action that was advisable but not done."},
{c:"REPORTED SPEECH",q:"She said, “I have completed the assignment.” Choose the correct reported form.",o:["She said that she completed the assignment.","She said that she had completed the assignment.","She said that I had completed the assignment.","She said that she has completed the assignment."],a:1,e:"In standard backshift, present perfect becomes past perfect after a past reporting verb."},
{c:"SUBJECT–VERB AGREEMENT",q:"A series of workshops ______ scheduled for the coming month.",o:["are","were","is","have been"],a:2,e:"The head noun ‘series’ is singular here, so the verb is ‘is’."},
{c:"CONDITIONALS",q:"If the team ______ the warning, the accident would have been avoided.",o:["heeded","had heeded","would heed","has heeded"],a:1,e:"This is a third conditional: if + past perfect, would have + past participle."},
{c:"DETERMINERS",q:"There is hardly ______ evidence to support the claim.",o:["many","a few","any","several"],a:2,e:"‘Evidence’ is uncountable; in a negative/near-negative construction, ‘any’ fits."},
{c:"TRANSFORMATION",q:"Choose the best transformation: ‘Despite being exhausted, she continued working.’",o:["Although she was exhausted, she continued working.","Although exhausted, but she continued working.","She was exhausted because she continued working.","She continued working, despite she was exhausted."],a:0,e:"‘Despite + -ing’ can be transformed to ‘although + clause’."},
{c:"PREPOSITIONS",q:"The new policy is aimed ______ reducing unnecessary expenditure.",o:["on","at","for","to"],a:1,e:"The fixed construction is ‘aimed at + noun/gerund’."},
{c:"ERROR DETECTION",q:"Identify the incorrect part: ‘Each of the participants were asked to submit their form.’",o:["Each","participants","were","their form"],a:2,e:"‘Each’ is singular, so the verb should be ‘was’: Each ... was asked."}
];
questions.splice(5);
let i=0,score=0,streak=0,best=0,correct=0,time=25,timerId=null,answered=false;
const $=id=>document.getElementById(id);
function sound(type){
  try{
    const A=window.AudioContext||window.webkitAudioContext;
    if(!A)return;
    const ctx=new A();
    const notes=type==="ok"?[660,880,1046]:type==="bad"?[220,165]:type==="next"?[440,660]:[330];
    notes.forEach((freq,k)=>{
      const o=ctx.createOscillator(),g=ctx.createGain();
      o.connect(g);g.connect(ctx.destination);o.type=type==="bad"?"sawtooth":"sine";
      o.frequency.value=freq;
      const t=ctx.currentTime+k*.09;
      g.gain.setValueAtTime(.0001,t);
      g.gain.exponentialRampToValueAtTime(.075,t+.015);
      g.gain.exponentialRampToValueAtTime(.0001,t+.16);
      o.start(t);o.stop(t+.19);
    });
  }catch(e){}
}

function render(){let x=questions[i];$("roundNo").textContent=i+1;$("qNumber").textContent=String(i+1).padStart(2,"0");$("category").textContent=x.c;$("question").textContent=x.q;$("score").textContent=String(score).padStart(4,"0");$("streak").textContent=streak;$("progressBar").style.width=((i+1)/questions.length*100)+"%";$("feedback").textContent="";$("nextBtn").disabled=true;$("showAnswer").disabled=false;answered=false;
$("options").innerHTML=x.o.map((v,n)=>`<button class="option" data-i="${n}">${String.fromCharCode(65+n)}. ${v}</button>`).join("");
document.querySelectorAll(".option").forEach(b=>b.onclick=()=>choose(+b.dataset.i));startTimer()}
function startTimer(){clearInterval(timerId);time=25;paintTimer();timerId=setInterval(()=>{time--;paintTimer();if(time<=0){clearInterval(timerId);if(!answered){streak=0;$("feedback").textContent="TIME OUT — teacher may reveal the answer.";sound("bad")}}},1000)}
function paintTimer(){ $("timer").textContent=time;$("timer-ring")?.style.setProperty("--time",(time/25*100)+"%");document.querySelector(".timer-ring").style.setProperty("--time",(time/25*100)+"%")}
function showPopup(kind,title,text){
  const p=$("resultPopup"), icon=$("popupIcon");
  p.className="result-popup show "+kind;
  icon.textContent=kind==="good"?"✓":"✕";
  $("popupTitle").textContent=title;
  $("popupText").textContent=text;
}
function hidePopup(){ $("resultPopup").className="result-popup"; }
$("popupClose").onclick=()=>{hidePopup();};
function choose(n){
  if(answered)return;
  answered=true;
  clearInterval(timerId);
  const x=questions[i],buttons=document.querySelectorAll(".option");
  const points=100+time*4;
  if(n===x.a){
    buttons[n].classList.add("correct","pulse-good");
    score+=points;streak++;best=Math.max(best,streak);correct++;
    $("feedback").textContent="CORRECT • +"+points;
    $("score").textContent=String(score).padStart(4,"0");
    $("streak").textContent=streak;
    sound("ok");
    showPopup("good","GOOD! CORRECT ANSWER","Excellent choice. You earned "+points+" points.");
  }else{
    buttons[n].classList.add("wrong","pulse-bad");
    streak=0;
    $("feedback").textContent="WRONG ANSWER";
    $("streak").textContent=streak;
    sound("bad");
    showPopup("bad","WRONG ANSWER","Not this one. The teacher can reveal the correct answer.");
  }
  $("nextBtn").disabled=false;
}

function showCorrect(){
  let x=questions[i];
  document.querySelectorAll(".option")[x.a]?.classList.add("correct");
  $("feedback").textContent=x.e;
  $("showAnswer").disabled=true;
  showPopup("good","CORRECT ANSWER",x.o[x.a]);
}

$("startBtn").onclick=()=>{sound("next");$("startScreen").classList.remove("active");$("gameScreen").classList.add("active");render()}
$("showAnswer").onclick=showCorrect;
$("nextBtn").onclick=()=>{if(i<questions.length-1){i++;sound("next");render()}else end()}
$("restartBtn").onclick=()=>{i=0;score=0;streak=0;best=0;correct=0;$("endScreen").classList.remove("active");$("gameScreen").classList.add("active");render()}
function end(){clearInterval(timerId);$("gameScreen").classList.remove("active");$("endScreen").classList.add("active");$("finalScore").textContent=score;$("correctCount").textContent=correct+"/"+questions.length;$("accuracy").textContent=Math.round(correct/questions.length*100)+"%";$("bestStreak").textContent=best}
