import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactsComponent } from './contacts.component';
import { AuthGuard } from '../auth/auth.guard';
import { ContactDetailComponent } from './contact-detail/contact-detail.component';
import { ContactFormComponent } from './contact-form/contact-form.component';

const routes: Routes = [
  {
    path: 'contacts',
    component: ContactsComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'new',
        component: ContactFormComponent,
        canActivate: [AuthGuard]
      },
      {
        path: ':id',
        component: ContactDetailComponent,
        canActivate: [AuthGuard]
      },
      {
        path: ':id/edit',
        component: ContactFormComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactsRoutingModule {}
