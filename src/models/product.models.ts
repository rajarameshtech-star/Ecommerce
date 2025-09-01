export interface ProductDetails {
    id:string,
    productTitle :string;
    productDescription :string;
    productImage: string;
    sellerId :string;
    price: number,
    quantity :number
}


export interface ProductInfo {
    id:string;
    productTitle:string;
    productDescription :string;
    productImage: string;
    price:number;
    quantity:number;
    sellerId :string;
    seller: {
        userId : string;
        appuser : null;
        sellerDummy : string;
    },
    reviews : {
        id:string;
        userId :string;
        productId : string;
        rating : number;
        review :string;
    }[]
}
