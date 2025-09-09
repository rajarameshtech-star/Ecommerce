import { Component, OnInit } from '@angular/core';
import { ProductDetails } from '../../models/product.models';
import { ProductComponent } from "../product/product.component";
import { ProductsService } from '../services/products.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  imports: [ProductComponent, FormsModule, CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: ProductDetails[] = [];
  
  // Filter and Pagination properties
  searchString: string = '';
  minPrice: number | undefined = 0;
  maxPrice: number | undefined = 1000000;
  pageSize: number = 50;
  pageNumber: number = 1;
  hasNextPage: boolean = true;

  constructor(private productService: ProductsService) {}
  
  ngOnInit(){
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts(this.searchString, this.minPrice, this.maxPrice, this.pageSize, this.pageNumber, ).subscribe({
      next: (data) => {
        console.log("Data received from getProducts API:", data);
        this.products = data;
        // If we get fewer products than the page size, we're on the last page.
        this.hasNextPage = data.length == this.pageSize;
      },
      error: (err) => console.log(err)
    });
  }

  onSearch() {
    this.pageNumber = 0; // Reset to first page for new search
    this.loadProducts();
  }

  previousPage() {
    if (this.pageNumber > 0) {
      this.pageNumber--;
      this.loadProducts();
    }
  }

  nextPage() {
    if (this.hasNextPage) {
      this.pageNumber++;
      this.loadProducts();
    }
  }
}
