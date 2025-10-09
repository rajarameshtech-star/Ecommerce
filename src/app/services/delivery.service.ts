import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  baseUrl = environment.apiBaseUrl;
  apiUrl = `${this.baseUrl}/deliveries`;
  authUrl = `${this.baseUrl}/auth`;
  constructor(private http:HttpClient) {

   }

   // register
   

  //  register(dto:RegisterDto):Observable<{data:any}>{
  //     return this.http.post<{data:any}>(`${this.authUrl}/register`, dto );
  //  }

   register(dto: RegisterDto):Observable<{data:any}> {
    return this.http.post<{data:any}>(`${this.authUrl}/register`, dto);
  }
 

   // login

   // get deliveries addresses

   // get delivery address

   // change delivery status
}
