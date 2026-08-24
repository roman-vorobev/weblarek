import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface IOrderErrors {
  payment?: string;
  address?: string;
}

export class OrderView extends Component<IOrderErrors> {
  private _cardButton: HTMLButtonElement;
  private _cashButton: HTMLButtonElement;
  private _addressInput: HTMLInputElement;
  private _submitButton: HTMLButtonElement;
  private _formErrors: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    const formElement =
      container.closest("form") || container.querySelector("form") || container;
    super(formElement as HTMLElement);

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
    this._formErrors = ensureElement<HTMLElement>(
      ".form__errors",
      this.container,
    );

    this._cardButton.addEventListener("click", () => {
      this.togglePaymentActive("card");
      events.emit("order:input", { field: "payment", value: "card" });
    });

    this._cashButton.addEventListener("click", () => {
      this.togglePaymentActive("cash");
      events.emit("order:input", { field: "payment", value: "cash" });
    });

    this._addressInput.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      events.emit("order:input", { field: "address", value: target.value });
    });

    this.container.addEventListener("submit", (e) => {
      e.preventDefault();
      events.emit("order:submit");
    });
  }

  private togglePaymentActive(method: "card" | "cash") {
    if (method === "card") {
      this._cardButton.classList.add("button_alt-active");
      this._cashButton.classList.remove("button_alt-active");
    } else {
      this._cashButton.classList.add("button_alt-active");
      this._cardButton.classList.remove("button_alt-active");
    }
  }

  setErrors(errors: IOrderErrors) {
    const errorText = errors.address || errors.payment || "";
    this._formErrors.textContent = errorText;

    if (errors.address || errors.payment) {
      this._submitButton.setAttribute("disabled", "true");
    } else {
      this._submitButton.removeAttribute("disabled");
    }
  }

  render(data?: Partial<IOrderErrors>): HTMLElement {
    if (data) {
      this.setErrors(data);
    }
    return this.container;
  }
}
