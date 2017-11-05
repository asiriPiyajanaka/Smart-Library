import {Component} from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {SqliteProvider} from '../../providers/sqlite/sqlite';
import {AlertController} from 'ionic-angular';
import {Platform} from 'ionic-angular'; 

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  
  	image1:any;
	public bgImg = [];
	public lendBooks = [];
    public lendVal = 0;
    lastActivityTime: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public sqliteService: SqliteProvider, protected platform : Platform, public alertCtrl: AlertController, public toastCtrl: ToastController) {
  
  			var currentDate = new Date().toISOString();
     		this.lastActivityTime = currentDate;

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
		          .getBooksAllLend()
		          .then(s => {
		            this.lendBooks = this.sqliteService.arrLend;
		            console.log(JSON.stringify(this.lendBooks));

		          });
		      })
  }

 	updateRemoveLend(id){	
			
			this
		      .sqliteService
		      .updateLendToInhand(id)
		    this
		      .sqliteService
		      .delLendedBookc(id)
		      .then(s => {
		        this.lendBooks = this.sqliteService.arrLend;
		        
		      });
		}

	showPromptRemoveLend(id) {
	    
	     let prompt = this.alertCtrl.create({
	      title: 'Take back your Book',
	      message: "Are you collecting your book back ?",
	      
	      buttons: [
	        {
	          text: 'No',
	          handler: data => {
	            
	          }
	        },
	        {
	          text: 'Yes',
	          handler: data => {
	            
	          	this.updateRemoveLend(id);
	          	this.presentToastRemoveLend();
	          }
	        }
	      ]
	    });
	    prompt.present();
	  }

	presentToastRemoveLend() {
	  		let toast = this.toastCtrl.create({
	    	message: 'Book collected',
	    	duration: 2000,
	    	position: 'bottom'
		  });

		  toast.onDidDismiss(() => {
		    console.log('Dismissed toast');
		  });

		  toast.present();
		}



	updateRemoveLendAll(){	
			
			for(let data of this.lendBooks) {
	  			
				this
			      .sqliteService
			      .updateLendToInhand(data.bId)
			    this
			      .sqliteService
			      .delLendedBookc(data.bId)
			      .then(s => {
			        this.lendBooks = this.sqliteService.arrLend;
		        
		      });

			}

			
		}
		
	showPromptRemoveLendAll() {
	    
	     let prompt = this.alertCtrl.create({
	      title: 'Collect All Books',
	      message: "Are you collecting all these books ?",
	      
	      buttons: [
	        {
	          text: 'No',
	          handler: data => {
	            
	          }
	        },
	        {
	          text: 'Yes',
	          handler: data => {
	            
	          	this.updateRemoveLendAll();
	          	this.presentToastRemoveLendAll();
	          }
	        }
	      ]
	    });
	    prompt.present();
	  }

	presentToastRemoveLendAll() {
	  		let toast = this.toastCtrl.create({
	    	message: 'All books collected',
	    	duration: 2000,
	    	position: 'bottom'
		  });

		  toast.onDidDismiss(() => {
		    console.log('Dismissed toast');
		  });

		  toast.present();
		}



}
