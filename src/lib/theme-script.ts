/** Keep in sync with STORAGE_KEY in components/theme.tsx */
export const THEME_STORAGE_KEY = "rutr-theme";

/** Runs before paint to avoid light→dark flash. */
export const themeInitScript = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var p=localStorage.getItem(k)||"light";var d=p==="dark"||(p==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light";}catch(e){}})();`;
