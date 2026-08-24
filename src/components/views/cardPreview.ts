import { CardCatalog } from "./cardCatalogView";
import { IProduct } from "../../types/index";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface ICardPreviewData extends IProduct {
  isInBucket: boolean;
}
export class CardPreview extends CardCatalog {
  private _text: HTMLElement;
  private _button: HTMLButtonElement;
  private _productPrice: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

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
        events.emit("preview:basket-toggle", { id: this._id });
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

  render(data: Partial<ICardPreviewData>): HTMLElement {
    if (data.id) {
      this._id = data.id;
    }

    super.render(data as Partial<IProduct>);

    if (data.description !== undefined) {
      this.text = data.description;
    }

    if (data.price !== undefined) {
      this.price = data.price;
    }
    if (data.isInBucket !== undefined) {
      this.isInBucket = data.isInBucket;
    }

    return this.container;
  }
}
