"use client";

import { MotionConfig, useAnimationFrame } from "framer-motion";
import { useMemo, useRef, useState } from "react";

const VIEWBOX = 200;
const WRAP_W = 250;
const WRAP_H = 250;
const NUM_NODES = 14;
const SPHERE_R = 72;
const FOCAL = 220;
const HOP_DURATION_S = 0.6;
const TAIL_POINTS = 70;
const NODE_BASE_R = 3;
const RUNNER_BASE_R = 3.4;
const TAIL_THICKNESS = 2.2;
const YAW_PERIOD_S = 24;
const PITCH_PERIOD_S = 40;
const C_PRIMARY = "#10B981";
const C_RING = "rgba(16,185,129,0.16)";

type P3 = { x: number; y: number; z: number };

const rotY = (p: P3, a: number): P3 => {
    const c = Math.cos(a),
        s = Math.sin(a);
    return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c };
};
const rotX = (p: P3, a: number): P3 => {
    const c = Math.cos(a),
        s = Math.sin(a);
    return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c };
};
const project = (p: P3) => {
    const s = FOCAL / (FOCAL + p.z);
    return { x: p.x * s, y: p.y * s, s };
};
const lerp3 = (a: P3, b: P3, t: number): P3 => ({
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: a.z + (b.z - a.z) * t,
});
function pickNext(cur: number, prev: number, n: number): number {
    const cs: number[] = [];
    for (let i = 0; i < n; i++) if (i !== cur && i !== prev) cs.push(i);
    return cs[Math.floor(Math.random() * cs.length)];
}

export default function SynapsiNetwork() {
    const nodes = useMemo<P3[]>(() => {
        const out: P3[] = [];
        for (let i = 0; i < NUM_NODES; i++) {
            const phi = Math.acos(1 - (2 * (i + 0.5)) / NUM_NODES);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;
            out.push({
                x: SPHERE_R * Math.sin(phi) * Math.cos(theta),
                y: SPHERE_R * Math.sin(phi) * Math.sin(theta),
                z: SPHERE_R * Math.cos(phi),
            });
        }
        return out;
    }, []);

    const ringEq = useMemo<P3[]>(() => {
        const out: P3[] = [];
        for (let i = 0; i <= 24; i++) {
            const t = (i / 24) * Math.PI * 2;
            out.push({ x: Math.cos(t) * SPHERE_R, y: 0, z: Math.sin(t) * SPHERE_R });
        }
        return out;
    }, []);
    const ringMer = useMemo<P3[]>(() => {
        const out: P3[] = [];
        for (let i = 0; i <= 24; i++) {
            const t = (i / 24) * Math.PI * 2;
            out.push({ x: 0, y: Math.cos(t) * SPHERE_R, z: Math.sin(t) * SPHERE_R });
        }
        return out;
    }, []);

    const curIdxRef = useRef(0);
    const prevIdxRef = useRef(-1);
    const nextIdxRef = useRef(1);
    const hopTRef = useRef(0);
    const trailRef = useRef<P3[]>([]);
    const lastTRef = useRef<number | null>(null);
    const yawRef = useRef(0);
    const pitchRef = useRef(0);
    const [, setTick] = useState(0);

    useAnimationFrame((tNow) => {
        const last = lastTRef.current;
        lastTRef.current = tNow;
        if (last == null) return;
        const dt = Math.min(0.05, (tNow - last) / 1000);
        yawRef.current += dt * ((2 * Math.PI) / YAW_PERIOD_S);
        pitchRef.current += dt * ((2 * Math.PI) / PITCH_PERIOD_S) * 0.6;
        hopTRef.current += dt / HOP_DURATION_S;
        if (hopTRef.current >= 1) {
            prevIdxRef.current = curIdxRef.current;
            curIdxRef.current = nextIdxRef.current;
            nextIdxRef.current = pickNext(curIdxRef.current, prevIdxRef.current, nodes.length);
            hopTRef.current = 0;
        }
        const cur = lerp3(nodes[curIdxRef.current], nodes[nextIdxRef.current], Math.min(1, hopTRef.current));
        trailRef.current.push(cur);
        if (trailRef.current.length > TAIL_POINTS) trailRef.current.shift();
        setTick((v) => (v + 1) % 1_000_000);
    });

    const rot = (p: P3): P3 => rotX(rotY(p, yawRef.current), pitchRef.current);

    const sortedNodes = nodes
        .map((p, i) => {
            const r = rot(p);
            return { i, r, proj: project(r) };
        })
        .sort((a, b) => b.r.z - a.r.z);

    const trailPoints = trailRef.current
        .map((p) => {
            const pr = project(rot(p));
            return `${pr.x.toFixed(2)},${pr.y.toFixed(2)}`;
        })
        .join(" ");

    const ringEqPts = ringEq
        .map((p) => {
            const pr = project(rot(p));
            return `${pr.x.toFixed(2)},${pr.y.toFixed(2)}`;
        })
        .join(" ");
    const ringMerPts = ringMer
        .map((p) => {
            const pr = project(rot(p));
            return `${pr.x.toFixed(2)},${pr.y.toFixed(2)}`;
        })
        .join(" ");

    const cur3 = trailRef.current[trailRef.current.length - 1];
    const runProj = cur3 ? project(rot(cur3)) : { x: 0, y: 0, s: 1 };

    return (
        <div className="mx-auto" style={{ width: WRAP_W, height: WRAP_H }}>
            <MotionConfig reducedMotion="never">
                <svg
                    viewBox={`-${VIEWBOX / 2} -${VIEWBOX / 2} ${VIEWBOX} ${VIEWBOX}`}
                    width={WRAP_W}
                    height={WRAP_H}
                    className="block"
                >
                    <polyline points={ringEqPts} fill="none" stroke={C_RING} strokeWidth="0.7" />
                    <polyline points={ringMerPts} fill="none" stroke={C_RING} strokeWidth="0.6" />
                    {sortedNodes.map(({ i, r, proj }) => {
                        const op = 0.3 + 0.7 * ((SPHERE_R + r.z) / (2 * SPHERE_R));
                        return (
                            <circle
                                key={i}
                                cx={proj.x}
                                cy={proj.y}
                                r={NODE_BASE_R * proj.s}
                                fill={C_PRIMARY}
                                opacity={op}
                            />
                        );
                    })}
                    <polyline
                        points={trailPoints}
                        fill="none"
                        stroke={C_PRIMARY}
                        strokeWidth={TAIL_THICKNESS}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {cur3 && <circle cx={runProj.x} cy={runProj.y} r={RUNNER_BASE_R * runProj.s} fill={C_PRIMARY} />}
                </svg>
            </MotionConfig>
        </div>
    );
}
