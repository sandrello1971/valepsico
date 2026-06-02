/// <reference types="vite/client" />

// vite-imagetools: import con query string (?format=webp&…)
declare module '*&as=srcset' {
  const srcset: string;
  export default srcset;
}
declare module '*?format=webp&w=640' {
  const src: string;
  export default src;
}
