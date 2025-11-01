import React, { useEffect, useState } from "react";
import { fetchRecommendations } from "../lib/recommendationApi";

const Recommendations: React.FC = () => {
  const [recs, setRecs] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchRecommendations();
      setRecs(data);
    };
    load();
  }, []);

  return (
    <div className="p-4 bg-gray-50">
      <h2 className="text-lg font-semibold mb-2">Gemini AI Recommendations</h2>
      <ul>
        {recs.map((r, i) => (
          <li key={i}>
            {r}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Recommendations;
