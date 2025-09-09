import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OrdersService } from '../../services/orders.service';
import { MatDialog } from '@angular/material/dialog';
import { NewProductComponent } from './new-product/new-product.component';


@Component({
  selector: 'app-seller-header',
  imports: [RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './seller-header.component.html',
  styleUrl: './seller-header.component.css'
})
export class SellerHeaderComponent {
  
  @Output() logout = new EventEmitter<void>();

  constructor(private orderService:OrdersService, private dialog:MatDialog) {}


  addProduct() {
    this.dialog.open(NewProductComponent, {
      width: '60%',
      data: { title: "Add New Product", message: "Do you want to Add New Product?", actions : {update : "Go to Products"} }
    });
  }

  onLogout() {
    this.logout.emit();
  }

}
