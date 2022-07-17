import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  result: any[] = []
  constructor() { }

  ngOnInit(): void {
  }

  handleSearchResult(e: any[]) {
    this.result = e
  }
}
