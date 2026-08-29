import { Component } from "../../../base/Component";
import { ensureElement } from "../../../../utils/utils";
import { IEvents } from "../../../base/Events";

export abstract class FormView<T> extends Component<T> {
  protected _submitButton: HTMLButtonElement;
  protected _formErrors: HTMLElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
    eventNameSubmit: string,
  ) {
    const formElement =
      container.closest("form") || container.querySelector("form") || container;
    super(formElement as HTMLElement);

    this._submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container,
    );
    this._formErrors = ensureElement<HTMLElement>(
      ".form__errors",
      this.container,
    );

    this.container.addEventListener("submit", (e) => {
      e.preventDefault();
      this.events.emit(`${eventNameSubmit}:attempt`);
      this.events.emit(eventNameSubmit);
    });

    this.container.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      if (target.tagName === "INPUT" && target.name) {
        this.onInputChange(target.name, target.value);
      }
    });

    this.container.addEventListener(
      "blur",
      (e) => {
        const target = e.target as HTMLInputElement;
        if (target.tagName === "INPUT" && target.name) {
          this.events.emit(`${target.name}:blur`);
        }
      },
      true,
    );
  }

  protected abstract onInputChange(field: string, value: string): void;

  public setErrors(errors: Partial<Record<string, string>>) {
    const errorText = Object.values(errors).filter(Boolean).join(", ");
    if (this._formErrors) {
      this._formErrors.textContent = errorText;
    }
  }
  public setValid(isValid: boolean) {
    if (this._submitButton) {
      if (isValid) {
        this._submitButton.removeAttribute("disabled");
      } else {
        this._submitButton.setAttribute("disabled", "true");
      }
    }
  }
}
