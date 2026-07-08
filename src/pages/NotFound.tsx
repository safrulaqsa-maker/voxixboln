import { motion } from "framer-motion";
import { Hexagon, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen bg-[#0A0A0F] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center px-6"
      >
        <Hexagon className="w-16 h-16 text-[#D4AF37]/20 mb-4" strokeWidth={0.5} />
        <h1 className="font-heading text-6xl font-semibold gold-text mb-2">
          404
        </h1>
        <p className="text-sm text-[#8A8A95] mb-8">
          Halaman yang Anda cari tidak ditemukan.
        </p>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-6 py-3 gold-gradient rounded-xl text-[#0A0A0F] font-semibold text-sm hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </button>
      </motion.div>
    </div>
  );
}
