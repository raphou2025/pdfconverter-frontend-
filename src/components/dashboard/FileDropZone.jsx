import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';

export default function FileDropzone({ onFileUpload }) {
  const { t } = useTranslation();
  const onDrop = useCallback((acceptedFiles) => {
    // Pass the first file to the parent component
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={`cursor-pointer rounded-2xl border-2 border-dashed px-5 py-10 text-center transition sm:py-14
        ${isDragActive
          ? 'border-blue-400 bg-blue-400/10'
          : 'border-slate-700 bg-slate-950/50 hover:border-blue-400/60 hover:bg-slate-950/80'}`}
    >
      <input {...getInputProps()} />
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-blue-300">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
          <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14.5v3A2.5 2.5 0 0 0 7.5 20h9a2.5 2.5 0 0 0 2.5-2.5v-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <p className={`font-medium ${isDragActive ? 'text-blue-300' : 'text-slate-200'}`}>
        {isDragActive ? t('upload.dropActive') : t('upload.dropPrompt')}
      </p>
      <p className="mt-2 text-sm text-slate-500">
        {t('upload.or')} <span className="text-blue-300">{t('upload.browse')}</span> {t('upload.fromDevice')}
      </p>
      <p className="mt-5 text-xs text-slate-600">{t('upload.supportedFiles')}</p>
    </div>
  );
}