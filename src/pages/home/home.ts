import { Component, NgZone} from '@angular/core';
import {AlertController, Platform} from 'ionic-angular';
import {Beacon} from "../../app/beacon.model";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {url} from "../../app/uuid.config";
import {BeaconMonitorProvider} from "../../providers/beacon-monitor/beacon-monitor";
import { AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Observable} from "rxjs";
import {BackgroundMode} from "@ionic-native/background-mode";
import {LocalNotifications} from "@ionic-native/local-notifications";
import { IBeacon } from '@ionic-native/ibeacon';
import {OpenNativeSettings} from "@ionic-native/open-native-settings";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  new_beacons: Beacon[] = [];
  beaconsBD: Beacon[] = [];
  beaconNotifi: Beacon[] = [];
  private beaconCollection: AngularFirestoreCollection<any>;
  beacons: Observable<Beacon[]>;

  constructor(
    private afs: AngularFirestore,
    private monitor: BeaconMonitorProvider,
    private ngzone: NgZone,
    private alertCtrl: AlertController,
    private iab: InAppBrowser,
    private backgroundMode: BackgroundMode,
    private ibeacon: IBeacon,
    private openNativeSettings: OpenNativeSettings,
    private alert: AlertController,
    public platform: Platform,
    private localNotifications: LocalNotifications,
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
        //console.log(beacon)
      })
    })
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

        nearby_beacons.forEach((beacon,index) => {
          if (this.beaconsBD.findIndex(b => b.cid === beacon.cid) != -1 && this.new_beacons.findIndex(b => b.cid === beacon.cid) == -1) {
            this.new_beacons.push(beacon);
            if(this.beaconNotifi.findIndex(b => b.cid === beacon.cid) == -1 ){
              this.beaconNotifi.push(beacon);
              this.beaconsBD.forEach(b =>{
                if(b.cid === beacon.cid){
                  this.showNotification(b, index + 1);
                }
              });
            }
          }
        })
      });
    });
  }

  ionViewWillLeave() {
    this.monitor.stop();
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
      text: 'Nuevo dispositivo encontrado',
      data: beacon,
      color: '#b3259d',
    };

    this.localNotifications.schedule(options);
  }
}
