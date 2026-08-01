import { useState } from 'react';
import Upload from './Upload';
import Chat from './Chat';

interface DocInfo {
  filename: string;
  chunks_stored: number;
}

function App() {
  const [docInfo, setDocInfo] = useState<DocInfo | null>(null);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-8 px-4">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Doc QA</h1>
        {docInfo && (
          <p className="text-zinc-500 text-sm mt-1">
            {docInfo.filename} · {docInfo.chunks_stored} chunks
          </p>
        )}
      </div>

      {!docInfo ? <Upload onUploadComplete={setDocInfo} /> : <Chat />}
    </div>
  );
}

export default App;
