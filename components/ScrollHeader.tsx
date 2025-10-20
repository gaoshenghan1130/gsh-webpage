"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ScrollHeaderProps {
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement>;
}

export default function ScrollHeader({
  children,
  containerRef,
}: ScrollHeaderProps) {
  const [show, setShow] = useState(true);
  const lastScrollY = useRef(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const currentScrollY = containerRef.current.scrollTop;
    const delta = currentScrollY - lastScrollY.current;

    if (delta > 1)
      setShow(false); // 向下滚动隐藏
    else if (delta < 1) setShow(true); // 向上滚动显示

    lastScrollY.current = currentScrollY;
  };

  useEffect(() => {
    const div = containerRef.current;
    if (!div) return;
    div.addEventListener("scroll", handleScroll);
    return () => div.removeEventListener("scroll", handleScroll);
  }, [containerRef]);

  useEffect(() => {
    requestAnimationFrame(() => setIsLoaded(true));
  }, []);

  if (!isLoaded) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="header"
          initial={{ y: -70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -70, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50 shadow-lg bg-white/40 backdrop-blur-sm py-[3vh] px-[3vw]"
          color="#1e42baff"
          style={{
            backdropFilter: "blur(3px)",
            WebkitBackdropFilter: "blur(3px)",
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
