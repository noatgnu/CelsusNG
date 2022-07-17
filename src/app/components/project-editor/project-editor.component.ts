import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {WebService} from "../../service/web.service";
import {NgbDateStructAdapter} from "@ng-bootstrap/ng-bootstrap/datepicker/adapters/ngb-date-adapter";

@Component({
  selector: 'app-project-editor',
  templateUrl: './project-editor.component.html',
  styleUrls: ['./project-editor.component.scss']
})
export class ProjectEditorComponent implements OnInit {
  project: any = {}

  experimentTypes: string[] = [
    "Shotgun proteomics",
    "Cross-linking (CX-MS)",
    "Affinity purification (AP-MS)",
    "SRM/MRM",
    "SWATH MS",
    "MS Imaging"
  ]


  finished = false
  @Input() set project_id(value: number) {
    this.web.getProjects([value.toString()]).subscribe(data => {
      console.log(data)
      // @ts-ignore
      const d: Date = new Date(data["results"][0].date*1000)
      const g: NgbDateStruct = {day: d.getDay(), month: d.getMonth(), year: d.getFullYear()}
      // @ts-ignore
      data["results"][0].date = g
      // @ts-ignore
      this.project = data["results"][0]
      console.log(this.project)
      this.finished = true
    })
  }

  constructor(private web: WebService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  addValue(data: any, dataType: string) {
    // @ts-ignore
    this.project[dataType] = [{name: ""}].concat(this.project[dataType])
  }

  removeValue(ind: number, dataType: string) {
    // @ts-ignore
    this.project[dataType].splice(ind, 1)
  }

  addSample() {
    this.project.sampleAnnotations.push({name: "", description: ""})
  }

  addAuthor() {
    this.project.authors.push({name: "", contact: "", first: false})
  }

  addCollaborator() {
    this.project.collaborators.push({name: "", contact: ""})
  }

  addPI() {
    this.project.pis.push({name: "", contact: ""})
  }

  addFile() {
    this.project.files.push({name: "", fileType: "", sampleColumns: []})
  }

  update() {
    if (this.web.access_token !== "") {
      this.web.adminUpdateProject(this.project,
        ["title", "description", "sampleProcessingProtocol", "dataProcessingProtocol", "experimentType",
          "date", "databaseVersion", "authors", "collaborators", "pis", "organisms", "quantificationMethods", "diseases",
          "keywords", "sampleAnnotations", "tissues", "cellTypes", "instruments"
        ]
      ).subscribe(data => {

      })
    }
  }
}
