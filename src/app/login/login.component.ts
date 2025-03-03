import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      
      this.http.post('http://localhost:5000/auth/login', { username, password })
        .subscribe({
          next: (response: any) => {
            localStorage.setItem('username', response.user.data.username);
            localStorage.setItem('userId', response.user.data.id);
            this.router.navigate(['/contacts']);
          },
          error: (error) => {
            if (error.status === 404) {
              this.errorMessage = 'Invalid username or password';
            } else {
              this.errorMessage = 'An error occurred during login';
            }
          }
        });
    }
  }
}