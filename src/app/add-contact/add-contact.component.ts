import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../services/contact.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css'],
  standalone:false
})
export class AddContactComponent {
  contactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private router: Router
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]],
      address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      notes: ['', Validators.maxLength(500)],
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.contactService.addContact(this.contactForm.value).subscribe(() => {
        this.router.navigate(['/contacts']); 
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/contacts']); 
  }
}