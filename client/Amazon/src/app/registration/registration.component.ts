import { Component, OnInit } from '@angular/core';

import { RestApiService } from '../rest-api.service'
import { DataService } from '../data.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  name = ''
  email = ''
  password = ''
  passwordConf = ''
  isSeller = false

  btnDisabled = false

  constructor(private router: Router, private api: RestApiService, private data: DataService) { }

  ngOnInit() {
  }

  validate() {
    if (this.name) {
      if (this.email){
        if (this.password){
          if (this.passwordConf) {
            if(this.password === this.passwordConf){
              return true
            } else {
              this.data.error('Password do not match')
            }
          } else {
            this.data.error('Password confirmation is not entered')
          }
        } else {
          this.data.error('Password is not entered')
        }
      } else {
        this.data.error('Email is not enteded')
      }
    } else {
      this.data.error('Name is not entered')
    }
  }

  async register() {
    this.btnDisabled = true;
    try {
      if(this.validate()){
        const data = await this.api.post('http://localhost:3030/api/accounts/signup', {
          name: this.name,
          email: this.email,
          password: this.password,
          isSeller: this.isSeller
        })
        if(data['success']) {
          localStorage.setItem('token', data['token'])
          this.data.success('Registration Successfull')
        } else {
          this.data.error(data['message'])
        }
      }
    } catch (error) {
      this.data.error(error.message)
    }
    this.btnDisabled = false
  }
}
