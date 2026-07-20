import { IApi, IProductResponse, IOrder, IOrderResult } from "../../../types";

export class ApiModal {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  public getProductsList(): Promise<IProductResponse> {
    return this.api.get<IProductResponse>("/product");
  }

  public postOrder(order: IOrder): Promise<IOrderResult> {
    return this.api.post<IOrderResult>("/order", order, "POST");
  }
}
