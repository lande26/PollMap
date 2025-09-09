import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

console.log("Supabase URL:", process.env.SUPABASE_URL ? "Loaded" : "Not Loaded");
console.log(
  "Supabase Service Role Key:",
  process.env.SUPABASE_SERVICE_ROLE_KEY ? "Loaded" : "Not Loaded"
);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY 
);
console.log("Supabase client created");
export { supabase };