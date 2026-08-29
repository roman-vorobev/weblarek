import "./scss/styles.scss";
import { EventEmitter } from "./components/base/Events";
import { Catalog } from "./components/models/catalog/catalog";
import { Bucket } from "./components/models/bucket/bucket";
import { Customer } from "./components/models/customer/customer";
import { ApiModal } from "./components/models/apiModal/apiModal";
import { IOrder } from "./types";
import { API_URL } from "./utils/constants";
import { Api } from "./components/base/Api";
import { CardCatalogView } from "./components/views/cardCatalogView";
import { modalView } from "./components/views/modalViews/modalView";
import { CardPreview } from "./components/views/modalViews/cardPreview";
import { BucketView } from "./components/views/modalViews/bucketView";
import { BucketItemView } from "./components/views/bucketItemView";
import { OrderView } from "./components/views/modalViews/formModalViews/orderView";
import { ContactsView } from "./components/views/modalViews/formModalViews/contactsView";
import { OrderSuccessView } from "./components/views/modalViews/orderSuccessView";
import { Header } from "./components/views/header";
import { ensureElement } from "./utils/utils";
import { Gallery } from "./components/views/gallery";

const formFields = {
  isOrderFormTouched: false,
  isContactsFormTouched: false,
};
const events = new EventEmitter();
const productsModel = new Catalog(events);
const customer = new Customer(events);
const bucketProducts = new Bucket(events);

const baseApi = new Api(API_URL);
const apiModal = new ApiModal(baseApi);

const header = new Header(ensureElement(".header"), events);
const gallery = new Gallery(ensureElement(".gallery"));
const modal = new modalView(ensureElement("#modal-container"));
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const bucketButtonHeader = ensureElement<HTMLButtonElement>(".header__basket");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const bucketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const cardBucketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");

const orderTemplateClone = orderTemplate.content.cloneNode(true) as HTMLElement;
const orderFormElement =
  orderTemplateClone.querySelector("form") ||
  (orderTemplateClone.firstElementChild as HTMLElement);
const orderView = new OrderView(orderFormElement, events);
const contactsTemplateClone = contactsTemplate.content.cloneNode(
  true,
) as HTMLElement;
const contactsFormElement =
  contactsTemplateClone.querySelector("form") ||
  (contactsTemplateClone.firstElementChild as HTMLElement);
const contactsView = new ContactsView(contactsFormElement, events);

function updateHeaderCounter() {
  header.render({
    counter: bucketProducts.getQuantityBucketProducts(),
  });
}

events.on("preview:changed", () => {
  const selectedProduct = productsModel.getSelectedProduct();

  if (selectedProduct) {
    const isInBucket = bucketProducts.getProductInBucket(selectedProduct.id);
    const hasPrice =
      selectedProduct.price !== null && selectedProduct.price !== undefined;

    let textForButton = "Купить";
    let isButtonDisabled = false;

    if (!hasPrice) {
      textForButton = "Недоступно";
      isButtonDisabled = true;
    } else if (isInBucket) {
      textForButton = "Удалить из корзины";
    }

    const templateContent = cardPreviewTemplate.content.cloneNode(
      true,
    ) as HTMLElement;
    const cardRoot = templateContent.querySelector(".card") as HTMLElement;

    const cardPreview = new CardPreview(cardRoot, () => {
      events.emit("preview:bucket-toggle", { id: selectedProduct.id });
    });
    modal.render({
      content: cardPreview.render({
        title: selectedProduct.title,
        image: selectedProduct.image,
        category: selectedProduct.category,
        description: selectedProduct.description,
        price: selectedProduct.price,
        buttonText: textForButton,
        buttonDisabled: isButtonDisabled,
      } as any),
    });

    modal.open();
  }
});

events.on<{ id: string; view: CardPreview }>(
  "preview:bucket-toggle",
  (data) => {
    const selected = productsModel.getProducts().find((p) => p.id === data.id);
    if (!selected) return;

    const isAlreadyInBucket = bucketProducts.getProductInBucket(selected.id);

    if (isAlreadyInBucket) {
      bucketProducts.deleteSelectedProductFromBucket(selected.id);
    } else {
      bucketProducts.setSelectedProductIntoBucket(selected);
    }

    updateHeaderCounter();

    events.emit("preview:changed");
    modal.close();
  },
);

events.on<{ id: string }>("card:select", (data) => {
  const product = productsModel.getProductByID(data.id);
  if (product) {
    productsModel.saveProduct(product);
  }
});

events.on("contacts:submit", async () => {
  try {
    const totalCost = bucketProducts.getFullBucketPrice();

    const orderData: IOrder = {
      ...customer.getAllCustomerData(),
      total: totalCost,
      items: bucketProducts.getBucketProducts().map((p) => p.id),
    };
    await apiModal.postOrder(orderData);

    events.emit("success:modal-open", { totalCost });
  } catch (err) {
    console.error("Ошибка при отправке заказа:", err);
  }
});

