import { manager } from "../manager/cartsManager.js";
import { manager as pManager } from "../manager/productManager.js";
import { Router } from "express";

const router = Router();

router.post("/", async (req, res) => {
  const data = await manager.addCart();
  if (data == 201) {
    res.status(201).send({ status: "success", paiload: "Carrito agregado" });
  } else {
    res
      .status(406)
      .send({ status: "error", paiload: "No se pudo agregar el carrito" });
  }
});

router.get("/:cid", async (req, res) => {
  const cid = parseInt(req.params.cid);
  const data = await manager.getCartById(cid);
  if (data == "406a") {
    res.status(406).send({ status: "error", paiload: "No hay carritos" });
  } else if (data == "406b") {
    res.status(406).send({ status: "error", paiload: "No existe el carrito" });
  } else {
    res.send({ status: "success", paiload: data.products });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cid = parseInt(req.params.cid);
  const pid = parseInt(req.params.pid);
  const productData = await pManager.getProductById(pid);
  if (productData == "406a") {
    res.status(406).send({ status: "error", paiload: "No hay productos" });
  } else if (productData == "406b") {
    res.status(406).send({ status: "error", paiload: "No existe el producto" });
  } else {
    const cartData = await manager.getCartById(cid);
    if (cartData == "406a") {
      res.status(406).send({ status: "error", paiload: "No hay carritos" });
    } else if (cartData == "406b") {
      res.status(406).send({ status: "error", paiload: "No existe el carrito" });
    } else {
      await manager.addProduct(cid, pid);
      res.status(201).send({ status: "success", paiload: "Producto agregado" });
    }
  }
});

export default router;
