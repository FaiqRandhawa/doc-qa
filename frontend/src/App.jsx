import { useState } from 'react';

function App() {
  const [health, setHealth] = useState(null);

  const checkHealth = async () => {
    const res = await fetch('http://localhost:8000/health');
    const data = await res.json();
    console.log('Response data:', data);
    setHealth(data.status);
    console.log('Health state should now be:', data.status);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Doc QA</h1>
      <button
        onClick={checkHealth}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
      >
        Check Backend Health
      </button>
      {health && <p className="text-green-400">Backend status: {health}</p>}
    </div>
  );
}

export default App;
