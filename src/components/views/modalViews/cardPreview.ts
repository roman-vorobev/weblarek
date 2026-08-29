import { CardComponent } from "./cardComponent";
import { ensureElement } from "../../../utils/utils";

interface ICardPreviewData {
  title: string;
  image: string;
  category: string;
  description: string;
  price: number | null;
  buttonText: string;
  buttonDisabled: boolean;
}

export class CardPreview extends CardComponent<ICardPreviewData> {
  private _text: HTMLElement;
  private _button: HTMLButtonElement;

  constructor(container: HTMLElement, onOrderToggle: () => void) {
    super(container);
    this._text = ensureElement<HTMLElement>(".card__text", this.container);
    this._button = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );

    this._price = ensureElement<HTMLElement>(".card__price", this.container);

    if (this._button) {
      this._button.addEventListener("click", (e) => {
        e.stopPropagation();
        onOrderToggle();
      });
    }
  }

  set description(value: string) {
    if (this._text) {
      this._text.textContent = value;
    }
  }

  set price(value: number | null) {
    if (this._price) {
      this._price.textContent =
        value !== null ? `${value} синапсов` : "бесценно";
    }
  }

  set buttonText(value: string) {
    if (this._button) {
      this._button.textContent = value;
    }
  }

  set buttonDisabled(value: boolean) {
    if (this._button) {
      this._button.disabled = value;
    }
  }
}
