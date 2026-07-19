import { IProduct } from "../../../types";

export class Catalog {
  products: IProduct[];
  selectedProduct: IProduct | undefined;
  constructor(initialProducts: IProduct[]) {
    this.products = initialProducts;
    this.selectedProduct = undefined;
  }

  public saveProducts(products: IProduct[]): void {
    this.products = products;
  }
  public getProducts(): IProduct[] {
    return this.products;
  }
  public getProductByID(id: string): IProduct | undefined {
    return this.products.find((product) => product.id == id);
  }
  public saveProduct(id: string): void {
    this.selectedProduct = this.getProductByID(id);
  }
  public getSelectedProduct(): IProduct | undefined {
    return this.selectedProduct;
  }
}
