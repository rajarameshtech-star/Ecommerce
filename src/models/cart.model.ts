export interface CartItem {
    id:string;
    recentCartId:string;
    productId :string;
    product:{
        id:string;
        productTitle:string;
        productDescription:string;
        price:number;
        quantity:number;
        sellerId:string;
    },
    quantity:number;
}