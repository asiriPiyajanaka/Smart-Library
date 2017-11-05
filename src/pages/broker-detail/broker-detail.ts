import {Component} from '@angular/core';
import {Platform} from 'ionic-angular'; 
import {ActionSheetController, ActionSheet, NavController, NavParams, ToastController, ModalController} from 'ionic-angular';

import {PropertyService} from '../../providers/property-service-mock';
import {SqliteProvider} from '../../providers/sqlite/sqlite';
import {AlertController} from 'ionic-angular';
import {FabContainer} from 'ionic-angular';
import {AddBookPage} from '../add-book/add-book';
import {LendBookPage} from '../lend-book/lend-book';

@Component({
    selector: 'page-broker-detail',
    templateUrl: 'broker-detail.html'
})
export class BrokerDetailPage {

	image1:any;
	public bgImg = [];
    public mainCatId;
    public subCatId;
    public subCatName;
    subCat : any;
    public subCatDetail = [];
    public lId = [];
    public text : any;
    public bookDetail = [];
    public favVal;
   	title = "Smart Library";
   	public toggled: boolean = false;
   	searchKey: string = "";
   	public srch = [];
   	lastActivityTime: any;

    constructor(public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, public navParams: NavParams, public propertyService: PropertyService, public toastCtrl: ToastController, public sqliteService: SqliteProvider, protected platform : Platform, public alertCtrl: AlertController, public modalCtrl: ModalController) {
       		this.subCatId = navParams.get("firstPassed");
    		this.subCatName = navParams.get("secondPassed");
    		this.mainCatId = navParams.get("thirdPassed");
    			
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
			          .getSubCat(this.mainCatId)
			          .then(s => {
			            this.subCatDetail = this.sqliteService.arr;
			          });
			      })

			      this
			      .platform
			      .ready()
			      .then(() => {
			        this
			          .sqliteService
			          .getBooks(this.mainCatId, this.subCatId)
			          .then(s => {
			            this.bookDetail = this.sqliteService.arr1;
			          });
			          
			      })

     this.title = this.subCatName;

     this.toggled = false;
    }


 //***************************************Local Notification **************************************************


 //************************************************************************************************************
 //**************************************** Search bar ********************************************************

    public toggle(): void {
       this.toggled = this.toggled ? false : true;
       
    }

   cancelSearch(){
   		this.toggle();
   		this.getSubCat();
    	this.getBook();
   }

   searchThis(){

   if(this.searchKey == ""){
    	this.getSubCat();
    	this.getBook();
    }
    else{
        this.sqliteService.searchBookMainCat(this.searchKey, this.mainCatId)
            .then(s => {
                this.bookDetail = this.sqliteService.arrSearchMainCat;
                
            })
            .catch(error => alert(JSON.stringify(error)));
    	}

   }

  



 //************************************************************************************************************

 //**************************************** sub cat control ***************************************************
    addSubCat(subCatName) {

	    this
	      .sqliteService
	      .addSubCat(subCatName, this.mainCatId)
	      .then(s => {
	        this.subCatDetail = this.sqliteService.arr;	        
	      });
  	}

  	updateSubCat(subCatName, subId) {

	    this
	      .sqliteService
	      .updateSubCatName(subCatName, subId, this.mainCatId)
	      .then(s => {
	        this.subCatDetail = this.sqliteService.arr;	        
	      });
  	}

  	updateSubCatPrompt(subId) {
    
     let prompt = this.alertCtrl.create({
      title: 'New Sub Category Name',
      message: "Enter a new name for this sub category.",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            
          }
        },
        {
          text: 'Save',
          handler: data => {
            var t = data.title;
	            if (t==""){
	            	
	            	this.presentToastUpdateSubCat();
	            }
	            else{
	            	this.updateSubCat(t, subId);
	            }

			
          }
        }
      ]
    });
    prompt.present();
  }

 presentToastUpdateSubCat() {
  		let toast = this.toastCtrl.create({
    	message: 'Oops ! Not updated. Sub category name can not be empty !',
    	duration: 3000,
    	position: 'bottom'
	  });

	  toast.onDidDismiss(() => {
	    
	  });

	  toast.present();
	}

	getSubCat() {

	    this
	      .sqliteService
	      .getSubCat(this.mainCatId)
	      .then(s => {
	        this.subCatDetail = this.sqliteService.arr;	        
	      });
  	}


  	
 //***********************************************************************************************************

 //**********************************************  Favorite control ******************************************

	updateFav(fav, bId, catId){		

		if(fav == 0){
			
			this.favVal =  1;
			
			this
		      .sqliteService
		      .updateFav(this.favVal, bId, catId, this.subCatId)
		      .then(s => {
		        this.bookDetail = this.sqliteService.arr1;
		        this.presentToastAddFav();
		      });
		}
		else{
			this.favVal =  0;
			
			this
		      .sqliteService
		      .updateFav(this.favVal, bId, catId, this.subCatId)
		      .then(s => {
		        this.bookDetail = this.sqliteService.arr1;
		        this.presentToastRemoveFav();
		      });
		}

	}

	presentToastAddFav() {
  		let toast = this.toastCtrl.create({
    	message: 'Added to favorites',
    	duration: 1500,
    	position: 'bottom'
	  });

	  toast.onDidDismiss(() => {
	    
	  });

	  toast.present();
	}

	presentToastRemoveFav() {
  		let toast = this.toastCtrl.create({
    	message: 'Removed from favorites',
    	duration: 1500,
    	position: 'bottom'
	  });

	  toast.onDidDismiss(() => {
	    
	  });

	  toast.present();
	}


 //**************************************************************************************************************

    openBrokerDetail(broker) {
        this.navCtrl.push(BrokerDetailPage, broker);
    }

    favorite(property) {
        this.propertyService.favorite(property)
            .then(property => {
                let toast = this.toastCtrl.create({
                    message: 'Property added to your favorites',
                    cssClass: 'mytoast',
                    duration: 1000
                });
                toast.present(toast);
            });
    }

    share(property) {
        let actionSheet: ActionSheet = this.actionSheetCtrl.create({
            title: 'Share via',
            buttons: [
                {
                    text: 'Twitter',
                    handler: () => console.log('share via twitter')
                },
                {
                    text: 'Facebook',
                    handler: () => console.log('share via facebook')
                },
                {
                    text: 'Email',
                    handler: () => console.log('share via email')
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => console.log('cancel share')
                }
            ]
        });

        actionSheet.present();
    }

    showPrompt(fab: FabContainer) {
    fab.close();
    
     let prompt = this.alertCtrl.create({
      title: 'New Book Album',
      message: "Enter a name for this new album.",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            
          }
        },
        {
          text: 'Save',
          handler: data => {
            var t = data.title;
	            if (t==""){
	            
	            this.presentToast();
	            }
	            else{
	            this.addSubCat(t);
	            }

			
          }
        }
      ]
    });
    prompt.present();
  }


	presentProfileModal(fab: FabContainer) {
  		
  		fab.close();
  		let profileModal = this.modalCtrl.create(AddBookPage, {
      		firstPassed: this.mainCatId,
      		secondPassed: this.subCatId
      
    	});
   		profileModal.onDidDismiss(data => {
     		
				if(data==10){
		     		this.presentToastAddBook();
		     		}
		     		else{}

     			this
			      .platform
			      .ready()
			      .then(() => {
			        this
			          .sqliteService
			          .getBooks(this.mainCatId, this.subCatId)
			          .then(s => {
			            this.bookDetail = this.sqliteService.arr1;
			          });
			          console.log(JSON.stringify(this.bookDetail));
			      })

     		
   		});

   		profileModal.present();
	}
 //*************************************************************      Lend control        ****************************
	updateBookLendedStatus(status, bId, catId) {

	    this
	      .sqliteService
	      .updateLendBookStatus('inHand', bId, this.mainCatId);
	      
  	}

  	removeLendedBook(bId) {

	    this
	      .sqliteService
	      .removeLendedBook(bId, this.mainCatId);
	      
  	}

	controlLendButton(bId, currPosi){

		if(currPosi == 'inHand'){
			this.presentLendBookModal(bId, currPosi);
		}
		else{
			this.showPromptBookTakeBack(bId, currPosi);
		}

	}

	presentLendBookModal(bId, currPosi) {
  		
  		
  		let LendBookModal = this.modalCtrl.create(LendBookPage, {
      		firstPassed: this.mainCatId,
      		secondPassed: bId,
      		thiredPassed: currPosi

      
    	});
   		LendBookModal.onDidDismiss(data => {
     		
     			this
			      .platform
			      .ready()
			      .then(() => {
			        this
			          .sqliteService
			          .getBooks(this.mainCatId, this.subCatId)
			          .then(s => {
			            this.bookDetail = this.sqliteService.arr1;
			          });
			          console.log('lend book array',JSON.stringify(this.bookDetail));
			      })
   		});

   		LendBookModal.present();
	}

	showPromptBookTakeBack(bId, currPosi) {
    
    
     let prompt = this.alertCtrl.create({
      title: 'Take back',
      message: "Are you sure you got this book back ?",
     
      buttons: [
        {
          text: 'No',
          handler: data => {
            
          }
        },
        {
          text: 'Yes',
          handler: data => {
            this.removeLendedBook(bId);
			this.updateBookLendedStatus(currPosi, bId, this.mainCatId);
			this
			      .platform
			      .ready()
			      .then(() => {
			        this
			          .sqliteService
			          .getBooks(this.mainCatId, this.subCatId)
			          .then(s => {
			            this.bookDetail = this.sqliteService.arr1;
			          });
			          
			      })
	            

			
          }
        }
      ]
    });
    prompt.present();
  }
 //*************************************************************************************************************

 //********************************************** Book control *************************************************
 getBook(){	
			
			this
		      .sqliteService
		      .getBooks(this.mainCatId, this.subCatId)
		      .then(s => {
		        this.bookDetail = this.sqliteService.arr1;
		        
		      });
		}


 updateBookName(bName, bid, catId){	
			
			this
		      .sqliteService
		      .updateBookName(bName, bid, catId, this.subCatId)
		      .then(s => {
		        this.bookDetail = this.sqliteService.arr1;
		        
		      });
		}
		

 showPromptUpdateBookName(bId, catId) {
    
     let prompt = this.alertCtrl.create({
      title: 'New Book Name',
      message: "Enter a new name for this book.",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            
          }
        },
        {
          text: 'Save',
          handler: data => {
            var t = data.title;
	            if (t==""){
	            	
	            	this.presentToastUpdateBookName();
	            }
	            else{
	            	this.updateBookName(t, bId, catId);
	            }

			
          }
        }
      ]
    });
    prompt.present();
  }

 presentToastUpdateBookName() {
  		let toast = this.toastCtrl.create({
    	message: 'Oops ! Book name can not be update as a empty name !',
    	duration: 3000,
    	position: 'bottom'
	  });

	  toast.onDidDismiss(() => {
	    
	  });

	  toast.present();
	}

 //****************************************

 updateBookDesc(bDes, bid, catId){	
			
			this
		      .sqliteService
		      .updateBookDescription(bDes, bid, catId, this.subCatId)
		      .then(s => {
		        this.bookDetail = this.sqliteService.arr1;
		        
		      });
		}
		

 showPromptUpdateBookDesc(bId, catId) {
    
     let prompt = this.alertCtrl.create({
      title: 'New Description',
      message: "Enter a new description for this book",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            
          }
        },
        {
          text: 'Save',
          handler: data => {
            var t = data.title;
	            if (t==""){
	            	
	            	this.presentToastUpdateBookDesc();
	            }
	            else{
	            	this.updateBookDesc(t, bId, catId);
	            }

			
          }
        }
      ]
    });
    prompt.present();
  }

 presentToastUpdateBookDesc() {
  		let toast = this.toastCtrl.create({
    	message: 'Oops ! Not updated. Book Description can not be empty !',
    	duration: 3000,
    	position: 'bottom'
	  });

	  toast.onDidDismiss(() => {
	    
	  });

	  toast.present();
	}


 //****************************************

 deleteBook(bid, catId){	
			
			this
		      .sqliteService
		      .deleteBook(bid, catId, this.subCatId)
		      .then(s => {
		        this.bookDetail = this.sqliteService.arr1;
		        
		      });
		}
		

 showPromptDeleteBook(bId, catId) {
    
     let prompt = this.alertCtrl.create({
      title: 'Remove Book',
      message: "Are you sure you want to remove this book from your library ?",
      
      buttons: [
        {
          text: 'No',
          handler: data => {
            
          }
        },
        {
          text: 'Remove',
          handler: data => {
           
           	this.deleteBook(bId, catId);
          	this.presentToastDeleteBook();
			
          }
        }
      ]
    });
    prompt.present();
  }

 presentToastDeleteBook() {
  		let toast = this.toastCtrl.create({
    	message: 'Removed',
    	duration: 1000,
    	position: 'bottom'
	  });

	  toast.onDidDismiss(() => {
	    
	  });

	  toast.present();
	}

