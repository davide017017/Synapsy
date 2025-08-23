#!/usr/bin/env node
const { API, url } = await import("../src/lib/api/endpoints.ts");
const keys = Object.keys(API).filter((k) => k !== "base");
for (const key of keys) {
  const target = url(key);
  try {
    const res = await fetch(target, { method: "HEAD" });
    const ok = res.ok || res.status === 401;
    console.log(`${API[key]} - ${ok ? "OK" : `ERR ${res.status}`}`);
  } catch (err) {
    console.log(`${API[key]} - ERR ${(err).message}`);
  }
}
