import { Component, OnInit, signal } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { Order } from '../../../models/order.models';
import { FormsModule } from '@angular/forms';
import { PAYMENT_STATUSES } from '../../shared/select.values';
import { ORDER_STATUSES } from '../../shared/select.values';
import { DatePipe, NgClass } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ViewOrderComponent } from '../dialogs/view-order/view-order.component';
import { UpdateOrderComponent } from '../dialogs/update-order/update-order.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-seller-orders',
  imports: [
    FormsModule,
    DatePipe,
    MatTableModule,
    MatCardModule,
    NgClass,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatSidenavModule,
    MatIconModule,
  ],
  templateUrl: './seller-orders.component.html',
  styleUrl: './seller-orders.component.css'
})
export class SellerOrdersComponent implements OnInit {

  orderStatuses = ORDER_STATUSES;
  paymentStatuses = PAYMENT_STATUSES;
  displayedColumns = ['product', 'price', 'quantity', 'orderedDate', 'expectedDeliveryBy','status', 'paymentStatus', 'actions'];

  startDate: Date | null = null;
  startTime: string = '00:00';
  endDate: Date | null = null;
  endTime: string = '23:59';

  sellerId:string|undefined;
  orderStatus:"Pending"|"Delivered"|"Shipped"|"OutForDelivery"|undefined="Pending";
  paymentStatus:"Pending"|"Paid"|undefined="Pending" ;
  pageSize:number|undefined = 10;
  pageNumber:number=0;
  hasNextPage = true;

  orders = signal<Order[]>([]);

  constructor(
    private orderService: OrdersService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.startDate = params['startDate'] ? new Date(params['startDate']) : null;
      this.startTime = params['startTime'] || '00:00';
      this.endDate = params['endDate'] ? new Date(params['endDate']) : null;
      this.endTime = params['endTime'] || '23:59';
      this.orderStatus = params['orderStatus'] || 'Pending';
      this.paymentStatus = params['paymentStatus'] || 'Pending';
      this.pageNumber = params['pageNumber'] ? parseInt(params['pageNumber'], 10) : 0;
      this.pageSize = params['pageSize'] ? parseInt(params['pageSize'], 10) : 10;

      this.fetchOrdersInternal();
    });
  }

  search() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        startDate: this.startDate?.toISOString().split('T')[0],
        startTime: this.startTime,
        endDate: this.endDate?.toISOString().split('T')[0],
        endTime: this.endTime,
        orderStatus: this.orderStatus,
        paymentStatus: this.paymentStatus,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
      },
      queryParamsHandling: 'merge',
    });
  }

  openViewOrderDialog(order: Order): void {
    this.dialog.open(ViewOrderComponent, {
      data: order,
    });
  }

  openUpdateOrderDialog(order: Order): void {
    const dialogRef = this.dialog.open(UpdateOrderComponent, {
      data: order,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.orders().findIndex(o => o.id === result.id);
        if (index > -1) {
          const updatedOrders = [...this.orders()];
          updatedOrders[index] = result;
          this.orders.set(updatedOrders);
        }
      }
    });
  }

  private combineDateTime(date: Date, time: string): string | undefined {
    if (!date || !time) {
      return undefined;
    }
    const [hours, minutes] = time.split(':');
    const newDate = new Date(date);
    newDate.setHours(parseInt(hours, 10));
    newDate.setMinutes(parseInt(minutes, 10));
    return newDate.toISOString();
  }

  private fetchOrdersInternal() {
    const startDateTime = this.startDate ? this.combineDateTime(this.startDate, this.startTime) : undefined;
    const endDateTime = this.endDate ? this.combineDateTime(this.endDate, this.endTime) : undefined;

    this.orderService.getSellerOrders({
      pageNumber : this.pageNumber,
      pageSize: this.pageSize ?? 10,
      startDate : startDateTime,
      endDate : endDateTime,
      orderStatus : this.orderStatus,
      paymentStatus : this.paymentStatus,
    }).subscribe({
      next : (res) => {
        this.orders.set(res);
        this.hasNextPage = res.length === this.pageSize;
        console.log(res);
      },
      error : (err) => {
        console.log(err);
      }
    });
  }

  previousPage() {
    if (this.pageNumber > 0) {
      this.pageNumber--;
      this.search();
    }
  }

  nextPage() {
    if (this.hasNextPage) {
      this.pageNumber++;
      this.search();
    } 
  }
}