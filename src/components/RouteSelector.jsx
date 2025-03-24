import React, { useState, useEffect } from 'react';
import { fetchRoutes } from '../services/api';

function RouteSelector({ onRouteSelect, selectedRouteId }) {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRoutes = async () => {
      setLoading(true);
      try {
        const data = await fetchRoutes();
        setRoutes(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setRoutes([]);
      } finally {
        setLoading(false);
      }
    };

    loadRoutes();
  }, []);

  if (loading) return <div>路線データを読み込み中...</div>;
  if (error) return <div>エラー: {error}</div>;

  return (
    <div className="route-selection">
      <select 
        value={selectedRouteId || ''} 
        onChange={(e) => onRouteSelect(e.target.value)}
      >
        <option value="">路線を選択してください</option>
        {routes.map(route => (
          <option key={route.id} value={route.id}>
            {route.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default RouteSelector;
