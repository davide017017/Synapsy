#!/usr/bin/env node
import { API } from "../Frontend-nextjs/src/lib/api/endpoints.ts";

const [baseArg, token] = process.argv.slice(2);
const base = baseArg || process.env.API_BASE_URL || "http://127.0.0.1:8000";
const headers = token ? { Authorization: `Bearer ${token}` } : {};

const keys = Object.keys(API).filter((k) => k !== "base");
for (const key of keys) {
  const path = API[key as keyof typeof API];
  const target = `${base}${path}`;
  try {
    const res = await fetch(target, { method: "HEAD", headers });
    const ok = res.ok || res.status === 401;
    console.log(`${path} - ${ok ? "OK" : `ERR ${res.status}`}`);
  } catch (err) {
    console.log(`${path} - ERR ${(err as Error).message}`);
  }
}
