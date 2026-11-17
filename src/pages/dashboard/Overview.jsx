// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../hooks/useAuth";
// import FileDropzone from "../../components/dashboard/FileDropZone";
// import Button from "../../components/ui/Button";
// import api from "../../services/api";
// import { useTranslation } from "react-i18next";
// import { localizeError } from "../../utils/localizeError";
// import { useNotification } from "../../context/NotificationContext";
// import { ToolIcons } from "../../components/ui/ToolIcons";

// export default function Overview() {
//   const { user } = useAuth();
//   const { t } = useTranslation();
//   const notify = useNotification();
//   const navigate = useNavigate();

//   const [file, setFile] = useState(null);
//   const [imageUrl, setImageUrl] = useState("");
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [result, setResult] = useState(null);

//   // 🚨 FIXED: Cleaned up the duplicate category and fixed the typo
//   const toolCategories = [
//     {
//       title: "Extract & Process",
//       tools: [
//         {
//           name: "OCR PDF / Image",
//           icon: ToolIcons.Search,
//           path: "#upload-section",
//           color: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
//         },
//         {
//           name: "Translate Document",
//           icon: ToolIcons.Translate,
//           path: "/dashboard/translator",
//           color: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
//         },
//       ],
//     },
//     {
//       title: "Manage PDF",
//       tools: [
//         {
//           name: "Merge PDF",
//           icon: ToolIcons.Merge,
//           path: "/dashboard/tools/merge", // 🚨 Now routes perfectly
//           color: "bg-violet-500/10 text-violet-400 ring-violet-500/20",
//         },
//         {
//           name: "Split PDF",
//           icon: ToolIcons.Split,
//           path: "#",
//           color: "bg-violet-500/10 text-violet-400 ring-violet-500/20",
//           comingSoon: true,
//         },
//       ],
//     },
//     {
//       title: "Convert from PDF",
//       tools: [
//         {
//           name: "PDF to Word",
//           icon: ToolIcons.Doc,
//           path: "#",
//           color: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
//           comingSoon: true,
//         },
//         {
//           name: "PDF to JPG",
//           icon: ToolIcons.Image,
//           path: "#",
//           color: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
//           comingSoon: true,
//         },
//       ],
//     },
//     {
//       title: "Convert to PDF",
//       tools: [
//         {
//           name: "Word to PDF",
//           icon: ToolIcons.Doc,
//           path: "#",
//           color: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
//           comingSoon: true,
//         },
//         {
//           name: "JPG to PDF",
//           icon: ToolIcons.Image,
//           path: "#",
//           color: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
//           comingSoon: true,
//         },
//       ],
//     },
//   ];

//   const handleToolClick = (tool) => {
//     if (tool.comingSoon) {
//       notify(`${tool.name} is coming soon!`, "info");
//     } else {
//       navigate(tool.path);
//     }
//   };

//   useEffect(() => {
//     if (file && file.type.startsWith("image/")) {
//       const objectUrl = URL.createObjectURL(file);
//       setPreviewUrl(objectUrl);
//       return () => URL.revokeObjectURL(objectUrl);
//     } else if (imageUrl.trim().length > 5) {
//       setPreviewUrl(imageUrl.trim());
//     } else {
//       setPreviewUrl(null);
//     }
//   }, [file, imageUrl]);

//   const handleUpload = async () => {
//     if (!file && !imageUrl) return;
//     setIsProcessing(true);
//     setResult(null);

//     try {
//       let response;

//       if (imageUrl.trim()) {
//         response = await api.post("/files/convert", {
//           imageUrl: imageUrl.trim(),
//         });
//       } else {
//         const formData = new FormData();
//         formData.append("file", file);
//         response = await api.post("/files/convert", formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//       }

