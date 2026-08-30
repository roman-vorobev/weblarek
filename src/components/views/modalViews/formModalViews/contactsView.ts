import { FormView } from "./formView";
import { ensureElement } from "../../../../utils/utils";
import { IEvents } from "../../../base/Events";

interface IContacts {
  email: string;
  phone: string;
}

export class ContactsView extends FormView<IContacts> {
  private _emailInput: HTMLInputElement;
  private _phoneInput: HTMLInputElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events, "contacts:submit");
    this._emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container,
    );
    this._phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container,
    );
  }

  protected onInputChange(field: string, value: string): void {
    this.events.emit("form:change", { field, value });
  }

  set phone(value: string) {
    if (this._phoneInput) {
      this._phoneInput.value = value;
    }
  }

  set email(value: string) {
    if (this._emailInput) {
      this._emailInput.value = value;
    }
  }
}
