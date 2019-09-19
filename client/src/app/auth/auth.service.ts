import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import _ from 'lodash';
import { tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from './user.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { convertToCamelCase, convertToSnakeCase } from '../utils/casing-converter';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private jwtHelper = new JwtHelperService();
  // tslint:disable-next-line: variable-name
  private _user: BehaviorSubject<User> = new BehaviorSubject(null);
  constructor(private http: HttpClient, private router: Router) {}

  public get user(): Observable<User> {
    const token = localStorage.getItem('token');
    return this._user.pipe(
      switchMap(user => {
        if (user) {
          return of(user);
        }
        return of(token ? convertToCamelCase(this.jwtHelper.decodeToken(token)) : null);
      })
    );
  }

  login(username, password) {
    return this.http.post<{ token: string }>('/auth/login', { username, password }).pipe(
      tap(({ token }) => {
        localStorage.setItem('token', token);
        const decodedToken = this.jwtHelper.decodeToken(token);
        this._user.next(convertToCamelCase(decodedToken));
      })
    );
  }
  register = user =>
    this.http.post(
      '/auth/register',
      convertToSnakeCase(user)
      // tslint:disable-next-line: semicolon
    );

  signOut() {
    localStorage.removeItem('token');
    this._user.next(null);
  }
}
