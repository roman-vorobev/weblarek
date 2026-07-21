import "./scss/styles.scss";

import { Catalog } from "./components/models/catalog/catalog";
import { Bucket } from "./components/models/bucket/bucket";
import { Customer } from "./components/models/customer/customer";
import { ApiModal } from "./components/models/apiModal/apiModal";
import { IProduct, IOrder } from "./types";
import { API_URL } from "./utils/constants";
import { Api } from "./components/base/Api";
import { apiProducts } from "./utils/data";

const productsModel = new Catalog();

const customer = new Customer();

const bucketProducts = new Bucket();

const apiProductsList: IProduct[] = apiProducts.items;

const baseApi = new Api(API_URL);

const apiModal = new ApiModal(baseApi);

//Products
productsModel.saveProducts(apiProductsList);

const productList = productsModel.getProducts();

console.log("Отображение списка товаров ", productList);

const selectedProduct = productsModel.getProductByID(
  "c101ab44-ed99-4a54-990d-47aa2bb4e7d9",
);

console.log("Поиск товара по ID ", selectedProduct);

if (selectedProduct) {
  productsModel.saveProduct(selectedProduct.id);
}

productsModel.saveProducts(apiProductsList);

console.log("Получить выбранный товар ", productsModel.getSelectedProduct());

//Buckets

console.log(
  "Получить список товаров в корзине",
  bucketProducts.getBucketProducts(),
);

bucketProducts.setSelectedProductIntoBucket(apiProductsList[0]);
bucketProducts.setSelectedProductIntoBucket(apiProductsList[2]);
bucketProducts.setSelectedProductIntoBucket(apiProductsList[1]);

console.log(
  "Отображение товаров в корзине ",
  bucketProducts.getBucketProducts(),
);

console.log(
  "Проверить наличие товара в корзине ",
  bucketProducts.getProductInBucket("b06cde61-912f-4663-9751-09956c0eed67"),
);

console.log(
  "Получение стоимости всех товаров в корзине ",
  bucketProducts.getFullBucketPrice(),
);

console.log(
  "Получение количества товаров в корзине ",
  bucketProducts.getQuantityBucketProducts(),
);

bucketProducts.deleteSelectedProductFromBucket(
  "b06cde61-912f-4663-9751-09956c0eed67",
);

console.log(
  "Получение списка товаров в корзине после удаления ",
  bucketProducts.getBucketProducts(),
);

(bucketProducts.deleteAllSelectedProductsFromBucket(),
  console.log(
    "Получение списка товаров в корзине после удаления всех товаров ",
    bucketProducts.getBucketProducts(),
  ));

console.log(
  "Проверить наличие товара в корзине ",
  bucketProducts.getProductInBucket("b06cde61-912f-4663-9751-09956c0eed67"),
);

//Customer

customer.setInputData("phone", "111111111111");

console.log("Получить все данные покупателя ", customer.getAllCustomerData());

(customer.deleteAllCustomerData(),
  console.log(
    "Получить все данные покупателя после удаления ",
    customer.getAllCustomerData(),
  ));

customer.setInputData("email", "test@test.ru");

console.log("Проверка валидации введенных значений ", customer.validateForm());

//Api

customer.setInputData("payment", "card");
customer.setInputData("email", "test-user@mail.ru");
customer.setInputData("phone", "89991112233");
customer.setInputData("address", "ул. Ленина, д. 10");

console.log("Проверка валидации введенных значений", customer.validateForm());

const response = await apiModal.getProductsList();
const realProductFromServer = response.items[5];

bucketProducts.setSelectedProductIntoBucket(realProductFromServer);

async function getItemsList() {
  try {
    const response = await apiModal.getProductsList();
    productsModel.saveProducts(response.items);

    console.log(
      "Список продуктов из модели каталога: ",
      productsModel.getProducts(),
    );
    return response;
  } catch (error) {
    console.log(error);
  }
}

const orderData: IOrder = {
  ...customer.getAllCustomerData(),

  total: bucketProducts.getFullBucketPrice(),

  items: bucketProducts.getBucketProducts().map((product) => product.id),
};

async function getOrderList() {
  try {
    const response = await apiModal.postOrder(orderData);
    return response;
  } catch (err) {
    console.log(err);
  }
}

console.log("Список товаров ", getItemsList());

const postOrderApi = getOrderList();

console.log("Выбранные товары ", postOrderApi);
