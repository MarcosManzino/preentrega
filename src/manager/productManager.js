import fs from "fs";

const filename = "./data/products.json";

class ProductManager {
  #path;
  #products;
  constructor() {
    this.#products = [];
    this.#path = "./src/data/products.json";
  }

  addProduct = async (product) => {
    let { title, description, price, thumbnail, code, stock } = product;
    if (!title || !description || !price || !code || !stock) {
      return "406a";
    }
    let id = this.#generateId();
    let producto = { id, ...product, status: true };
    if (!thumbnail) {
      producto = { ...producto, thumbnail: [] };
    }
    await this.#saveFile(producto);
    return 201;
  };

  #saveFile = async (product) => {
    if (!fs.existsSync(this.#path)) {
      fs.writeFileSync(this.#path, JSON.stringify([], null, "\t"));
    }
    const data = await this.getProducts();
    if (data.find((item) => item.code === product.code)) {
      return "406b";
    }
    data.push(product);
    fs.writeFileSync(this.#path, JSON.stringify(data, null, "\t"));
  };

  #generateId = () => {
    if (!fs.existsSync(this.#path)) return 1;
    this.#products = JSON.parse(fs.readFileSync(this.#path, "utf-8"));
    let id = this.#products[this.#products.length - 1].id + 1;
    return id;
  };

  getProducts = async () => {
    if (!fs.existsSync(this.#path)) {
      return [];
    } else {
      const data = await fs.promises.readFile(this.#path, "utf-8");
      if (data) {
        const products = JSON.parse(data);
        return products;
      }
    }
  };

  getProductById = async (id) => {
    if (!fs.existsSync(this.#path)) {
      return "406a";
    }
    const products = await this.getProducts();
    let resultadoBusqueda = products.filter((item) => item.id === id);
    if (resultadoBusqueda.length === 0) {
      return "406b";
    }
    return resultadoBusqueda[0];
  };

  updateProduct = async (id, mods) => {
    const data = await this.getProducts();
    if (!data.find((item) => item.id === id)) {
      return 406;
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        data[i] = { ...data[i], ...mods };
        fs.writeFileSync(this.#path, JSON.stringify(data, null, "\t"));
      }
    }
  };

  deleteProduct = async (id) => {
    const data = await this.getProducts();
    if (!data.find((item) => item.id === id)) {
      return 406;
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        data.splice(i, 1);
      }
    }
    fs.writeFileSync(this.#path, JSON.stringify(data, null, "\t"));
  };
}

const manager = new ProductManager();

export { manager, ProductManager };
