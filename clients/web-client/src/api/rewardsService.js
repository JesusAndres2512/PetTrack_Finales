import apiClient from "./apiClient";

const BASE_PATH = "/rewards";

export const listRewards = async () =>
  (await apiClient.get(BASE_PATH)).data;

