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


@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatCheckbox, FormsModule,
    MatIconModule
  ],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  product = input.required<ProductDetails>();
  selectable = input.required<boolean>();
  orderedQuantity = input.required<number>(); // Default value is 0
  isSelected = false;

  edit = output<ProductDetails>();
  delete = output<string>();
  selected = output<string>();

  constructor(public dialog: MatDialog) {
    effect(()=>{
      if(!this.selectable()) this.isSelected = false;
    });
  }

  editProduct() {
    const dialogRef = this.dialog.open(EditProductComponent, {
      width: '60%',
      data: { ...this.product()}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        console.log(this.product());
        this.edit.emit({ ...this.product(), ...result });
      }
    });
  }

  deleteProduct() {
    const dialogRef = this.dialog.open(DummyComponent, {
      width: '400px',
      data: { title: this.product().productTitle,message: "Do you want to Delete " + this.product().productTitle + "?", actions : {update : "Update Instead"} }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        console.log(this.product());
        console.log({ ...this.product(), ...result });
        this.delete.emit(this.product().id);
      }
      else {
        // this.editProduct();
      }
    });
  }

  notifySelection() {
    this.selected.emit(this.product().id);
  }

}
