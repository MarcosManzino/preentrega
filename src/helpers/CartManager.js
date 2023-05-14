import fs from "fs";

class CartManager{
    constructor(){
        this.index = 0
        this.path = "./src/data/carrito.json"
        this.productPath = "./src/data/productos.json"
        /* this.carts = []
        fs.writeFileSync(this.path, JSON.stringify(this.carts,null, "\t")) */
        
    }

    newCart = () =>{
        let id = 1
        let lista  = fs.readFileSync(this.path, "utf-8")
        let carts = JSON.parse(lista)
       if (carts.length >0){
            id = carts[carts.length-1].id+1
            let  cart={
                        id,
                        products : []
                    }
        carts.push(cart)
        fs.writeFileSync(this.path, JSON.stringify(carts, null, "\t"))
        }  else{
                let cart = {
                    id,
                    products :[]
                }
                fs.writeFileSync(this.path,JSON.stringify([cart],null,2))
        }
        return(carts)
    }


    addToCart = async (id,productId)=>{
        id = parseInt(id)
        productId = parseInt(productId)
        if(!fs.existsSync(this.path)) return{error:0, descripcion:"No existe la DB"}
        if(!fs.existsSync(this.productPath)) return {error:0, descripcion:"No existe la DB"}
        let productList =  await fs.promises.readFile(this.productPath, "utf-8") 
        let productos = JSON.parse(productList)
        let found = productos.find(e => e.id === productId)
        if (!found) return {error:0, descripcion:"Producto no encontrado"}
        let lista  = await fs.promises.readFile(this.path, "utf-8")
        let carts = JSON.parse(lista)
        let foundCart = carts.find(i =>i.id === id)
        if (!foundCart) return {error:0, descripcion:"Producto no encontrado"}
        let producto = foundCart.products.find(i => i.id === productId)
        if(foundCart.products.some(i=> i.id === productId)){
            producto.cuantity = producto.cuantity + 1
            fs.writeFileSync(this.path, JSON.stringify(carts,null,"\t"))
        } else{
            let producto = {
                id : productId,
                cuantity: 1
            }
            foundCart.products.push(producto)
            fs.writeFileSync(this.path, JSON.stringify(carts,null,"\t"))
        }
        return(foundCart)
        }


        getProductsFromCart = async(id)=>{
            id = parseInt(id)
            if(!fs.existsSync(this.path)) return{error:0, descripcion:"No existe la DB"}
            let cartList = await fs.promises.readFile(this.path, "utf-8")
            let carts = JSON.parse(cartList)
            let found = carts.find(e=>e.id === id)
            return (found.products)


        }
    }



export default CartManager