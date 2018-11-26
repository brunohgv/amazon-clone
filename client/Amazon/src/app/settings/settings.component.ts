import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  btnDisabled = false
  currentSettings: any

  constructor(private data: DataService, private api: RestApiService) { }

  async ngOnInit() {
    try {
      if(!this.data.user) {
        await this.data.getProfile()
      }
      this.currentSettings = Object.assign({
        newPassword: '',
        passwordConfirm: ''
      }, this.data.user)
    } catch (err) {
      this.data.error(err)
    }
  }

  validate(settings){
    if(settings['name']) {
      if(settings['email']) {
        if(settings['newPassword']) {
          if(settings['passwordConf']) {
            if(settings['passwordConf'] === settings['newPassword']) {
              return true
            } else {
              this.data.error("Passwords do ot match.")
            }
          } else {
            this.data.error("Password confirmation is empty")
          }
        } else {
          this.data.error("Password is empty")
        }
      } else {
        this.data.error("Email is empty")
      }
    } else {
      this.data.error("Name is empty")
    }
  }

  async update () {
    this.btnDisabled = true
    try {
      if(this.validate(this.currentSettings)) {
        const data = await this.api.post('htpp://localhost:3030/api/accounts/profile', {
          name: this.currentSettings['name'],
          email: this.currentSettings['email'],
          password: this.currentSettings['newPassword'],
          isSeller: this.currentSettings['isSeller']
        })
        
        data['success']
        ? (this.data.getProfile(), this.data.success(data['message']))
        : this.data.error(data['message'])
      }
    } catch (err) {
      this.data.error(err['message'])
    }
    this.btnDisabled = false
  }
}
