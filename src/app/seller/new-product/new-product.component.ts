import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {  MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-new-product',
  imports: [MatDialogModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.css'
})
export class NewProductComponent {

  newProduct! :FormGroup;

  constructor(
    public dialogRef : MatDialogRef<NewProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private fb : FormBuilder
  ) {
    this.newProduct = this.fb.group({
      productTitle : ['product from the dialog'],
      productDescription : ['this is a new product'],
      price : [10],
      quantity : [10],
      productImage : ['a'],
      sellerId : ['']
    })
  }

  onFileSelected(imgData:string){

  }

  onCancel() {
    this.dialogRef.close();
  }

  onCreate() {
    if(this.newProduct.valid){
      this.dialogRef.close(this.newProduct.value);
    }
  }

}