//       setResult(response.data);
//       notify(t("overview.conversionSuccess"), "success");
//     } catch (requestError) {
//       notify(
//         requestError.response?.data?.message
//           ? localizeError(requestError.response.data.message, t)
//           : t("overview.conversionError"),
//         "error",
//       );
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div>
//       <div className="mb-8">
//         <p className="mb-2 text-sm font-medium text-blue-300">
//           {t("overview.workspace")}
//         </p>
//         <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
//           {user?.name
//             ? t("overview.welcomeUser", { name: user.name.split(" ")[0] })
//             : t("overview.welcome")}
//         </h1>
//         <p className="mt-2 text-slate-400">{t("overview.intro")}</p>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
//         {toolCategories.map((category) => (
//           <div key={category.title}>
//             <h3 className="font-semibold text-slate-200 mb-4 text-sm tracking-wide uppercase">
//               {category.title}
//             </h3>
//             <div className="flex flex-col gap-3">
//               {category.tools.map((tool) => (
//                 <button
//                   key={tool.name}
//                   onClick={() => handleToolClick(tool)}
//                   className="flex items-center gap-4 p-3 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/80 transition text-left group"
//                 >
//                   <div
//                     className={`h-11 w-11 rounded-lg flex items-center justify-center ring-1 ${tool.color} group-hover:scale-105 transition-transform`}
//                   >
//                     <tool.icon className="w-5 h-5" />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <span className="block font-medium text-sm text-slate-200 group-hover:text-white transition truncate">
//                       {tool.name}
//                     </span>
//                   </div>
//                   {tool.comingSoon && (
//                     <span className="ml-auto text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md uppercase tracking-wider">
//                       Soon
//                     </span>
//                   )}
//                 </button>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       <div
//         id="upload-section"
//         className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(240px,0.8fr)] scroll-mt-24"
//       >
//         <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-black/10 sm:p-7">
//           <div className="mb-5">
//             <h2 className="text-lg font-semibold text-white">
//               {t("overview.convertFile")}
//             </h2>
//             <p className="mt-1 text-sm text-slate-400">
//               {t("overview.uploadDescription")}
//             </p>
//           </div>

//           <FileDropzone
//             onFileUpload={(f) => {
//               setFile(f);
//               setImageUrl("");
//               setResult(null);
//             }}
//           />
//           <p className="mt-3 text-xs text-amber-500/80">
//             Note: If your PDF is a scanned image (like a photo of a book), our
//             text extractor might fail. For best results, upload an image file
//             instead.
//           </p>

//           <div className="relative my-6">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-slate-700"></div>
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="bg-slate-900 px-2 text-slate-500">OR</span>
//             </div>
//           </div>

//           <div>
//             <label
//               htmlFor="imageUrl"
//               className="mb-2 block text-sm font-medium text-slate-300"
//             >
//               Paste an Image URL
//             </label>
//             <input
//               id="imageUrl"
//               type="url"
//               placeholder="https://example.com/image.jpg"
//               value={imageUrl}
//               onChange={(e) => {
//                 setImageUrl(e.target.value);
//                 setFile(null);
//                 setResult(null);
//               }}
//               className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400"
//             />
//           </div>

//           {previewUrl && (
//             <div className="mt-6">
//               <p className="mb-2 text-sm font-medium text-slate-300">
//                 Image Preview
//               </p>
//               <div className="relative h-48 w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-950">
//                 <img
//                   src={previewUrl}
//                   alt="Preview"
//                   className="h-full w-full object-contain"
//                   onError={() => setPreviewUrl(null)}
//                 />
//               </div>
//             </div>
//           )}

//           {(file || imageUrl) && (
//             <div className="mt-5 flex flex-col gap-4 rounded-xl border border-slate-700 bg-slate-950/70 p-4 sm:flex-row sm:items-center sm:justify-between">
//               <div className="min-w-0">
//                 <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
//                   {file ? t("overview.selectedFile") : "Selected URL"}
//                 </p>
//                 <p className="mt-1 truncate text-sm font-medium text-slate-200">
//                   {file ? file.name : imageUrl}
//                 </p>
//               </div>
//               <Button onClick={handleUpload} isLoading={isProcessing}>
//                 {t("overview.convertButton")}
//               </Button>
//             </div>
//           )}

//           {result && (
//             <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
//               <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                 <div>
//                   <p className="font-medium text-emerald-300">
//                     {t("overview.success")}
//                   </p>
//                   <p className="mt-1 text-sm text-slate-400">
//                     {t("overview.copyInstruction")}
//                   </p>
//                 </div>
//                 {result.outputUrl && (
//                   <a
//                     href={result.outputUrl}
//                     download
//                     className="text-sm font-semibold text-emerald-300 hover:text-emerald-200"
//                   >
//                     {t("overview.downloadText")}
//                   </a>
//                 )}
//               </div>
//               <textarea
//                 aria-label={t("overview.extractedText")}
//                 readOnly
//                 value={result.extractedText}
//                 className="mt-4 min-h-48 w-full resize-y rounded-xl border border-slate-700 bg-slate-950/80 p-3 text-sm leading-6 text-slate-200 focus:outline-none"
//               />
//             </div>
//           )}
//         </section>

