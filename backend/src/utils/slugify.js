/** Turn "NPK Fertilizer 50kg" into "npk-fertilizer-50kg". */
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Append a short random suffix to guarantee uniqueness on collision. */
export function uniqueSlug(text) {
  const base = slugify(text);
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base}-${suffix}`;
}
