export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(url: string): Promise<T>;
  post<T extends object>(
    url: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

export type TPayment = "card" | "cash";

export interface IProduct {
  id: string;
  title: string;
  description: string;
  price: number | null;
  image: string;
  productType: string;
}

export interface ICustomer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface IProductResponse {
  total: number;
  items: IProduct[];
}

export interface IOrder extends ICustomer {
  total: number;
  items: string[];
}

export interface IOrderResult {
  id: string;
  total: number;
}
