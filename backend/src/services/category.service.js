import { Category } from "../models/Category.model.js";
import { AppError } from "../utils/AppError.js";
import { slugify, uniqueSlug } from "../utils/slugify.js";

export async function listCategories() {
  const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).lean();

  // Nest subcategories under their parent so the frontend can render a tree
  // without doing the grouping itself.
  const byId = new Map(categories.map((c) => [String(c._id), { ...c, subcategories: [] }]));
  const roots = [];

  for (const cat of byId.values()) {
    if (cat.parent) {
      const parent = byId.get(String(cat.parent));
      if (parent) parent.subcategories.push(cat);
    } else {
      roots.push(cat);
    }
  }
  return roots;
}

export async function createCategory(data) {
  const slug = data.slug ? slugify(data.slug) : slugify(data.name);
  const taken = await Category.exists({ slug });
  return Category.create({ ...data, slug: taken ? uniqueSlug(data.name) : slug });
}

export async function updateCategory(id, updates) {
  const category = await Category.findById(id);
  if (!category) throw new AppError("Category not found.", 404, "CATEGORY_NOT_FOUND");

  Object.assign(category, updates);
  await category.save();
  return category;
}

export async function deleteCategory(id) {
  const hasChildren = await Category.exists({ parent: id });
  if (hasChildren) {
    throw new AppError(
      "Remove or reassign its subcategories first.",
      400,
      "CATEGORY_HAS_CHILDREN"
    );
  }
  const category = await Category.findByIdAndDelete(id);
  if (!category) throw new AppError("Category not found.", 404, "CATEGORY_NOT_FOUND");
  return category;
}
