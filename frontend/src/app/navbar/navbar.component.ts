import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl:'./navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent {

    constructor(private router: Router) {}

    goto(pageName: string) {
      const pageUrl = `views/page/${pageName}`;
      this.router.navigateByUrl(pageUrl);
    }

}
