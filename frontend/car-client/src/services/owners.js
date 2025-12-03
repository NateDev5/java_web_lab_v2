import { apiGet, apiPost, apiPut, apiDelete } from "./api";
export const OwnersAPI = {
  list: () => apiGet("/owners"),
  get: (id) => apiGet(`/owners/${id}`),
  create: (payload) => apiPost("/owners", payload),
  update: (id, payload) => apiPut(`/owners/${id}`, payload),
  remove: (id) => apiDelete(`/owners/${id}`),
  search: (q) => apiGet("/owners/search", q),
  carsByOwner: (id) => apiGet(`/owners/${id}/cars`),
};
