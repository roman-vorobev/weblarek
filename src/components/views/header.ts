import { IEvents } from "../base/Events";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

interface IHeader {
  counter: number;
}

export class Header extends Component<IHeader> {
  protected _counterElement: HTMLElement;
  protected _bucketButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this._counterElement = ensureElement<HTMLElement>(
      ".header__basket-counter",
      this.container,
    );
    this._bucketButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      this.container,
    );

    this._bucketButton.addEventListener("click", () => {
      this.events.emit("bucket:open");
    });
  }
  set counter(value: number) {
    this._counterElement.textContent = String(value);
  }
}