//         <aside className="rounded-2xl border border-slate-800 bg-gradient-to-br from-blue-500/10 via-slate-900 to-slate-900 p-6">
//           <span className="inline-flex rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs font-medium text-blue-200">
//             {t("overview.workflow")}
//           </span>
//           <h2 className="mt-5 text-xl font-semibold text-white">
//             {t("overview.moreThanConversion")}
//           </h2>
//           <p className="mt-2 text-sm leading-6 text-slate-400">
//             {t("overview.workflowDescription")}
//           </p>
//           <div className="mt-6 space-y-3">
//             <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
//               <p className="text-sm font-medium text-slate-200">
//                 {t("overview.textTranslator")}
//               </p>
//               <p className="mt-1 text-xs leading-5 text-slate-500">
//                 {t("overview.translatorDescription")}
//               </p>
//             </div>
//             <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
//               <p className="text-sm font-medium text-slate-200">
//                 {t("overview.workHistory")}
//               </p>
//               <p className="mt-1 text-xs leading-5 text-slate-500">
//                 {t("overview.historyDescription")}
//               </p>
//             </div>
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import FileDropzone from "../../components/dashboard/FileDropZone";
import Button from "../../components/ui/Button";
import api from "../../services/api";
import { useTranslation } from "react-i18next";
import { localizeError } from "../../utils/localizeError";
import { useNotification } from "../../context/NotificationContext";
import { ToolIcons } from "../../components/ui/ToolIcons";
import UpgradeModal from "../../components/dashboard/UpgradeModal"; // 🚨 Import Paywall