//********************************************** Bookmark & Reading************************************************

//***************** Add
addBookmark(specsDetail, bid, catId){	
			
			this
		      .sqliteService
		      .addBookmark(specsDetail, bid, catId, this.subCatId)
		      .then(s => {
		        this.bookDetail = this.sqliteService.arr1;
		        
		      });
		}
		

 showPromptAddBookmark(bId, catId) {
    
     let prompt = this.alertCtrl.create({
      title: 'Add Bookmark',
      message: "Are you sure you want to add a bookmark for this book ?",
      inputs: [
        {
          name: 'pageNo',
          placeholder: 'Add Bookmark'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
           
          }
        },
        {
          text: 'Add',
          handler: data => {
           
           	this.addBookmark(data.pageNo, bId, catId);
			this.presentToastAddBookmark();
          }
        }
      ]
    });
    prompt.present();
  }

 presentToastAddBookmark() {
  		let toast = this.toastCtrl.create({
    	message: 'Bookmark added',
    	duration: 1500,
    	position: 'bottom'
	  });

	  toast.onDidDismiss(() => {
	    
	  });

	  toast.present();
	}
//******************** Remove

removeBookmark(bid, catId){	
			
			this
		      .sqliteService
		      .removeBookmark(bid, catId, this.subCatId)
		      .then(s => {
		        this.bookDetail = this.sqliteService.arr1;
		        
		      });
		}
		

 showPromptRemoveBookmark(bId, catId) {
    
     let prompt = this.alertCtrl.create({
      title: 'Remove Bookmark',
      message: "Are you sure you want to remove this bookmark ?",
      
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            
          }
        },
        {
          text: 'Remove',
          handler: data => {
           
           	this.removeBookmark(bId, catId);
			this.presentToastRemoveBookmark();
          }
        }
      ]
    });
    prompt.present();
  }

 presentToastRemoveBookmark() {
  		let toast = this.toastCtrl.create({
    	message: 'Bookmark removed',
    	duration: 1500,
    	position: 'bottom'
	  });

	  toast.onDidDismiss(() => {
	    
	  });

	  toast.present();
	}
 
 manegeBookmark(specs, bId, catId){

 		if(specs == 1){
 			this.showPromptRemoveBookmark(bId, catId);
 		}
 		else{
 			this.showPromptAddBookmark(bId, catId);
 		}

 }

 //********************************* Reading*******************************************************************

 //***************** Add
