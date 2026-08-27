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
import { OrderView } from "./components/views/modalViews/orderView";
import { ContactsView } from "./components/views/modalViews/contactsView";
import { OrderSuccessView } from "./components/views/modalViews/orderSuccessView";
import { Header } from "./components/views/header";
import { ensureElement } from "./utils/utils";
import { Gallery } from "./components/views/gallery";

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

let contactsViewInstance: ContactsView | null = null;
let orderViewInstance: OrderView | null = null;

function updateHeaderCounter() {
  header.render({
    counter: bucketProducts.getQuantityBucketProducts(),
  });
}

events.on<{ id: string }>("preview:bucket-toggle", (data) => {
  const selected = productsModel.getProducts().find((p) => p.id === data.id);
  if (!selected) return;

  const isAlreadyInBucket = bucketProducts.getProductInBucket(selected.id);

  if (isAlreadyInBucket) {
    bucketProducts.deleteSelectedProductFromBucket(selected.id);
  } else {
    bucketProducts.setSelectedProductIntoBucket(selected);
  }

  updateHeaderCounter();
  modal.close();
});

events.on<{ id: string }>("card:select", (data) => {
  productsModel.saveProduct(data.id);
  const selected = productsModel.getSelectedProduct();

  if (selected) {
    const templateContent = cardPreviewTemplate.content.cloneNode(
      true,
    ) as HTMLElement;
    const cardRoot = templateContent.querySelector(".card") as HTMLElement;

    const cardPreview = new CardPreview(cardRoot, () => {
      events.emit("preview:bucket-toggle", { id: selected.id });
    });
    const initialInBucket = bucketProducts.getProductInBucket(selected.id);

    modal.render({
      content: cardPreview.render({
        title: selected.title,
        image: selected.image,
        category: selected.category,
        description: selected.description,
        price: selected.price,
        isInBucket: initialInBucket,
      } as Record<string, unknown>),
    });

    modal.open();
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

    await baseApi.post("/order", orderData);
    events.emit("success:modal-open", { totalCost });
  } catch (err) {
    console.error("Ошибка при отправке заказа:", err);
  }
});

events.on<{ field: string; value: string }>("order:input", (data) => {
  customer.setInputData(data.field as any, data.value);
});

events.on<{ field: string; value: string }>("contacts:input", (data) => {
  customer.setInputData(data.field as any, data.value);
});

events.on("customer-data:changed", () => {
  const customerData = customer.getAllCustomerData();
  const errors = customer.validateForm();

  if (orderViewInstance) {
    orderViewInstance.render({
      address: customerData.address,
      payment: customerData.payment,
    } as Record<string, unknown>);
    orderViewInstance.setErrors(errors);
  }

  if (contactsViewInstance) {
    contactsViewInstance.render({
      phone: customerData.phone,
      email: customerData.email,
    } as Record<string, unknown>);
    contactsViewInstance.setErrors(errors);
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
  updateHeaderCounter();

  modal.render({
    content: orderSuccessView.render({ total: data.totalCost }),
  });
});

events.on("success:close", () => {
  modal.close();
});

events.on("bucket:open", () => {
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
        events.emit("bucket:open");
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
  modal.open();
});

events.on("order:open", () => {
  const orderContent = orderTemplate.content.cloneNode(true) as HTMLElement;
  const orderRoot = orderContent.querySelector(".form") as HTMLElement;

  orderViewInstance = new OrderView(orderRoot, events);

  const initialErrors = customer.validateForm();
  orderViewInstance.setErrors(initialErrors);

  modal.render({
    content: orderViewInstance.render(),
  });
});

events.on("contacts:open", () => {
  const contactsContent = contactsTemplate.content.cloneNode(
    true,
  ) as HTMLElement;
  const contactsRoot = contactsContent.querySelector(".form") as HTMLElement;

  contactsViewInstance = new ContactsView(contactsRoot, events);

  const initialErrors = customer.validateForm();
  contactsViewInstance.setErrors(initialErrors);

  modal.render({
    content: contactsViewInstance.render(),
  });
});

events.on("products:changed", () => {
  const products = productsModel.getProducts();

  const catalogCardsDOM = products.map((product) => {
    const cardContent = cardCatalogTemplate.content.cloneNode(
      true,
    ) as HTMLElement;
    const cardRoot = cardContent.querySelector(".card") as HTMLElement;
    const cardView = new CardCatalogView(cardRoot, () => {
      events.emit("card:select", { id: product.id });
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
