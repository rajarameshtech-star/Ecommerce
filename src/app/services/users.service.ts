import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { loginDto, registerDto } from '../../models/user.models';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private _isAuthenticated = signal<boolean>(this.hasToken());

  isAuthenticated = this._isAuthenticated.asReadonly();

  hasToken(): boolean {
    return localStorage.getItem('jwt') !== null;
  }

  private apiUrl = 'https://localhost:44394/api/Auth/';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  registerUser(userData: registerDto): Observable<any> {
    return this.http.post(this.apiUrl + "register", userData, this.httpOptions).pipe(
      tap(response => {
        // Log successful registration
        console.log('User registration successful:', response);
      })
    );
  }

  loginUser(loginDetails:loginDto):Observable<any> {
    return this.http.post(this.apiUrl + "login", loginDetails, this.httpOptions ).pipe(
      tap(response=>{
        console.log("User successfully logged in ", response);
        this._isAuthenticated.set(true);
      })
    );
  }

  logoutUser(): void {
    localStorage.clear();
    sessionStorage.clear();
    this._isAuthenticated.set(false);
    console.log("User logged out successfully");
  }

}
