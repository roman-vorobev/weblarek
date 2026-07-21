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

export type TFormErrors = Partial<Record<keyof ICustomer, string>>;

export interface IProduct {
  id: string;
  title: string;
  description: string;
  price: number | null;
  image: string;
  category: string;
}

export interface ICustomer {
  payment: TPayment | null;
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
