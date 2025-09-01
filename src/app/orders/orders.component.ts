import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../services/orders.service';
import { Order } from '../../models/order.models';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
// orders.component.ts

@Component({
  selector: 'app-orders',
  imports:[DatePipe, FormsModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  startDate:string|undefined;
  endDate:string|undefined;
  sellerId:string|undefined;
  orderStatus:string|undefined;
  paymentStatus:string|undefined="Pending";
  pageSize:number|undefined;
  pageNumber:number|undefined;

  orders: Order[] = [];
  loading = true;
  error: string | null = null;

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    console.log(this.sellerId);
  }

  getOrders() {
    this.ordersService.getOrders(
      this.startDate,
      this.endDate,
      this.sellerId,
      this.orderStatus,
      this.paymentStatus,
      this.pageSize,
      this.pageNumber
    ).subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders.';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
