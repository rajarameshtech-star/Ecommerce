import { Component, effect, EventEmitter, input, output, signal } from '@angular/core';
import { ProductDetails } from '../../../../models/product.models';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { DummyComponent } from '../dummy/dummy.component';
import { MatCheckbox } from "@angular/material/checkbox";
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatCheckbox,
    FormsModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  /** The product to display. */
  product = input.required<ProductDetails>();

  /** Whether the product is selectable. */
  selectable = input.required<boolean>();

  /** The quantity of the product that has been ordered. */
  orderedQuantity = input.required<number>();

  /** Emits when the product is edited. */
  edit = output<ProductDetails>();

  /** Emits when the product is deleted. */
  delete = output<string>();

  /** Emits when the product is selected. */
  selected = output<string>();

  /** Emits when the user wants to check the orders for this product. */
  checkOrders = output<string>();

  isSelected = false;

  constructor(public dialog: MatDialog) {
    effect(() => {
      if (!this.selectable()) {
        this.isSelected = false;
      }
    });
  }

  editProduct(): void {
    const dialogRef = this.dialog.open(EditProductComponent, {
      width: '60%',
      data: { ...this.product() }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.edit.emit({ ...this.product(), ...result });
      }
    });
  }

  deleteProduct(): void {
    const dialogRef = this.dialog.open(DummyComponent, {
      width: '400px',
      data: {
        title: this.product().productTitle,
        message: `Do you want to Delete ${this.product().productTitle}?`,
        actions: { update: 'Update Instead' }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.delete.emit(this.product().id);
      }
    });
  }

  notifySelection(): void {
    this.selected.emit(this.product().id);
  }

  checkProductOrders(): void {
    this.checkOrders.emit(this.product().id);
  }
}