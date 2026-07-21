import { IProduct } from "../../../types";

export class Bucket {
  getSelectedProductInfoBucket(): any {
    throw new Error("Method not implemented.");
  }
  private selectedProducts: IProduct[] = [];
  constructor() {
    this.selectedProducts = [];
  }

  getBucketProducts(): IProduct[] {
    return this.selectedProducts;
  }
  setSelectedProductIntoBucket(product: IProduct): void {
    this.selectedProducts.push(product);
  }

  deleteSelectedProductFromBucket(id: string): void {
    if (this.selectedProducts) {
      this.selectedProducts = this.selectedProducts.filter(
        (product) => product.id !== id,
      );
    }
  }
  deleteAllSelectedProductsFromBucket(): void {
    this.selectedProducts = [];
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
