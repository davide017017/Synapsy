"use client";

export default function SplashScreen() {
    return (
        <>
            <style>{`
                :root {
                    --bg: #020f0a;
                    --line: rgba(255,255,255,0.06);
                    --line-2: rgba(255,255,255,0.12);
                    --ink: #e8ecef;
                    --ink-mute: rgba(232,236,239,0.45);
                    --primary: #14b88a;
                    --primary-glow: rgba(20,184,138,0.45);
                }

                html, body { background: #020f0a !important; }
                body { background-color: #020f0a !important; }

                .spl-root {
                    position: fixed;
                    inset: 0;
                    z-index: 9999;
                    background: var(--bg);
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                /* ── Glow radiale centrale ── */
                .spl-glow {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    background: radial-gradient(ellipse 60% 50% at 50% 50%, rgba(20,184,138,0.12), transparent 70%);
                }

                /* ── Grid bg ── */
                .spl-grid {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    background-image:
                        linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
                    background-size: 48px 48px;
                    mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, #000 20%, transparent 80%);
                    -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, #000 20%, transparent 80%);
                }

                /* ── Scan line ── */
                .spl-scan {
                    position: absolute;
                    left: 0;
                    right: 0;
                    height: 1px;
                    pointer-events: none;
                    background: linear-gradient(90deg, transparent 0%, rgba(20,184,138,0.45) 50%, transparent 100%);
                    animation: splScan 5.5s linear infinite;
                    z-index: 1;
                }
                @keyframes splScan {
                    from { top: 0; }
                    to   { top: 100%; }
                }

                /* ── Corner marks ── */
                .spl-corner {
                    position: absolute;
                    width: 14px;
                    height: 14px;
                    pointer-events: none;
                }
                .spl-corner-tl { top: 18px;    left: 18px;  border-top:    1px solid #14b88a; border-left:  1px solid #14b88a; }
                .spl-corner-tr { top: 18px;    right: 18px; border-top:    1px solid #14b88a; border-right: 1px solid #14b88a; }
                .spl-corner-bl { bottom: 18px; left: 18px;  border-bottom: 1px solid #14b88a; border-left:  1px solid #14b88a; }
                .spl-corner-br { bottom: 18px; right: 18px; border-bottom: 1px solid #14b88a; border-right: 1px solid #14b88a; }

                /* ── Top / Bottom bars ── */
                .spl-bar {
                    position: absolute;
                    left: 18px;
                    right: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-family: var(--font-jetbrains-mono, "JetBrains Mono", ui-monospace, Menlo, monospace);
                    font-size: 10px;
                    text-transform: uppercase;
                    letter-spacing: 0.18em;
                    color: var(--ink-mute);
                    pointer-events: none;
                }
                .spl-bar-top    { top: 22px; }
                .spl-bar-bottom { bottom: 22px; }

                .spl-bar-left {
                    display: flex;
                    align-items: center;
                }

                /* ── Status dot (blink) ── */
                .spl-dot {
                    display: inline-block;
                    width: 5px;
                    height: 5px;
                    border-radius: 50%;
                    background: #14b88a;
                    box-shadow: 0 0 6px rgba(20,184,138,0.7);
                    margin-right: 7px;
                    flex-shrink: 0;
                    animation: splBlink 1.2s steps(2) infinite;
                }
                @keyframes splBlink {
                    0%, 100% { opacity: 1; }
                    50%      { opacity: 0; }
                }

                /* ── Center frame ── */
                .spl-frame {
                    position: relative;
                    width: 380px;
                    height: 160px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                /* ── Brackets ── */
                .spl-bracket {
                    position: absolute;
                    width: 34px;
                    height: 34px;
                    animation: splBracketIn 1s cubic-bezier(.6,.05,.2,1) 0.2s both;
                }
                .spl-bracket-tl {
                    top: 0; left: 0;
                    border-top: 1px solid #14b88a;
                    border-left: 1px solid #14b88a;
                    --from-x: -40px; --from-y: -40px;
                }
                .spl-bracket-tr {
                    top: 0; right: 0;
                    border-top: 1px solid #14b88a;
                    border-right: 1px solid #14b88a;
                    --from-x: 40px; --from-y: -40px;
                }
                .spl-bracket-bl {
                    bottom: 0; left: 0;
                    border-bottom: 1px solid #14b88a;
                    border-left: 1px solid #14b88a;
                    --from-x: -40px; --from-y: 40px;
                }
                .spl-bracket-br {
                    bottom: 0; right: 0;
                    border-bottom: 1px solid #14b88a;
                    border-right: 1px solid #14b88a;
                    --from-x: 40px; --from-y: 40px;
                }
                @keyframes splBracketIn {
                    from { transform: translate(var(--from-x), var(--from-y)); opacity: 0; }
                    to   { transform: translate(0, 0); opacity: 1; }
                }

                /* ── Reticle ── */
                .spl-reticle {
                    position: absolute;
                    width: 80px;
                    height: 80px;
                    top: 50%;
                    left: 50%;
                    animation: splReticleIn 0.4s ease-out 1s both;
                }
                .spl-reticle::before,
                .spl-reticle::after {
                    content: '';
                    position: absolute;
                    background: rgba(20,184,138,0.45);
                }
                .spl-reticle::before {
                    top: 50%;
                    left: 0;
                    right: 0;
                    height: 1px;
                    margin-top: -0.5px;
                }
                .spl-reticle::after {
                    left: 50%;
                    top: 0;
                    bottom: 0;
                    width: 1px;
                    margin-left: -0.5px;
                }
                @keyframes splReticleIn {
                    from { opacity: 0; transform: translate(-50%, -50%) scale(0.6); }
                    to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }

                /* ── Wordmark ── */
                .spl-word {
                    position: relative;
                    z-index: 1;
                    font-family: var(--font-space-grotesk, "Space Grotesk", ui-sans-serif, system-ui);
                    font-size: 42px;
                    font-weight: 600;
                    letter-spacing: 0.28em;
                    color: #e8ecef;
                    user-select: none;
                    display: inline-flex;
                    align-items: center;
                    animation: splWordIn 0.5s ease-out 1.3s both;
                }
                @keyframes splWordIn {
                    from { opacity: 0; letter-spacing: 0.6em; filter: blur(8px); }
                    to   { opacity: 1; letter-spacing: 0.28em; filter: blur(0px); }
                }
                .spl-word-teal { color: #14b88a; }

                /* ── Caret ── */
                .spl-caret {
                    display: inline-block;
                    width: 0.55em;
                    height: 1.05em;
                    background: #14b88a;
                    box-shadow: 0 0 12px rgba(20,184,138,0.45);
                    margin-left: 6px;
                    transform: translateY(4px);
                    animation: splCaret 1s steps(2) infinite;
                    flex-shrink: 0;
                }
                @keyframes splCaret {
                    0%, 100% { opacity: 1; }
                    50%      { opacity: 0; }
                }

                /* ── Sub label ── */
                .spl-sub {
                    position: absolute;
                    bottom: -36px;
                    left: 50%;
                    white-space: nowrap;
                    font-family: var(--font-jetbrains-mono, "JetBrains Mono", ui-monospace, Menlo, monospace);
                    font-size: 11px;
                    letter-spacing: 0.28em;
                    color: var(--ink-mute);
                    animation: splSubIn 0.5s ease-out 1.7s both;
                }
                @keyframes splSubIn {
                    from { opacity: 0; transform: translateX(-50%) translateY(6px); }
                    to   { opacity: 0.85; transform: translateX(-50%) translateY(0); }
                }

                /* ── Sub label secondary ── */
                  .spl-sub-secondary {
                      bottom: -56px;
                      font-size: 9px;
                      letter-spacing: 0.22em;
                      color: rgba(232,236,239,0.32);
                      animation-delay: 1.9s;
                  }

                /* ── Tick progress ── */
                .spl-ticks {
                    position: absolute;
                    left: 50%;
                    bottom: 52px;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 6px;
                }
                .spl-tick {
                    width: 18px;
                    height: 2px;
                    background: var(--line-2);
                }
                .spl-tick-1 { animation: splTickFill 1.2s ease-out 2.20s forwards; }
                .spl-tick-2 { animation: splTickFill 1.2s ease-out 2.35s forwards; }
                .spl-tick-3 { animation: splTickFill 1.2s ease-out 2.50s forwards; }
                .spl-tick-4 { animation: splTickFill 1.2s ease-out 2.65s forwards; }
                .spl-tick-5 { animation: splTickFill 1.2s ease-out 2.80s forwards; }
                .spl-tick-6 { animation: splTickFill 1.2s ease-out 2.95s forwards; }
                @keyframes splTickFill {
                    from { background: var(--line-2); box-shadow: none; }
                    to   { background: #14b88a; box-shadow: 0 0 6px rgba(20,184,138,0.45); }
                }

                /* ── Screen reader only ── */
                .spl-sr-only {
                    position: absolute;
                    width: 1px;
                    height: 1px;
                    padding: 0;
                    margin: -1px;
                    overflow: hidden;
                    clip: rect(0,0,0,0);
                    white-space: nowrap;
                    border: 0;
                }

                /* ── Reduced motion ── */
                @media (prefers-reduced-motion: reduce) {
                    .spl-scan { animation: none; display: none; }
                    .spl-dot  { animation: none; opacity: 1; }
                    .spl-bracket {
                        animation: none;
                        opacity: 1;
                        transform: translate(0, 0);
                    }
                    .spl-reticle {
                        animation: none;
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1);
                    }
                    .spl-word {
                        animation: none;
                        opacity: 1;
                        letter-spacing: 0.28em;
                        filter: none;
                    }
                    .spl-caret { animation: none; opacity: 1; }
                    .spl-sub {
                        animation: none;
                        opacity: 0.85;
                        transform: translateX(-50%) translateY(0);
                    }
                    .spl-tick-1, .spl-tick-2, .spl-tick-3,
                    .spl-tick-4, .spl-tick-5, .spl-tick-6 {
                        animation: none;
                        background: #14b88a;
                        box-shadow: 0 0 6px rgba(20,184,138,0.45);
                    }
                }
            `}</style>

            <div role="status" aria-label="Caricamento Synapsy" className="spl-root">
                <span className="spl-sr-only">Caricamento Synapsy</span>

                {/* Glow radiale centrale */}
                <div aria-hidden="true" className="spl-glow" />

                {/* Grid bg */}
                <div aria-hidden="true" className="spl-grid" />

                {/* Scan line */}
                <div aria-hidden="true" className="spl-scan" />

                {/* Corner marks */}
                <div aria-hidden="true" className="spl-corner spl-corner-tl" />
                <div aria-hidden="true" className="spl-corner spl-corner-tr" />
                <div aria-hidden="true" className="spl-corner spl-corner-bl" />
                <div aria-hidden="true" className="spl-corner spl-corner-br" />

                {/* Top bar */}
                <div aria-hidden="true" className="spl-bar spl-bar-top">
                    <span className="spl-bar-left">
                        <span className="spl-dot" />
                        SYN/INIT
                    </span>
                    <span>LOCK · TARGET</span>
                </div>

                {/* Bottom bar */}
                <div aria-hidden="true" className="spl-bar spl-bar-bottom">
                    <span>SESSION · LOADING · NO PANIC</span>
                    <span>0x14B88A</span>
                </div>

                {/* Center frame */}
                <div className="spl-frame">
                    {/* Brackets */}
                    <div aria-hidden="true" className="spl-bracket spl-bracket-tl" />
                    <div aria-hidden="true" className="spl-bracket spl-bracket-tr" />
                    <div aria-hidden="true" className="spl-bracket spl-bracket-bl" />
                    <div aria-hidden="true" className="spl-bracket spl-bracket-br" />

                    {/* Reticle */}
                    <div aria-hidden="true" className="spl-reticle" />

                    {/* Wordmark */}
                    <span aria-hidden="true" className="spl-word">
                        SYN<span className="spl-word-teal">APSY</span>
                        <span className="spl-caret" />
                    </span>

                    {/* Sub label */}
                    <span aria-hidden="true" className="spl-sub">
                        {"// DB RESPONSE · MAYBE TODAY"}
                    </span>

                    {/* Sub label secondary */}
                    <span aria-hidden="true" className="spl-sub spl-sub-secondary">
                        {"TRUST THE PROCESS"}
                    </span>
                </div>

                {/* Tick progress */}
                <div aria-hidden="true" className="spl-ticks">
                    <div className="spl-tick spl-tick-1" />
                    <div className="spl-tick spl-tick-2" />
                    <div className="spl-tick spl-tick-3" />
                    <div className="spl-tick spl-tick-4" />
                    <div className="spl-tick spl-tick-5" />
                    <div className="spl-tick spl-tick-6" />
                </div>
            </div>
        </>
    );
}
