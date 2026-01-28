import React, { useState, useEffect } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

function EventStream() {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({ device_id: '', app: '', type: '' });

  useEffect(() => {
    const client = new W3CWebSocket(`ws://localhost:8000/ws/admin?token=${localStorage.getItem('token')}`);
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      const event = JSON.parse(message.data);
      setEvents(prev => [event, ...prev].slice(0, 100)); // Keep last 100 events
    };
    return () => client.close();
  }, []);

  const filteredEvents = events.filter(event =>
    (!filters.device_id || event.device_id === filters.device_id) &&
    (!filters.app || event.package_name === filters.app) &&
    (!filters.type || event.event_type === filters.type)
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Live Event Stream</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by Device ID"
          value={filters.device_id}
          onChange={(e) => setFilters({...filters, device_id: e.target.value})}
          className="mr-2 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Filter by App"
          value={filters.app}
          onChange={(e) => setFilters({...filters, app: e.target.value})}
          className="mr-2 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Filter by Type"
          value={filters.type}
          onChange={(e) => setFilters({...filters, type: e.target.value})}
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
            <th className="p-2">View ID</th>
          </tr>
        </thead>
        <tbody>
          {filteredEvents.map((event, index) => (
            <tr key={index} className="border-t">
              <td className="p-2">{new Date(event.timestamp).toLocaleString()}</td>
              <td className="p-2">{event.device_id}</td>
              <td className="p-2">{event.package_name}</td>
              <td className="p-2">{event.event_type}</td>
              <td className="p-2">{event.text}</td>
              <td className="p-2">{event.view_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EventStream;
