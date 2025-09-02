import { HttpClient } from '@angular/common/http';
import { computed, effect, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CartItem } from '../../models/cart.model';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  api = "https://localhost:44394/api/Cart";

  cartQtys = signal<Map<string, number>>(new Map<string, number>());

  counter = 0;

  constructor(private http: HttpClient, private userService: UsersService) {
    console.log(Math.random());
    // if(!userService.isAuthenticated()) {
    //   return;
    // }

    effect(() => {
      if (!this.userService.isAuthenticated() || this.userService.userRole() == "Seller") {
        this.cartQtys.set(new Map<string, number>());
        return; // Exit early if the user is not authenticated
      }
  
      // Fetch user cart quantities
      this.getUserCartQtys().subscribe(qtys => {
        const map = new Map(Object.entries(qtys));
        this.cartQtys.set(map);
      });
  
      // Fetch user cart ID
      this.getUserCartId().subscribe({
        next: (data) => {
          if (data && data.cartId) {
            console.log("THIS IS FROM GET USER CART ID", this.counter++);
            sessionStorage.setItem("cartId", data.cartId);
          } else {
            console.warn("No cart ID found in response.");
          }
        }
      });
    })
  }

  addToCart(cartData: { productId: string, quantity: number }): void {
    const currentMap = this.cartQtys();
    
    // Optimistic UI update
    this.cartQtys.update(currentMap => {
      const newMap = new Map(currentMap);
      newMap.set(cartData.productId, cartData.quantity);
      return newMap;
    });

    this.http.post<{ isSucceeded: true | false }>(this.api, cartData, {}).subscribe({
      error: (err) => {
        // Rollback on error
        console.error("Failed to update cart", err);
        this.cartQtys.set(currentMap); // Revert to the original state
      }
    });
  }

  removeFromCart(cartItemId: string, productId: string): Observable<any> {
    return this.http.delete<boolean>(`${this.api}/${cartItemId}`).pipe(
      tap((res) => {
        if (res === true) {
          // On success, update the signal that tracks quantities by product ID
          this.cartQtys.update(currentMap => {
            const newMap = new Map(currentMap);
            newMap.delete(productId);
            return newMap;
          });
        } else {
          // Manually trigger an error if the backend indicates failure
          throw new Error('Backend failed to delete the item.');
        }
      })
    );
  }

  getCartItems(): Observable<CartItem[]> {
    const cartId = sessionStorage.getItem("cartId");
    console.log("THIS IS FROM GET CART ITEMS", cartId, this.counter++);
    return this.http.get<CartItem[]>(`${this.api}/${cartId}`, {});
  }

  getUserCartId(): Observable<any> {
    return this.http.get(`${this.api}/user/fromapp`)
  }

  getUserCartQtys(): Observable<Map<string, number>> {
    return this.http.get<Map<string, number>>(`${this.api}/qtyProducts`, {});
  }

  getQtyMap() {
    return this.cartQtys;
  }

  getQtyOfProduct(id: string) {
    return this.cartQtys().get(id) || 0;
  }

  setQtyOfProduct(id: string, magnitude: number) {
    // const CurrentQty = this.cartQtys().get(id) || 0;
    // if (CurrentQty + magnitude < 0) {
    //   return false;
    // }
    // return false;
  }
}
