import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ContactService } from '../contacts/contact.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy {
  user: User;
  userSubscription: Subscription;
  form: FormGroup = this.fb.group({
    value: ['']
  });
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private fb: FormBuilder,
    private contactService: ContactService
  ) {}

  ngOnInit() {
    this.userSubscription = this.authService.user.subscribe(user => (this.user = user));
    this.form.get('value').valueChanges.subscribe(value => {
      this.contactService.filterContacts(value);
    });
  }

  signOut() {
    this.authService.signOut();
    this.router.navigateByUrl('/login');
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
