import "dotenv/config";
import express from "express";
import path from "path";
import morgan from "morgan";
import helmet from "helmet";
import yup from "yup";
import mongoose from "mongoose";
import { nanoid } from "nanoid";

import slowDown from "express-slow-down";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 1330;

mongoose.connect(process.env.MONGODB_URI!);

const urlSchema = new mongoose.Schema({
  alias: String,
  url: String,
});
const urls = mongoose.model("urls", urlSchema);
const app = express();
app.enable("trust proxy");

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(morgan("common"));
app.use(express.json());
app.use(express.static("./public"));

const notFoundPath = path.join(__dirname, "public/404.html");

app.get("/:id", async (req, res, _next) => {
  const { id: alias } = req.params;
  try {
    const url = await urls.findOne({ alias });
    if (url?.url) {
      res.redirect(url.url);
    }
    return res.status(404).sendFile(notFoundPath);
  } catch (error) {
    return res.status(404).sendFile(notFoundPath);
  }
});

const schema = yup.object().shape({
  alias: yup
    .string()
    .trim()
    .matches(/^[\w\-]+$/i),
  url: yup.string().trim().url().required(),
});

app.post(
  "/url",
  slowDown({
    windowMs: 30 * 1000,
    delayAfter: 1,
    delayMs: 500,
  }),
  async (req, res, next) => {
    let { alias, url } = req.body;
    try {
      await schema.validate({
        alias,
        url,
      });
      if (url.includes("nst.moe")) {
        throw new Error(
          "STOP! YOU VIOLATED THE LAW! PAY THE COURT A FINE OR SERVE YOUR SENTENCE, YOUR STOLEN GOODS ARE NOW FORFEIT."
        );
      }
      if (!alias) {
        alias = nanoid(5);
      } else {
        const existing = await urls.findOne({ alias });
        if (existing) {
          throw new Error("Alias is in use.");
        }
      }
      alias = alias.toLowerCase();
      const newUrl = {
        url,
        alias,
      };
      const created = await urls.create(newUrl);
      res.json(created);
    } catch (error) {
      next(error);
    }
  }
);

app.use((_req, res, _next) => {
  res.status(404).sendFile(notFoundPath);
});

app.listen(port, () => {
  console.log(`Running at http://localhost:${port}`);
});
