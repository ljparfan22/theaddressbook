import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, switchMap, map, take } from 'rxjs/operators';
import { convertToCamelCase, convertToSnakeCase } from '../utils/casing-converter';

@Injectable({ providedIn: 'root' })
export class ContactService {
  // tslint:disable-next-line: variable-name
  private _contacts: BehaviorSubject<any[]> = new BehaviorSubject([]);
  // tslint:disable-next-line: variable-name
  private _selectedContact: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(private http: HttpClient) {}

  public get contacts(): Observable<any[]> {
    return this._contacts.asObservable();
  }

  public get selectedContact(): Observable<any> {
    return this._selectedContact.asObservable();
  }

  public fetchContacts() {
    return this.http.get<any[]>('/contacts/').pipe(
      tap(contacts => {
        this._contacts.next(contacts.map(contact => convertToCamelCase(contact)));
        return of(null);
      })
    );
  }

  public addContact(contact: any) {
    contact.image = null;
    let contactsInStore = [];
    return this._contacts.pipe(
      take(1),
      switchMap(contacts => {
        contactsInStore = contacts;
        return this.http.post<any>('/contacts/', { ...convertToSnakeCase(contact) });
      }),
      map(result => {
        this._contacts.next([...contactsInStore, convertToCamelCase(result)]);
        return convertToCamelCase(result);
      })
    );
  }

  public getContact(id: number) {
    return this.http.get<any>(`/contacts/${id}/`).pipe(
      switchMap(contact => {
        this._selectedContact.next(convertToCamelCase(contact));
        return this.selectedContact;
      })
    );
  }

  public updateContact(id: number, contact: any) {
    let updatedContact: any;
    return this.http.patch<any>(`/contacts/${id}/`, { ...convertToSnakeCase(contact) }).pipe(
      switchMap(updatedContactInDb => {
        updatedContact = updatedContactInDb;
        return this._contacts;
      }),
      take(1),
      tap(contacts => {
        const updatedContactList = contacts.map(contactItemInStore => {
          if (parseInt(contactItemInStore.id, 0) === parseInt(id + '', 0)) {
            contactItemInStore = { ...updatedContact };
          }
          return convertToCamelCase(contactItemInStore);
        });
        this._contacts.next(updatedContactList);
      })
    );
  }
  public deleteContact(id: number) {
    return this.http.delete<any>(`/contacts/${id}/`).pipe(
      switchMap(() => {
        return this._contacts;
      }),
      take(1),
      tap(contacts => {
        const updatedContactList = contacts.filter(c => parseInt(c.id, 0) !== parseInt(id + '', 0));
        this._contacts.next(updatedContactList.map(c => convertToCamelCase(c)));
      })
    );
  }
}
