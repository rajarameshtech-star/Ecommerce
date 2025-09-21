import { Component, signal, computed } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ProductDetails } from '../../../models/product.models';
import { ProductComponent } from "./product/product.component";
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductEventsService } from '../../shared/product-events.service';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { OrderHubService } from '../../services/order-hub.service';

@Component({
  selector: 'app-seller-products',
  standalone: true,
  imports: [
    CommonModule, ProductComponent, FormsModule,
    MatSnackBarModule, MatCheckboxModule,
    MatInputModule,
    MatIconModule, MatButtonModule, MatFormFieldModule, MatSelectModule,
    MatSidenavModule,
  ],
  templateUrl: './seller-products.component.html',
  styleUrls: ['./seller-products.component.css']
})
export class SellerProductsComponent {

  view = 'grid';
  canSelectMultiple = false;
  searchString: string = '';
  minPrice: number | undefined = 0;
  maxPrice: number | undefined = 1000000;
  pageSize: number = 30;
  pageNumber: number = 1;
  hasNextPage: boolean = true;
  selectedIds: Set<string> = new Set();

  products = signal<ProductDetails[]>([]);
  quantities: { [productId: string]: number } = {}; // Updated to a dictionary
  tempProduct!: ProductDetails;

  sortOrder = signal<'name-asc' | 'name-desc' | 'price-asc' | 'price-desc'>('name-asc');
  clientSideFilter = signal<string>('');

  filteredProducts = computed(() => {
    const prods = this.products();
    const filter = this.clientSideFilter().toLowerCase();
    const sortedProds = [...prods].sort((a, b) => {
      switch (this.sortOrder()) {
        case 'name-asc':
          return a.productTitle.localeCompare(b.productTitle);
        case 'name-desc':
          return b.productTitle.localeCompare(a.productTitle);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
      }
    });

    if (!filter) {
      return sortedProds;
    }

    return sortedProds.filter(p => p.productTitle.toLowerCase().includes(filter));
  });

  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private productEvents: ProductEventsService,
    private orderHubService: OrderHubService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchString = params['search'] || '';
      this.minPrice = +params['min'] || 0;
      this.maxPrice = +params['max'] || 1000000;
      this.pageSize = +params['size'] || 30;
      this.pageNumber = +params['page'] || 1;
    });
    this.productEvents.productsChanged.subscribe(() => {
      this.loadProducts();
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
      '' + product.productTitle + ' updated successfully',
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
        '' + product.productTitle + ' updated reverted successfully',
        'ok',
        {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        }
      );
      snackRef2.onAction().subscribe(() => {
        console.log("undone the update");
      });
    })

  }

  deleteProduct(productId: string) {
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
        '' + this.tempProduct.productTitle + ' deletion reverted successfully',
        'ok',
        {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        }
      );
      snackRef2.onAction().subscribe(() => {
        console.log("undone the delete");
      });
    })
  }

  nextPage() {
    this.pageNumber += 1;
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
        page: this.pageNumber,
      },
      queryParamsHandling: 'merge',
    });

    this.productsService
      .getProductsAndOrderQtys(
        this.searchString,
        this.minPrice,
        this.maxPrice,
        this.pageSize,
        this.pageNumber
      )
      .subscribe(({ products, quantities }) => {
        this.products.set(products);
        this.quantities = quantities.reduce((acc, qty) => {
          acc[qty.productId] = qty.pendingOrderQuantity;
          return acc;
        }, {} as { [productId: string]: number });
        this.hasNextPage = products.length >= this.pageSize;
      });
  }

  handleSelection(selectedId:string){
    this.selectedIds.has(selectedId) ? this.selectedIds.delete(selectedId) : this.selectedIds.add(selectedId);
    console.log(this.selectedIds);
  }

  deleteSelectedProducts() {
    if(this.selectedIds.size === 0) return;
    let ids = Array.from(this.selectedIds);
    this.selectedIds.clear();
    this.snackBar.open("Deleted multiple products successfully", 'undo', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    })
  }

  checkProductOrders(productId:string) {
    this.router.navigate(["seller","orders"], { queryParams: { productId } });
  }
}
