import { Component } from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {SqliteProvider} from '../../providers/sqlite/sqlite';
import {AlertController} from 'ionic-angular';
import {Platform} from 'ionic-angular'; 

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

	public delBooks = [];
	public bgImg = [];
	image1:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public sqliteService: SqliteProvider, protected platform : Platform, public alertCtrl: AlertController, public toastCtrl: ToastController) {

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
		          .getBooksAllDelete()
		          .then(s => {
		            this.delBooks = this.sqliteService.arrDel;
		            

		          });
		      })

  }
//****************************** Restore contrl ***********************************************************

	restoreBook(id){	
			
			this
		      .sqliteService
		      .restoreDelBook(id)
		      .then(s => {
		        this.delBooks = this.sqliteService.arrDel;
		        
		      });
		}

	showPromptRestoreBook(id) {
	    
	     let prompt = this.alertCtrl.create({
	      title: 'Restore Book',
	      message: "Are you restoring this book ?",
	      
	      buttons: [
	        {
	          text: 'No',
	          handler: data => {
	            
	          }
	        },
	        {
	          text: 'Yes',
	          handler: data => {
	            
	          	this.restoreBook(id);
	          	this.presentToastRestoreBook();
	          }
	        }
	      ]
	    });
	    prompt.present();
	  }

	presentToastRestoreBook() {
	  		let toast = this.toastCtrl.create({
	    	message: 'Book restored',
	    	duration: 2000,
	    	position: 'bottom'
		  });

		  toast.onDidDismiss(() => {
		    
		  });

		  toast.present();
		}

	restoreBookAll(){	
			
		for(let data of this.delBooks) {
			this
		      .sqliteService
		      .restoreDelBook(data.bId)
		      .then(s => {
		        this.delBooks = this.sqliteService.arrDel;
		        
		      });
		}
	}

	showPromptRestoreBookAll() {
	    
	     let prompt = this.alertCtrl.create({
	      title: 'Restore All',
	      message: "Are you restoring all these books ?",
	      
	      buttons: [
	        {
	          text: 'No',
	          handler: data => {
	            
	          }
	        },
	        {
	          text: 'Yes',
	          handler: data => {
	            
	          	this.restoreBookAll();
	          	this.presentToastRestoreBookAll();
	          }
	        }
	      ]
	    });
	    prompt.present();
	  }

	presentToastRestoreBookAll() {
	  		let toast = this.toastCtrl.create({
	    	message: 'Books restored',
	    	duration: 2000,
	    	position: 'bottom'
		  });

		  toast.onDidDismiss(() => {
		    
		  });

		  toast.present();
		}

//*********************************************************************************************************

//************************************* Permenant Delete **************************************************

	deleteBook(id){	
			
			this
		      .sqliteService
		      .delBookPermenant(id)
		      .then(s => {
		        this.delBooks = this.sqliteService.arrDel;
		        
		      });
		}

	showPromptDeleteBook(id) {
	    
	     let prompt = this.alertCtrl.create({
	      title: 'Remove Book Permanently',
	      message: "Are you removing this book permanently ?",
	      
	      buttons: [
	        {
	          text: 'No',
	          handler: data => {
	            
	          }
	        },
	        {
	          text: 'Yes',
	          handler: data => {
	            
	          	this.deleteBook(id);
	          	this.presentToastDeleteBook();
	          }
	        }
	      ]
	    });
	    prompt.present();
	  }

	presentToastDeleteBook() {
	  		let toast = this.toastCtrl.create({
	    	message: 'Book removed permanently',
	    	duration: 2000,
	    	position: 'bottom'
		  });

		  toast.onDidDismiss(() => {
		    
		  });

		  toast.present();
		}

	deleteBookAll(){	
			
		for(let data of this.delBooks) {
			this
		      .sqliteService
		      .delBookPermenant(data.bId)
		      .then(s => {
		        this.delBooks = this.sqliteService.arrDel;
		        
		      });
		}
	}

	showPromptDeleteBookAll() {
	    
	     let prompt = this.alertCtrl.create({
	      title: 'Remove All Books Permanently',
	      message: "Are you removing all these books permanently ?",
	      
	      buttons: [
	        {
	          text: 'No',
	          handler: data => {
	            
	          }
	        },
	        {
	          text: 'Yes',
	          handler: data => {
	            
	          	this.deleteBookAll();
	          	this.presentToastDeleteBookAll();
	          }
	        }
	      ]
	    });
	    prompt.present();
	  }

	presentToastDeleteBookAll() {
	  		let toast = this.toastCtrl.create({
	    	message: 'All books removed permanently',
	    	duration: 2000,
	    	position: 'bottom'
		  });

		  toast.onDidDismiss(() => {
		    
		  });

		  toast.present();
		}	

//*********************************************************************************************************
}
