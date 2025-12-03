import { apiGet, apiPost, apiPut, apiDelete } from "./api";
export const CarsAPI = {
  list: () => apiGet("/cars"),
  get: (id) => apiGet(`/cars/${id}`),
  create: (payload) => apiPost("/cars", payload),
  update: (id, payload) => apiPut(`/cars/${id}`, payload),
  remove: (id) => apiDelete(`/cars/${id}`),
  search: async (q) => {
    try {
      return await apiGet("/cars/search", q);
    } catch (e) {
      if (e?.status === 404 || e?.status === 405) {
        return apiGet("/cars", q);
      }
      throw e;
    }
  },
};
