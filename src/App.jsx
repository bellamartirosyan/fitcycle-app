import { useState, useEffect } from “react”;

const PHASES = {
menstrual: {
name: “Menstrual”,
days: [1, 5],
emoji: “🌑”,
color: “#c0392b”,
bg: “#fdf0ee”,
energy: “Low”,
desc: “Rest & restore. Your body is working hard — prioritize gentle movement and iron-rich foods.”,
workouts: [“Gentle yoga”, “Light stretching”, “Short walks”, “Pilates (low intensity)”],
avoid: [“Heavy lifting”, “HIIT”, “High-impact cardio”],
nutrition: {
focus: “Iron, magnesium, anti-inflammatory foods”,
meals: [
{ time: “Breakfast (8am)”, food: “Oatmeal with dark berries, chia seeds + warm ginger tea”, why: “Iron + anti-inflammatory” },
{ time: “Snack (11am)”, food: “Dark chocolate (70%+) + handful of almonds”, why: “Magnesium boost” },
{ time: “Lunch (1pm)”, food: “Lentil soup with spinach, whole grain bread”, why: “Iron-rich, warming” },
{ time: “Snack (4pm)”, food: “Banana + peanut butter”, why: “Potassium for cramps” },
{ time: “Dinner (7pm)”, food: “Salmon or lentils with roasted beets & quinoa”, why: “Omega-3 + iron” },
],
hydration: “Warm herbal teas (ginger, chamomile), avoid excessive caffeine”,
calories: “Eat at maintenance or slight surplus — your metabolism is slightly elevated”,
},
},
follicular: {
name: “Follicular”,
days: [6, 13],
emoji: “🌒”,
color: “#27ae60”,
bg: “#edfbf3”,
energy: “Rising”,
desc: “Energy is building! Great time to try new exercises and push a little harder.”,
workouts: [“Strength training (progressive)”, “Running”, “HIIT”, “Dance classes”, “Cycling”],
avoid: [“Nothing major — this is your power window!”],
nutrition: {
focus: “Lean protein, complex carbs, estrogen-supporting foods”,
meals: [
{ time: “Breakfast (7:30am)”, food: “Eggs + avocado on rye toast, green smoothie”, why: “Protein + healthy fats for energy” },
{ time: “Snack (10:30am)”, food: “Greek yogurt + flaxseeds + berries”, why: “Supports estrogen metabolism” },
{ time: “Lunch (1pm)”, food: “Grilled chicken/tofu bowl with brown rice, broccoli & tahini”, why: “Lean protein + complex carbs” },
{ time: “Snack (4pm)”, food: “Apple + almond butter + pumpkin seeds”, why: “Zinc + steady energy” },
{ time: “Dinner (7pm)”, food: “Stir-fry with edamame, veggies, soba noodles”, why: “Phytoestrogens + carb replenishment” },
],
hydration: “Increase water — especially around workouts. Add lemon or cucumber.”,
calories: “Match calories to activity — add 100–200 extra on intense training days”,
},
},
ovulation: {
name: “Ovulation”,
days: [14, 16],
emoji: “🌕”,
color: “#e67e22”,
bg: “#fef9f0”,
energy: “Peak”,
desc: “Your peak performance window! You’re strongest, most coordinated, and most motivated now.”,
workouts: [“Max effort lifts (PRs!)”, “Sprints”, “Intense HIIT”, “Group fitness”, “Competitive sports”],
avoid: [“Skipping the gym — this is your superpower week!”],
nutrition: {
focus: “High protein, antioxidants, light & energizing foods”,
meals: [
{ time: “Breakfast (7am)”, food: “Protein smoothie: spinach, banana, protein powder, almond milk”, why: “Fast fuel for high energy” },
{ time: “Pre-workout Snack (10am)”, food: “Rice cakes + hummus + cucumber”, why: “Light carbs, no bloat” },
{ time: “Lunch (1pm)”, food: “Big colorful salad: grilled protein, chickpeas, pomegranate, feta”, why: “Antioxidants + protein” },
{ time: “Post-workout (4pm)”, food: “Chocolate milk or protein shake + banana”, why: “Muscle recovery window” },
{ time: “Dinner (7pm)”, food: “Lean steak/tempeh with sweet potato + greens”, why: “Zinc + iron replenishment” },
],
hydration: “Electrolytes if training hard. Coconut water is great.”,
calories: “Slight deficit is fine here — your body is efficient. Don’t under-eat though!”,
},
},
luteal: {
name: “Luteal”,
days: [17, 28],
emoji: “🌗”,
color: “#8e44ad”,
bg: “#f8f0ff”,
energy: “Decreasing”,
desc: “Energy may dip toward the end. Focus on consistency over intensity, and nourish your cravings wisely.”,
workouts: [“Moderate strength training”, “Yoga”, “Pilates”, “Swimming”, “Walking”],
avoid: [“Extreme HIIT late in phase”, “Skipping rest — listen to your body”],
nutrition: {
focus: “Complex carbs, B6, calcium, mood-stabilizing foods”,
meals: [
{ time: “Breakfast (8am)”, food: “Sweet potato toast + poached eggs + sunflower seeds”, why: “B6 + complex carbs for mood” },
{ time: “Snack (11am)”, food: “Dates + cashews OR dark chocolate”, why: “Healthy way to satisfy cravings” },
{ time: “Lunch (1pm)”, food: “Warm grain bowl: roasted veggies, chickpeas, tahini, whole grains”, why: “Complex carbs + calcium” },
{ time: “Snack (4pm)”, food: “Cheese + whole grain crackers + dried figs”, why: “Calcium for PMS relief” },
{ time: “Dinner (7pm)”, food: “Turkey/chicken with mashed sweet potato + steamed greens”, why: “Tryptophan for serotonin” },
],
hydration: “Reduce caffeine in late luteal (days 24–28). Try spearmint or chamomile tea.”,
calories: “Slight increase is normal — don’t fight cravings, redirect them to nutrient-dense foods”,
},
},
};

