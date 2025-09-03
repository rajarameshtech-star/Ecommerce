import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { loginDto, registerDto } from '../../models/user.models';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private _isAuthenticated = signal<boolean>(this.hasToken());
  private _role = signal<string | null>(localStorage.getItem('role'));

  userRole = this._role.asReadonly();

  isAuthenticated = this._isAuthenticated.asReadonly();

  hasToken(): boolean {
    return localStorage.getItem('jwt') !== null;
  }

  private apiUrl = environment.apiBaseUrl + 'Auth/';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient, private router:Router) {}

  registerUser(userData: registerDto): Observable<any> {
    return this.http.post(this.apiUrl + "register", userData, this.httpOptions).pipe(
      tap(response => {
        // Log successful registration
        console.log('User registration successful:', response);
      })
    );
  }

  loginUser(loginDetails:loginDto):Observable<{success:boolean, expiresAt:string, jwt: string, roles : string[]}> {
    return this.http.post<{success:boolean, expiresAt:string, jwt: string, roles : string[]}>(this.apiUrl + "login", loginDetails, this.httpOptions ).pipe(
      tap(response => {
        console.log("User successfully logged in ", response);
        this._role.set( response.roles[0] );
        localStorage.setItem("expiresAt", response.expiresAt);
        localStorage.setItem("role", response.roles[0]);
        this._isAuthenticated.set(true);
        this.checkTokenExpiry(response.expiresAt);
      })
    );
  }

  logoutUser(): void {
    localStorage.clear();
    sessionStorage.clear();
    this._isAuthenticated.set(false);
    console.log("User logged out successfully");
    this.router.navigate(['/login']);
  }

  checkTokenExpiry(expiresAt:string) {
    // const expiresAt = localStorage.getItem('expiresAt');
    if (!expiresAt) return;
  
    const expiryTime = new Date(expiresAt).getTime();
    const currentTime = Date.now();
    const timeout = expiryTime - currentTime;
  
    if (timeout <= 0) {
      alert("Session TimedOut, Logged Out of the Device");
      this.logoutUser(); // Already expired
    } else {
      setTimeout(() => {
        alert("Session TimedOut, Logged Out of the Device");
        this.logoutUser(); // Auto logout when time is up
      }, timeout);
    }
  }

}
