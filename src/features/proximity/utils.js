export const createHeart = (x, y) => {
  const h = document.createElement("div");
  h.className = "floating-heart";
  h.textContent = "❤️";
  h.style.left = x + "px";
  h.style.top = y + "px";
  h.style.setProperty("--drift-x", (Math.random() - 0.5) * 100 + "px");
  document.body.appendChild(h);
  setTimeout(() => h.remove(), 3000);
};
