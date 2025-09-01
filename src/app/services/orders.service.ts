import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Order } from '../../models/order.models';
import { start } from '@popperjs/core';


interface OrderResponse {
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  api = "https://localhost:44394/api/orders";

  constructor(private http:HttpClient) {  }


  addToCart() {
    // return this.http.post(`${this.api}/`)
  }

  
  orderFromCart(): Observable<OrderResponse | null> {
    const cartId = sessionStorage.getItem('cartId');

    if (!cartId) {
      console.error('Cart ID not found in session storage.');
      return of(null);
    }

    const url = `${this.api}/${cartId}`;
    return this.http.post<OrderResponse>(url, {}).pipe(
      catchError(error => {
        console.error('Error calling orderFromCart API:', error);
        return of(null);
      })
    );
  }


  getOrders(
    startDate?: string,
    endDate?: string,
    sellerId?: string,
    orderStatus?: string,
    paymentStatus? : string,
    pageSize?: number, 
    pageNumber: number=1,

  ): Observable<Order[]> {

    let params = new HttpParams();

    if(startDate!=undefined && startDate!=null && endDate != undefined && endDate != null) {
      params = params.append("startDate", startDate);
      params = params.append("endDate", endDate);
    }

    if(sellerId != undefined && sellerId != null) {
      params = params.append("sellerId" , sellerId);
    }

    if(orderStatus != undefined && orderStatus != null) {
      params = params.append("orderStatus", orderStatus);
    }

    if(paymentStatus != undefined && paymentStatus != null) {
      params = params.append("paymentStatus", paymentStatus);
    }

    if(pageSize && pageSize > 0) {
      params = params.append("pageSize", pageSize.toString());
    }

    if(pageNumber && pageNumber > -1) {
      params = params.append("pageNumber", pageNumber.toString());
    }


    return this.http.get<Order[]>(this.api + "/user", { params });
  }



}
