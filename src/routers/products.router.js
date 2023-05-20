import { manager } from "../manager/productManager.js";
import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  const limit = req.query.limit;
  const data = await manager.getProducts();
  if (data) {
    !limit
      ? res.send({ status: "success", paiload: data })
      : res.send({ status: "success", paiload: data.slice(0, limit) });
  } else {
    res.status(406).send({ status: "error", paiload: "No hay productos" });
  }
});

router.get("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  const data = await manager.getProductById(id);
  if (data == "406a") {
    res.status(406).send({ status: "error", paiload: "No hay productos" });
  } else if (data == "406b") {
    res.status(406).send({ status: "error", paiload: "No existe el producto" });
  } else {
    res.send({ status: "success", paiload: data });
  }
});

router.post("/", async (req, res) => {
  const product = req.body;
  if ("id" in product) {
    delete product.id;
  }
  const data = await manager.addProduct(product);
  if (data == "406b") {
    res.status(406).send({ status: "error", paiload: "El producto ya existe" });
  } else if (data == "406a") {
    res.status(406).send({ status: "error", paiload: "Complete todos los campos" });
  } else {
    res.status(201).send({ status: "success", paiload: "Producto agregado" });
  }
});

router.put("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  const mods = req.body;
  if ("id" in mods) {
    delete mods.id;
  }
  const data = await manager.updateProduct(id, mods);
  if (data == 406) {
    res.status(406).send({ status: "error", paiload: "El producto no existe" });
  } else {
    res.status(201).send({ status: "success", paiload: "Producto modificado" });
  }
});

router.delete("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  const data = await manager.deleteProduct(id);
  if (data == 406) {
    res.status(406).send({ status: "error", paiload: "El producto no existe" });
  } else {
    res.status(201).send({ status: "success", paiload: "Producto eliminado" });
  }
});

export default router;
