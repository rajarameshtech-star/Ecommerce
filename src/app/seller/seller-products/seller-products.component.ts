import { Component, signal } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ProductDetails } from '../../../models/product.models';
import { ProductComponent } from "./product/product.component";
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-seller-products',
  standalone: true,
  imports: [CommonModule, ProductComponent, FormsModule, MatSnackBarModule],
  templateUrl: './seller-products.component.html',
  styleUrls: ['./seller-products.component.css']
})
export class SellerProductsComponent {

  searchString: string = '';
  minPrice: number | undefined = 0;
  maxPrice: number | undefined = 1000000;
  pageSize: number = 30;
  pageNumber: number = 1;
  hasNextPage: boolean = true;

  products = signal<ProductDetails[]>([]);
  tempProduct!: ProductDetails;

  constructor(private productsService : ProductsService, private route:ActivatedRoute,private router:Router, private snackBar:MatSnackBar) {
    
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

   editProduct(product: ProductDetails) {
    this.productsService.updateProduct(product).subscribe(() => {
      this.products.update((prods) => {
        this.tempProduct = prods.find(p => p.id === product.id)!;
        let newProds = prods.map((prod) => (prod.id === product.id ? product : prod));
        return newProds;
      })
    });

    let snackRef = this.snackBar.open(
      ''+product.productTitle+' updated successfully',
      'undo',
      {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      }
    );
    snackRef.onAction().subscribe(() => {
      this.productsService.updateProduct(this.tempProduct).subscribe(() => {
        this.products.update((prods) => {
          let newProds = prods.map((prod) => (prod.id === this.tempProduct.id ? this.tempProduct : prod));
          return newProds;
        })
      });
      var snackRef2 = this.snackBar.open(
        ''+product.productTitle+' updated reverted successfully',
        'ok',
        {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        }
      );
      snackRef2.onAction().subscribe(()=>{
        console.log("undone the update");
      });
    })

   }

   deleteProduct(productId:string) {
    this.tempProduct = this.products().find(p => p.id === productId)!;
    console.log("temp product", this.tempProduct);
    this.productsService.deleteProduct(productId).subscribe(() => {
      this.products.update((prods) => prods.filter(prod => prod.id !== productId));
    });

    let snackRef = this.snackBar.open(
      'Product deleted successfully',
      'undo',
      {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      }
    );
    snackRef.onAction().subscribe(() => {
      this.productsService.addProduct(this.tempProduct).subscribe(() => {
        this.products.update((prods) => [this.tempProduct, ...prods]);
      });
      var snackRef2 = this.snackBar.open(
        ''+this.tempProduct.productTitle+' deletion reverted successfully',
        'ok',
        {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        }
      );
      snackRef2.onAction().subscribe(()=>{
        console.log("undone the delete");
      });
    })
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
