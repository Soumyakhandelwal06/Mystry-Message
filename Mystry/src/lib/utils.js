// Merge Tailwind class names safely
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
