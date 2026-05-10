import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

const sb = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

/* LOGIN */
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const { data, error } = await sb
      .from("users")
      .select("*")
      .eq("name", username)
      .eq("password", password)
      .single();

    if (error || !data) {
      return res.status(401).json({
        success: false,
        error: "بيانات خاطئة"
      });
    }

    res.json({
      success: true,
      user: data
    });

  } catch (e) {
    res.status(500).json({
      error: e.message
    });
  }
});

/* DEVICES */
app.get("/api/devices", async (req, res) => {
  const { data, error } = await sb
    .from("devices")
    .select("*");

  if (error) {
    return res.status(500).json({
      error: error.message
    });
  }

  res.json(data);
});

/* ROUTERS */
app.get("/api/routers", async (req, res) => {
  const { data, error } = await sb
    .from("mikrotik_servers")
    .select("*");

  if (error) {
    return res.status(500).json({
      error: error.message
    });
  }

  res.json(data);
});

/* START */
app.listen(3000, () => {
  console.log("Server Running On Port 3000");
});