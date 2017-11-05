import {Component} from '@angular/core';
import {Platform} from 'ionic-angular'; 
import {Config, NavController} from 'ionic-angular';
import {PropertyService} from '../../providers/property-service-mock';
import {PropertyDetailPage} from '../property-detail/property-detail';
import {SqliteProvider} from '../../providers/sqlite/sqlite';
import leaflet from 'leaflet';
import {AlertController} from 'ionic-angular';
import { ActionSheetController, ActionSheet, ToastController } from 'ionic-angular';



@Component({
    selector: 'page-property-list', 
    templateUrl: 'property-list.html'
})
export class PropertyListPage {

	image1:any;
	public bgImg = [];
	public todos = [];
  	public text : any;

    properties: Array<any>;
    searchKey: string = "";
    viewMode: string = "list";
    map;
    markersGroup;

    constructor(public navCtrl: NavController, public service: PropertyService, public config: Config, public alertCtrl: AlertController, public sqliteService: SqliteProvider, protected platform : Platform, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController) {
        
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
		          .getRows()
		          .then(s => {
		            this.todos = this.sqliteService.arr;
		          });
		      })

    }

    //Adding the Function
  add(i) {
    this
      .sqliteService
      .addItem(i)
      .then(s => {
        this.todos = this.sqliteService.arr;
        this.text = '';
      });
  }
  //Deleting function
  delete(i) {
    this
      .sqliteService
      .del(i)
      .then(s => {
        this.todos = this.sqliteService.arr;
      });
  }
  //updating function
  update(id, todo) {    
    this
      .sqliteService
      .update(id, todo)
      .then(s => {
        this.todos = this.sqliteService.arr;
      });
  }

    openPropertyDetail(property: any) {
        this.navCtrl.push(PropertyDetailPage, property);
    }

    onInput(event) {
    
    if(this.searchKey == ""){
    	this.findAll();
    }
    else{
        this.sqliteService.searchByName(this.searchKey)
            .then(s => {
                this.todos = this.sqliteService.arr;
                //if (this.viewMode === "map") {
                //    this.showMarkers();
                //}
            })
            .catch(error => alert(JSON.stringify(error)));
    	}
    }

    onCancel(event) {
        this.findAll();
    }

    findAll() {
        this
      .sqliteService
      .getRows()
      .then(s => {
        this.todos = this.sqliteService.arr;
      })
		.catch(error => alert(JSON.stringify(error)))
      ;
    }

    showMap() {
        setTimeout(() => {
            this.map = leaflet.map("map").setView([42.361132, -71.070876], 14);
            leaflet.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri'
            }).addTo(this.map);
            this.showMarkers();
        })
    }

    showMarkers() {
        if (this.markersGroup) {
            this.map.removeLayer(this.markersGroup);
        }
        this.markersGroup = leaflet.layerGroup([]);
        this.properties.forEach(property => {
            if (property.lat, property.long) {
                let marker: any = leaflet.marker([property.lat, property.long]).on('click', event => this.openPropertyDetail(event.target.data));
                marker.data = property;
                this.markersGroup.addLayer(marker);
            }
        });
        this.map.addLayer(this.markersGroup);
    }

    onMe(i, catName) {

    var ida = i;
    var namea = catName;
    
    this.navCtrl.push(PropertyDetailPage, {
      firstPassed: ida,
      secondPassed: namea
    })
    }

    showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'New Book Category',
      message: "Enter a name for this new Category.",
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
	            	
	            	this.presentToastAddCat();
	            }
	            else{
	            	this.add(t);
	            }
	
          }
        }
      ]
    });
    prompt.present();
  }

  presentToastAddCat() {
  		let toast = this.toastCtrl.create({
    	message: 'Oops ! Not Added. Category name can not be empty !',
    	duration: 3000,
    	position: 'bottom'
	  });

	  toast.onDidDismiss(() => {
	    
	  });

	  toast.present();
	}

  updateSubCatPrompt(Id) {
    
     let prompt = this.alertCtrl.create({
      title: 'Update Category Name',
      message: "Enter a new name for this Category.",
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
	            	
	            	this.presentToastUpdateCat();
	            }
	            else{
	            	this.update(Id, t);
	            }

			
          }
        }
      ]
    });
    prompt.present();
  }

   presentToastUpdateCat() {
  		let toast = this.toastCtrl.create({
    	message: 'Oops ! Not updated. Category name can not be empty !',
    	duration: 3000,
    	position: 'bottom'
	  });

	  toast.onDidDismiss(() => {
	    
	  });

	  toast.present(); 
	}

  presentActionSheet(id, todo) {
    let actionSheet: ActionSheet = this.actionSheetCtrl.create({
            title: 'Main Category options',
            
            buttons: [
                {
                    text: 'Edit Category Name',
                    handler: () => this.updateSubCatPrompt(id)
                },
                
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => console.log('canceled')
                }
            ]
        });

        actionSheet.present();
}

}
