import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact.model';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private apiUrl = 'http://localhost:5000/contacts'; 

  constructor(private http: HttpClient) {}

  getContacts(page: number = 1, limit: number = 5, filters?: { name?: string; phone?: string; address?: string }): Observable<{ data: Contact[]; total: number }> {
    let params = `page=${page}&limit=${limit}`;
    if (filters) {
      if (filters.name) params += `&name=${filters.name}`;
      if (filters.phone) params += `&phone=${filters.phone}`;
      if (filters.address) params += `&address=${filters.address}`;
    }
    return this.http.get<{ data: Contact[]; total: number }>(
      `${this.apiUrl}?${params}`,
    );
  }

  addContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.apiUrl, contact);
  }

  updateContact(id: number, contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}/${id}`, contact);
  }

  deleteContact(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  lockContact(id: number, lockedBy: string): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}/${id}/lock`, { lockedBy });
  }

  unlockContact(id: number): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}/${id}/unlock`, {});
  }
}