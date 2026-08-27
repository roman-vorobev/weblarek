import { IProduct } from "../../../types";
import { IEvents } from "../../base/Events";

export class Catalog {
  protected products: IProduct[];
  protected selectedProduct: IProduct | undefined;
  constructor(private events: IEvents) {
    this.products = [];
    this.selectedProduct = undefined;
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
  public saveProduct(id: string): void {
    this.selectedProduct = this.getProductByID(id);
    this.events.emit("products:changed");
  }
  public getSelectedProduct(): IProduct | undefined {
    return this.selectedProduct;
  }
}
