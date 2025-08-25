import { API, EndpointKey, url } from "../src/lib/api/endpoints";

// ==============================
// Script: verifica endpoints API
// ==============================
async function check() {
    const keys = Object.keys(API) as EndpointKey[];
    for (const key of keys) {
        const endpoint = url(key);
        for (const method of ["HEAD", "GET"] as const) {
            try {
                const res = await fetch(endpoint, { method });
                const ok = (res.status >= 200 && res.status < 300) || res.status === 401;
                console.log(`${method} ${endpoint} -> ${res.status} ${ok ? "OK" : "FAIL"} [${key}]`);
            } catch (err: any) {
                console.log(`${method} ${endpoint} -> ERROR [${key}] ${err.message}`);
            }
        }
    }
}

check();
