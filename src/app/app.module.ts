import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { HomePageScan } from '../pages/home-scan/home-scan';

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
import { ScanMonitorProvider } from '../providers/scan-monitor/scan-monitor';



const firebaseConfig = {
  apiKey: "AIzaSyAq6P4eZJLp6cj1_zseF4N8Ouxj5kFZSWQ",
  authDomain: "blueon-dbf11.firebaseapp.com",
  databaseURL: "https://blueon-dbf11.firebaseio.com",
  projectId: "blueon-dbf11",
  storageBucket: "blueon-dbf11.appspot.com",
  messagingSenderId: "271111022906"
};

@NgModule({
  declarations: [
    MyApp,
    HomePageScan
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
    HomePageScan
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ScanMonitorProvider,
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

