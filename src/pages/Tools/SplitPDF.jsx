import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import { useNotification } from '../../context/NotificationContext';

export default function SplitPDF() {
  const [file, setFile] = useState(null);
  const [startPage, setStartPage] = useState('');
  const [endPage, setEndPage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const notify = useNotification();
  const navigate = useNavigate();

  const handleSplit = async (e) => {
    e.preventDefault();
    if (!file || !startPage || !endPage) return notify('Please fill all fields.', 'error');
    
    setIsProcessing(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('startPage', startPage);
    formData.append('endPage', endPage);

    try {
      const res = await api.post('/tools/split', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResultUrl(res.data.outputUrl);
      notify('PDF split successfully!', 'success');
    } catch (error) {
      notify(error.response?.data?.message || 'Splitting failed.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-white mb-6">← Back to Dashboard</button>
      <h1 className="text-3xl font-bold text-white mb-2">Split PDF</h1>
      <p className="text-slate-400 mb-8">Extract a specific range of pages from your PDF.</p>

      <form onSubmit={handleSplit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <label className="block text-slate-300 mb-2">Upload PDF</label>
          <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} className="block w-full text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20" />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-slate-300 mb-2">Start Page</label>
            <input type="number" min="1" value={startPage} onChange={(e) => setStartPage(e.target.value)} className="w-full bg-slate-950 text-white p-3 rounded-lg border border-slate-800 focus:border-blue-500 outline-none" />
          </div>
          <div className="flex-1">
            <label className="block text-slate-300 mb-2">End Page</label>
            <input type="number" min="1" value={endPage} onChange={(e) => setEndPage(e.target.value)} className="w-full bg-slate-950 text-white p-3 rounded-lg border border-slate-800 focus:border-blue-500 outline-none" />
          </div>
        </div>

        <Button type="submit" isLoading={isProcessing}>Split PDF</Button>

        {resultUrl && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <a href={resultUrl} target="_blank" rel="noreferrer" className="text-emerald-400 font-semibold underline hover:text-emerald-300">Download Split PDF</a>
          </div>
        )}
      </form>
    </div>
  );
}