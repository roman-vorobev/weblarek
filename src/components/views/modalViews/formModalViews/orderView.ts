import { FormView } from "./formView";
import { ensureElement } from "../../../../utils/utils";
import { IEvents } from "../../../base/Events";
import { TPayment } from "../../../../types";

interface IOrder {
  payment: TPayment | null;
  address: string;
}

export class OrderView extends FormView<IOrder> {
  private _cardButton: HTMLButtonElement;
  private _cashButton: HTMLButtonElement;
  private _addressInput: HTMLInputElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events, "order:submit");

    this._cardButton = ensureElement<HTMLButtonElement>(
      'button[name="card"]',
      this.container,
    );
    this._cashButton = ensureElement<HTMLButtonElement>(
      'button[name="cash"]',
      this.container,
    );
    this._addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.container,
    );

    this._submitButton = ensureElement<HTMLButtonElement>(
      ".order__button",
      this.container,
    );
    this._cardButton.addEventListener("click", () => {
      this.payment = "card";
      this.events.emit("form:change", { field: "payment", value: "card" });
    });

    this._cashButton.addEventListener("click", () => {
      this.payment = "cash";
      this.events.emit("form:change", { field: "payment", value: "cash" });
    });
  }
  protected onInputChange(field: string, value: string): void {
    if (field === "address") {
      this.events.emit("form:change", { field, value });
    }
  }

  set address(value: string) {
    if (this._addressInput) {
      this._addressInput.value = value;
    }
  }

  set payment(value: TPayment | null) {
    if (!this._cardButton || !this._cashButton) return;

    if (value === "card") {
      this._cardButton.classList.add("button_alt-active");
      this._cashButton.classList.remove("button_alt-active");
    } else if (value === "cash") {
      this._cashButton.classList.add("button_alt-active");
      this._cardButton.classList.remove("button_alt-active");
    } else {
      this._cardButton.classList.remove("button_alt-active");
      this._cashButton.classList.remove("button_alt-active");
    }
  }
}