events.on("customer-data:changed", () => {
  const customerData = customer.getAllCustomerData();
  const errors = customer.validateForm();
  const isOrderValid = !errors.payment && !errors.address;
  const isContactsValid = !errors.phone && !errors.email;
  if (
    customerData.payment ||
    (customerData.address && customerData.address.length > 0)
  ) {
    formFields.isOrderFormTouched = true;
  }
  if (
    (customerData.phone && customerData.phone.length > 0) ||
    (customerData.email && customerData.email.length > 0)
  ) {
    formFields.isContactsFormTouched = true;
  }
  if (orderView) {
    orderView.render({
      address: customerData.address || "",
      payment: customerData.payment || null,
    } as Record<string, unknown>);

    orderView.setValid(isOrderValid);
    const visibleOrderErrors: any = {};
    if (formFields.isOrderFormTouched) {
      if (errors.payment) visibleOrderErrors.payment = errors.payment;
      if (errors.address) visibleOrderErrors.address = errors.address;
    }
    orderView.setErrors(visibleOrderErrors);
  }

  if (contactsView) {
    contactsView.render({
      phone: customerData.phone || "",
      email: customerData.email || "",
    } as Record<string, unknown>);

    contactsView.setValid(isContactsValid);
    const visibleContactErrors: any = {};
    if (formFields.isContactsFormTouched) {
      if (errors.phone) visibleContactErrors.phone = errors.phone;
      if (errors.email) visibleContactErrors.email = errors.email;
    }
    contactsView.setErrors(visibleContactErrors);
  }
});

events.on("order:submit", () => {
  events.emit("contacts:open");
});

events.on<{ totalCost: number }>("success:modal-open", (data) => {
  const successContent = successTemplate.content.cloneNode(true) as HTMLElement;
  const successRoot = successContent.querySelector(
    ".order-success",
  ) as HTMLElement;
  const orderSuccessView = new OrderSuccessView(successRoot, events);

  bucketProducts.getBucketProducts().forEach((product) => {
    bucketProducts.deleteSelectedProductFromBucket(product.id);
  });
  customer.deleteAllCustomerData();
  formFields.isOrderFormTouched = false;
  formFields.isContactsFormTouched = false;

  events.emit("customer-data:changed");
  updateHeaderCounter();

  modal.render({
    content: orderSuccessView.render({ total: data.totalCost }),
  });
});

events.on("success:close", () => {
  modal.close();
});

events.on("bucket:open", () => {
  events.emit("bucket:changed");
  modal.open();
});

events.on("modal:close", () => {
  modal.close();
});

events.on("bucket:changed", () => {
  const bucketContent = bucketTemplate.content.cloneNode(true) as HTMLElement;
  const bucketRoot = bucketContent.querySelector(".basket") as HTMLElement;
  const bucketViewInstance = new BucketView(bucketRoot, events);

  const bucketItemsDOM = bucketProducts
    .getBucketProducts()
    .map((product, index) => {
      const itemContent = cardBucketTemplate.content.cloneNode(
        true,
      ) as HTMLElement;
      const itemRoot = itemContent.querySelector(
        ".basket__item",
      ) as HTMLElement;

      const bucketItem = new BucketItemView(itemRoot, () => {
        bucketProducts.deleteSelectedProductFromBucket(product.id);
        updateHeaderCounter();
      });

      return bucketItem.render({
        index: index + 1,
        title: product.title,
        price: product.price,
      });
    });

  modal.render({
    content: bucketViewInstance.render({
      items: bucketItemsDOM,
      total: bucketProducts.getFullBucketPrice(),
    }),
  });
});

events.on("order:open", () => {
  formFields.isOrderFormTouched = false;
  formFields.isContactsFormTouched = false;
  modal.render({
    content: orderView.render(),
  });
  events.emit("customer-data:changed");
});

events.on<{ field: string; value: string }>("form:change", (data) => {
  customer.setInputData(data.field as any, data.value);
});

events.on("contacts:open", () => {
  formFields.isContactsFormTouched = false;
  modal.render({
    content: contactsView.render(),
  });
  events.emit("customer-data:changed");
});

events.on("products:changed", () => {
  const products = productsModel.getProducts();

  const catalogCardsDOM = products.map((product) => {
    const cardContent = cardCatalogTemplate.content.cloneNode(
      true,
    ) as HTMLElement;
    const cardRoot = cardContent.querySelector(".card") as HTMLElement;
    const cardView = new CardCatalogView(cardRoot, () => {
      events.emit("card:select", product);
    });
    return cardView.render({
      title: product.title,
      image: product.image,
      category: product.category,
      price: product.price,
    });
  });

  gallery.render({ catalog: catalogCardsDOM });
});

if (bucketButtonHeader) {
  bucketButtonHeader.addEventListener("click", () => {
    events.emit("bucket:open");
  });
}

async function startApp() {
  try {
    const response = await apiModal.getProductsList();
    productsModel.saveProducts(response.items);
  } catch (err) {
    console.error("Ошибка при инициализации приложения:", err);
  }
}

startApp();
