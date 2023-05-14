import fs from "fs";

class ProductManager {
    constructor (){
        this.path = "./src/data/productos.json"
    }

    getProducts = () =>{
        if(!fs.existsSync(this.path)) return {error:0, descripcion:"No existe la DB"}
        const productsList =  fs.readFileSync(this.path, "utf-8")
        return(productsList); 
    }
    
    getProductByID = async (id)=>{
        id= parseInt(id)
        if(!fs.existsSync(this.path)) return {error:0, descripcion:"No existe la DB"}
        let lista = await fs.promises.readFile(this.path, "utf-8") ;
        let products = JSON.parse(lista)
        let found = products.find(e=> e.id === id)
        if (!found) return {error:0, descripcion:"Producto no encontrado"} 
        return found   
        
    }
    
    
    
    addProduct =  (product) =>{
        let id = 1;
        let lista = fs.readFileSync(this.path, "utf-8")
        let products = JSON.parse(lista)
        if (products.length >0){
            id = products[products.length-1].id+1
             product={
                        id,
                        ...product
                    }
                    products.push(product)
                    fs.writeFileSync(this.path, JSON.stringify(products, null, "\t"))
        }  else{
                product = {
                    id,
                    ...product
                }
                fs.writeFileSync(this.path,JSON.stringify([product],null,2))
        }
        return(product)
    }

    updateProduct = (id, update)=>{
        id = parseInt(id)
        if (fs.existsSync(this.path)){
            let isFound = false
            let data =  fs.readFileSync(this.path, "utf-8")
            let products = JSON.parse(data)
            let newProducts = products.map(item=>{
                if(item.id === id){
                    isFound = true
                    return {
                        id,
                        ...update
                    }
                } else return item
            })
            if(!isFound) return {error:0, descripcion:"Producto no encontrado"}
             fs.writeFileSync(this.path, JSON.stringify(newProducts,null,2))
            return newProducts.find(item => item.id === id)       
        }else{
            return{error:0, descripcion:"No existe la DB"}
        }
    }

    deleteProduct = (id) =>{
        id = parseInt(id)
        if(fs.existsSync(this.path)){
            let isFound = false
            let data =  fs.readFileSync(this.path,"utf-8")
            let products = JSON.parse(data)
            let newProducts = products.filter(item =>item.id !== id)
            if(products.length !== newProducts.length) isFound = true
            if(!isFound) return{error:0, descripcion:"Producto no encontrado"}
             fs.writeFileSync(this.path, JSON.stringify(newProducts,null,2))
            return newProducts
        } else{
            return {error:0, descripcion:"No existe la BD"}
        }
    }


}


export default ProductManager
