import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Order } from '../../../../models/order.models';
import { OrdersService } from '../../../services/orders.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ORDER_STATUSES, PAYMENT_STATUSES } from '../../../shared/select.values';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-update-order',
  templateUrl: './update-order.component.html',
  styleUrls: ['./update-order.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    DatePipe,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
  ],
})
export class UpdateOrderComponent {
  orderStatuses = ORDER_STATUSES;
  paymentStatuses = PAYMENT_STATUSES;
  initialStatus:string;
  initialPaymentStatus:string;
  updatedOrder: Order;

  constructor(
    @Inject(MAT_DIALOG_DATA) public order: Order,
    private ordersService: OrdersService,
    public dialogRef: MatDialogRef<UpdateOrderComponent>
  ) {
    this.initialStatus = order.status;
    this.initialPaymentStatus = order.paymentStatus;
    this.updatedOrder = { ...order };
  }

  updateOrder() {
    this.ordersService.updateOrderStatus(this.updatedOrder.id, this.updatedOrder.status, this.updatedOrder.paymentStatus).subscribe(() => {
      alert("updated order successfully");
      this.dialogRef.close(this.updatedOrder);
    });
  }
}
