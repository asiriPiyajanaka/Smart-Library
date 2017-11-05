import {Component} from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import {Platform} from 'ionic-angular'; 
import {SqliteProvider} from '../../providers/sqlite/sqlite';
import {AlertController} from 'ionic-angular';

@Component({
    selector: 'page-favorite-list',
    templateUrl: 'favorite-list.html'
})
export class FavoriteListPage {

    image1:any;
	public bgImg = [];
    public brrBooks = [];
    public brrVal = 0;
    lastActivityTime: any;

    constructor(public navCtrl: NavController, public sqliteService: SqliteProvider, protected platform : Platform, public alertCtrl: AlertController, public toastCtrl: ToastController) {
       
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
		          .getAllBorrowedBook()
		          .then(s => {
		            this.brrBooks = this.sqliteService.arrBrr;
		            

		          });
		      })
    }

    updateRemoveBrr(id){	
			
			this
		      .sqliteService
		      .deleteBrrBFromBook(id)
		    this
		      .sqliteService
		      .delBorrowedBookc(id)
		      .then(s => {
		        this.brrBooks = this.sqliteService.arrBrr;
		        
		      });
		}
		

	showPromptRemoveBrr(id) {
	    
	     let prompt = this.alertCtrl.create({
	      title: 'Return Book',
	      message: "Are you returning this book to owner ?",
	      
	      buttons: [
	        {
	          text: 'No',
	          handler: data => {
	            
	          }
	        },
	        {
	          text: 'Yes',
	          handler: data => {
	            
	          	this.updateRemoveBrr(id);
	          	this.presentToastRemoveBrr();
	          }
	        }
	      ]
	    });
	    prompt.present();
	  }

	presentToastRemoveBrr() {
	  		let toast = this.toastCtrl.create({
	    	message: 'Book returned',
	    	duration: 2000,
	    	position: 'bottom'
		  });

		  toast.onDidDismiss(() => {
		    
		  });

		  toast.present();
		}


	updateRemoveBrrAll(){	
			
			for(let data of this.brrBooks) {
	  			
				this
			      .sqliteService
			      .deleteBrrBFromBook(data.bId)
			    this
			      .sqliteService
			      .delBorrowedBookc(data.bId)
			      .then(s => {
			        this.brrBooks = this.sqliteService.arrBrr;
			        
			      });

			}

			
		}
		
	showPromptRemoveBrrAll() {
	    
	     let prompt = this.alertCtrl.create({
	      title: 'Return Books',
	      message: "Are you returning all these book to their owners ?",
	      
	      buttons: [
	        {
	          text: 'No',
	          handler: data => {
	            
	          }
	        },
	        {
	          text: 'Yes',
	          handler: data => {
	            
	          	this.updateRemoveBrrAll();
	          	this.presentToastRemoveBrrAll();
	          }
	        }
	      ]
	    });
	    prompt.present();
	  }

	presentToastRemoveBrrAll() {
	  		let toast = this.toastCtrl.create({
	    	message: 'All books returned',
	    	duration: 2000,
	    	position: 'bottom'
		  });

		  toast.onDidDismiss(() => {
		    
		  });

		  toast.present();
		}

}
