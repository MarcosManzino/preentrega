import express from "express"
import CartManager from "../helpers/CartManager.js"

const cartRouter = express.Router()
const manager = new CartManager()

cartRouter.post("/", (req,res)=>{
    res.send(manager.newCart())

})

cartRouter.post("/:cid/product/:pid",(req,res)=>{
    if(isNaN(req.params.pid)) return res.status(404).send({error:-2,descripcion:`ruta ${req.baseUrl}${req.url} método ${req.method} no implementado`})
    if(isNaN(req.params.cid)) return res.status(404).send({error:-2,descripcion:`ruta ${req.baseUrl}${req.url} método ${req.method} no implementado`})
    manager.addToCart(req.params.cid,req.params.pid)
        .then(result=> res.send(result))
        .catch(err=>res.send({error:0, descripcion:err}))
})

cartRouter.get("/:cid",(req,res)=>{
    if(isNaN(req.params.cid)) return res.status(404).send({error:-2,descripcion:`ruta ${req.baseUrl}${req.url} método ${req.method} no implementado`})
    manager.getProductsFromCart(req.params.cid)
        .then(result => res.send(result))
        .catch(err=>res.send({error:0,descripcion:err}))
})

export default cartRouter;