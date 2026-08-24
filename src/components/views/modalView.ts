// src/components/views/modalView.ts
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

interface IModalData {
  content: HTMLElement;
}

export class modalView extends Component<IModalData> {
  private _closeButton: HTMLButtonElement;
  private _content: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this._closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container,
    );
    this._content = ensureElement<HTMLElement>(
      ".modal__content",
      this.container,
    );

    this._closeButton.addEventListener("click", () => this.close());
    this.container.addEventListener("click", (e) => {
      if (e.target === this.container) this.close();
    });
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  open() {
    this.container.classList.add("modal_active");
  }

  close() {
    this.container.classList.remove("modal_active");
    this.content = document.createElement("div");
  }
}
