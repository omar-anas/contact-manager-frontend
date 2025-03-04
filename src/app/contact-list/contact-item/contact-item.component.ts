import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Contact } from '../../models/contact.model';

@Component({
  selector: 'app-contact-item',
  templateUrl: './contact-item.component.html',
  styleUrls: ['./contact-item.component.css'],
  standalone: false
})
export class ContactItemComponent {
  @Input() contact!: Contact;
  @Input() currentUser!: string;
  
  @Output() delete = new EventEmitter<number>();
  @Output() lock = new EventEmitter<number>();
  @Output() unlock = new EventEmitter<number>();
  @Output() update = new EventEmitter<Contact>();

  editMode = false;
  contactForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]],
      address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      notes: ['', Validators.maxLength(500)]
    });
  }

  toggleEdit(): void {
    if (!this.contact.isLocked || this.contact.lockedBy === this.currentUser) {
      if (!this.editMode) {
        this.lock.emit(this.contact.id);
        this.contactForm.patchValue(this.contact);
      } else {
        this.unlock.emit(this.contact.id);
      }
      this.editMode = !this.editMode;
    }
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      const updatedContact = {
        ...this.contact,
        ...this.contactForm.value
      };
      this.update.emit(updatedContact);
      this.editMode = false;
      this.unlock.emit(this.contact.id);
    }
  }

  onDelete(): void {
    this.delete.emit(this.contact.id);
  }

  canEdit(): boolean {
    return !this.contact.isLocked || this.contact.lockedBy === this.currentUser;
  }
}