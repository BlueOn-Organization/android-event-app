import { Component, NgZone} from '@angular/core';
import {AlertController, Platform,NavController} from 'ionic-angular';
import {Beacon} from "../../app/beacon.model";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {url} from "../../app/uuid.config";
import {ScanMonitorProvider} from "../../providers/scan-monitor/scan-monitor";
import { AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Observable} from "rxjs";
import {BackgroundMode} from "@ionic-native/background-mode";
import {LocalNotifications} from "@ionic-native/local-notifications";
import { IBeacon } from '@ionic-native/ibeacon';
import {OpenNativeSettings} from "@ionic-native/open-native-settings";
import {AngularFireAuth} from "angularfire2/auth";
import {Storage} from "@ionic/storage";

@Component({
  selector: 'page-home',
  templateUrl: 'home-scan.html'
})
export class HomePageScan {
  new_beacons: Beacon[] = [];
  beaconsBD: Beacon[] = [];
  beaconNotifi: Beacon[] = [];
  private beaconCollection: AngularFirestoreCollection<any>;
  beacons: Observable<Beacon[]>;

  constructor(
    private afs: AngularFirestore,
    private monitor: ScanMonitorProvider,
    private ngzone: NgZone,
    private iab: InAppBrowser,
    private backgroundMode: BackgroundMode,
    private ibeacon: IBeacon,
    private afAuth: AngularFireAuth,
    private openNativeSettings: OpenNativeSettings,
    private alert: AlertController,
    public platform: Platform,
    private localNotifications: LocalNotifications,
    public navCtrl: NavController,
    public storage: Storage,
  ) {
    if(platform.is('android')){
      backgroundMode.setDefaults({
        title: 'Monitor de dispositivos activo',
        text: 'Se te notificara cuando algun dispositivo es detectado.'
      });
    }

    this.beaconCollection = this.afs.collection('Beacons');
    this.beacons = this.beaconCollection.valueChanges();
    this.beacons.subscribe(info =>{
      this.beaconsBD = [];
      info.forEach(beacon => {
        this.beaconsBD.push(beacon);
      })
      this.monitoInit();
      console.log('Beacons:',this.beaconsBD.length)
    });

    this.platform.ready().then(info =>{
      this.localNotifications.on('click').subscribe((info)=>{
        //console.log(info.data.url);
        const browser = this.iab.create(info.data.url);
        browser.show();
      })
    });
  }


  ionViewWillLoad() {
    this.checkBluetoothEnabled();
    this.monitoInit();
  }


  checkBluetoothEnabled() {
    this.ibeacon.isBluetoothEnabled().then(enabled => {
      if (!enabled) {
        if(this.platform.is('android')){
          this.alertAndroid();
        }else{
          this.alertIos();
        }
      }
    });
  }

  alertAndroid(){
    this.alert.create({
      enableBackdropDismiss: false,
      subTitle: 'El Bluetooth está desactivado, debes activarlo para poder continuar.',
      buttons: [{
        text: 'Activar',
        role: 'cancel',
        handler: () => this.openSettings()
      }]
    }).present();
  }

  alertIos(){
    this.alert.create({
      enableBackdropDismiss: false,
      subTitle: 'El Bluetooth está desactivado, debes activarlo para poder continuar.',
      buttons: [{
        text: 'Validar',
        role: 'cancel',
        handler: () => this.checkBluetoothEnabled()
      }]
    }).present();
  }

  openSettings(){
    this.openNativeSettings.open("bluetooth");
  }



  monitoInit(){
    this.backgroundMode.enable();
    let cont = 0;
    this.monitor.search().subscribe(nearby_beacons => {
      this.ngzone.run(() => {
        cont++;
        if (cont == 15) {
          this.new_beacons = [];
          cont = 0;
        }

        nearby_beacons.forEach(beacon => {
          if (this.beaconsBD.findIndex(b => b.cid === beacon.cid) != -1 && this.new_beacons.findIndex(b => b.cid === beacon.cid) == -1) {

            this.beaconsBD.forEach(b =>{
              if(b.cid === beacon.cid){
                this.new_beacons.push(b);
              }
            });

            if(this.beaconNotifi.findIndex(b => b.cid === beacon.cid) == -1 ){
              this.beaconNotifi.push(beacon);
              this.beaconsBD.forEach(b =>{
                if(b.cid === beacon.cid){
                  this.showNotification(b, beacon.minor);
                }
              });
            }
          }
        })
      });
    });
  }



  openLink(beacon: Beacon){
    this.beaconsBD.forEach(b =>{
      if(b.cid === beacon.cid){
        const browser = this.iab.create(b.url);
        browser.show();
      }
    });
  }

  link(){
    const browser = this.iab.create(url);
    browser.show();
  }

  private showNotification(beacon: Beacon, index: number) {
    const options = {
      id: index,
      title: `${beacon.nombre}`,
      text: `${beacon.id}`,
      data: beacon,
      color: '#b3259d',
    };

    this.localNotifications.schedule(options);
  }

  logout(){
    this.afAuth.auth.signOut().then(x=>{
      this.storage.set('introShown', false);
      this.navCtrl.setRoot('LoginPageScan');
    });
  }

  ionViewWillLeave() {
    this.monitor.stop();
  }
}
