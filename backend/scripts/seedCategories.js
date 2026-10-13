/**
 * Populates the default top-level categories from the project spec.
 * Run with: node scripts/seedCategories.js
 * Safe to re-run — skips categories that already exist by slug.
 */
import "dotenv/config";
import mongoose from "mongoose";
import { Category } from "../src/models/Category.model.js";
import { slugify } from "../src/utils/slugify.js";

const DEFAULT_CATEGORIES = [
  "Seeds",
  "Fertilizers",
  "Crop Protection",
  "Farm Equipment",
  "Irrigation",
  "Tools",
  "Organic Products",
  "Animal & Livestock Supplies",
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB.");

  for (const name of DEFAULT_CATEGORIES) {
    const slug = slugify(name);
    const exists = await Category.findOne({ slug });
    if (exists) {
      console.log(`- "${name}" already exists, skipping.`);
      continue;
    }
    await Category.create({ name, slug });
    console.log(`+ Created "${name}"`);
  }

  await mongoose.disconnect();
  console.log("Done.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
