import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    const response = await fetch('http://localhost:8000/api/devices', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await response.json();
    setDevices(data);
  };

  const handleConnect = (deviceId) => {
    // Implement remote desktop connection
    console.log('Connecting to device:', deviceId);
  };

  const handleDisconnect = (deviceId) => {
    // Implement disconnect
    console.log('Disconnecting from device:', deviceId);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Device Dashboard</h1>
      <div className="mb-4">
        <Link to="/events" className="mr-4 p-2 bg-blue-500 text-white rounded">Live Events</Link>
        <Link to="/history" className="mr-4 p-2 bg-green-500 text-white rounded">Event History</Link>
        <Link to="/overlay" className="p-2 bg-purple-500 text-white rounded">Interaction Overlay</Link>
      </div>
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Device ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">OS</th>
            <th className="p-2">IP</th>
            <th className="p-2">Status</th>
            <th className="p-2">Last Active</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device) => (
            <tr key={device.id} className="border-t">
              <td className="p-2">{device.device_id}</td>
              <td className="p-2">{device.name}</td>
              <td className="p-2">{device.os}</td>
              <td className="p-2">{device.ip}</td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded ${device.is_online ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                  {device.is_online ? 'Online' : 'Offline'}
                </span>
              </td>
              <td className="p-2">{new Date(device.last_active).toLocaleString()}</td>
              <td className="p-2">
                <button
                  onClick={() => handleConnect(device.device_id)}
                  className="mr-2 p-1 bg-blue-500 text-white rounded"
                  disabled={!device.is_online}
                >
                  Connect
                </button>
                <button
                  onClick={() => handleDisconnect(device.device_id)}
                  className="p-1 bg-red-500 text-white rounded"
                >
                  Disconnect
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
