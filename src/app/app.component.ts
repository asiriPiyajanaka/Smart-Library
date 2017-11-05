import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {SqliteProvider} from '../providers/sqlite/sqlite';
import {PropertyListPage} from '../pages/property-list/property-list';
import {BrokerListPage} from '../pages/broker-list/broker-list';
import {FavoriteListPage} from '../pages/favorite-list/favorite-list';
import {WelcomePage} from '../pages/welcome/welcome';
import {AboutPage} from '../pages/about/about';
import {ListPage} from '../pages/list/list';
import {HomePage} from '../pages/home/home';
import {BookmarkPage} from '../pages/bookmark/bookmark';
import {HelpPage} from '../pages/help/help';
import {AlertController, LoadingController, ToastController } from 'ionic-angular';


export interface MenuItem {
    title: string;
    component: any;
    icon: string;
}

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = WelcomePage;

    appMenuItems: Array<MenuItem>;

    accountMenuItems: Array<MenuItem>;

    helpMenuItems: Array<MenuItem>;

    lastTimeBackPress = 0;
    timePeriodToExit  = 2000;

    constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public sqlite: SqliteProvider, public alertCtrl: AlertController,public loadingCtrl: LoadingController, public toastCtrl: ToastController) {
        //this.presentLoading();
        this.initializeApp();

        this.appMenuItems = [
            {title: 'My Library', component: PropertyListPage, icon: 'logo-buffer'},
            {title: 'Bookmarks & Readings', component: BookmarkPage, icon: 'bookmarks'},
            {title: 'Favourites', component: BrokerListPage, icon: 'star'},
            {title: 'Borrowed Books', component: FavoriteListPage, icon: 'basket'},
            {title: 'Lended Books', component: ListPage, icon: 'exit'},
            {title: 'Trash', component: HomePage, icon: 'trash'},
        ];

        
        this.accountMenuItems = [            
            {title: 'Exit Smart Library', component: WelcomePage, icon: 'log-out'},
        ];

        this.helpMenuItems = [
            {title: 'Welcome', component: WelcomePage, icon: 'home'},
            {title: 'About', component: AboutPage, icon: 'information-circle'},
            {title: 'Help & Preferences', component: HelpPage, icon: 'help-circle'},
        ];

    }

    initializeApp() {
    
        this.platform.ready().then(() => {

            this.backButtonControl();
            this.statusBar.styleLightContent();
            this.splashScreen.hide();           
            this.sqlite.openDb();
            
        });
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);

    }

    presentLoading() {
	  const loading = this.loadingCtrl.create({
	    content: 'Please wait while we are setting thins for you'
	  });

	  loading.present();

	  setTimeout(() => {
	    loading.dismiss();
	  }, 5000);
}

    exit(){
      let alert = this.alertCtrl.create({
        title: 'Exit Smart Library',
        message: 'Do you want to exit Smart Library ?',
        buttons: [{
          text: "Exit Smart Library",
          handler: () => { this.exitApp() }
        }, {
          text: "Cancel",
          role: 'cancel'
        }]
      })
      alert.present();
  }

  exitApp(){
    this.platform.exitApp();
  }

backButtonControl(){
	this.platform.registerBackButtonAction(() => {

            let view = this.nav.getActive();
				if (view.component.name == "FavoriteListPage" || view.component.name == "BookmarkPage" || view.component.name == "PropertyListPage" || view.component.name == "BrokerListPage" || view.component.name == "ListPage" || view.component.name == "HomePage" || view.component.name == "WelcomePage" || view.component.name == "AboutPage" || view.component.name == "HelpPage") {
				
                		var dateOne = new Date().getTime();
                		var resultOne = dateOne - this.lastTimeBackPress;
                	if (resultOne < this.timePeriodToExit) {
                    	this.exitApp();
                	} 
                	else {
                    	
                    	this.manageExit();

                	}
            	} else {
                
                this.nav.pop({});
            	}
        });
}

  manageExit() {
	  		let toast = this.toastCtrl.create({
	    	message: 'Press again to exit Smart Library',
	    	duration: 3000,
	    	position: 'bottom'
		  });

		  toast.onDidDismiss(() => {
		    
		  });

		  toast.present();
		  this.lastTimeBackPress = new Date().getTime();
		}


}
