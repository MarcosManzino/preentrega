import express from "express";
import productRouter from "./router/products.router.js";
import cartRouter from "./router/carts.router.js";

const server = express();

server.listen(8080, ()=>{console.log("Server UP!")})

server.use(express.json())
server.use(express.urlencoded({extended:true}))

server.use("/api/products", productRouter)
server.use("/api/carts", cartRouter)
