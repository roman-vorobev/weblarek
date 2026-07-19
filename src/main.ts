import "./scss/styles.scss";

import { Catalog } from "./components/models/catalog/catalog";
import { Bucket } from "./components/models/bucket/bucket";
import { Customer } from "./components/models/customer/customer";
import { ApiModal } from "./components/models/apiModal/apiModal";
import { IProduct, ICustomer, IOrder } from "./types";
import { API_URL } from "./utils/constants";
import { Api } from "./components/base/Api";

const productsModel = new Catalog([]);

const customerData: ICustomer = {
  payment: "card",
  email: "",
  phone: "",
  address: "",
};

const customer = new Customer(customerData);

const bucketProducts = new Bucket([]);

const apiProducts: IProduct[] = [
  {
    id: "1",
    title: "Кошачья лапка",
    description: "Просто лапка",
    price: 100,
    image: "",
    productType: "Другое",
  },
  {
    id: "2",
    title: "Кроличья лапка",
    description: "Дает удачу",
    price: 200,
    image: "",
    productType: "Дополнительное",
  },
];

const baseApi = new Api(API_URL);

const apiModal = new ApiModal(baseApi);

//Products
console.log(
  "Получение списка товаров ",
  productsModel.saveProducts(apiProducts),
);

const productList = productsModel.getProducts();
console.log("Отображение списка товаров ", productList);
const selectedProduct = productsModel.getProductByID("1");
console.log("Поиск товара по ID ", selectedProduct);
if (selectedProduct) {
  console.log(
    "Отображение карточки продукта ",
    productsModel.saveProduct(selectedProduct?.id),
  );
}

console.log("Получить выбранный товар ", productsModel.getSelectedProduct());

//Buckets

console.log(
  "Получить список товаров в корзине",
  bucketProducts.getBucketProducts(),
);

const selectedProductIntoBucket = bucketProducts.setSelectedProductIntoBucket(
  apiProducts[0],
);
console.log(
  "Отображение выбранного товара в корзину ",
  selectedProductIntoBucket,
);

console.log(
  "Проверить наличие товара в корзине ",
  bucketProducts.getProductInBucket("1"),
);

console.log(
  "Получение стоимости всех товаров в корзине",
  bucketProducts.getFullBucketPrice(),
);

console.log(
  "Получение списка количества товаров в корзине",
  bucketProducts.getQuantityBucketProducts(),
);

console.log(
  "Удаление товара с корзины ",
  bucketProducts.deleteSelectedProductFromBucket("1"),
);

console.log(
  "Удаление всех товаров с корзины после покупки",
  bucketProducts.deleteAllSelectedProductsFromBucket(),
);

console.log(
  "Проверить наличие товара в корзине ",
  bucketProducts.getProductInBucket("1"),
);

//Customer

console.log("Получить все данные покупателя ", customer.getAllCustomerData());

console.log(
  "Удалить все данные пользователя ",
  customer.deleteAllCustomerData(),
);

console.log(
  "Ввести данные в поле, например в поле 'Телефон' ",
  customer.setInputData("phone", "111111111111"),
);

console.log("Проверка валидации введенных значений ", customer.validateForm());

//API

customer.setInputData("payment", "card");
customer.setInputData("email", "test-user@mail.ru");
customer.setInputData("phone", "89991112233");
customer.setInputData("address", "ул. Ленина, д. 10");

console.log("Проверка валидации введенных значений", customer.validateForm());

const response = await apiModal.getProductsList();
const realProductFromServer = response.items[5];

bucketProducts.setSelectedProductIntoBucket(realProductFromServer);

console.log("Список товаров ", await apiModal.getProductsList());

const orderData: IOrder = {
  ...customer.getAllCustomerData(),

  total: bucketProducts.getFullBucketPrice(),

  items: bucketProducts.getBucketProducts().map((product) => product.id),
};

const postOrderApi = await apiModal.postOrder(orderData);

console.log("Выбранные товары ", postOrderApi);
