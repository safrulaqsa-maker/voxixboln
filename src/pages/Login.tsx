import { motion } from "framer-motion";
import { Hexagon, Sparkles, Shield, Server, Cpu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const { login } = useAuth();

  const features = [
    { icon: Cpu, text: "98 Model AI" },
    { icon: Shield, text: "Self-Hosted" },
    { icon: Server, text: "Zero API Key" },
  ];

  return (
    <div className="w-screen h-screen bg-[#0A0A0F] flex items-center justify-center relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#D4AF37] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.1 + Math.random() * 0.3,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center max-w-md w-full px-6"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative">
            <Hexagon
              className="w-24 h-24 text-[#D4AF37]/30"
              strokeWidth={0.5}
            />
            <Hexagon
              className="w-24 h-24 text-[#D4AF37] absolute inset-0"
              strokeWidth={1}
            />
            <Sparkles className="w-8 h-8 text-[#D4AF37] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="font-heading text-4xl font-semibold gold-text mb-2"
        >
          Genesis AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-[#8A8A95] mb-8 text-center"
        >
          Platform AI mandiri dengan 98 model bahasa besar.
          <br />
          Tanpa API key. Data Anda, server Anda.
        </motion.p>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-4 mb-10"
        >
          {features.map((feat) => (
            <div key={feat.text} className="flex items-center gap-1.5">
              <feat.icon className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[10px] text-[#8A8A95]">{feat.text}</span>
            </div>
          ))}
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="w-full liquid-glass rounded-2xl p-8"
        >
          <h2 className="font-heading text-xl font-semibold text-[#EAE0C8] text-center mb-2">
            Selamat Datang
          </h2>
          <p className="text-xs text-[#8A8A95] text-center mb-6">
            Login untuk mengakses Genesis AI Platform
          </p>

          <button
            onClick={() => login()}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 gold-gradient rounded-xl text-[#0A0A0F] font-semibold text-sm shimmer-hover transition-all hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] active:scale-[0.98]"
          >
            <Hexagon className="w-4 h-4" />
            Login dengan Platform
          </button>

          <p className="text-[10px] text-[#8A8A95]/60 text-center mt-4">
            Dengan login, Anda menyetujui ketentuan penggunaan platform.
          </p>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-[10px] text-[#8A8A95]/40 mt-8"
        >
          Genesis AI v1.0 · Self-Hosted AI Platform · 98 Models
        </motion.p>
      </motion.div>
    </div>
  );
}
