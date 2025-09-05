import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Order } from '../../../../models/order.models';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.css'],
  standalone: true,
  imports: [CommonModule, MatCardModule, DatePipe, MatDialogModule, MatDividerModule],
})
export class ViewOrderComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public order: Order) {}
}
