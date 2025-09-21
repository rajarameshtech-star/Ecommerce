import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { ProductDetails } from '../../../../models/product.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seller-stats',
  templateUrl: './seller-stats.component.html',
  styleUrls: ['./seller-stats.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class SellerStatsComponent implements OnInit {
  products: ProductDetails[] = [];
  quantities: { productId: string; pendingOrderQuantity: number }[] = [];
  totalPendingOrders = 0;

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.productsService.getProductsAndOrderQtys().subscribe(data => {
      this.products = data.products;
      this.quantities = data.quantities;
      this.totalPendingOrders = this.quantities.reduce((acc, curr) => acc + curr.pendingOrderQuantity, 0);
    });
  }

  getProductQuantity(productId: string): number {
    const productQuantity = this.quantities.find(q => q.productId === productId);
    return productQuantity ? productQuantity.pendingOrderQuantity : 0;
  }
}
