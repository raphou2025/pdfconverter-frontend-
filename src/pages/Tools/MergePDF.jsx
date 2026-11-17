import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import { useNotification } from '../../context/NotificationContext';

export default function MergePDF() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const notify = useNotification();
  const navigate = useNavigate();

  // 🚨 Use react-dropzone to handle files perfectly
  const onDrop = useCallback((acceptedFiles) => {
    // Filter out non-PDFs just in case
    const pdfFiles = acceptedFiles.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== acceptedFiles.length) {
      notify('Some files were ignored because they are not PDFs.', 'info');
    }
    
    setFiles((prev) => [...prev, ...pdfFiles]);
  }, [notify]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'application/pdf': ['.pdf'] }
  });

  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      return notify('Please select at least 2 PDF files to merge.', 'error');
    }
    
    setIsProcessing(true);
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    try {
      const res = await api.post('/tools/merge', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResultUrl(res.data.outputUrl);
      notify('PDFs merged successfully!', 'success');
    } catch (error) {
      notify(error.response?.data?.message || 'Failed to merge PDFs. Check server logs.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      <button 
        onClick={() => navigate('/dashboard')} 
        className="text-slate-400 hover:text-white mb-6 flex items-center gap-2 transition text-sm font-medium"
      >
        ← Back to Dashboard
      </button>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Merge PDF</h1>
        <p className="text-slate-400">Combine multiple PDF files into one seamless document.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
        
        {/* 🚨 Drag and Drop Area */}
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors mb-6
            ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-slate-500 bg-slate-950/50'}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium">Click to upload or drag and drop</p>
              <p className="text-slate-500 text-sm mt-1">Only PDF files are supported</p>
            </div>
          </div>
        </div>

        {/* 🚨 Selected Files List */}
        {files.length > 0 && (
          <div className="mb-6 space-y-3">
            <h3 className="text-sm font-medium text-slate-300">Selected Files ({files.length}):</h3>
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-slate-950 border border-slate-800 p-3 rounded-lg">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="h-8 w-8 rounded bg-red-500/10 text-red-400 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                  </div>
                  <div className="truncate">
                    <p className="text-sm text-slate-200 truncate">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button 
                  onClick={() => removeFile(index)}
                  className="text-slate-500 hover:text-rose-400 p-2 transition"
                  title="Remove file"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 🚨 Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={handleMerge} 
            isLoading={isProcessing} 
            disabled={files.length < 2}
            className="w-full sm:w-auto"
          >
            {isProcessing ? 'Merging...' : `Merge ${files.length > 0 ? files.length : ''} Files`}
          </Button>
          
          {files.length > 0 && (
            <button 
              onClick={() => setFiles([])}
              className="text-slate-400 hover:text-white text-sm font-medium transition px-4 py-2"
            >
              Clear All
            </button>
          )}
        </div>

        {/* 🚨 Success Result */}
        {resultUrl && (
          <div className="mt-8 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              </div>
              <div>
                <p className="text-emerald-400 font-semibold">Merge Complete!</p>
                <p className="text-emerald-500/70 text-sm">Your files have been combined.</p>
              </div>
            </div>
            <a 
              href={resultUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="bg-emerald-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-emerald-600 transition w-full sm:w-auto text-center"
            >
              Download PDF
            </a>
          </div>
        )}
      </div>
    </div>
  );
}