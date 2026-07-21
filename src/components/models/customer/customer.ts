import { ICustomer, TPayment, TFormErrors } from "../../../types";

export class Customer {
  private payment: TPayment | null = null;
  private email: string = "";
  private phone: string = "";
  private address: string = "";
  constructor() {}

  getAllCustomerData(): ICustomer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }
  deleteAllCustomerData(): void {
    this.payment = null;
    this.email = "";
    this.phone = "";
    this.address = "";
  }
  validateForm(): TFormErrors {
    const errors: TFormErrors = {};

    if (!this.payment) {
      errors.payment = "Не выбран вид оплаты";
    }

    if (!this.email) {
      errors.email = "Укажите email";
    }

    if (!this.phone.trim()) {
      errors.phone = "Укажите номер телефона";
    }

    if (!this.address.trim()) {
      errors.address = "Укажите адрес доставки";
    }

    return errors;
  }

  validPayments: TPayment[] = ["card", "cash"];

  setInputData(field: keyof ICustomer, value: string | TPayment): void {
    if (field === "payment") {
      if (!this.validPayments.includes(value as TPayment)) {
        console.log(`Невалидное значение для payment: ${value}`);
        return;
      }
      this.payment = value as TPayment;
    } else {
      (this as any)[field] = value;
    }
  }
}
