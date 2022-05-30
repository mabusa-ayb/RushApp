import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthenticationService } from 'src/app/services/authentication.service';

export function passwordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if(password && confirmPassword && password !== confirmPassword){
      return {
        passwordsDontMatch: true
      }
    }

    return null;
  }
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  signUpForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required)
  }, { validators: passwordsMatchValidator() })

  constructor(private authService: AuthenticationService, private toast: HotToastService, private router: Router) { }

  ngOnInit(): void {
  }

  get name(){
    return this.signUpForm.get('name');
  }

  get email(){
    return this.signUpForm.get('email');
  }

  get password(){
    return this.signUpForm.get('password');
  }

  get confirmPassword(){
    return this.signUpForm.get('confirmPassword');
  }

  submit(){
    if (!this.signUpForm.valid)
    return;

    const { name, email, password } = this.signUpForm.value;
    this.authService.signUp(name, email, password).pipe(
      this.toast.observe({
        success: 'Success! New Account created.',
        loading: 'Signing Up...',
        error: ({ message }) => `${message}`
      })
    ).subscribe(() => {
      this.router.navigate(['/home']);
    })
  }
}
