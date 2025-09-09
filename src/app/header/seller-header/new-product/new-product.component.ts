import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductsService } from '../../../services/products.service';
import { ProductDetails } from '../../../../models/product.models';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-product',
  imports: [
    MatDialogModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatButtonModule,
    FormsModule,
    MatCheckboxModule
  ],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.css'
})
export class NewProductComponent {

  newProduct!: FormGroup;
  addedProducts: ProductDetails[] = [];
  addMultiple: boolean = false;
  counter = 1;

  constructor(
    public dialogRef: MatDialogRef<NewProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private productsService: ProductsService,
    private snackBar:MatSnackBar
  ) {
    this.newProduct = this.fb.group({
      productTitle: ['dialog' + this.counter++],
      productDescription: ['this is a new product'],
      price: [10],
      quantity: [10],
      productImage: ['a'],
      sellerId: ['']
    })
  }

  onFileSelected(imgData: string) {

  }

  onCancel() {
    this.dialogRef.close();
  }

  onCreate() {
    if (this.newProduct.valid) {

      this.productsService.addProduct(this.newProduct.value).subscribe({
        next:(res)=>{
          this.newProduct.reset({
            productTitle: 'dialog' + this.counter++,
            productDescription: 'this is a new product',
            price: 10,
            quantity: 10,
            productImage: 'a',
            sellerId: ''
          })
          
          console.log("Product Added");
          let snackBarRef = this.snackBar.open("Product Added Successfully!", "Add More", {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['snackbar-success']
          });

          snackBarRef.onAction().subscribe(()=>{
            this.addMultiple=true;
          });
        }
      })
      this.addedProducts.unshift(this.newProduct.value);
      if(!this.addMultiple)
        this.dialogRef.close(this.addedProducts);
    }
  }

}
