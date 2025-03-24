import React, { useState } from 'react';
import RouteSelector from './RouteSelector';
import ScheduleDisplay from './ScheduleDisplay';
import SchedulePager from './SchedulePager';

function App() {
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const ITEMS_PER_PAGE = 3;

  const handleRouteSelect = (routeId) => {
    setSelectedRouteId(routeId);
    setCurrentPage(0);
  };

  return (
    <div className="container">
      <h1>路線時刻表</h1>
      <RouteSelector 
        onRouteSelect={handleRouteSelect}
        selectedRouteId={selectedRouteId}
      />
      <ScheduleDisplay 
        routeId={selectedRouteId}
        page={currentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        onTotalPagesChange={setTotalPages}
      />
      <SchedulePager 
        onPageChange={setCurrentPage}
        currentPage={currentPage}
        hasNextPage={currentPage < totalPages - 1}
        hasPrevPage={currentPage > 0}
      />
    </div>
  );
}

export default App;
