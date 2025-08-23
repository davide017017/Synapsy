export const API = {
  base: process.env.NEXT_PUBLIC_API_BASE_URL!,
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
} as const;
export type EndpointKey = keyof typeof API;
export const url = (k: EndpointKey, id?: string | number) =>
  id != null ? `${API.base}${API[k]}/${id}` : `${API.base}${API[k]}`;
