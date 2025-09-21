import { Component, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterOutlet } from '@angular/router';
import { MatButtonModule } from "@angular/material/button";
import { NewProductComponent } from '../../header/seller-header/new-product/new-product.component';
import { DummyComponent } from '../seller-products/dummy/dummy.component';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { SellerProductsComponent } from '../seller-products/seller-products.component';
import { ProductsService } from '../../services/products.service';
import { OrderHubService } from '../../services/order-hub.service';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule],
  templateUrl: './seller-dashboard.component.html',
  styleUrl: './seller-dashboard.component.css'
})
export class SellerDashboardComponent {

  latestOrders = 0;
  loggedInDateTime = new Date();
  viewLatestOrders!: MatSnackBarRef<any>;

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    readonly router: Router,
    private orderHubService: OrderHubService // Inject OrderHubService
  ) {
    this.initializeOrderHub();

    this.viewLatestOrders?.onAction()?.subscribe(()=>{
      alert("routed to the orders component")
    })

    console.log(new Date());
    console.log(this.loggedInDateTime);

  }

  /**
   * Initializes the OrderHubService and listens to the OrderPlaced event.
   */
  private initializeOrderHub(): void {
    this.orderHubService.startConnection().then(() => {
      console.log('OrderHub connection established.');
      // Listen to the OrderPlaced event
      this.orderHubService['connection'].on('OrderPlaced', (data: { productTitle: string; quantityRequested: number }) => {
        this.latestOrders+=1;
        let ref = this.snackBar.open(
          `Order Placed: ${data.productTitle} - Quantity: ${data.quantityRequested}`,
          'Close',
          {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['order-snackbar'], // Add custom styling,
            politeness:'assertive'
          }
        );

        ref.afterDismissed().subscribe(()=>{
          let view = this.snackBar.open(
            `${this.latestOrders} new order${this.latestOrders>1 ? 's' : ''} received`,
            'Close',
            {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['order-snackbar'], // Add custom styling,
              politeness:'assertive'
            }
          )

          view.onAction().subscribe(()=>{
            this.latestOrders = 0;
            
            this.router.navigate(["seller","orders"], {
              queryParams: { startDate: this.loggedInDateTime.getFullYear()+'-'+(this.loggedInDateTime.getMonth() < 10 ? '0' : '')+(this.loggedInDateTime.getMonth()+1)+"-"+this.loggedInDateTime.getDate(), startTime: this.loggedInDateTime.getHours()+":"+this.loggedInDateTime.getMinutes()+':'+this.loggedInDateTime.getSeconds(), endDate: "2200-12-12", endTime: "00:00",
                orderStatus: "Pending", paymentStatus: "Pending", pageNumber: 0, pageSize: 30
              }
            })
          })
        })    

      });
    }).catch(err => {
      console.error('Error establishing OrderHub connection:', err);
    });
  }

  addNewProduct() {
    let dialogRef = this.dialog.open(NewProductComponent, {
      width: '60%',
      data: { title: "Add New Product", message: "Do you want to Add New Product?", actions: { update: "Go to Products" } }
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        console.log(response);
      }
    });
  }
    
}
