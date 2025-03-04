import { Component, OnInit } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { SocketService } from '../services/socket.service';
import { Router } from '@angular/router';
import { Contact } from '../models/contact.model';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css'],
  standalone:false
})
export class ContactListComponent implements OnInit {
  dataSource: { data: Contact[]; total: number } = { data: [], total: 0 };
  pageSize = 5;
  currentPage = 1;
  currentUser = localStorage.getItem('username') || 'Unknown User';
  filters = {
    name: '',
    phone: '',
    address: ''
  };

  constructor(
    private contactService: ContactService,
    private socketService: SocketService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadContacts();
    this.listenForUpdates();
  }

  loadContacts(): void {
    this.contactService
      .getContacts(this.currentPage, this.pageSize, this.filters)
      .subscribe((response) => {
        this.dataSource = response;
      });
  }

  applyFilters(): void {
    this.currentPage = 1; // Reset to first page when filtering
    this.loadContacts();
  }

  listenForUpdates(): void {
    this.socketService.onContactLocked().subscribe((data) => {
      const contact = this.dataSource.data.find((c) => c.id === data.id);
      if (contact) {
        contact.isLocked = true;
        contact.lockedBy = data.lockedBy;
      }
    });

    this.socketService.onContactUnlocked().subscribe((data) => {
      const contact = this.dataSource.data.find((c) => c.id === data.id);
      if (contact) {
        contact.isLocked = false;
        contact.lockedBy = null;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadContacts();
  }

  openAddDialog(): void {
    this.router.navigate(['/add-contact']);
  }

  updateContact(contact: Contact): void {
    this.contactService.updateContact(contact.id, contact).subscribe(() => {
      this.loadContacts();
    });
  }

  deleteContact(id: number): void {
    if (confirm('Are you sure you want to delete this contact?')) {
      this.contactService.deleteContact(id).subscribe(() => {
        this.loadContacts();
      });
    }
  }

  lockContact(id: number): void {
    this.contactService.lockContact(id, this.currentUser).subscribe(() => {
      this.socketService.emitLockContact(id, this.currentUser);
    });
  }

  unlockContact(id: number): void {
    this.contactService.unlockContact(id).subscribe(() => {
      this.socketService.emitUnlockContact(id);
    });
  }
}
