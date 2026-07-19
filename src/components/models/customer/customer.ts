import { ICustomer, TPayment } from "../../../types";

export class Customer {
  private payment: TPayment;
  private email: string;
  private phone: string;
  private address: string;
  constructor(customer: ICustomer) {
    this.payment = customer.payment;
    this.email = customer.email;
    this.phone = customer.phone;
    this.address = customer.address;
  }

  getAllCustomerData(): ICustomer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }
  deleteAllCustomerData(): void {
    this.payment = "" as TPayment;
    this.email = "";
    this.phone = "";
    this.address = "";
  }
  validateForm(): Partial<Record<keyof ICustomer, string>> {
    const errors: Partial<Record<keyof ICustomer, string>> = {};

    if (!this.payment) {
      errors.payment = "Не выбран вид оплаты";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email) {
      errors.email = "Укажите email";
    } else if (!emailRegex.test(this.email)) {
      errors.email = "Неверный формат почты";
    }

    const cleanPhone = this.phone.replace(/\D/g, "");
    if (!this.phone.trim()) {
      errors.phone = "Укажите номер телефона";
    } else if (cleanPhone.length !== 11) {
      errors.phone = "Номер телефона должен содержать 11 цифр";
    }

    if (!this.address.trim()) {
      errors.address = "Укажите адрес доставки";
    }

    return errors;
  }

  setInputData(field: keyof ICustomer, value: string | TPayment): void {
    (this as any)[field] = value;
  }
}
