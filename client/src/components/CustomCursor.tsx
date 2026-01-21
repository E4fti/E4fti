import { useEffect, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import type { Profile } from "@shared/schema";

interface CustomCursorProps {
  config: Profile["cursor"];
}

export function CustomCursor({ config }: CustomCursorProps) {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (!config.enabled) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" || 
        target.tagName === "A" || 
        target.closest("button") || 
        target.closest("a") ||
        target.classList.contains("interactive")
      ) {
        document.body.classList.add("hovering");
      } else {
        document.body.classList.remove("hovering");
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      document.body.classList.remove("hovering");
    };
  }, [config.enabled, cursorX, cursorY]);

  if (!config.enabled) return null;

  if (config.style === "emoji") {
    return (
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] text-2xl select-none"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        {config.emoji}
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        className="cursor-dot"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          backgroundColor: config.primaryColor,
        }}
      />
      <motion.div
        className="cursor-ring"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          borderColor: config.secondaryColor,
        }}
      />
    </>
  );
}
