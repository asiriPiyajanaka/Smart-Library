import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import {SqliteProvider} from '../../providers/sqlite/sqlite';
import {Platform} from 'ionic-angular'; 
import { DemoPage } from '../demo/demo';
/**
 * Generated class for the HelpPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-help',
  templateUrl: 'help.html',
})
export class HelpPage {

	image1:any;
	public bgImg = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public sqliteService: SqliteProvider, protected platform : Platform, public modalCtrl: ModalController) {

  			this
		      .platform
		      .ready()
		      .then(() => {
		        this
			      .sqliteService
			      .getBg()
			      .then(s => {
			        this.bgImg = this.sqliteService.arrBg;	        

			        for(let data of this.bgImg) {	  			
						this.image1 = data.bgImage;				
					}
			      });
		      })
  
  }

  ionViewDidLoad() {
    
  }

  changeBg(img){

   		this
	      .sqliteService
	      .setBg(img)
	      .then(s => {
	        this.bgImg = this.sqliteService.arrBg;	        

	        for(let data of this.bgImg) {	  			
				this.image1 = data.bgImage;				
			}
	      });

	      
  	
  }


  	getDemo() {
  		
  		
  		let profileModal = this.modalCtrl.create(DemoPage);
   		profileModal.onDidDismiss(data => {
     					
   		});

   		profileModal.present();
	}

}
