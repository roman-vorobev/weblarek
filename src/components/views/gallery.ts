import { Component } from "../base/Component";

interface IGalleryData {
  catalog: HTMLElement[];
}

export class Gallery extends Component<IGalleryData> {
  private catalogElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.catalogElement = container;
  }

  set catalog(value: HTMLElement[]) {
    this.catalogElement.replaceChildren(...value);
  }
}
