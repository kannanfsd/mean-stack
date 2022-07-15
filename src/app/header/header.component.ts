import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  myMessages = 'Welcome to our MEAN Stack Model';
  constructor() { }

  ngOnInit(): void {
  }

}
