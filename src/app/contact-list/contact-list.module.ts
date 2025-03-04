import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactItemComponent } from './contact-item/contact-item.component';

@NgModule({
  declarations: [ContactItemComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [ContactItemComponent]
})
export class ContactListModule { }