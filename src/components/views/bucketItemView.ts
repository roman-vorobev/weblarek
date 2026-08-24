import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface IBucketItemData {
  id: string;
  index: number;
  title: string;
  price: number | null;
}

export class BucketItemView extends Component<IBucketItemData> {
  private _index: HTMLElement;
  private _title: HTMLElement;
  private _price: HTMLElement;
  private _deleteButton: HTMLButtonElement;
  private _id!: string;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this._index = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );
    this._title = ensureElement<HTMLElement>(".card__title", this.container);
    this._price = ensureElement<HTMLElement>(".card__price", this.container);
    this._deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container,
    );

    if (this._deleteButton) {
      this._deleteButton.addEventListener("click", () => {
        this.events.emit("basket:delete-item", { id: this._id });
      });
    }
  }
  set id(value: string) {
    this._id = value;
  }

  set index(value: number) {
    if (this._index) this._index.textContent = String(value);
  }

  set title(value: string) {
    if (this._title) this._title.textContent = value;
  }

  set price(value: number | null) {
    if (this._price) {
      this._price.textContent =
        value !== null ? `${value} синапсов` : "бесценно";
    }
  }
}
