import { Component, input, output } from '@angular/core';
import { ProductDetails } from '../../../../models/product.models';

@Component({
  selector: 'app-product',
  imports: [],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  product = input.required<ProductDetails>();
  edit = output<string>();

  editProduct() {
    // Logic to edit the product
    this.edit.emit(this.product().id);
  }
}
