import { useState } from 'react';

interface UploadResult {
  filename: string;
  chunks_stored: number;
}

interface UploadProps {
  onUploadComplete: (data: UploadResult) => void;
}

function Upload({ onUploadComplete }: UploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data: UploadResult = await res.json();
      onUploadComplete(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 p-10 border border-zinc-800 rounded-2xl bg-zinc-950/50 backdrop-blur">
      <div className="w-14 h-14 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
        <span className="text-2xl">📄</span>
      </div>
      <div className="text-center">
        <p className="text-zinc-200 font-medium">Upload a PDF</p>
        <p className="text-zinc-500 text-sm mt-1">
          Ask questions about your document
        </p>
      </div>

      <label className="bg-white text-black hover:bg-zinc-200 transition-colors px-5 py-2.5 rounded-full text-sm font-medium cursor-pointer">
        {uploading ? 'Processing...' : 'Choose file'}
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
      </label>

      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
}

export default Upload;
