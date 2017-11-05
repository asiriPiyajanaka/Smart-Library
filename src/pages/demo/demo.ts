import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';



@Component({
  selector: 'page-demo',
  templateUrl: 'demo.html',
})
export class DemoPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  closeDemo(){

  		this.viewCtrl.dismiss();

  }

}
