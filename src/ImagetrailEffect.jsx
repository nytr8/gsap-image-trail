import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const ImageTrailEffect = () => {
  const images = [
    "/image1.avif",
    "/image2.avif",
    "/image3.avif",
    "/image4.avif",
    "/image5.avif",
    "/image6.avif",
    "/image7.avif",
  ];

  const containerRef = useRef(null);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const imageIndexRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const threshold = window.innerWidth < 900 ? 50 : 100;

    const handleMouseMove = (e) => {
      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > threshold) {
        const img = document.createElement("img");
        img.src = images[imageIndexRef.current];
        img.style.cssText = `
          position: absolute;
          width: 150px;
          height: 250px;
          object-fit: cover;
          border-radius: 8px;
          pointer-events: none;
        `;

        container.appendChild(img);

        // Update index
        imageIndexRef.current = (imageIndexRef.current + 1) % images.length;

        // Animate
        gsap.fromTo(
          img,
          {
            left: e.clientX,
            top: e.clientY,
            xPercent: -50,
            yPercent: -50,
            scale: 0,
            opacity: 0,
          },
          {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
              gsap.to(img, {
                scale: 0.2,
                opacity: 0,
                duration: 0.8,
                ease: "power2.in",
                onComplete: () => img.remove(),
              });
            },
          },
        );

        // Update last position
        lastPosRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []); // Empty dependency array - only runs once!

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 1,
      }}
    />
  );
};

export default ImageTrailEffect;
