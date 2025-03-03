import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactListComponent } from './contact-list/contact-list.component';
import { AddContactComponent } from './add-contact/add-contact.component';
import { EditContactComponent } from './edit-contact/edit-contact.component';

const routes: Routes = [
  { path: '', redirectTo: '/contacts', pathMatch: 'full' }, // Default route
  { path: 'contacts', component: ContactListComponent }, // Contact list route
  { path: 'add-contact', component: AddContactComponent }, // Add contact route
  { path: 'edit-contact/:id', component: EditContactComponent }, // Edit contact route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}