import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from '../services/orders.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  orderId = signal<string | null>(null);
  paymentMethod = signal<string | null>(null);
  paymentDetails = {
    vpa: '',
    cardNumber: '',
    cvv: '',
    expiry: '',
    walletId: ''
  };
  
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ordersService = inject(OrdersService);

  constructor() {
    this.orderId.set(this.route.snapshot.paramMap.get('orderId'));
  }

  selectPaymentMethod(method: string) {
    this.paymentMethod.set(method);
    this.paymentDetails = {
      vpa: '',
      cardNumber: '',
      cvv: '',
      expiry: '',
      walletId: ''
    };
  }

  submitPayment() {
    if (this.orderId() && this.paymentMethod()) {
      const paymentData = {
        method: this.paymentMethod(),
        details: this.paymentDetails
      }
      this.ordersService.updatePaymentMethod(this.orderId()!, paymentData).subscribe(() => {
        this.ordersService.orderFromCart().subscribe(response => {
          if (response) {
            
            this.router.navigate(['/previous-orders']);
          }
        });
      });
    }
  }
}
