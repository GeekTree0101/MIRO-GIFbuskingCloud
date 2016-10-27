import {Component} from '@angular/core'
import {HomePage} from '../Home/home';
import {AboutPage} from '../About/about';
import {ListPage} from '../List/list';
import {NavController} from 'ionic-angular';


@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {

  private tab1Root: any;
  private tab2Root: any;
  private tab3Root: any;

  constructor(private nav : NavController) {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.tab1Root = HomePage;
    this.tab2Root = ListPage;
    this.tab3Root = AboutPage;
  }
  
  
}