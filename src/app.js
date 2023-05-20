import express from "express";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import productsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";
import viewsRouter from "./routers/views.router.js";
import { Server } from "socket.io";
import { manager } from "./manager/productManager.js";

const app = express();
app.use(express.json());

const httpServer = app.listen(8080, () =>
  console.log("Servidor escuchando en el puerto 8080")
);

const io = new Server(httpServer);

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));

app.use("/", viewsRouter);
app.use("/api/products/", productsRouter);
app.use("/api/carts/", cartsRouter);

io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado!");
  const data = await manager.getProducts();
  if (data) {
    io.emit("resp-new-product", data);
  }
  socket.on("new-product", async (data) => {
    const result = await manager.addProduct(data);
    if (result == "406b") {
      socket.emit("resp-new-product", "El producto ya existe");
    } else if (result == "406a") {
      socket.emit("resp-new-product", "Todos los campos son obligatorios");
    } else {
      const products = await manager.getProducts();
      if (products) {
        io.emit("resp-new-product", products);
      }
    }
  });
  socket.on("delete-product", async (id) => {
    const result = await manager.deleteProduct(parseInt(id));
    if (result == 406) {
      socket.emit("resp-delete-product", "El producto no existe");
    } else {
      const products = await manager.getProducts();
      if (products) {
        io.emit("resp-delete-product", products);
      }
    }
  });
});
