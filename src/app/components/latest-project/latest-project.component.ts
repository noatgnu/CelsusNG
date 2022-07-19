import { Component, OnInit } from '@angular/core';
import {WebService} from "../../service/web.service";

@Component({
  selector: 'app-latest-project',
  templateUrl: './latest-project.component.html',
  styleUrls: ['./latest-project.component.scss']
})
export class LatestProjectComponent implements OnInit {
  projects: any[] = []

  constructor(private web: WebService) {
    this.web.getProjects(["0"]).subscribe(data => {
      // @ts-ignore
      this.projects = data["results"]
      for (const p of this.projects) {
        p.date = new Date(p.date*1000)
      }
      console.log(this.projects)
    })
  }

  ngOnInit(): void {
  }

}
