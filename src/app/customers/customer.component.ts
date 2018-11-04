import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

import { Customer } from './customer';

/*to pass parameters to a custom validator function the custom validator function is wrapped as return function like below
  as the custom validator can only take one parameter i.e., AbstractControl */
function ratingRange(min: number, max: number): ValidatorFn { 
  return (c: AbstractControl): {[key: string]: boolean} | null{
          if(c.value != undefined && (isNaN(c.value) || c.value < min || c.value > max)) {
            return {'range': true};
          };
    return null;
  };
}
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerForm: FormGroup;
  customer = new Customer();

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.customerForm = this.fb.group({ //creates root form group
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]], //{value: 'n/a', disabled: true} can be used to set the properties of the form control
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+')]],
      phone: '',
      notification: 'email',
      rating: ['', ratingRange(1, 5)],
      sendCatalog: true      
    });  
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
}
