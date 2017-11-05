import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';
import { WelcomePage } from '../welcome/welcome';
import {SqliteProvider} from '../../providers/sqlite/sqlite';
/**
 * Generated class for the IntroPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {

  constructor(public navCtrl: NavController, public sqliteService: SqliteProvider) {
  }

  navHome() {
  	  
	this.sqliteService.addBg();
	this.navCtrl.setRoot(WelcomePage);
  }

  ionViewDidLoad() {
    
  }

}
