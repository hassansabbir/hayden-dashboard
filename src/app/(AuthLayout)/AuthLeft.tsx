"use client";

import { motion } from "framer-motion";
import { Flag } from "lucide-react";

const AuthLeft = () => {
  return (
    <div className="relative hidden basis-[50%] lg:block overflow-hidden">
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2070&auto=format&fit=crop"
          alt="Golf Course"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-[#142d22]/60" />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute left-12 top-12 flex items-center gap-3"
      >
        <div className="bg-[#2ea268] p-2 rounded-xl">
          <Flag className="w-6 h-6 text-white fill-white/20" />
        </div>
        <div className="text-white">
          <h1 className="font-bold text-lg leading-tight">GolfAdmin</h1>
          <p className="text-xs text-white/70">Club Management</p>
        </div>
      </motion.div>

      {/* Hero Content */}
      <div className="absolute bottom-20 left-12 max-w-lg text-white">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-6 inline-block rounded-full border border-white/30 bg-white/10 px-5 py-1.5 text-[10px] font-bold tracking-widest uppercase backdrop-blur-md"
        >
          Admin Portal
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-6 text-[56px] font-bold leading-none tracking-tight"
        >
          Manage every <br />
          <span className="text-[#79d6a6]">tee time with ease.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-lg font-medium text-white/90 leading-relaxed max-w-sm"
        >
          Sign in to review booking requests, manage tee times, and keep your
          club running smoothly.
        </motion.p>
      </div>
    </div>
  );
};

export default AuthLeft;
