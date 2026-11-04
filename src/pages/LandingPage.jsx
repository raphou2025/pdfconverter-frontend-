import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import heroImage from "../assets/images/hero-banner/hero.jpg";

export default function LandingPage() {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const isLight = theme === "light";

  return (
    <div className={`flex min-h-screen flex-col font-sans ${isLight ? "bg-[#f8f6f0]" : "bg-gray-950"}`}>
      <Navbar />

      <main
        className={`relative flex min-h-[500px] flex-1 flex-col justify-center bg-cover bg-center bg-no-repeat px-6 py-24 md:min-h-[600px] lg:min-h-[700px] ${isLight ? "items-center text-center md:items-start md:pl-[8vw] md:text-left" : "items-center text-center"}`}
        style={{
          backgroundImage: isLight
            ? `linear-gradient(90deg, rgba(248, 246, 240, 0.92) 0%, rgba(248, 246, 240, 0.76) 44%, rgba(248, 246, 240, 0.08) 100%), url("${heroImage}")`
            : `linear-gradient(rgba(3, 7, 18, 0.72), rgba(3, 7, 18, 0.78)), url("${heroImage}")`,
        }}
      >
        <span className={`mb-6 rounded-full px-4 py-2 text-xs font-bold tracking-wide ${isLight ? "bg-blue-100/90 text-slate-700" : "bg-blue-400/10 text-blue-300"}`}>
          {t("landing.badge")}
        </span>

        <h1 className={`max-w-2xl text-5xl font-extrabold leading-tight md:text-7xl ${isLight ? "text-slate-900" : "text-white"}`}>
          {t("landing.headline")}{" "}
          <span className={isLight ? "text-blue-500" : "text-blue-400"}>{t("landing.instantly")}</span>
        </h1>

        <p className={`mb-10 mt-6 max-w-xl text-lg ${isLight ? "text-slate-700" : "text-gray-200"}`}>
          {t("landing.description")}
        </p>

        <div className={`flex flex-wrap gap-4 ${isLight ? "justify-center md:justify-start" : "justify-center"}`}>
          <Link
            to="/register"
            className={`rounded-xl px-8 py-4 text-lg font-bold transition ${isLight ? "bg-blue-500 text-white shadow-lg shadow-blue-900/20 hover:bg-blue-600" : "bg-blue-400 text-slate-950 hover:bg-blue-300"}`}
          >
            {t("landing.startFree")}
          </Link>
          <Link
            to="/login"
            className={`rounded-xl border px-8 py-4 text-lg font-bold transition ${isLight ? "border-slate-500/50 bg-white/35 text-slate-900 hover:bg-white/70" : "border-gray-300/50 text-white hover:bg-gray-900/70"}`}
          >
            {t("landing.viewDemo")}
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
