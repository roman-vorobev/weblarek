import { Component } from "../../components/base/Component";
import { CDN_URL } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { IProduct } from "../../types/index";

export class CardCatalogView extends Component<IProduct> {
  private _title: HTMLElement;
  private _image: HTMLImageElement;
  private _category: HTMLElement;
  private _price: HTMLElement;

  constructor(container: HTMLElement, onClick?: () => void) {
    super(container);

    this._title = ensureElement<HTMLElement>(".card__title", this.container);
    this._image = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
    this._category = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this._price = ensureElement<HTMLElement>(".card__price", this.container);

    if (onClick) {
      this.container.addEventListener("click", () => {
        onClick();
      });
    }
  }

  set title(value: string) {
    this._title.textContent = value;
    if (this._image) {
      this._image.alt = value;
    }
  }

  set image(value: string) {
    const baseUrl = CDN_URL.endsWith("/") ? CDN_URL.slice(0, -1) : CDN_URL;
    const cleanValue = value.startsWith("/") ? value : `/${value}`;
    const fullUrl = `${baseUrl}${cleanValue}`;

    this.setImage(this._image, fullUrl, this._title?.textContent || "");
  }

  set category(value: string) {
    this._category.textContent = value;
    this._category.className = "card__category";

    switch (value) {
      case "софт-скил":
        this._category.classList.add("card__category_soft");
        break;
      case "другое":
        this._category.classList.add("card__category_other");
        break;
      case "хард-скил":
        this._category.classList.add("card__category_hard");
        break;
      case "кнопка":
        this._category.classList.add("card__category_button");
        break;
      case "дополнительное":
        this._category.classList.add("card__category_additional");
        break;
    }
  }

  set price(value: number | null) {
    this._price.textContent = value !== null ? `${value} синапсов` : "Бесценно";
  }
}
