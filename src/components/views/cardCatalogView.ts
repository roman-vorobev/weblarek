import { CardComponent } from "./modalViews/cardComponent";

export class CardCatalogView extends CardComponent {
  constructor(container: HTMLElement, onClick?: () => void) {
    super(container, onClick);
  }
}
