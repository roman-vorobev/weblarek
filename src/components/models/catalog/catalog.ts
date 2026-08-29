import { IProduct } from "../../../types";
import { IEvents } from "../../base/Events";

export class Catalog {
  protected products: IProduct[];
  protected selectedProduct: IProduct | null;
  constructor(private events: IEvents) {
    this.products = [];
    this.selectedProduct = null;
  }

  public saveProducts(products: IProduct[]): void {
    this.products = products;
    this.events.emit("products:changed");
  }
  public getProducts(): IProduct[] {
    return this.products;
  }
  public getProductByID(id: string): IProduct | undefined {
    return this.products.find((product) => product.id == id);
  }
  public saveProduct(product: IProduct): void {
    this.selectedProduct = product;
    this.events.emit("preview:changed");
  }
  public getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
