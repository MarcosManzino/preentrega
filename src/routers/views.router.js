import express from "express";
import { manager } from "../manager/productManager.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const data = await manager.getProducts();
  if (data) {
    res.render("home", { data });
  }
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", {});
});

export default router;