export default function Overview() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const notify = useNotification();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  // 🚨 Paywall Modal State
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState("");

  const toolCategories = [
    {
      title: "Extract & Process",
      tools: [
        {
          name: "OCR PDF / Image",
          icon: ToolIcons.Search,
          path: "#upload-section",
          color: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
        },
        {
          name: "Translate Document",
          icon: ToolIcons.Translate,
          path: "/dashboard/translator",
          color: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
        },
      ],
    },
    {
      title: "Manage PDF",
      tools: [
        {
          name: "Merge PDF",
          icon: ToolIcons.Merge,
          path: "/dashboard/tools/merge",
          color: "bg-violet-500/10 text-violet-400 ring-violet-500/20",
        },
        {
          name: "Split PDF",
          icon: ToolIcons.Split,
          path: "/dashboard/tools/split", // 🚨 Fixed to route properly
          color: "bg-violet-500/10 text-violet-400 ring-violet-500/20",
        },
      ],
    },
    {
      title: "Convert from PDF",
      tools: [
        {
          name: "PDF to Word",
          icon: ToolIcons.Doc,
          path: "#",
          color: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
          isPremium: true, // 🚨 Marked as Premium
        },
        {
          name: "PDF to JPG",
          icon: ToolIcons.Image,
          path: "#",
          color: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
          comingSoon: true,
        },
      ],
    },
    {
      title: "Convert to PDF",
      tools: [
        {
          name: "Word to PDF",
          icon: ToolIcons.Doc,
          path: "#",
          color: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
          isPremium: true, // 🚨 Marked as Premium
        },
        {
          name: "JPG to PDF",
          icon: ToolIcons.Image,
          path: "/dashboard/tools/jpg-to-pdf", // 🚨 Fixed to route properly
          color: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
        },
      ],
    },
  ];

  const handleToolClick = (tool) => {
    if (tool.isPremium) {
      // 🚨 Open the Paywall Modal instead of navigating
      setSelectedFeature(tool.name);
      setUpgradeModalOpen(true);
    } else if (tool.comingSoon) {
      notify(`${tool.name} is coming soon!`, "info");
    } else {
      navigate(tool.path);
    }
  };

  useEffect(() => {
    if (file && file.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (imageUrl.trim().length > 5) {
      setPreviewUrl(imageUrl.trim());
    } else {
      setPreviewUrl(null);
    }
  }, [file, imageUrl]);

  const handleUpload = async () => {
    if (!file && !imageUrl) return;
    setIsProcessing(true);
    setResult(null);

    try {
      let response;

      if (imageUrl.trim()) {
        response = await api.post("/files/convert", {
          imageUrl: imageUrl.trim(),
        });
      } else {
        const formData = new FormData();
        formData.append("file", file);
        response = await api.post("/files/convert", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setResult(response.data);
      notify(t("overview.conversionSuccess"), "success");
    } catch (requestError) {
      notify(
        requestError.response?.data?.message
          ? localizeError(requestError.response.data.message, t)
          : t("overview.conversionError"),
        "error",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-blue-300">
          {t("overview.workspace")}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {user?.name
            ? t("overview.welcomeUser", { name: user.name.split(" ")[0] })
            : t("overview.welcome")}
        </h1>
        <p className="mt-2 text-slate-400">{t("overview.intro")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {toolCategories.map((category) => (
          <div key={category.title}>
            <h3 className="font-semibold text-slate-200 mb-4 text-sm tracking-wide uppercase">
              {category.title}
            </h3>
            <div className="flex flex-col gap-3">
              {category.tools.map((tool) => (
                <button
                  key={tool.name}
                  onClick={() => handleToolClick(tool)}
                  className="flex items-center gap-4 p-3 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/80 transition text-left group"
                >
                  <div
                    className={`h-11 w-11 rounded-lg flex items-center justify-center ring-1 ${tool.color} group-hover:scale-105 transition-transform`}
                  >
                    <tool.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block font-medium text-sm text-slate-200 group-hover:text-white transition truncate">
                      {tool.name}
                    </span>
                  </div>
                  
                  {/* 🚨 BADGES: PRO vs SOON */}
                  {tool.isPremium && (
                    <span className="ml-auto text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md uppercase tracking-wider">
                      PRO
                    </span>
                  )}
                  {tool.comingSoon && !tool.isPremium && (
                    <span className="ml-auto text-[10px] font-bold text-slate-400 bg-slate-400/10 px-2 py-1 rounded-md uppercase tracking-wider">
                      Soon
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        id="upload-section"
        className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(240px,0.8fr)] scroll-mt-24"
      >
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-black/10 sm:p-7">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-white">
              {t("overview.convertFile")}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {t("overview.uploadDescription")}
            </p>
          </div>

          <FileDropzone
            onFileUpload={(f) => {
              setFile(f);
              setImageUrl("");
              setResult(null);
            }}
          />
          <p className="mt-3 text-xs text-amber-500/80">
            Note: If your PDF is a scanned image (like a photo of a book), our
            text extractor might fail. For best results, upload an image file
            instead.
          </p>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-slate-900 px-2 text-slate-500">OR</span>
            </div>
          </div>

          <div>
            <label
              htmlFor="imageUrl"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Paste an Image URL
            </label>
            <input
              id="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setFile(null);
                setResult(null);
              }}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400"
            />
          </div>

          {previewUrl && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-slate-300">
                Image Preview
              </p>
              <div className="relative h-48 w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-950">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-full w-full object-contain"
                  onError={() => setPreviewUrl(null)}
                />
              </div>
            </div>
          )}

          {(file || imageUrl) && (
            <div className="mt-5 flex flex-col gap-4 rounded-xl border border-slate-700 bg-slate-950/70 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {file ? t("overview.selectedFile") : "Selected URL"}
                </p>
                <p className="mt-1 truncate text-sm font-medium text-slate-200">
                  {file ? file.name : imageUrl}
                </p>
              </div>
              <Button onClick={handleUpload} isLoading={isProcessing}>
                {t("overview.convertButton")}
              </Button>
            </div>
          )}

          {result && (
            <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-emerald-300">
                    {t("overview.success")}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    {t("overview.copyInstruction")}
                  </p>
                </div>
                {result.outputUrl && (
                  <a
                    href={result.outputUrl}
                    download
                    className="text-sm font-semibold text-emerald-300 hover:text-emerald-200"
                  >
                    {t("overview.downloadText")}
                  </a>
                )}
              </div>
              <textarea
                aria-label={t("overview.extractedText")}
                readOnly
                value={result.extractedText}
                className="mt-4 min-h-48 w-full resize-y rounded-xl border border-slate-700 bg-slate-950/80 p-3 text-sm leading-6 text-slate-200 focus:outline-none"
              />
            </div>
          )}
        </section>

        <aside className="rounded-2xl border border-slate-800 bg-gradient-to-br from-blue-500/10 via-slate-900 to-slate-900 p-6">
          <span className="inline-flex rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs font-medium text-blue-200">
            {t("overview.workflow")}
          </span>
          <h2 className="mt-5 text-xl font-semibold text-white">
            {t("overview.moreThanConversion")}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            {t("overview.workflowDescription")}
          </p>
          <div className="mt-6 space-y-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-sm font-medium text-slate-200">
                {t("overview.textTranslator")}
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                {t("overview.translatorDescription")}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-sm font-medium text-slate-200">
                {t("overview.workHistory")}
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                {t("overview.historyDescription")}
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* 🚨 THE PAYWALL MODAL */}
      <UpgradeModal 
        isOpen={upgradeModalOpen} 
        onClose={() => setUpgradeModalOpen(false)} 
        featureName={selectedFeature} 
      />
    </div>
  );
}