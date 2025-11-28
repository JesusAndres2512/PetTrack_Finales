import apiClient from "./apiClient";

const BASE_PATH = "/postconsult";

export const getFollowups = async () =>
  (await apiClient.get(`${BASE_PATH}/followups`)).data;

export const createFollowup = async (payload) =>
  (await apiClient.post(`${BASE_PATH}/followups`, payload)).data;

export const updateFollowup = async (id, payload) =>
  (await apiClient.patch(`${BASE_PATH}/followups/${id}`, payload)).data;

