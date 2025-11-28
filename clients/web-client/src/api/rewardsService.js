import apiClient from "./apiClient";

const BASE_PATH = VITE_API_APIM_URL;

export const listRewards = async () =>
  (await apiClient.get(BASE_PATH + "/rewards/rewards")).data;

export const getRewardById = async (rewardId) =>
  (await apiClient.get(BASE_PATH + `/rewards/${rewardId}`)).data;