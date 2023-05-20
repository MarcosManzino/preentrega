import fs from "fs";

const filename = "./data/carts.json";

class CartsManager {
  #path;
  #carts;
  constructor() {
    this.#carts = [];
    this.#path = "./src/data/carts.json";
  }

  addCart = async () => {
    let id = this.#generateId();
    let cart = { id, products: [] };
    await this.#saveFile(cart);
    return 201;
  };

  #saveFile = async (cart) => {
    if (!fs.existsSync(this.#path)) {
      fs.writeFileSync(this.#path, JSON.stringify([], null, "\t"));
    }
    const data = await this.getCarts();
    data.push(cart);
    fs.writeFileSync(this.#path, JSON.stringify(data, null, "\t"));
  };

  #generateId = () => {
    if (!fs.existsSync(this.#path)) return 1;
    this.#carts = JSON.parse(fs.readFileSync(this.#path, "utf-8"));
    let id = this.#carts[this.#carts.length - 1].id + 1;
    return id;
  };

  getCarts = async () => {
    if (!fs.existsSync(this.#path)) {
      return [];
    } else {
      const data = await fs.promises.readFile(this.#path, "utf-8");
      if (data) {
        const carts = JSON.parse(data);
        return carts;
      }
    }
  };

  getCartById = async (id) => {
    if (!fs.existsSync(this.#path)) {
      return "406a";
    }
    const carts = await this.getCarts();
    let resultadoBusqueda = carts.filter((item) => item.id === id);
    if (resultadoBusqueda.length === 0) {
      return "406b";
    }
    return resultadoBusqueda[0];
  };

  addProduct = async (cid, pid) => {
    const product = { id: pid, quantity: 1 };
    const carts = await this.getCarts();
    carts.forEach((element) => {
      if (element.id === cid) {
        console.log(element);
        if (element.products.find((item) => item.id === pid)) {
          element.products.forEach((item) => {
            if (item.id === pid) {
              item.quantity += 1;
              fs.writeFileSync(this.#path, JSON.stringify(carts, null, "\t"));
            }
          });
        } else {
          element.products = [...element.products, { id: pid, quantity: 1 }];
          fs.writeFileSync(this.#path, JSON.stringify(carts, null, "\t"));
        }
      }
    });
  };
}

const manager = new CartsManager();

export { manager, CartsManager };
