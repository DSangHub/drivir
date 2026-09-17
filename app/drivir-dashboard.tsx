"use client";

import { useState } from "react";
import { CarFront, CircleGauge, Clock3, Coins, MapPin, Route, ShieldCheck, Trophy } from "lucide-react";

type TripState = "setup" | "ready" | "driving" | "complete";

export function DrivirDashboard() {
  const [destination, setDestination] = useState("Downtown office");
  const [minutes, setMinutes] = useState(28);
  const [state, setState] = useState<TripState>("setup");
  const [score, setScore] = useState(96);

  function advanceTrip() {
    if (state === "setup") setState("ready");
    else if (state === "ready") setState("driving");
    else if (state === "driving") { setState("complete"); setScore(97); }
    else setState("setup");
  }

  const buttonText = state === "setup" ? "Set safe trip" : state === "ready" ? "Simulate vehicle in Drive" : state === "driving" ? "Complete demo trip" : "Plan another trip";

  return (
    <main className="min-h-screen bg-[#07100c] text-white">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#b7ff2a] text-[#07100c]"><Route size={24} strokeWidth={2.6} /></div>
          <div><p className="text-xl font-black tracking-tight">DRIVIR</p><p className="text-xs text-white/55">Safe moves. Real rewards.</p></div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[.06] px-4 py-2 text-sm"><Coins size={17} className="text-[#ffd166]" /><strong>2,840</strong><span className="text-white/50">pts</span></div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 pb-28 pt-3 lg:grid-cols-[1.4fr_.72fr] lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#101c16] shadow-2xl">
          <div className="relative min-h-[360px] overflow-hidden bg-[radial-gradient(circle_at_18%_18%,#214f38_0,transparent_34%),linear-gradient(145deg,#13261c,#08110d)] p-6 sm:p-9">
            <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(#ffffff12_1px,transparent_1px),linear-gradient(90deg,#ffffff12_1px,transparent_1px)] [background-size:34px_34px]" />
            <div className="relative z-10">
              <div className="mb-8 flex items-center justify-between gap-3">
                <span className="rounded-full bg-[#b7ff2a] px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#07100c]">{state === "driving" ? "Trip live" : state === "complete" ? "Trip complete" : "Ready to drive"}</span>
                <span className="flex items-center gap-2 text-sm text-white/65"><span className="h-2 w-2 rounded-full bg-[#b7ff2a]" /> OBD demo connected</span>
              </div>

              {state === "complete" ? (
                <div className="max-w-lg py-5">
                  <p className="mb-2 text-sm font-bold uppercase tracking-[.18em] text-[#b7ff2a]">Excellent trip</p>
                  <div className="mb-4 flex items-end gap-3"><span className="text-8xl font-black leading-none">{score}</span><span className="pb-2 text-xl text-white/50">safe score</span></div>
                  <p className="text-lg text-white/70">+185 points for smooth braking, complete stops, steady speed, and an on-time arrival.</p>
                </div>
              ) : (
                <>
                  <p className="mb-2 text-sm font-bold uppercase tracking-[.18em] text-[#b7ff2a]">Today’s safe trip</p>
                  <h1 className="max-w-xl text-4xl font-black leading-[1.02] tracking-tight sm:text-6xl">Turn every drive into a better drive.</h1>
                  <p className="mt-4 max-w-xl text-lg text-white/65">Choose where you’re going and a realistic arrival window. Drivir rewards the safe decisions you make along the way.</p>
                </>
              )}
            </div>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-[1fr_170px] sm:p-7">
            <label className="field-label"><span><MapPin size={17} /> Destination</span><input value={destination} onChange={(e) => setDestination(e.target.value)} disabled={state === "driving"} /></label>
            <label className="field-label"><span><Clock3 size={17} /> Safe arrival</span><select value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} disabled={state === "driving"}><option value={20}>20 minutes</option><option value={28}>28 minutes</option><option value={35}>35 minutes</option><option value={45}>45 minutes</option></select></label>
            <button onClick={advanceTrip} className="sm:col-span-2 flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#b7ff2a] px-5 text-base font-extrabold text-[#07100c] transition hover:bg-[#c9ff59] focus:outline-none focus:ring-4 focus:ring-[#b7ff2a]/25"><CarFront size={21} />{buttonText}</button>
            <p className="sm:col-span-2 text-center text-xs leading-relaxed text-white/45">Set your trip before moving. Drivir never rewards speeding or beating the clock. Do not touch the phone while driving.</p>
          </div>
        </div>

        <aside className="grid gap-5">
          <div className="rounded-[2rem] border border-white/10 bg-[#101c16] p-6">
            <div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-extrabold">Safe streak</h2><Trophy size={21} className="text-[#ffd166]" /></div>
            <div className="flex items-end gap-3"><strong className="text-6xl font-black">12</strong><span className="pb-2 text-white/50">trips</span></div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-4/5 rounded-full bg-[#b7ff2a]" /></div>
            <p className="mt-3 text-sm text-white/55">3 more safe trips to unlock a 500-point bonus.</p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[#101c16] p-6">
            <h2 className="mb-5 text-lg font-extrabold">Scoring this trip</h2>
            <div className="space-y-4">
              {[['Smooth braking','98%', ShieldCheck],['Complete stops','100%', CircleGauge],['Steady pace','94%', Route]].map(([label,value,Icon]) => <div key={String(label)} className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white/[.06] text-[#b7ff2a]"><Icon size={19} /></span><span className="flex-1 text-sm text-white/65">{label}</span><strong>{value}</strong></div>)}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#ffd166]/20 bg-[#ffd166]/[.08] p-6">
            <div className="mb-3 flex items-center justify-between gap-2"><h2 className="font-extrabold">Safety Challenge</h2><span className="rounded-full bg-[#ffd166] px-2.5 py-1 text-xs font-black text-[#251b00]">COMING SOON</span></div>
            <p className="text-sm leading-relaxed text-white/60">Challenge friends using earned points. Winners are based on safe scores—not speed. Purchased tokens and cash payouts stay off until compliance review.</p>
          </div>
        </aside>
      </section>

      <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto flex max-w-md justify-around rounded-t-[1.6rem] border border-white/10 bg-[#111d17]/95 px-4 py-3 backdrop-blur-xl lg:bottom-5 lg:rounded-[1.6rem]">
        {[['Drive',CarFront],['Trips',Route],['Rewards',Trophy],['Wallet',Coins]].map(([label,Icon],i)=><button key={String(label)} className={`flex min-w-16 flex-col items-center gap-1 text-xs ${i===0?'text-[#b7ff2a]':'text-white/45'}`}><Icon size={20}/><span>{label}</span></button>)}
      </nav>
    </main>
  );
}
