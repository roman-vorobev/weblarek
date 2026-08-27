import { CardCatalogView } from "../cardCatalogView";
import { ensureElement } from "../../../utils/utils";

export class CardPreview extends CardCatalogView {
  private _text: HTMLElement;
  private _button: HTMLButtonElement;
  private _productPrice: HTMLElement;

  constructor(container: HTMLElement, onOrderToggle: () => void) {
    super(container, () => {});

    this._text = ensureElement<HTMLElement>(".card__text", this.container);
    this._button = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );
    this._productPrice = ensureElement<HTMLElement>(
      ".card__price",
      this.container,
    );

    if (this._button) {
      this._button.addEventListener("click", (e) => {
        e.stopPropagation();
        onOrderToggle();
      });
    }
  }

  set text(value: string) {
    if (this._text) {
      this._text.textContent = value;
    }
  }
  set price(value: number | null) {
    super.price = value;

    if (!this._button) return;

    if (value === null || value === undefined) {
      this._button.textContent = "Недоступно";
      this._button.disabled = true;
      this._productPrice.textContent = `бесценно`;
    } else {
      this._button.disabled = false;
    }
  }

  set isInBucket(value: boolean) {
    if (!this._button || this._button.disabled) return;

    if (value) {
      this._button.textContent = "Удалить из корзины";
    } else {
      this._button.textContent = "Купить";
    }
  }

  set description(value: string) {
    if (this._text) {
      this._text.textContent = value;
    }
  }
}
