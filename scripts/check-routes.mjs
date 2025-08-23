#!/usr/bin/env node

const API = {
  login: "/api/v1/login",
  register: "/api/v1/register",
  forgotPassword: "/api/v1/forgot-password",
  resetPassword: "/api/v1/reset-password",
  me: "/api/v1/me",
  profile: "/api/v1/profile",
  avatars: "/api/v1/avatars",
  financialOverview: "/api/v1/financialoverview",
  entrate: "/api/v1/entrate",
  spese: "/api/v1/spese",
  categories: "/api/v1/categories",
  recurring: "/api/v1/recurring-operations",
  mlSuggestCategory: "/api/v1/ml/suggest-category",
};

const [baseArg, token] = process.argv.slice(2);
const base = baseArg || process.env.API_BASE_URL || "http://127.0.0.1:8000";
const headers = token ? { Authorization: `Bearer ${token}` } : {};

for (const path of Object.values(API)) {
  const target = `${base}${path}`;
  try {
    const res = await fetch(target, { method: "HEAD", headers });
    const ok = res.ok || res.status === 401;
    console.log(`${path} - ${ok ? "OK" : `ERR ${res.status}`}`);
  } catch (err) {
    console.log(`${path} - ERR ${err.message}`);
  }
}
