import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {}

  onSubmit() {
    const { username, password } = this.form.value;
    this.authService.login(username, password).subscribe(
      () => {
        this.snackbar.open('Successfully logged in.', 'Dismiss', { duration: 3000 });
        this.router.navigateByUrl('/');
      },
      err => {
        if (err) {
          this.snackbar.open('Invalid username / password.', 'Dismiss', { duration: 3000 });
        }
      }
    );
  }
}
