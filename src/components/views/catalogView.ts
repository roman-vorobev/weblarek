import { IProduct } from "../../types/index";
import { IEvents } from "../base/Events";
import { CardCatalog } from "./cardCatalogView";

export class CatalogView {
  private galleryContainer: HTMLElement;
  private template: HTMLTemplateElement;
  private events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
    this.galleryContainer = document.querySelector(".gallery")!;
    this.template = document.querySelector(
      "#card-catalog",
    ) as HTMLTemplateElement;
  }
  public renderCatalog(products: IProduct[]): void {
    const cardElements = products.map((item) => {
      const templateContent = this.template.content.cloneNode(
        true,
      ) as HTMLElement;
      const cardRoot = templateContent.querySelector(".card") as HTMLElement;

      const cardComponent = new CardCatalog(cardRoot, this.events);
      return cardComponent.render(item);
    });
    this.galleryContainer.replaceChildren(...cardElements);
  }
}
