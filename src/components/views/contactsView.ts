import { Component } from "../base/Component"; //
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface IContactsErrors {
  email?: string;
  phone?: string;
}

export class ContactsView extends Component<IContactsErrors> {
  private _emailInput: HTMLInputElement;
  private _phoneInput: HTMLInputElement;
  private _submitButton: HTMLButtonElement;
  private _formErrors: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    const formElement =
      container.closest("form") || container.querySelector("form") || container;
    super(formElement as HTMLElement);

    this._emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container,
    );
    this._phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container,
    );
    this._submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container,
    );
    this._formErrors = ensureElement<HTMLElement>(
      ".form__errors",
      this.container,
    );

    this._emailInput.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      events.emit("contacts:input", { field: "email", value: target.value });
    });

    this._phoneInput.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      events.emit("contacts:input", { field: "phone", value: target.value });
    });

    this.container.addEventListener("submit", (e) => {
      e.preventDefault();
      events.emit("contacts:submit");
    });
  }

  setErrors(errors: IContactsErrors) {
    const errorText = errors.email || errors.phone || "";
    this._formErrors.textContent = errorText;

    if (errors.email || errors.phone) {
      this._submitButton.setAttribute("disabled", "true");
    } else {
      this._submitButton.removeAttribute("disabled");
    }
  }

  render(data?: Partial<IContactsErrors>): HTMLElement {
    if (data) {
      this.setErrors(data);
    }
    return this.container;
  }
}
