import { Component, signal } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ProductDetails } from '../../../models/product.models';
import { ProductComponent } from "./product/product.component";
import { FormsModule, NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-seller-products',
  imports: [ProductComponent, FormsModule],
  templateUrl: './seller-products.component.html',
  styleUrl: './seller-products.component.css'
})
export class SellerProductsComponent {

  searchString: string = '';
  minPrice: number | undefined = 0;
  maxPrice: number | undefined = 1000000;
  pageSize: number = 30;
  pageNumber: number = 1;
  hasNextPage: boolean = true;

  editingProduct = signal<ProductDetails | undefined>(undefined);
  products = signal<ProductDetails[]>([]);
  editing = false;

  constructor(private productsService : ProductsService, private route:ActivatedRoute,private router:Router) {
    
   }

   
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchString = params['search'] || '';
      this.minPrice = +params['min'] || 0;
      this.maxPrice = +params['max'] || 1000000;
      this.pageSize = +params['size'] || 30;
      this.pageNumber = +params['page'] || 1;
    });
    this.loadProducts();
  }

   editProduct(productId : string) {
    // Logic to edit the product
    this.editingProduct.set(this.products().find((v,i,o) => v.id === productId));
    this.editing=true;
   }

   nextPage() {
    this.pageNumber +=1;
    this.loadProducts();
   }

    previousPage() {
      if (this.pageNumber > 1) {
        this.pageNumber--;
        this.loadProducts();
      }
    }

   loadProducts() {
    this.router.navigate([], {
      queryParams: {
        search: this.searchString,
        min: this.minPrice,
        max: this.maxPrice,
        size: this.pageSize,
        page: this.pageNumber
      },
      queryParamsHandling: 'merge' // Optional: keeps existing params
    });
    this.productsService.getProducts(this.searchString, this.minPrice, this.maxPrice, this.pageSize, this.pageNumber).subscribe(products => {
      this.products.set(products);
      if (products.length < this.pageSize) {
        this.hasNextPage = false;
      }else{
        this.hasNextPage = true;
      }
    });
   }
}
