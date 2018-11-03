import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { Customer } from './customer';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerForm: FormGroup;
  customer = new Customer();

  constructor() { }

  ngOnInit(): void {
    this.customerForm = new FormGroup({ //creates root form group
      firstName: new FormControl(),
      lastName: new FormControl(),
      email: new FormControl(),
      sendCatalog: new FormControl(true)
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
}
