import React, { useState } from 'react';
import RouteSelector from './RouteSelector';
import ScheduleDisplay from './ScheduleDisplay';
import SchedulePager from './SchedulePager';

function App() {
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 3;

  return (
    <div className="container">
      <h1>路線時刻表</h1>
      <RouteSelector 
        onRouteSelect={setSelectedRouteId}
        selectedRouteId={selectedRouteId}
      />
      <ScheduleDisplay 
        routeId={selectedRouteId}
        page={currentPage}
        itemsPerPage={ITEMS_PER_PAGE}
      />
      <SchedulePager 
        onPageChange={setCurrentPage}
        currentPage={currentPage}
        hasNextPage={true}  // This will be updated based on schedule data
        hasPrevPage={currentPage > 0}
      />
    </div>
  );
}

export default App;
