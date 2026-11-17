import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import { useNotification } from '../../context/NotificationContext';

export default function JpgToPdf() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const notify = useNotification();
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }
  });

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleConvert = async () => {
    if (files.length === 0) return notify('Please select at least 1 image.', 'error');
    setIsProcessing(true);
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    try {
      const res = await api.post('/tools/jpg-to-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResultUrl(res.data.outputUrl);
      notify('Images converted successfully!', 'success');
    } catch (error) {
      notify(error.response?.data?.message || 'Conversion failed.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-white mb-6">← Back to Dashboard</button>
      <h1 className="text-3xl font-bold text-white mb-2">JPG to PDF</h1>
      <p className="text-slate-400 mb-8">Convert your images into a single PDF document.</p>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer mb-6 ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-950/50 hover:border-slate-500'}`}>
          <input {...getInputProps()} />
          <p className="text-white font-medium">Click or drag images here</p>
          <p className="text-slate-500 text-sm mt-1">JPG or PNG only</p>
        </div>

        {files.length > 0 && (
          <div className="mb-6 space-y-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between bg-slate-950 border border-slate-800 p-3 rounded-lg">
                <p className="text-sm text-slate-300 truncate">{f.name}</p>
                <button onClick={() => removeFile(i)} className="text-slate-500 hover:text-rose-400">✕</button>
              </div>
            ))}
          </div>
        )}

        <Button onClick={handleConvert} isLoading={isProcessing} disabled={files.length === 0}>Convert to PDF</Button>

        {resultUrl && (
          <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <a href={resultUrl} target="_blank" rel="noreferrer" className="text-emerald-400 font-semibold underline hover:text-emerald-300">Download PDF</a>
          </div>
        )}
      </div>
    </div>
  );
}