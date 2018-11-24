import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPageScan } from './login-scan';

@NgModule({
  declarations: [
    LoginPageScan,
  ],
  imports: [
    IonicPageModule.forChild(LoginPageScan),
  ],
})
export class LoginPageModule {}
