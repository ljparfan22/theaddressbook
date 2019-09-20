import { Component, OnInit } from '@angular/core';
import { ContactService } from '../contact.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { convertToSnakeCase } from 'src/app/utils/casing-converter';
import _ from 'lodash';
import faker from 'faker';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {
  contactId: number;
  imageSrc: string;
  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    image: [null],
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

  populateFormWithTestData() {
    this.form.patchValue({
      name: faker.name.findName(),
      email: faker.internet.email(),
      phoneNumber: faker.phone.phoneNumberFormat(),
      address: faker.address.city()
    });
  }
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
          const { name, email, phoneNumber, address, image } = contact;
          this.imageSrc = image;
          this.form.patchValue({ name, email, phoneNumber, address });
        }
      });
  }

  onSubmit() {
    const contact = {
      ...this.form.value
    };
    if (contact.image && contact.image.files && contact.image.files.length > 0) {
      contact.image = contact.image.files[0];
    }
    let formData = new FormData();
    for (const key in convertToSnakeCase(contact)) {
      if (contact.hasOwnProperty(_.camelCase(key))) {
        formData.append(key, contact[_.camelCase(key)]);
      }
    }
    if (this.contactId) {
      if (!contact.image) {
        formData.delete('image');
      }
      this.contactService.updateContact(this.contactId, formData).subscribe(
        () => {
          this.snackbar.open('Successfully updated contact.', 'Dismiss', { duration: 3000 });
          this.router.navigateByUrl('/contacts');
        },
        err => {
          this.snackbar.open('Please fill up all the fields properly.', 'Dismiss', { duration: 3000 });
        }
      );
    } else {
      if (!contact.image) {
        formData.delete('image');
        formData = convertToSnakeCase(contact);
      }
      this.contactService.addContact(formData).subscribe(
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
