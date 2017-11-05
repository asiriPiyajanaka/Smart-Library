import {Component} from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import {BrokerService} from '../../providers/broker-service-mock';
import {BrokerDetailPage} from '../broker-detail/broker-detail';
import {Platform} from 'ionic-angular'; 
import {SqliteProvider} from '../../providers/sqlite/sqlite';
import {AlertController} from 'ionic-angular';

@Component({
    selector: 'page-broker-list',
    templateUrl: 'broker-list.html'
})
export class BrokerListPage {

    image1:any;
	public bgImg = [];
    public favBooks = [];
    public favVal = 0;

    constructor(public navCtrl: NavController, public service: BrokerService, public sqliteService: SqliteProvider, protected platform : Platform, public alertCtrl: AlertController, public toastCtrl: ToastController) {

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

    	this
		      .platform
		      .ready()
		      .then(() => {
		        this
		          .sqliteService
		          .getAllFavoriteBooks()
		          .then(s => {
		            this.favBooks = this.sqliteService.arrFav;

		          });
		      })
        
    }

    
   	updateRemoveFav(id){	
			
			this
		      .sqliteService
		      .updateFavAlll(this.favVal, id)
		      .then(s => {
		        this.favBooks = this.sqliteService.arrFav;
		        
		      });
		}
		

	showPromptRemoveFav(id) {
	    
	     let prompt = this.alertCtrl.create({
	      title: 'Remove Book from Favorites',
	      message: "Are you sure you want to remove this book from favorites ?",
	      
	      buttons: [
	        {
	          text: 'No',
	          handler: data => {
	            
	          }
	        },
	        {
	          text: 'Yes',
	          handler: data => {
	            
	          	this.updateRemoveFav(id);
	          	this.presentToastRemoveFav();
	          }
	        }
	      ]
	    });
	    prompt.present();
	  }

	presentToastRemoveFav() {
	  		let toast = this.toastCtrl.create({
	    	message: 'Book removed from favorites',
	    	duration: 2000,
	    	position: 'bottom'
		  });

		  toast.onDidDismiss(() => {
		    
		  });

		  toast.present();
		}


	removeAllFav(){

		for(let data of this.favBooks) {
	  			
				this
			      .sqliteService
			      .updateFavAlll(this.favVal, data.bId)
			      .then(s => {
			        this.favBooks = this.sqliteService.arrFav;
			        
			      });

			}

	}	

	showPromptRemoveFavAll() {
	    
	     let prompt = this.alertCtrl.create({
	      title: 'Remove Book from Favorites',
	      message: "Are you sure you want to remove all books from favorites ?",
	      
	      buttons: [
	        {
	          text: 'No',
	          handler: data => {
	            
	          }
	        },
	        {
	          text: 'Yes',
	          handler: data => {
	            
	          	this.removeAllFav();
	          	this.presentToastRemoveFavAll();
	          }
	        }
	      ]
	    });
	    prompt.present();
	  }

	presentToastRemoveFavAll() {
	  		let toast = this.toastCtrl.create({
	    	message: 'Removed all favorites',
	    	duration: 2000,
	    	position: 'bottom'
		  });

		  toast.onDidDismiss(() => {
		   
		  });

		  toast.present();
		}	



    openBrokerDetail(broker) {
        this.navCtrl.push(BrokerDetailPage, broker);
    }

}
