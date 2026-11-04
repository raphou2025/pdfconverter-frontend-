import { useState } from 'react';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../../context/NotificationContext';
import { localizeError } from '../../utils/localizeError';

const LanguageSelect = ({ id, label, value, onChange, disabled, t }) => (
  <label htmlFor={id} className="flex min-w-0 flex-1 items-center gap-3">
    <span className="sr-only">{label}</span>
    <select
      id={id}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full cursor-pointer rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-medium text-slate-100 outline-none transition hover:border-slate-600 focus:border-blue-400 disabled:cursor-wait disabled:opacity-60"
    >
      <option value="en">{t('translator.english')}</option>
      <option value="km">{t('translator.khmer')}</option>
    </select>
  </label>
);

function SwapIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="M7 7h13m0 0-3-3m3 3-3 3M17 17H4m0 0 3 3m-3-3 3-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export default function Translator() {
  const { t } = useTranslation();
  const notify = useNotification();
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('km');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = async () => {
    const text = sourceText.trim();
    if (!text || isLoading) return;

    setIsLoading(true);
    setTranslatedText('');
    try {
      const { data } = await api.post('/translate', { text, sourceLang, targetLang });
      setTranslatedText(data.translatedText);
      notify(t('translator.translationSuccess'), 'success');
    } catch (error) {
      console.error('Translation failed:', error);
      notify(error.response?.data?.message
        ? localizeError(error.response.data.message, t)
        : t('translator.translationFailed'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText || sourceText);
    setTranslatedText(translatedText ? sourceText : '');
  };

  const handleClear = () => {
    setSourceText('');
    setTranslatedText('');
  };

  const handleCopy = async () => {
    if (!translatedText) return;
    try {
      await navigator.clipboard.writeText(translatedText);
      notify(t('translator.copied'), 'success');
    } catch (error) {
      console.error('Failed to copy translated text:', error);
      notify(t('translator.copyFailed'), 'error');
    }
  };

  const handleSourceChange = (event) => {
    setSourceText(event.target.value);
    setTranslatedText('');
  };

  return (
    <div>
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-blue-300">{t('translator.tools')}</p>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{t('translator.title')}</h1>
        <p className="mt-2 text-slate-400">{t('translator.description')}</p>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl shadow-black/10">
        <div className="grid items-center gap-3 border-b border-slate-800 bg-slate-950/30 p-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:p-5">
          <LanguageSelect
            id="source-language"
            label={t('translator.sourceLanguage')}
            value={sourceLang}
            onChange={(event) => {
              setSourceLang(event.target.value);
              setTranslatedText('');
            }}
            disabled={isLoading}
            t={t}
          />
          <button
            type="button"
            onClick={handleSwapLanguages}
            disabled={isLoading}
            aria-label={t('translator.swapLanguages')}
            title={t('translator.swapLanguages')}
            className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-blue-400/50 hover:bg-slate-800 hover:text-blue-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <SwapIcon />
          </button>
          <LanguageSelect
            id="target-language"
            label={t('translator.targetLanguage')}
            value={targetLang}
            onChange={(event) => {
              setTargetLang(event.target.value);
              setTranslatedText('');
            }}
            disabled={isLoading}
            t={t}
          />
        </div>

        <div className="grid lg:grid-cols-2">
          <div className="border-b border-slate-800 p-4 sm:p-5 lg:border-b-0 lg:border-r">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{t('translator.sourceText')}</span>
              {sourceText && (
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={isLoading}
                  className="rounded-lg px-2 py-1 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
                >
                  {t('translator.clear')}
                </button>
              )}
            </div>
            <textarea
              id="source-text"
              maxLength={5000}
              className="mt-3 h-56 w-full resize-y bg-transparent text-lg leading-8 text-slate-100 outline-none placeholder:text-slate-600 disabled:opacity-60 sm:h-64"
              placeholder={t('translator.sourcePlaceholder')}
              value={sourceText}
              onChange={handleSourceChange}
              onKeyDown={(event) => {
                if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                  event.preventDefault();
                  handleTranslate();
                }
              }}
              disabled={isLoading}
            />
            <div className="flex items-center justify-between gap-4 border-t border-slate-800 pt-3">
              <span className="text-xs text-slate-500">
                {t('translator.characters', { count: sourceText.length })} / 5000
              </span>
              <Button
                onClick={handleTranslate}
                isLoading={isLoading}
                disabled={!sourceText.trim()}
                className="min-w-32 rounded-full"
              >
                {t('translator.translate')}
              </Button>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{t('translator.translation')}</span>
              {translatedText && (
                <button
                  type="button"
                  onClick={handleCopy}
                  aria-label={t('translator.copyTranslation')}
                  className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
                >
                  <CopyIcon />
                  {t('translator.copy')}
                </button>
              )}
            </div>
            <textarea
              id="translated-text"
              aria-label={t('translator.translation')}
              className="mt-3 h-56 w-full resize-y bg-transparent text-lg leading-8 text-blue-100 outline-none placeholder:text-slate-600 sm:h-64"
              placeholder={isLoading ? t('translator.translating') : t('translator.translationPlaceholder')}
              value={translatedText}
              readOnly
            />
            <div className="flex items-center justify-end border-t border-slate-800 pt-3">
              <span className="text-xs text-slate-500">
                {t('translator.characters', { count: translatedText.length })}
              </span>
            </div>
          </div>
        </div>
      </section>
      <p className="mt-3 text-xs text-slate-500">{t('translator.keyboardShortcut')}</p>
    </div>
  );
}