addReading(bid, catId){	
			
			this
		      .sqliteService
		      .addReading(bid, catId, this.subCatId)
		      .then(s => {
		        this.bookDetail = this.sqliteService.arr1;
		        
		      });
		}
		

 showPromptAddReading(bId, catId) {
    
     let prompt = this.alertCtrl.create({
      title: 'Mark Book',
      message: "Do you want to mark this book as a reading book ?",
      
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            
          }
        },
        {
          text: 'Add',
          handler: data => {
           
           	this.addReading(bId, catId);
			this.presentToastAddReading();
          }
        }
      ]
    });
    prompt.present();
  }

 presentToastAddReading() {
  		let toast = this.toastCtrl.create({
    	message: 'Book Marked',
    	duration: 1500,
    	position: 'bottom'
	  });

	  toast.onDidDismiss(() => {
	    
	  });

	  toast.present();
	}
//******************** Remove

removeReading(bid, catId){	
			
			this
		      .sqliteService
		      .removeReading(bid, catId, this.subCatId)
		      .then(s => {
		        this.bookDetail = this.sqliteService.arr1;
		        
		      });
		}
		

 showPromptRemoveReading(bId, catId) {
    
     let prompt = this.alertCtrl.create({
      title: 'Remove Mark',
      message: "Do you finished reading this book ?",
      
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            
          }
        },
        {
          text: 'Remove',
          handler: data => {
           
           	this.removeReading(bId, catId);
			this.presentToastRemoveReading();
          }
        }
      ]
    });
    prompt.present();
  }

 presentToastRemoveReading() {
  		let toast = this.toastCtrl.create({
    	message: 'Book Unmarked',
    	duration: 1500,
    	position: 'bottom'
	  });

	  toast.onDidDismiss(() => {
	    
	  });

	  toast.present();
	}
 
 manegeReading(rding, bId, catId){

 		if(rding == 1){
 			this.showPromptRemoveReading(bId, catId);
 		}
 		else{
 			this.showPromptAddReading(bId, catId);
 		}

 }

 //*************************************************************************************************************
	findAll() {
        this
      .sqliteService
      .getSubCat(this.mainCatId)
      .then(s => {
        this.subCatDetail = this.sqliteService.arr;
      })
		.catch(error => alert(JSON.stringify(error)))
      ;
    }


    getData(ttle){
	 	

	}

	presentToast() {
  		let toast = this.toastCtrl.create({
    	message: 'Oops! Sub category did not create ! The name can not be empty.',
    	duration: 3000,
    	position: 'bottom'
	  });

	  toast.onDidDismiss(() => {
	    
	  });

	  toast.present();
	}


	doRefresh(refresher) {
    	this
      .platform
      .ready()
      .then(() => {
        this
          .sqliteService
          .getBooks(this.mainCatId, this.subCatId)
          .then(s => {
            this.bookDetail = this.sqliteService.arr1;
          });
          console.log(JSON.stringify(this.bookDetail));
      })

    setTimeout(() => {
      
      refresher.complete();
    }, 2000);
  }

  presentToastAddBook() {
  		let toast = this.toastCtrl.create({
    	message: 'Added to your library',
    	duration: 2000,
    	position: 'bottom'
	  });

	  toast.onDidDismiss(() => {
	    
	  });

	  toast.present();
	}

 goToSubCatBooks(sId, catName, mCatId) {

    var subId = sId;
    var subName = catName;
    var mainCatId = mCatId;

    this.navCtrl.push(BrokerDetailPage, {
      firstPassed: subId,
      secondPassed: subName,
      thirdPassed: mainCatId
    })
    }

 //**************************************************** Action sheets ******************************

  presentActionSheet(subId) {
    let actionSheet: ActionSheet = this.actionSheetCtrl.create({
            title: 'Sub category options',
            
            buttons: [
                {
                    text: 'Edit sub category name',
                    handler: () => this.updateSubCatPrompt(subId)
                },
                {
                    text: 'Remove sub category',
                    handler: () => console.log('share via facebook')
                },              
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => console.log('cancel share')
                }
            ]
        });

        actionSheet.present();
 }

  presentActionSheet1(bId, catId) {
    let actionSheet: ActionSheet = this.actionSheetCtrl.create({
            title: 'Edit this book',
            
            buttons: [
                {
                    text: 'Edit book name',
                    handler: () => this.showPromptUpdateBookName(bId, catId)
                },
                {
                    text: 'Edit book description',
                    handler: () => this.showPromptUpdateBookDesc(bId, catId)
                },
                {
                    text: 'Remove book from library',
                    handler: () => this.showPromptDeleteBook(bId, catId)
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => console.log('cancel share')
                }
            ]
        });

        actionSheet.present();
}

}
