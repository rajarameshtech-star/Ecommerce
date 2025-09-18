export interface Product {
    id: string;
    productTitle: string;
    productDescription: string;
    price: number;
    quantity: number;
    sellerId: string;
    seller: any; // Replace with Seller interface if available
    reviews: any; // Replace with Review[] if available
  }
  
  export interface RecentCart {
    id: string;
    userId: string;
    updateDate: string;
    ordered: boolean;
  }
  
  export interface Order {
    id: string;
    productId: string;
    product: Product;
    recentCartId: string;
    recentCart: RecentCart;
    quantity: number;
    orderedDate: string;
    expectedDeliveryBy: string;
    deliveryDate: string;
    status: "Pending"|"Delivered"|"Shipped"|"OutForDelivery";
    paymentStatus: "Pending"|"Paid";
  }
  
  export type OrderSortOption =
  | 'OrderedDate'
  | 'ExpectedDeliveryBy'
  | 'Price'
  | 'OrderStatus'
  | 'PaymentStatus'
  | 'Relevance'
  | 'Popularity';

export enum OrderSortEnum {
  OrderedDate = 'OrderedDate',
  ExpectedDeliveryBy = 'ExpectedDeliveryBy',
  Price = 'Price',
  OrderStatus = 'OrderStatus',
  PaymentStatus = 'PaymentStatus',
  Relevance = 'Relevance',
  Popularity = 'Popularity'
}

export const ORDER_SORT_OPTIONS: { label: string; value: OrderSortEnum }[] = [
  { label: 'Ordered Date', value: OrderSortEnum.OrderedDate },
  { label: 'Expected Delivery By', value: OrderSortEnum.ExpectedDeliveryBy },
  { label: 'Price', value: OrderSortEnum.Price },
  { label: 'Order Status', value: OrderSortEnum.OrderStatus },
  { label: 'Payment Status', value: OrderSortEnum.PaymentStatus },
  { label: 'Relevance', value: OrderSortEnum.Relevance },
  { label: 'Popularity', value: OrderSortEnum.Popularity }
];
