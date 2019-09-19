import { Component, OnInit } from '@angular/core';
import { ContactService } from '../contact.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {
  contactId: number;
  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    address: ['', [Validators.required]]
  });
  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap(({ id }) => {
          if (id) {
            this.contactId = id;
            return this.contactService.getContact(id);
          }
          return of(null);
        })
      )
      .subscribe(contact => {
        if (contact) {
          const { name, email, phoneNumber, address } = contact;
          this.form.patchValue({ name, email, phoneNumber, address });
        }
      });
  }

  onSubmit() {
    if (this.contactId) {
      this.contactService.updateContact(this.contactId, this.form.value).subscribe(
        () => {
          this.snackbar.open('Successfully updated contact.', 'Dismiss', { duration: 3000 });
          this.router.navigateByUrl('/contacts');
        },
        err => {
          this.snackbar.open('Please fill up all the fields properly.', 'Dismiss', { duration: 3000 });
        }
      );
    } else {
      this.contactService.addContact(this.form.value).subscribe(
        () => {
          this.snackbar.open('Successfully added contact.', 'Dismiss', { duration: 3000 });
          this.router.navigateByUrl('/contacts');
        },
        err => {
          console.log(err);
          this.snackbar.open('Please fill up all the fields properly.', 'Dismiss', { duration: 3000 });
        }
      );
    }
  }
}
