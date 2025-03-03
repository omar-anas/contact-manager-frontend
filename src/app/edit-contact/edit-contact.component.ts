import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService } from '../services/contact.service';
import { Contact } from '../models/contact.model';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css'],
  standalone:false
})
export class EditContactComponent implements OnInit {
  contactForm: FormGroup;
  contactId: number;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private socketService: SocketService,
    private route: ActivatedRoute,
    private router: Router, // Inject Router
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      notes: [''],
    });
    this.contactId = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.contactService.getContacts().subscribe((response) => {
      const contact = response.data.find((c) => c.id === this.contactId);
      if (contact) {
        this.contactForm.patchValue(contact);
      }
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.contactService
      .updateContact(this.contactId, this.contactForm.value)
      .subscribe(() => {
        this.unlockContact(this.contactId)
        this.router.navigate(['/contacts']); // Navigate back to the contact list
      });
    }
  }

  onCancel(): void {
    this.unlockContact(this.contactId)
    this.router.navigate(['/contacts']); // Navigate back to the contact list
  }


  unlockContact(id: number): void {
    this.contactService.unlockContact(id).subscribe(() => {
      this.socketService.emitUnlockContact(id);
    });
  }
}