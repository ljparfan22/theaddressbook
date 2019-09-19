import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phoneNumber: ['', Validators.required]
  });
  constructor(private fb: FormBuilder, private authService: AuthService, private snackbar: MatSnackBar) {}

  ngOnInit() {}

  onSubmit() {
    this.authService.register(this.form.value).subscribe(
      res => {
        this.snackbar.open('Successfully registered!.', 'Dismiss', { duration: 3000 });
      },
      err => {
        if (err) {
          console.log(err);
          this.snackbar.open(err.error.message, 'Dismiss', { duration: 3000 });
        }
      }
    );
  }
}
