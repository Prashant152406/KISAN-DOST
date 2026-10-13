/**
 * Promotes an existing, already-registered user to the "admin" role.
 * This is a CLI-only tool by design — role can never be set from the
 * frontend or any HTTP endpoint (see requireRole in auth.middleware.js).
 *
 * Usage: node scripts/makeAdmin.js someone@example.com
 */
import "dotenv/config";
import mongoose from "mongoose";
import { User } from "../src/models/User.model.js";

const email = process.argv[2];

if (!email) {
  console.error("Usage: node scripts/makeAdmin.js <email>");
  process.exit(1);
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    console.error(`No user found with email "${email}". They must register first.`);
    process.exit(1);
  }

  user.role = "admin";
  await user.save();
  console.log(`"${user.name}" (${user.email}) is now an admin.`);

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
