import { Component, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterOutlet } from '@angular/router';
import { MatButton } from "@angular/material/button";
import { NewProductComponent } from '../new-product/new-product.component';
import { DummyComponent } from '../seller-products/dummy/dummy.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SellerProductsComponent } from '../seller-products/seller-products.component';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-seller-dashboard',
  imports: [RouterOutlet, MatButton],
  templateUrl: './seller-dashboard.component.html',
  styleUrl: './seller-dashboard.component.css'
})
export class SellerDashboardComponent {

  constructor(public dialog:MatDialog, public snackBar:MatSnackBar, readonly router: Router, private productsService:ProductsService) {
    
  }

  addNewProduct() {
    let dialogRef = this.dialog.open(NewProductComponent, {
      width: '60%',
      data: { title: "Add New Product", message: "Do you want to Add New Product?", actions : {update : "Go to Products"} }
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response) {

        this.productsService.addProduct(response).subscribe({
          next: (res) => {
            console.log(res);
            let snackBarRef = this.snackBar.open("Product Added Successfully!", "Go to Products", {
              duration: 5000,
              verticalPosition: 'top',
              horizontalPosition: 'center',
              panelClass: ['snackbar-success']
            });
    
            snackBarRef.onAction().subscribe(()=>{
              
              this.router.navigate(["seller", "products"]);
            });
          },
          error: (err) => {
            console.log(err);
            let snackBarRef = this.snackBar.open("Error while adding Product!", "info", {
              duration: 5000,
              verticalPosition: 'top',
              horizontalPosition: 'center',
              panelClass: ['snackbar-success']
            });
          }
        })

        
      }
    })
  }
}
