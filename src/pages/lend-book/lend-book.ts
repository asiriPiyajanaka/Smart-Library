import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AlertController } from 'ionic-angular';
import {SqliteProvider} from '../../providers/sqlite/sqlite';




@Component({
  selector: 'page-lend-book',
  templateUrl: 'lend-book.html',
})
export class LendBookPage {

	image1:any;
	public bgImg = [];
	name:any;
	tp:any;
	rDate:any;
	validations_form: FormGroup;
	public mainCatId;
	public bId;
	public currPosi;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public formBuilder: FormBuilder, public alertCtrl: AlertController, public sqliteService: SqliteProvider, protected platform : Platform) {

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

  			this.mainCatId = navParams.get("firstPassed");
  			this.bId = navParams.get("secondPassed");
  			this.currPosi = navParams.get("thiredPassed");
  			

  }

    addLendedBook(name, tp, rDate) {

	    this
	      .sqliteService
	      .addLendedBook(this.bId, name, tp, rDate, this.mainCatId);
	      
  	}

	updateBookLendedStatus(status) { 

	    this
	      .sqliteService
	      .updateLendBookStatus(status, this.bId, this.mainCatId);
	      
  	}

  	removeLendedBook() {

	    this
	      .sqliteService
	      .removeLendedBook(this.bId, this.mainCatId);
	      
  	}

  	onSubmit(values){

  		
  			this.addLendedBook(values.name, values.tp, values.rDate);
  			this.updateBookLendedStatus('lended');
  		
  		
  		this.viewCtrl.dismiss();

  	}

    ionViewWillLoad() {

	this.validations_form = this.formBuilder.group({
     
      name: new FormControl('', Validators.compose([	        	        
	        Validators.required
      ])),
      tp: new FormControl('', Validators.compose([	        	        
	        Validators.required,
	        Validators.pattern('[0-9]+'),
	        Validators.minLength(10)
      ])),
      rDate: new FormControl('1', Validators.compose([	        	        
	       
      ])),

	});

  }

myDate: String = new Date().toISOString();

    validation_messages = {
    
    'name': [
      { type: 'required', message: 'Name is required !' },
    ],
    'tp': [
      { type: 'required', message: 'Contact No. required !' },
      { type: 'pattern', message: 'This must be a valid contact number !' },
      { type: 'minLength', message: 'This must be a valid contact number !' },
    ],
    
  };


  ionViewDidLoad() {
    
  }

  closeForm() {
   	this.viewCtrl.dismiss();
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

   	clearData(){
	 
	 	this.validations_form.reset();
	 	
	}

	showConfirmClear() {
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


}
