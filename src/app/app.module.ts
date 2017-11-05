import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import {WelcomePage} from '../pages/welcome/welcome';
import {PropertyListPage} from '../pages/property-list/property-list';
import {PropertyDetailPage} from '../pages/property-detail/property-detail';
import {BrokerListPage} from '../pages/broker-list/broker-list';
import {BrokerDetailPage} from '../pages/broker-detail/broker-detail';
import {FavoriteListPage} from '../pages/favorite-list/favorite-list';
import {AboutPage} from '../pages/about/about';
import {AddBookPage} from '../pages/add-book/add-book';
import {LendBookPage} from '../pages/lend-book/lend-book';
import {ListPage} from '../pages/list/list';
import {HomePage} from '../pages/home/home';
import {BookmarkPage} from '../pages/bookmark/bookmark';
import {HelpPage} from '../pages/help/help';
import { IntroPage } from '../pages/intro/intro';
import { DemoPage } from '../pages/demo/demo';
import {PropertyService} from "../providers/property-service-mock";
import {BrokerService} from "../providers/broker-service-mock";
import { SqliteProvider } from '../providers/sqlite/sqlite';
import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


@NgModule({
  declarations: [
    MyApp,
    WelcomePage,
    AboutPage,
    PropertyListPage,
    PropertyDetailPage,
    FavoriteListPage,
    BrokerListPage,
    BrokerDetailPage,
    AddBookPage,
    LendBookPage,
    ListPage,
    HomePage,
	BookmarkPage,
	IntroPage,
	HelpPage,
	DemoPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WelcomePage,
    AboutPage,
    PropertyListPage,
    PropertyDetailPage,
    FavoriteListPage,
    BrokerListPage,
    BrokerDetailPage,
    AddBookPage,
    LendBookPage,
    ListPage,
    HomePage,
    BookmarkPage,
    IntroPage,
    HelpPage,
    DemoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    PropertyService,
    BrokerService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}, SqliteProvider
  ]
})
export class AppModule {}
