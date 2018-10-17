import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { IBeacon } from '@ionic-native/ibeacon';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import {OpenNativeSettings} from "@ionic-native/open-native-settings";
import { BeaconMonitorProvider } from '../providers/beacon-monitor/beacon-monitor';



const firebaseConfig = {
  apiKey: "AIzaSyA6aDT1tJslnXmz-Txitt3JzZBxVX7C-Fg",
  authDomain: "blueon-beacons.firebaseapp.com",
  databaseURL: "https://blueon-beacons.firebaseio.com",
  projectId: "blueon-beacons",
  storageBucket: "blueon-beacons.appspot.com",
  messagingSenderId: "790642989381"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BeaconMonitorProvider,
    IBeacon,
    LocalNotifications,
    InAppBrowser,
    BackgroundMode,
    Facebook,
    GooglePlus,
    OpenNativeSettings,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

