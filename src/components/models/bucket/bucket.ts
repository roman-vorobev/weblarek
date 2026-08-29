import { IProduct } from "../../../types";
import { IEvents } from "../../base/Events";

export class Bucket {
  getSelectedProductInfoBucket(): any {
    throw new Error("Method not implemented.");
  }
  private selectedProducts: IProduct[] = [];
  constructor(private events: IEvents) {
    this.selectedProducts = [];
  }

  getBucketProducts(): IProduct[] {
    return this.selectedProducts;
  }

  setSelectedProductIntoBucket(product: IProduct): void {
    this.selectedProducts.push(product);
    this.events.emit("bucket:changed");
  }

  deleteSelectedProductFromBucket(id: string): void {
    if (this.selectedProducts) {
      this.selectedProducts = this.selectedProducts.filter(
        (product) => product.id !== id,
      );
    }
    this.events.emit("bucket:changed");
  }

  deleteAllSelectedProductsFromBucket(): void {
    this.selectedProducts = [];
    this.events.emit("bucket:changed");
  }
  getFullBucketPrice(): number {
    return (
      this.selectedProducts?.reduce(
        (cost, product) => cost + (product.price || 0),
        0,
      ) ?? 0
    );
  }
  getQuantityBucketProducts(): number {
    return this.selectedProducts.length ?? 0;
  }
  getProductInBucket(id: string): boolean {
    return this.selectedProducts.some((product) => product.id === id) ?? false;
  }
}
