import React, { useState, useEffect } from 'react';

function History() {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ device_id: '', app: '', type: '', start_time: '', end_time: '' });

  useEffect(() => {
    fetchEvents();
  }, [page, filters]);

  const fetchEvents = async () => {
    const query = new URLSearchParams({ ...filters, page, limit: 50 });
    const response = await fetch(`http://localhost:8000/api/events?${query}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await response.json();
    setEvents(data);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Event History</h1>
      <div className="mb-4 grid grid-cols-5 gap-2">
        <input
          type="text"
          placeholder="Device ID"
          value={filters.device_id}
          onChange={(e) => setFilters({...filters, device_id: e.target.value})}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="App"
          value={filters.app}
          onChange={(e) => setFilters({...filters, app: e.target.value})}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Type"
          value={filters.type}
          onChange={(e) => setFilters({...filters, type: e.target.value})}
          className="p-2 border rounded"
        />
        <input
          type="datetime-local"
          placeholder="Start Time"
          value={filters.start_time}
          onChange={(e) => setFilters({...filters, start_time: e.target.value})}
          className="p-2 border rounded"
        />
        <input
          type="datetime-local"
          placeholder="End Time"
          value={filters.end_time}
          onChange={(e) => setFilters({...filters, end_time: e.target.value})}
          className="p-2 border rounded"
        />
      </div>
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Timestamp</th>
            <th className="p-2">Device ID</th>
            <th className="p-2">App</th>
            <th className="p-2">Type</th>
            <th className="p-2">Text</th>
            <th className="p-2">Bounds</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <tr key={index} className="border-t">
              <td className="p-2">{new Date(event.ts).toLocaleString()}</td>
              <td className="p-2">{event.device_id}</td>
              <td className="p-2">{event.app}</td>
              <td className="p-2">{event.type}</td>
              <td className="p-2">{event.text}</td>
              <td className="p-2">{event.l},{event.t},{event.r},{event.b}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <button onClick={() => setPage(Math.max(1, page - 1))} className="mr-2 p-2 bg-blue-500 text-white rounded">Previous</button>
        <span>Page {page}</span>
        <button onClick={() => setPage(page + 1)} className="ml-2 p-2 bg-blue-500 text-white rounded">Next</button>
      </div>
    </div>
  );
}

export default History;
