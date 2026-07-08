import { motion } from "framer-motion";
import { Hexagon, Sparkles, Shield, Database, Code, Globe } from "lucide-react";

export default function WelcomeMessage() {
  const features = [
    { icon: Database, label: "98 Model AI", desc: "Berbagai kategori" },
    { icon: Shield, label: "Self-Hosted", desc: "Data di server Anda" },
    { icon: Code, label: "100/hari", desc: "Tanpa batas kata" },
    { icon: Globe, label: "10 Mode AI", desc: "Untuk setiap kebutuhan" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col items-center justify-center h-full px-8 py-12"
    >
      {/* Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-6"
      >
        <div className="relative">
          <Hexagon
            className="w-20 h-20 text-[#D4AF37]/20"
            strokeWidth={0.5}
          />
          <Hexagon
            className="w-20 h-20 text-[#D4AF37] absolute inset-0"
            strokeWidth={1}
          />
          <Sparkles className="w-6 h-6 text-[#D4AF37] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="font-heading text-4xl md:text-5xl font-semibold text-center gold-text mb-3"
      >
        Selamat datang di Genesis AI
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-center text-[#8A8A95] text-sm max-w-lg mb-2 leading-relaxed"
      >
        Platform AI mandiri dengan 98 model siap pakai.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-center text-[#D4AF37]/80 text-xs mb-10 tracking-wide"
      >
        Tanpa API key. Tanpa batasan. Tanpa biaya bulanan.
      </motion.p>

      {/* Feature Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl w-full"
      >
        {features.map((feat, i) => (
          <motion.div
            key={feat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + i * 0.1, duration: 0.4 }}
            className="flex flex-col items-center gap-2 p-4 liquid-glass-light rounded-2xl"
          >
            <feat.icon className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-xs font-medium text-[#EAE0C8]">{feat.label}</span>
            <span className="text-[10px] text-[#8A8A95]">{feat.desc}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="mt-10 text-[10px] text-[#8A8A95]/60 text-center"
      >
        Pilih model di panel kanan, atau ketik pesan di bawah untuk memulai
      </motion.p>
    </motion.div>
  );
}
