import { Component, OnInit } from '@angular/core';
import {WebService} from "../../service/web.service";
import {DataService} from "../../service/data.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ProjectEditorComponent} from "../project-editor/project-editor.component";
import {ProjectFileEditorComponent} from "../project-file-editor/project-file-editor.component";

@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.scss']
})
export class AdminManagementComponent implements OnInit {
  currentPage: number = 1
  pageSize: number = 20
  totalCount: number = 1
  totalPages: number = 1
  searchText: string = ""
  constructor(public web: WebService, public data: DataService, private modal: NgbModal) {
    if (this.web.access_token !== "") {
      this.web.adminGetProjects(1, this.searchText).subscribe(data => {
        // @ts-ignore
        if (data["results"]) {
          // @ts-ignore
          this.data.adminProjects = data["results"]
          // @ts-ignore
          this.totalPages = data["total_pages"]
          // @ts-ignore
          this.totalCount = data["count"]
        }
      })
    }
  }

  ngOnInit(): void {
  }

  update(d: any, properties: string[]) {
    this.web.adminUpdateProject(d, properties).subscribe(data => {

    })
  }

  editProject(id: number) {
    const ref = this.modal.open(ProjectEditorComponent, {size: "xl"})
    ref.componentInstance.project_id = id
  }

  editProjectFile(id: number) {
    const ref = this.modal.open(ProjectFileEditorComponent)
    ref.componentInstance.project_id = id
  }

  updateViewer(e: number) {
    this.web.adminGetProjects(e, this.searchText).subscribe(data => {
      // @ts-ignore
      if (data["results"]) {
        // @ts-ignore
        this.data.adminProjects = data["results"]
        // @ts-ignore
        this.totalPages = data["total_pages"]
        // @ts-ignore
        this.totalCount = data["count"]
      }
    })

  }

  logged(e: boolean) {
    if (e) {
      this.updateViewer(1)
    }
  }
}
