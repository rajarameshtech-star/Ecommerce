import { AfterViewInit, Component, OnInit, OnDestroy, signal, ViewChild } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { Order, ORDER_SORT_OPTIONS, OrderSortEnum } from '../../../models/order.models';
import { FormsModule } from '@angular/forms';
import { PAYMENT_STATUSES } from '../../shared/select.values';
import { ORDER_STATUSES } from '../../shared/select.values';
import { DatePipe, NgClass } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
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
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
    MatSelectModule,
    MatSortModule,
    MatCheckboxModule
  ],
  templateUrl: './seller-orders.component.html',
  styleUrl: './seller-orders.component.css'
})
export class SellerOrdersComponent implements OnInit, AfterViewInit, OnDestroy {

  orderStatuses = ORDER_STATUSES;
  paymentStatuses = PAYMENT_STATUSES;
  displayedColumns = ['product', 'price', 'quantity', 'orderedDate', 'expectedDeliveryBy','status', 'paymentStatus', 'actions'];

  startDate: Date | null = null;
  startTime: string = '00:00';
  endDate: Date | null = null;
  endTime: string = '23:59';
  selectedSortOption : OrderSortEnum = OrderSortEnum.OrderedDate;
  orderSortOptions = ORDER_SORT_OPTIONS;
  reverse = false;
  orderStatus:"Pending"|"Delivered"|"Shipped"|"OutForDelivery"|undefined="Pending";
  paymentStatus:"Pending"|"Paid"|undefined="Pending" ;
  pageSize: number = 10;
  pageNumber: number = 0;
  hasNextPage = true;

  dataSource = new MatTableDataSource<Order>();
  @ViewChild(MatSort) sort!: MatSort;

  private destroy$ = new Subject<void>();

  constructor(
    private orderService: OrdersService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.startDate = params['startDate'] ? new Date(params['startDate'] + 'T00:00:00') : null;
      this.startTime = params['startTime'] || '00:00';
      this.endDate = params['endDate'] ? new Date(params['endDate'] + 'T00:00:00') : null;
      this.endTime = params['endTime'] || '23:59';
      this.orderStatus = params['orderStatus'] || 'Pending';
      this.paymentStatus = params['paymentStatus'] || 'Pending';
      this.selectedSortOption = params['sortBy'] || OrderSortEnum.OrderedDate;
      this.reverse = params['reverse'] === 'true' ? true : false;
      this.pageNumber = params['pageNumber'] ? +params['pageNumber'] : 0;
      this.pageSize = params['pageSize'] ? +params['pageSize'] : 10;
      this.fetchOrdersInternal();
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'product': return item.product.productTitle.toLowerCase();
        case 'price': return item.product.price;
        default: return (item as any)[property];
      }
    };
    this.dataSource.filterPredicate = (data: Order, filter: string) => {
      const searchString = filter.toLowerCase();
      return data.product.productTitle.toLowerCase().includes(searchString) ||
             data.status.toLowerCase().includes(searchString) ||
             data.paymentStatus.toLowerCase().includes(searchString);
    };
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private toYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  search() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        startDate: this.startDate ? this.toYYYYMMDD(this.startDate) : undefined,
        startTime: this.startTime,
        endDate: this.endDate ? this.toYYYYMMDD(this.endDate) : undefined,
        endTime: this.endTime,
        orderStatus: this.orderStatus,
        paymentStatus: this.paymentStatus,
        sortBy: this.selectedSortOption,
        reverse: this.reverse.toString(),
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      },
      queryParamsHandling: 'merge',
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
        const index = this.dataSource.data.findIndex(o => o.id === result.id);
        if (index > -1) {
          const updatedOrders = [...this.dataSource.data];
          updatedOrders[index] = result;
          this.dataSource.data = updatedOrders;
        }
      }
    });
  }

  private combineDateTime(date: Date, time: string): string | undefined {
    if (!date || !time) {
      return undefined;
    }
    const newDate = new Date(date);
    const [hours, minutes] = time.split(':');
    newDate.setHours(parseInt(hours, 10));
    newDate.setMinutes(parseInt(minutes, 10));
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);
    return newDate.toISOString();
  }

  private fetchOrdersInternal() {
    const startDateTime = this.startDate ? this.combineDateTime(this.startDate, this.startTime) : undefined;
    const endDateTime = this.endDate ? this.combineDateTime(this.endDate, this.endTime) : undefined;

    this.orderService.getSellerOrders({
      startDate : startDateTime,
      endDate : endDateTime,
      orderStatus : this.orderStatus,
      paymentStatus : this.paymentStatus,
      sortBy: this.selectedSortOption,
      reverse: this.reverse,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    }).subscribe({
      next : (res) => {
        this.dataSource.data = res;
        this.hasNextPage = res.length === this.pageSize;
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
