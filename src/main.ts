import "./scss/styles.scss";
import { EventEmitter } from "./components/base/Events";
import { Catalog } from "./components/models/catalog/catalog";
import { Bucket } from "./components/models/bucket/bucket";
import { Customer } from "./components/models/customer/customer";
import { ApiModal } from "./components/models/apiModal/apiModal";
import { IOrder } from "./types";
import { API_URL } from "./utils/constants";
import { Api } from "./components/base/Api";
import { CatalogView } from "./components/views/catalogView";
import { modalView } from "./components/views/modalView";
import { CardPreview } from "./components/views/cardPreview";
import { BucketView } from "./components/views/bucketView";
import { BucketItemView } from "./components/views/bucketItemView";
import { OrderView } from "./components/views/orderView";
import { ContactsView } from "./components/views/contactsView";
import { OrderSuccessView } from "./components/views/orderSuccessView";

const events = new EventEmitter();
const productsModel = new Catalog();
const customer = new Customer();
const bucketProducts = new Bucket();

const baseApi = new Api(API_URL);
const apiModal = new ApiModal(baseApi);
const catalogView = new CatalogView(events);

const modalContainer = document.querySelector(
  "#modal-container",
) as HTMLElement;
const modal = new modalView(modalContainer);

const bucketCounter = document.querySelector(
  ".header__basket-counter",
) as HTMLElement;
const bucketButtonHeader = document.querySelector(
  ".header__basket",
) as HTMLButtonElement;

const cardPreviewTemplate = document.querySelector(
  "#card-preview",
) as HTMLTemplateElement;
const bucketTemplate = document.querySelector("#basket") as HTMLTemplateElement;
const cardBucketTemplate = document.querySelector(
  "#card-basket",
) as HTMLTemplateElement;

const orderTemplate = document.querySelector("#order") as HTMLTemplateElement;

const contactsTemplate = document.querySelector(
  "#contacts",
) as HTMLTemplateElement;
const successTemplate = document.querySelector(
  "#success",
) as HTMLTemplateElement;

let contactsViewInstance: ContactsView | null = null;
let orderViewInstance: OrderView | null = null;

function updateBucketCounter() {
  if (bucketCounter) {
    bucketCounter.textContent = String(
      bucketProducts.getQuantityBucketProducts(),
    );
  }
}

events.on<{ id: string }>("basket:delete-item", (data) => {
  bucketProducts.deleteSelectedProductFromBucket(data.id);
  updateBucketCounter();
  events.emit("basket:open");
});

events.on("basket:order", () => {
  events.emit("order:open");
});

events.on<{ id: string }>("preview:basket-toggle", (data) => {
  const selected = productsModel.getProducts().find((p) => p.id === data.id);
  if (!selected) return;

  const isAlreadyInBucket = bucketProducts.getProductInBucket(selected.id);

  if (isAlreadyInBucket) {
    bucketProducts.deleteSelectedProductFromBucket(selected.id);
  } else {
    bucketProducts.setSelectedProductIntoBucket(selected);
  }

  updateBucketCounter();
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

    const cardPreview = new CardPreview(cardRoot, events);
    const initialInBucket = bucketProducts.getProductInBucket(selected.id);

    modal.render({
      content: cardPreview.render({
        id: selected.id,
        title: selected.title,
        image: selected.image,
        category: selected.category,
        description: selected.description,
        price: selected.price,
        isInBucket: initialInBucket,
      }),
    });

    modal.open();
  }
});

events.on<{ field: string; value: string }>("contacts:input", (data) => {
  customer.setInputData(data.field as any, data.value);
  const errors = customer.validateForm();
  if (contactsViewInstance) {
    contactsViewInstance.setErrors(errors);
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

  const errors = customer.validateForm();
  if (orderViewInstance) {
    orderViewInstance.setErrors(errors);
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
  updateBucketCounter();

  modal.render({
    content: orderSuccessView.render({ total: data.totalCost }),
  });
});

events.on("success:close", () => {
  modal.close();
});

events.on("basket:open", () => {
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

      const bucketItem = new BucketItemView(itemRoot, events);

      return bucketItem.render({
        id: product.id,
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

if (bucketButtonHeader) {
  bucketButtonHeader.addEventListener("click", () => {
    events.emit("basket:open");
  });
}

async function startApp() {
  try {
    const response = await apiModal.getProductsList();
    productsModel.saveProducts(response.items);

    const products = productsModel.getProducts();
    catalogView.renderCatalog(products);
  } catch (err) {
    console.error("Ошибка инициализации приложения:", err);
  }
}

startApp();
