import { Component, computed, Signal, signal, WritableSignal } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CartItem } from '../../models/cart.model';

import { CommonModule } from '@angular/common';
import { OrdersService } from '../services/orders.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  cartItems: WritableSignal<CartItem[]> = signal([]);
  subtotal: Signal<number>;

  constructor(private cartService: CartService, private orderServive: OrdersService, private router: Router) {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems.set(items);
    });

    this.subtotal = computed(() => 
      this.cartItems().reduce((acc, item) => acc + item.quantity * item.product.price, 0)
    );
  }

  placeOrder() {
    this.orderServive.orderFromCart().subscribe({
      next: (data) => {
        if (data?.status === 'Success') {
          alert('Successfully Ordered');
          this.cartService.getUserCartId().subscribe({
            next : (data) => {
              sessionStorage.setItem("cartId", data.cartId);
              this.cartService.cartQtys.set(new Map<string, number>());
            }
          })
          this.router.navigate(['products']);
        } else {
          alert('Error in Ordering');
        }
      }
    });
  }

  removeFromCart(cartItemId: string, productId: string) {
    const originalItems = this.cartItems();

    // Optimistically update the local UI
    this.cartItems.update(items => items.filter(item => item.id !== cartItemId));

    this.cartService.removeFromCart(cartItemId, productId).subscribe({
      error: (err) => {
        // On error, revert the UI change
        console.error("Failed to remove item:", err);
        this.cartItems.set(originalItems);
        alert("Could not remove item from cart. Please try again. ||||||||||");
      }
    });
  }
}
