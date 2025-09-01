import { Component, computed, input, Signal } from '@angular/core';
import { ProductDetails } from '../../models/product.models';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-product',
  imports: [CommonModule, RouterLink],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  product = input.required<ProductDetails>();
  
  qty: Signal<number>;

  constructor(public cartService : CartService, private userService : UsersService) { // Made public for easier template access if needed
    this.qty = computed(() => {
      const cartMap = this.cartService.cartQtys();
      const productId = this.product()?.id;
      if (cartMap && productId) {
        return cartMap.get(productId) || 0;
      }
      
      return 0;
    });
  }

  increment(){
    this.cartService.addToCart({productId:this.product().id, quantity: this.qty() + 1});
  }
  decrement(){
    this.cartService.addToCart({productId:this.product().id, quantity: this.qty() - 1});
  }

  addProductToCart() {
    this.cartService.addToCart({productId:this.product().id, quantity: 1});
  }

  removeFromCart() {
    this.cartService.addToCart({productId:this.product().id, quantity: 0});
  }
}
