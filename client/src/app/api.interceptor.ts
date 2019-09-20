import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    const headers = req.headers.append('Authorization', `Bearer ${token}`);
    const request = token
      ? req.clone({ url: `${environment.apiBaseUrl}/api${req.url}`, headers })
      : req.clone({ url: `${environment.apiBaseUrl}/api${req.url}` });
    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          if (error.status >= 401 && error.status < 500) {
            // window.location.href = '/login';
          }

          if (error.status >= 500) {
            //
          }
        }

        return throwError(error);
      })
    );
  }
}
