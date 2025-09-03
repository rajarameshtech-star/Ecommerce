import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductDetails, ProductInfo } from '../../models/product.models';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  api=environment.apiBaseUrl + "Products";
  constructor(private http:HttpClient) { }

  getProducts(searchString?: string, minPrice?: number, maxPrice?: number, pageSize?: number, pageNumber?: number, sellerId?: string): Observable<ProductDetails[]> {
    let params = new HttpParams();
    if (searchString) {
      params = params.append('searchString', searchString);
    }
    if (minPrice !== undefined && minPrice !== null) {
      params = params.append('minPrice', minPrice.toString());
    }
    if (maxPrice !== undefined && maxPrice !== null) {
      params = params.append('maxPrice', maxPrice.toString());
    }
    if (pageSize !== undefined && pageSize !== null) {
      params = params.append('pageSize', pageSize.toString());
    }
    if (pageNumber !== undefined && pageNumber !== null) {
      params = params.append('pageNumber', pageNumber.toString());
    }
    if (sellerId) {
      params = params.append('sellerId', sellerId);
    }

    return this.http.get<ProductDetails[]>(this.api, { params });
  }

  getProductId(id:string):Observable<ProductInfo>{
    return this.http.get<ProductInfo>(`${this.api}/${id}`, {});
  }

  updateProduct(product: ProductDetails): Observable<string> {
    return this.http.patch<string>(`${this.api}/${product.id}`, product, {responseType:"text" as "json"});
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }

  addProduct(product:ProductDetails):Observable<any> {
    return this.http.post(this.api,product,{responseType:"text" as "json"});
  }
}
