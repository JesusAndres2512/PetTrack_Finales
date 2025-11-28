import apiClient from "./apiClient";

const BASE_PATH = VITE_API_APIM_URL + "/rewards";

export const listRewards = async () =>
  (await apiClient.get(BASE_PATH)).data;

