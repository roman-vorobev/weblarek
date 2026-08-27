import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";

interface IBucketViewData {
  items: HTMLElement[];
  total: number;
}

export class BucketView extends Component<IBucketViewData> {
  private _list: HTMLElement;
  private _price: HTMLElement;
  private _button: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this._list = ensureElement<HTMLElement>(".basket__list", this.container);
    this._price = ensureElement<HTMLElement>(".basket__price", this.container);
    this._button = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container,
    );

    if (this._button) {
      this._button.addEventListener("click", () => {
        events.emit("order:open");
      });
    }
  }
  set items(value: HTMLElement[]) {
    if (value.length > 0) {
      this._list.replaceChildren(...value);
      this._button.removeAttribute("disabled");
    } else {
      const emptyText = document.createElement("p");
      emptyText.className = "basket__empty";
      emptyText.textContent = "Корзина пуста";
      this._list.replaceChildren(emptyText);

      this._button.setAttribute("disabled", "true");
    }
  }

  set total(value: number) {
    if (this._price) {
      this._price.textContent = `${value} синапсов`;
    }
  }
}