const WORKOUTS = [“Strength Training”, “HIIT”, “Cardio / Running”, “Yoga / Pilates”, “Swimming”, “Cycling”, “Walking”, “Rest Day”];
const DAYS = [“Mon”, “Tue”, “Wed”, “Thu”, “Fri”, “Sat”, “Sun”];

function getCurrentPhase(lastPeriodDate, cycleLength = 28) {
if (!lastPeriodDate) return null;
const today = new Date();
const start = new Date(lastPeriodDate);
const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
const dayInCycle = (diff % cycleLength) + 1;

if (dayInCycle <= 5) return { phase: “menstrual”, day: dayInCycle };
if (dayInCycle <= 13) return { phase: “follicular”, day: dayInCycle };
if (dayInCycle <= 16) return { phase: “ovulation”, day: dayInCycle };
return { phase: “luteal”, day: dayInCycle };
}

export default function FitCycle() {
const [tab, setTab] = useState(“home”);
const [lastPeriod, setLastPeriod] = useState(””);
const [cycleLength, setCycleLength] = useState(28);
const [workoutLog, setWorkoutLog] = useState({});
const [aiPlan, setAiPlan] = useState(””);
const [aiLoading, setAiLoading] = useState(false);
const [phaseInfo, setPhaseInfo] = useState(null);
const [customGoal, setCustomGoal] = useState(“lose weight and gain muscle”);

useEffect(() => {
if (lastPeriod) {
const result = getCurrentPhase(lastPeriod, cycleLength);
setPhaseInfo(result);
}
}, [lastPeriod, cycleLength]);

const phase = phaseInfo ? PHASES[phaseInfo.phase] : null;

const toggleWorkout = (day, workout) => {
const key = `${day}-${workout}`;
setWorkoutLog(prev => ({ …prev, [key]: !prev[key] }));
};

const getWorkoutsThisWeek = () => {
return Object.entries(workoutLog)
.filter(([, v]) => v)
.map(([k]) => k.split(”-”).slice(1).join(”-”));
};

const generateAIPlan = async () => {
setAiLoading(true);
setAiPlan(””);
const weekWorkouts = getWorkoutsThisWeek();
const phaseName = phase?.name || “Unknown”;
const prompt = `You are a certified nutritionist and personal trainer. A woman wants to ${customGoal}.  She is currently in her ${phaseName} phase (day ${phaseInfo?.day ?? "?"} of her cycle). This week she has done: ${weekWorkouts.length > 0 ? weekWorkouts.join(", ") : "no workouts logged yet"}. Provide a short, practical, friendly personalized nutrition + workout tip (3–4 sentences max) specifically for today and tomorrow, taking her cycle phase into account. Be specific and motivating. No bullet points, just natural conversational advice.`;

```
try {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  const text = data.content?.map(b => b.text || "").join("") || "Could not generate advice.";
  setAiPlan(text);
} catch {
  setAiPlan("Something went wrong. Please try again.");
}
setAiLoading(false);
```

};

const cycleProgressPct = phaseInfo ? ((phaseInfo.day - 1) / cycleLength) * 100 : 0;

return (
<div style={{
fontFamily: “‘DM Serif Display’, Georgia, serif”,
background: “linear-gradient(135deg, #fdf6ec 0%, #fef0f8 100%)”,
minHeight: “100vh”,
color: “#2d1f3d”,
maxWidth: 480,
margin: “0 auto”,
position: “relative”,
overflow: “hidden”,
}}>
<style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } .tab-btn { background: none; border: none; cursor: pointer; transition: all 0.2s; } .tab-btn:hover { transform: translateY(-2px); } input, select { font-family: 'DM Sans', sans-serif; outline: none; border: 1.5px solid #e8d5c4; border-radius: 10px; padding: 10px 14px; width: 100%; background: rgba(255,255,255,0.7); color: #2d1f3d; font-size: 14px; } input:focus, select:focus { border-color: #c0845a; background: white; } .card { background: rgba(255,255,255,0.7); backdrop-filter: blur(10px); border-radius: 20px; padding: 20px; border: 1px solid rgba(255,255,255,0.9); box-shadow: 0 4px 24px rgba(192,132,90,0.1); margin-bottom: 14px; } .pill { display: inline-block; padding: 4px 12px; border-radius: 20px; font-family: 'DM Sans'; font-size: 12px; font-weight: 500; margin: 3px; } .meal-row { background: rgba(255,255,255,0.5); border-radius: 12px; padding: 12px 14px; margin-bottom: 10px; border-left: 3px solid; } .ai-btn { background: linear-gradient(135deg, #c0845a, #8e44ad); color: white; border: none; border-radius: 14px; padding: 14px 24px; font-family: 'DM Sans'; font-size: 15px; font-weight: 600; cursor: pointer; width: 100%; letter-spacing: 0.3px; transition: all 0.2s; box-shadow: 0 4px 16px rgba(192,132,90,0.3); } .ai-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(192,132,90,0.4); } .ai-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; } .workout-chip { background: rgba(255,255,255,0.6); border: 1.5px solid #e8d5c4; border-radius: 10px; padding: 8px 10px; font-family: 'DM Sans'; font-size: 12px; cursor: pointer; transition: all 0.15s; text-align: center; line-height: 1.2; } .workout-chip.active { background: #2d1f3d; color: white; border-color: #2d1f3d; } .section-title { font-size: 22px; font-style: italic; color: #2d1f3d; margin-bottom: 6px; } .nav-tab { flex: 1; text-align: center; padding: 10px 4px; font-family: 'DM Sans'; font-size: 11px; font-weight: 500; cursor: pointer; border-radius: 12px; transition: all 0.2s; color: #8a7a9b; } .nav-tab.active { background: #2d1f3d; color: white; } .phase-ring { width: 130px; height: 130px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-direction: column; position: relative; } .shimmer { animation: shimmer 1.5s infinite; } @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>

```
  {/* Header */}
  <div style={{ padding: "28px 24px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <div>
      <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#8a7a9b", letterSpacing: 2, textTransform: "uppercase", marginBottom: 2 }}>Your Wellness</div>
      <h1 style={{ fontSize: 30, lineHeight: 1.1 }}>FitCycle <span style={{ color: "#c0845a" }}>✦</span></h1>
    </div>
    {phase && (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 32 }}>{phase.emoji}</div>
        <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: "#8a7a9b", marginTop: 2 }}>{phase.name}</div>
      </div>
    )}
  </div>

  {/* Content */}
  <div style={{ padding: "0 16px 100px", overflowY: "auto" }}>

    {/* HOME TAB */}
    {tab === "home" && (
      <>
        {/* Cycle Setup */}
        <div className="card">
          <div className="section-title">Your Cycle 🌙</div>
          <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#7a6a8a", marginBottom: 14 }}>Enter your last period start date to unlock cycle-aware recommendations.</p>
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#8a7a9b", display: "block", marginBottom: 5 }}>LAST PERIOD START DATE</label>
            <input type="date" value={lastPeriod} onChange={e => setLastPeriod(e.target.value)} />
          </div>
          <div>
            <label style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#8a7a9b", display: "block", marginBottom: 5 }}>CYCLE LENGTH (DAYS)</label>
            <select value={cycleLength} onChange={e => setCycleLength(Number(e.target.value))}>
              {[21,22,23,24,25,26,27,28,29,30,31,32,33,34,35].map(n => <option key={n} value={n}>{n} days</option>)}
            </select>
          </div>
        </div>

        {/* Phase Display */}
        {phase && phaseInfo ? (
          <div className="card" style={{ background: `linear-gradient(135deg, ${phase.bg}, white)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
              <div className="phase-ring" style={{ background: `${phase.color}15`, border: `3px solid ${phase.color}30`, width: 90, height: 90 }}>
                <div style={{ fontSize: 28 }}>{phase.emoji}</div>
                <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: phase.color, fontWeight: 600 }}>Day {phaseInfo.day}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#8a7a9b", letterSpacing: 1.5, textTransform: "uppercase" }}>Current Phase</div>
                <div style={{ fontSize: 22, color: phase.color, fontStyle: "italic" }}>{phase.name}</div>
                <div style={{ background: "#e8e0f0", height: 6, borderRadius: 4, marginTop: 8, overflow: "hidden" }}>
                  <div style={{ background: phase.color, height: "100%", width: `${cycleProgressPct}%`, borderRadius: 4, transition: "width 0.5s" }} />
                </div>
                <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#8a7a9b", marginTop: 4 }}>Day {phaseInfo.day} of {cycleLength}</div>
              </div>
            </div>
            <p style={{ fontFamily: "'DM Sans'", fontSize: 13.5, color: "#4a3a5a", lineHeight: 1.6 }}>{phase.desc}</p>
            <div style={{ marginTop: 10 }}>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#8a7a9b", marginBottom: 5 }}>⚡ ENERGY LEVEL: <span style={{ color: phase.color, fontWeight: 600 }}>{phase.energy}</span></div>
            </div>
          </div>
        ) : (
          <div className="card" style={{ textAlign: "center", padding: "30px 20px" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🌙</div>
            <p style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#8a7a9b" }}>Enter your last period date above to see your current cycle phase and personalized recommendations!</p>
          </div>
        )}

        {/* Goal input */}
        <div className="card">
          <div className="section-title">Your Goal 🎯</div>
          <input type="text" value={customGoal} onChange={e => setCustomGoal(e.target.value)} placeholder="e.g. lose weight and gain muscle" />
        </div>

        {/* AI Daily Tip */}
        <div className="card">
          <div className="section-title">Today's AI Tip ✨</div>
          <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#7a6a8a", marginBottom: 14 }}>Get a personalized tip based on your phase + this week's workouts.</p>
          <button className="ai-btn" onClick={generateAIPlan} disabled={aiLoading || !lastPeriod}>
            {aiLoading ? <span className="shimmer">Generating your plan...</span> : "✦ Generate My Daily Advice"}
          </button>
          {aiPlan && (
            <div style={{ marginTop: 16, background: "linear-gradient(135deg, #f8f0ff, #fdf6ec)", borderRadius: 14, padding: 16, border: "1px solid #e8d5c4" }}>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#8a7a9b", marginBottom: 8, letterSpacing: 1.5, textTransform: "uppercase" }}>✦ Your Personalized Advice</div>
              <p style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#2d1f3d", lineHeight: 1.7 }}>{aiPlan}</p>
            </div>
          )}
          {!lastPeriod && <p style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#c0845a", marginTop: 8, textAlign: "center" }}>Please enter your last period date first</p>}
        </div>
      </>
    )}

    {/* NUTRITION TAB */}
    {tab === "nutrition" && (
      <>
        {phase ? (
          <>
            <div className="card" style={{ background: `linear-gradient(135deg, ${phase.bg}, white)` }}>
              <div className="section-title">{phase.emoji} {phase.name} Eating Guide</div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#7a6a8a", marginBottom: 10 }}>{phase.desc}</div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 600, color: phase.color, marginBottom: 6 }}>FOCUS ON: {phase.nutrition.focus}</div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#7a6a8a", background: "rgba(255,255,255,0.6)", borderRadius: 10, padding: "10px 12px" }}>
                💧 {phase.nutrition.hydration}
              </div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#7a6a8a", background: "rgba(255,255,255,0.6)", borderRadius: 10, padding: "10px 12px", marginTop: 8 }}>
                🔥 {phase.nutrition.calories}
              </div>
            </div>

            <div className="card">
              <div className="section-title">Daily Meal Schedule 🍽️</div>
              {phase.nutrition.meals.map((m, i) => (
                <div key={i} className="meal-row" style={{ borderLeftColor: phase.color }}>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: phase.color, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>{m.time}</div>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#2d1f3d", marginBottom: 4 }}>{m.food}</div>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#8a7a9b" }}>✓ {m.why}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🍽️</div>
            <p style={{ fontFamily: "'DM Sans'", color: "#8a7a9b" }}>Set up your cycle on the Home tab to unlock your personalized meal schedule!</p>
          </div>
        )}
      </>
    )}

    {/* WORKOUT TAB */}
    {tab === "workout" && (
      <>
        {phase && (
          <div className="card" style={{ background: `linear-gradient(135deg, ${phase.bg}, white)` }}>
            <div className="section-title">{phase.emoji} Best Workouts Now</div>
            <div style={{ marginBottom: 8 }}>
              {phase.workouts.map((w, i) => (
                <span key={i} className="pill" style={{ background: `${phase.color}20`, color: phase.color, border: `1px solid ${phase.color}30` }}>✓ {w}</span>
              ))}
            </div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#8a7a9b", marginTop: 8 }}>
              {phase.avoid.map((a, i) => (
                <div key={i}>⚠️ {a}</div>
              ))}
            </div>
          </div>
        )}

        <div className="card">
          <div className="section-title">This Week's Log 📋</div>
          <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#7a6a8a", marginBottom: 14 }}>Tap to log what you've done each day:</p>
          <div style={{ overflowX: "auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: `80px repeat(${DAYS.length}, 1fr)`, gap: 4, minWidth: 500 }}>
              <div />
              {DAYS.map(d => (
                <div key={d} style={{ fontFamily: "'DM Sans'", fontSize: 11, fontWeight: 600, textAlign: "center", color: "#8a7a9b", padding: "4px 0" }}>{d}</div>
              ))}
              {WORKOUTS.map(w => (
                <>
                  <div key={w} style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#4a3a5a", display: "flex", alignItems: "center", paddingRight: 6, lineHeight: 1.3 }}>{w}</div>
                  {DAYS.map(d => {
                    const key = `${d}-${w}`;
                    const active = workoutLog[key];
                    return (
                      <div key={d}
                        onClick={() => toggleWorkout(d, w)}
                        style={{
                          width: "100%", aspectRatio: "1", borderRadius: 8, background: active ? "#2d1f3d" : "rgba(255,255,255,0.6)",
                          border: `1.5px solid ${active ? "#2d1f3d" : "#e8d5c4"}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 14, transition: "all 0.15s", margin: "2px auto",
                        }}>
                        {active ? "✓" : ""}
                      </div>
                    );
                  })}
                </>
              ))}
            </div>
          </div>

          {getWorkoutsThisWeek().length > 0 && (
            <div style={{ marginTop: 16, background: "linear-gradient(135deg, #edfbf3, white)", borderRadius: 12, padding: 12, border: "1px solid #c3e6cb" }}>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#27ae60", fontWeight: 600, marginBottom: 6 }}>✦ This Week So Far</div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#2d1f3d" }}>
                {[...new Set(getWorkoutsThisWeek())].join(", ")}
              </div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#7a6a8a", marginTop: 4 }}>
                {getWorkoutsThisWeek().length} sessions logged 💪
              </div>
            </div>
          )}
        </div>
      </>
    )}

    {/* PHASES TAB */}
    {tab === "phases" && (
      <>
        <div className="card">
          <div className="section-title">Your Cycle Phases 🌙</div>
          <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#7a6a8a", marginBottom: 4 }}>Understanding each phase helps you work <em>with</em> your body, not against it.</p>
        </div>
        {Object.values(PHASES).map(p => (
          <div key={p.name} className="card" style={{ background: `linear-gradient(135deg, ${p.bg}, white)`, borderLeft: `4px solid ${p.color}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 24 }}>{p.emoji}</span>
              <div>
                <div style={{ fontSize: 18, color: p.color, fontStyle: "italic" }}>{p.name}</div>
                <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#8a7a9b" }}>Days {p.days[0]}–{p.days[1]} • Energy: <strong>{p.energy}</strong></div>
              </div>
            </div>
            <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#4a3a5a", lineHeight: 1.6, marginBottom: 8 }}>{p.desc}</p>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#7a6a8a" }}>
              <strong style={{ color: p.color }}>Eat:</strong> {p.nutrition.focus}
            </div>
          </div>
        ))}
      </>
    )}
  </div>

  {/* Bottom Nav */}
  <div style={{
    position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
    width: "100%", maxWidth: 480, background: "rgba(253,246,236,0.95)",
    backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,0.8)",
    display: "flex", padding: "8px 12px 14px", gap: 6,
    boxShadow: "0 -4px 24px rgba(192,132,90,0.12)",
  }}>
    {[
      { id: "home", icon: "🏠", label: "Home" },
      { id: "nutrition", icon: "🍽️", label: "Nutrition" },
      { id: "workout", icon: "💪", label: "Workouts" },
      { id: "phases", icon: "🌙", label: "Phases" },
    ].map(t => (
      <div key={t.id} className={`nav-tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
        <div style={{ fontSize: 18, marginBottom: 2 }}>{t.icon}</div>
        {t.label}
      </div>
    ))}
  </div>
</div>
```

);
}
