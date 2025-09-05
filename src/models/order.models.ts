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
  