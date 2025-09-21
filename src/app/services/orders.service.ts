import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Order, OrderSortEnum } from '../../models/order.models';
import { environment } from '../../environments/environment';

interface OrderResponse {
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  api = environment.apiBaseUrl + "orders";

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
    pageSize: number=30, 
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


  getSellerOrders(
    data : {
      startDate?: string,
      endDate?: string
      orderStatus?: string,
      paymentStatus? : string,
      pageSize?: number, 
      pageNumber?: number,
      sortBy?: OrderSortEnum,
      reverse?: boolean,
      productId : string | null
    }
  ) {
    let params = new HttpParams();

    if(data.productId != null) {
      params = params.append("productId", data.productId);
    }

    if(data.startDate!=undefined && data.startDate!=null) {
      params = params.append("startDate", data.startDate);
    }

    if(data.reverse) {
      params = params.append("reverse", data.reverse.toString());
    }

    if(data.endDate!=undefined && data.endDate!=null) {
      params = params.append("endDate", data.endDate);
    }

    if(data.sortBy!=undefined && data.sortBy!=null) {
      params = params.append("sortBy", data.sortBy);
    }

    if(data.orderStatus != undefined && data.orderStatus != null) {
      params = params.append("orderStatus", data.orderStatus);
    }

    if(data.paymentStatus != undefined && data.paymentStatus != null) {
      params = params.append("paymentStatus", data.paymentStatus);
    }

    if(data.pageSize && data.pageSize > 0) {
      params = params.append("pageSize", data.pageSize.toString());
    }

    if(data.pageNumber && data.pageNumber > -1) {
      params = params.append("pageNumber", data.pageNumber.toString());
    }


    return this.http.get<Order[]>(this.api + "/seller/", { params });
  }

  updateOrderStatus(orderId: string, orderStatus: string, paymentStatus: string): Observable<any> {
    const url = `${this.api}/${orderId}`;
    return this.http.patch(url, { status:orderStatus, paymentStatus });  
  }

  updatePaymentMethod(orderId: string, paymentData: any): Observable<any> {
    const url = `${this.api}/cart/${orderId}/payment/method`;
    return this.http.put(url, paymentData);
  }

  getSellerSummary(): Observable<{pending: number, shipped: number, delivered: number, outForDelivery: number, lateDeliveries: number, settledEarnings: number, settledEarningsThisMonth: number, settledEarningsThisYear: number, pendingAmount: number, totalProducts: number}> {
    return this.http.get<{pending: number, shipped: number, delivered: number, outForDelivery: number, lateDeliveries: number, settledEarnings: number, settledEarningsThisMonth: number, settledEarningsThisYear: number, pendingAmount: number, totalProducts: number}>(`${this.api}/seller/summary`);
  }

}
