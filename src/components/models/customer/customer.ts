import { ICustomer, TPayment, TFormErrors } from "../../../types";

export class Customer {
  private payment: TPayment = null;
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

  validPayments: TPayment[] = ["card", "cash", null];

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
