export const API = {
  base: process.env.NEXT_PUBLIC_API_BASE_URL!,
  me: "/api/v1/me",
  entrate: "/api/v1/entrate",
  spese: "/api/v1/spese",
  categories: "/api/v1/categories",
  recurring: "/api/v1/recurring-operations",
} as const;
export type EndpointKey = keyof typeof API;
export const url = (k: EndpointKey, id?: string | number) =>
  id != null ? `${API.base}${API[k]}/${id}` : `${API.base}${API[k]}`;
