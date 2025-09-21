import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../../services/orders.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller-summary',
  templateUrl: './seller-summary.component.html',
  styleUrls: ['./seller-summary.component.css'],
  standalone: true,
  imports: [CommonModule,CurrencyPipe]
})
export class SellerSummaryComponent implements OnInit {
  summary: {pending: number, shipped: number, delivered: number, outForDelivery: number, lateDeliveries: number, settledEarnings: number, settledEarningsThisMonth: number, settledEarningsThisYear: number, pendingAmount: number, totalProducts: number
} | undefined;

  constructor(private ordersService: OrdersService, private router: Router) {}

  ngOnInit(): void {
    this.ordersService.getSellerSummary().subscribe(data => {
      this.summary = data;
    });
  }

  navigateTo(type: string): void {
    switch (type) {
      case 'pending':
        this.router.navigate(['/seller/orders'], { queryParams: { orderStatus: 'pending' } });
        break;
      case 'shipped':
        this.router.navigate(['/seller/orders'], { queryParams: { orderStatus: 'shipped' } });
        break;
      case 'delivered':
        this.router.navigate(['/seller/orders'], { queryParams: { orderStatus: 'delivered' } });
        break;
      case 'outForDelivery':
        this.router.navigate(['/seller/orders'], { queryParams: { orderStatus: 'outForDelivery' } });
        break;
      case 'settledEarnings':
      case 'settledEarningsThisMonth':
      case 'settledEarningsThisYear':
        this.router.navigate(['/seller/orders'], { queryParams: { paymentStatus: 'paid' } });
        break;
      case 'pendingAmount':
        this.router.navigate(['/seller/orders'], { queryParams: { paymentStatus: 'pending' } });
        break;
      case 'totalProducts':
        this.router.navigate(['/seller/products']);
        break;
    }
  }
}
