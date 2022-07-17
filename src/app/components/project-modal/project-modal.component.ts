import {Component, Input, OnInit} from '@angular/core';
import {WebService} from "../../service/web.service";

@Component({
  selector: 'app-project-modal',
  templateUrl: './project-modal.component.html',
  styleUrls: ['./project-modal.component.scss']
})
export class ProjectModalComponent implements OnInit {
  @Input() project: any = {}
  constructor(public web: WebService) { }

  ngOnInit(): void {
  }

}
