import {Component} from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import {Platform} from 'ionic-angular'; 
import {SqliteProvider} from '../../providers/sqlite/sqlite';
import {AlertController} from 'ionic-angular';
import {FabContainer} from 'ionic-angular';


@Component({
  selector: 'page-bookmark',
  templateUrl: 'bookmark.html',
})

export class BookmarkPage {

	image1:any;
	public bgImg = [];
	public bookmarksArr = [];
	public readingsArr = [];

  constructor(public navCtrl: NavController, public sqliteService: SqliteProvider, protected platform : Platform, public alertCtrl: AlertController, public toastCtrl: ToastController) {

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
		          .getBooksAllBookmark()
		          .then(s => {
		            this.bookmarksArr = this.sqliteService.arrBkmrk;

		          });
		      })

		this
		      .platform
		      .ready()
		      .then(() => {
		        this
		          .sqliteService
		          .getBooksAllReading()
		          .then(s => {
		            this.readingsArr = this.sqliteService.arrRding;

		          });
		      })

  }

	removeBookmrk(bid){	
			
			this
		      .sqliteService
		      .removeAllBookmark(bid)
		      .then(s => {
		        this.bookmarksArr = this.sqliteService.arrBkmrk;
		        
		      });
		}
		

	showPromptRemoveBookmrk(bid) {
	    
	     let prompt = this.alertCtrl.create({
	      title: 'Remove Bookmark',
	      message: "Are you removing this Bookmark ?",
	      
	      buttons: [
	        {
	          text: 'No',
	          handler: data => {
	            
	          }
	        },
	        {
	          text: 'Yes',
	          handler: data => {
	            
	          	this.removeBookmrk(bid);
	          	this.presentToastRemoveBookmrk();
	          }
	        }
	      ]
	    });
	    prompt.present();
	  }

	presentToastRemoveBookmrk() {
	  		let toast = this.toastCtrl.create({
	    	message: 'Bookmark removed',
	    	duration: 1500,
	    	position: 'bottom'
		  });

		  toast.onDidDismiss(() => {
		    
		  });

		  toast.present();
		}


	removeAllBookmrks(){

		for(let data of this.bookmarksArr) {
	  			
				this
			      .sqliteService
			      .removeAllBookmark(data.bId)
			      .then(s => {
			        this.bookmarksArr = this.sqliteService.arrBkmrk;
			        
			    });

			}

	}	

	showPromptRemoveBookmrksAll(fab: FabContainer) {
	    fab.close();
	     let prompt = this.alertCtrl.create({
	      title: 'Remove All Bookmarks',
	      message: "Are you removing all these bookmarks ?",
	      
	      buttons: [
	        {
	          text: 'No',
	          handler: data => {
	            
	          }
	        },
	        {
	          text: 'Yes',
	          handler: data => {
	            
	          	this.removeAllBookmrks();
	          	this.presentToastRemoveBookmrksAll();
	          }
	        }
	      ]
	    });
	    prompt.present();
	  }

	presentToastRemoveBookmrksAll() {
	  		let toast = this.toastCtrl.create({
	    	message: 'Removed all Bokmarks',
	    	duration: 1500,
	    	position: 'bottom'
		  });

		  toast.onDidDismiss(() => {
		    
		  });

		  toast.present();
		}


	removeReading(bid){	
			
			this
		      .sqliteService
		      .removeAllReadings(bid)
		      .then(s => {
		        this.readingsArr = this.sqliteService.arrRding;
		        
		      });
		}
		

	showPromptRemoveReading(bid) {
	    
	     let prompt = this.alertCtrl.create({
	      title: 'Remove Currunt Reading',
	      message: "Are you done reading this book ?",
	      
	      buttons: [
	        {
	          text: 'No',
	          handler: data => {
	            
	          }
	        },
	        {
	          text: 'Yes',
	          handler: data => {
	            
	          	this.removeReading(bid);
	          	this.presentToastRemoveReading();
	          }
	        }
	      ]
	    });
	    prompt.present();
	  }

	presentToastRemoveReading() {
	  		let toast = this.toastCtrl.create({
	    	message: 'Currunt reading removed',
	    	duration: 1500,
	    	position: 'bottom'
		  });

		  toast.onDidDismiss(() => {
		    
		  });

		  toast.present();
		}


	remAllReadings(){

		for(let data of this.readingsArr) {
	  			
				this
			      .sqliteService
			      .removeAllReadings(data.bId)
			      .then(s => {
			        this.readingsArr = this.sqliteService.arrRding;
		        
		      });

			}

	}	

	showPromptRemoveReadingsAll(fab: FabContainer) {
	    fab.close();
	     let prompt = this.alertCtrl.create({
	      title: 'Remove All Readings',
	      message: "Are you removing all these readings ?",
	      
	      buttons: [
	        {
	          text: 'No',
	          handler: data => {
	            
	          }
	        },
	        {
	          text: 'Yes',
	          handler: data => {
	            
	          	this.remAllReadings();
	          	this.presentToastRemoveReadingsAll();
	          }
	        }
	      ]
	    });
	    prompt.present();
	  }

	presentToastRemoveReadingsAll() {
	  		let toast = this.toastCtrl.create({
	    	message: 'Removed all Readings',
	    	duration: 1500,
	    	position: 'bottom'
		  });

		  toast.onDidDismiss(() => {
		    
		  });

		  toast.present();
		}


showPromptClear(fab: FabContainer) {
	    fab.close();
	     let prompt = this.alertCtrl.create({
	      title: 'Clear The Page',
	      message: "Are you removing all these readings and bookmarks ?",
	      
	      buttons: [
	        {
	          text: 'No',
	          handler: data => {
	            
	          }
	        },
	        {
	          text: 'Yes',
	          handler: data => {
	            
	          	this.remAllReadings();
	          	this.removeAllBookmrks();
	          	this.presentToastClear();
	          }
	        }
	      ]
	    });
	    prompt.present();
	  }

	presentToastClear() {
	  		let toast = this.toastCtrl.create({
	    	message: 'Cleared',
	    	duration: 1000,
	    	position: 'bottom'
		  });

		  toast.onDidDismiss(() => {
		    
		  });

		  toast.present();
		}

}
