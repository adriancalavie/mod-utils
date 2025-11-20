import minecraftFont from "@/assets/fonts/minecraft-mojangles.ttf";
import { useEffect } from "react";

export function useMinecraftFont() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @font-face {
        font-family: 'minecraft';
        src: url('${minecraftFont}') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
    `;
    document.head.appendChild(style);
  }, []);
}
