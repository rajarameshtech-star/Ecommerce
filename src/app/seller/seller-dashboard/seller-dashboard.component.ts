import { Component, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterOutlet } from '@angular/router';
import { MatButton } from "@angular/material/button";
import { NewProductComponent } from '../../header/seller-header/new-product/new-product.component';
import { DummyComponent } from '../seller-products/dummy/dummy.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SellerProductsComponent } from '../seller-products/seller-products.component';
import { ProductsService } from '../../services/products.service';


@Component({
  selector: 'app-seller-dashboard',
  imports: [RouterOutlet],
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
        console.log(response);
      }
    })
  }
}
