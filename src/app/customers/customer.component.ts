import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { Customer } from './customer';

/*to pass parameters to a custom validator function the custom validator function is wrapped as return function like below
  as the custom validator can only take one parameter i.e., AbstractControl */
function ratingRange(min: number, max: number): ValidatorFn { 
  return (c: AbstractControl): { [key: string]: boolean} | null => {
          if(c.value != undefined && (isNaN(c.value) || c.value < min || c.value > max)) {
            return {'range': true};
          }
    return null;
  };
}

function emailMatcher(c: AbstractControl): { [key: string]: boolean} | null {
    let emailControl = c.get('email');
    let confirmEmailControl = c.get('confirmEmail');
    if(emailControl.pristine || confirmEmailControl.pristine) { //lets not validate until user has typed anything i.e., not until touched property is true
        return null;
    }
    if(emailControl.value === confirmEmailControl.value) {
        return null;
    }
    return {'match' : true};
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerForm: FormGroup;
  customer = new Customer();
  emailMessage: string;

  get addresses(): FormArray {
    return <FormArray>this.customerForm.get('addresses');
  }

  private validationMessages = {
    required: 'Please enter your email address.',
    pattern: 'Please enter a valid email address.'
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.customerForm = this.fb.group({ //creates root form group
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]], //{value: 'n/a', disabled: true} can be used to set the properties of the form control
      emailGroup: this.fb.group({
        email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+')]],
        confirmEmail: ['', Validators.required],
      }, {validator: emailMatcher}),      
      phone: '',
      notification: 'email',
      rating: ['', ratingRange(1, 5)],
      sendCatalog: true, 
      addresses: this.fb.array([ this.buildAdress() ])
    });  

    this.customerForm.get('notification').valueChanges.subscribe(value => this.setNotification(value));

    const emailControl = this.customerForm.get('emailGroup.email');
    emailControl.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(value => this.setMessage(emailControl));
  }

  addAddress(): void {
    this.addresses.push(this.buildAdress());
  }

  buildAdress(): FormGroup {
    return this.fb.group({
      addressType: 'home',
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip: ''
    })
  }

  populateTestData(): void {
    /* // setValue demo
    this.customerForm.setValue({ //setValue == requires to set all the values of the form group
      firstName: 'Jack',
      lastName: 'Harkness',
      email: 'jack@torchwood.com',
      sendCatalog: false
    })
    */
    this.customerForm.patchValue({ //patchValue == can only set required values of the form group
      firstName: 'Jack',
      lastName: 'Harkness',
      sendCatalog: false,
    })
  }

  save() {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm));
  }

  setNotification(notifyVia: string): void {
    const phoneContol = this.customerForm.get('phone');
    if(notifyVia === 'text') {
      phoneContol.setValidators(Validators.required);
    } else {
      phoneContol.clearValidators();
    }
    phoneContol.updateValueAndValidity();
  }

  setMessage(c: AbstractControl): void {
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {          
          this.emailMessage = Object.keys(c.errors).map(key => 
                                this.validationMessages[key]).join(' ');
    }
  }
}
