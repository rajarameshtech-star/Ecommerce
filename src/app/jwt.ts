import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let jwt = localStorage.getItem("jwt");
    if(jwt) {
        const newReq = request.clone(
            {
                headers: request.headers.set("Authorization", jwt ? `Bearer ${jwt}` : "")
            }
        );
        return next.handle(newReq).pipe(
            tap(event => {
            })
        );
    }
    return next.handle(request).pipe(
      tap(event => {
      })
    );
  }
}