import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ContactsComponent } from './contacts/contacts.component';
import { AuthGuard } from './auth/auth.guard';
import { AnonGuard } from './auth/anon.guard';

const routes: Routes = [
  { path: '', redirectTo: 'contacts', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AnonGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [AnonGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
