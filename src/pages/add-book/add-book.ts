import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AlertController } from 'ionic-angular';
import { SqliteProvider } from '../../providers/sqlite/sqlite';

/**
 * Generated class for the AddBookPage page. 
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-add-book',
  templateUrl: 'add-book.html',
})
export class AddBookPage {
		image1:any;
		public bgImg = [];
		title: any;
		descrip: any;
		qty:  any;
		isbnn: any;
		owner: any;
		tp: any;
		rDate: any;
		validations_form: FormGroup;
		public mainCatId;
		public subCatId;
		public isbnC;
		public bookDetail = [];
		public lastId = [];
		public isbnArr = [];
		uniVal = 0;
		brrVal = 0;
		lstId = 0;
		cIsbn = 0;
		

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public formBuilder: FormBuilder, public alertCtrl: AlertController, public sqliteService: SqliteProvider, protected platform : Platform) {


  	this.mainCatId = navParams.get("firstPassed");
  	this.subCatId = navParams.get("secondPassed");

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
	      .sqliteService
	      .getIsbn()
	      .then(s => {
        		this.isbnArr = this.sqliteService.arrIsbn;

     		});
  	
  }

	addBook(title, descrip, qty, borrVal, isbnn) {
			
	    this
	      .sqliteService
	      .addBook(title, descrip, this.mainCatId, this.subCatId, 'inHand', 0, borrVal, qty, 0, isbnn)
	    /*  .then(s => {
        		this.lastId = this.sqliteService.arrLastId;
        		
        		for(let data of this.lastId){
        				this.lstId = data.bId;
        				
        		}

     		});*/
        		
        		
      
  	}



	addBorrowedBook(owner, tp, rDate) {
			var timeNow = new Date().getTime();
			var dateToday = new Date().toISOString();
			this
		      .sqliteService
		      .getBookLastId()
		      .then(s => {
	        		this.lastId = this.sqliteService.arrLastId;
	        		
	        		for(let data of this.lastId){
	        				this.lstId = data.bId;
	        				
	        				this
						      .sqliteService
						      .addBorrowedBook(this.lstId, owner, tp, rDate, dateToday, timeNow);
	        		}

	     		});

		    
	      
  	}


  ionViewDidLoad() {
    
  }

  ionViewWillLoad() {

	this.validations_form = this.formBuilder.group({
     
      title: new FormControl('', Validators.compose([	        	        
	        Validators.required
      ])),
      descrip: new FormControl('', Validators.compose([	        	        
	        Validators.minLength(0)
      ])),
      qty: new FormControl('1', Validators.compose([	        	        
	        Validators.required,
	        Validators.pattern('[0-9]+')	        
      ])),
      isbnn: new FormControl('', Validators.compose([	        	        
	        Validators.required,
	        Validators.pattern('[0-9]+'),
	        Validators.minLength(10),
	        
      ])),
      owner: new FormControl({value:'', disabled: true},Validators.required),
      
      //tp: new FormControl({value:'', disabled: true},Validators.required, Validators.pattern('10[0-9]')),
      //

      tp: new FormControl({value:'', disabled: true}, Validators.compose([	        	        
	        Validators.required,
	        Validators.pattern('[0-9]+'),
	        Validators.minLength(10)
      ])),
      rDate: new FormControl({value:'', disabled: true}),

	});

  }

myDate: String = new Date().toISOString();


 
    validation_messages = {
    
    'title': [
      { type: 'required', message: 'Name is required !' },
    ],
    'descrip': [
      { type: 'minLength', message: '' },
    ],
    'qty': [
      { type: 'required', message: 'No of books cant be empty !' },
      { type: 'pattern', message: 'No of books must be a number !' },
    ],
    'isbnn': [
      { type: 'required', message: 'Please provide the ISBN' },
      { type: 'pattern', message: 'Please provide a valid ISBN' },
      { type: 'minLength', message: 'Please provide a valid ISBN' },
      
    ],
    'owner': [
      { type: 'required', message: 'Owner name required !' },
    ],
    'tp': [
      { type: 'required', message: 'Contact No. required !' },
      { type: 'pattern', message: 'This must be a valid contact number !' },
      { type: 'minLength', message: 'This must be a valid contact number !' },
    ],
    
  };


aTwo: boolean = true;

  changeRadio(answer){

	if(answer == 2){
		this.aTwo = false;
		this.validations_form.get('owner').enable();
		this.validations_form.get('tp').enable();
		this.validations_form.get('rDate').enable();
		this.uniVal = 1;
	}
	else{
		this.aTwo = true;
		this.validations_form.get('owner').disable();
		this.validations_form.get('tp').disable();
		this.validations_form.get('rDate').disable();
		this.uniVal = 0;

	}
}

	 clearData(){
	 
	 	this.validations_form.reset();
	 	
	 }



	onSubmit(values){
var i= 10;
	 			for(let data of this.isbnArr){

        			if(values.isbnn == data.isbn){
						this.cIsbn = 1;
        			}
        			else{
        				this.cIsbn = 0;
        			}
        				
        		}

	 	   		if(this.cIsbn == 0){
	 	   					
					if(this.uniVal == 1){
							this.brrVal = 1;
							this.addBook(values.title, values.descrip, values.qty, this.brrVal, values.isbnn);
							this.addBorrowedBook(values.owner, values.tp, values.rDate);
						}
					else{	
							this.brrVal = 0;		
							this.addBook(values.title, values.descrip, values.qty, this.brrVal, values.isbnn);
						}
					
					this.viewCtrl.dismiss(i);
				}

				else{
					
					this.showOk();
				}
    
 	}

 	showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Clear all Inputs?',
      message: 'Are you sure you want to clear all Inputs?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            
          }
        },
        {
          text: 'Yes',
          handler: () => {
            
            this.clearData();
          }
        }
      ]
    });
    confirm.present();
  }

  closeForm() {
  var i= 0;
   	this.viewCtrl.dismiss(i);
 }

 showConfirmClose() {
    let confirm = this.alertCtrl.create({
      title: 'Close page?',
      message: 'Are you sure you want to close this page and return to main page?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            
          }
        },
        {
          text: 'Yes',
          handler: () => {
            
            this.closeForm();
          }
        }
      ]
    });
    confirm.present();
  }

  showOk() {
    let confirm = this.alertCtrl.create({
      title: 'Book Already In Your Library',
      message: 'This book already in your Smart Library according to ISBN you provided.Please check ISBN and try again.',
      buttons: [
        {
          text: 'Close',
          handler: () => {
            
          }
        }        
      ]
    });
    confirm.present();
  }

}
