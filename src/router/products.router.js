import express from "express"
import ProductManager from "../helpers/ProductManager.js"

const router = express.Router()
const manager = new ProductManager()


router.get("/", (req,res)=>{
    res.send(manager.getProducts())
        
})

router.get("/:id",(req,res)=>{
    if(isNaN(req.params.id)) return res.status(404).send({error:-2,descripcion:`ruta ${req.baseUrl}${req.url} método ${req.method} no implementado`})
    manager.getProductByID(req.params.id)
        .then(result=> res.send(result))
        .catch(err=>res.send({error:0, descripcion:err}))
})

router.post("/", (req,res)=>{
    let products = manager.getProducts()
    let lista = JSON.parse(products)
    if (lista.some(i => i.code === req.body.code)){
        console.log("Codigo repetido");
    } else if(!req.body.description || !req.body.title || !req.body.price || !req.body.thumbnail || !req.body.code || !req.body.stock || !req.body.category || !req.body.status){
        console.log("faltan datos");
    }else{
        
        res.send(manager.addProduct(req.body))
    }
    
})

router.put("/", (req,res)=>{
    res.send(manager.updateProduct(req.body.id,req.body))
})

router.delete("/:id",(req,res)=>{
    res.send(manager.deleteProduct(req.params.id))
})



export default router;