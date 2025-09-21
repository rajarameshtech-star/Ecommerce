import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Address } from '../../models/user.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressesService {
  private http = inject(HttpClient);

  baseUrl = environment.apiBaseUrl;

  getAddresses() {
    return this.http.get<Address[]>(`${this.baseUrl}Addresses`);
  }

  getAddress(id: string) {
    return this.http.get<Address>(`${this.baseUrl}Addresses/${id}`);
  }

  addAddress(address: Omit<Address, 'id'>) {
    return this.http.post(`${this.baseUrl}Addresses`, address);
  }

  updateAddress(id: string, address: Address) {
    return this.http.put(`${this.baseUrl}Addresses/${id}`, address);
  }

  updateCartAddress(cartId : string, addressId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}cart/update-address`, { cartId, addressId });
  }

  deleteAddress(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}Addresses/${id}`);
  }
}