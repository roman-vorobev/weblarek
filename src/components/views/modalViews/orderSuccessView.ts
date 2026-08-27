import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

interface IOrderSuccessData {
  total: number;
}

export class OrderSuccessView extends Component<IOrderSuccessData> {
  private _description: HTMLElement;
  private _closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this._description = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container,
    );
    this._closeButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container,
    );

    this._closeButton.addEventListener("click", () => {
      events.emit("success:close");
    });
  }

  set total(value: number) {
    if (this._description) {
      this._description.textContent = `Списано ${value} синапсов`;
    }
  }
}
