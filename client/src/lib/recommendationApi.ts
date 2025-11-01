import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_RECOMMEND_URL || "http://localhost:7001/api/recommendations";

export const fetchRecommendations = async (): Promise<any[]> => {
  const res = await axios.post(API_URL, { topics: "AI", skillLevel: "Intermediate" });
  return res.data.recommendations;
};
