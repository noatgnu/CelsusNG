import {Component, OnInit} from '@angular/core';
import {Project} from "../../classes/project";
import {WebService} from "../../service/web.service";
import {fromCSV} from "data-forge";
import {HttpEventType} from "@angular/common/http";

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})
export class ProjectFormComponent implements OnInit {
  project = new Project()
  experimentTypes: string[] = [
    "Shotgun proteomics",
    "Cross-linking (CX-MS)",
    "Affinity purification (AP-MS)",
    "SRM/MRM",
    "SWATH MS",
    "MS Imaging",
    "TMT"
  ]

  fileTypes: string[] = [
    "Raw",
    "Differential analysis",
    "Other"
  ]

  filesForUpload: any = {}

  dfMap: any = {}

  selectedCols: any = {}

  progress: any = {}

  primaryIDCols: any = {}

  fcCols: any = {}

  significantCols: any = {}

  fileUploadError: any = {}

  comparisons: any[] = []

  constructor(public web: WebService) { }

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

  submit() {

    for (let ind = 0; ind < this.project.files.length; ind ++) {
      const cols: any[] = []
      for (const n of this.selectedCols[this.project.files[ind].name]) {
        cols.push({name: n, columnType: "sample"})
      }
      if (this.project.files[ind].fileType == this.fileTypes[0] || this.project.files[ind].fileType == this.fileTypes[1]) {
        cols.push({name: this.primaryIDCols[this.project.files[ind].name], columnType: "primaryID"})
        if (this.project.files[ind].fileType == this.fileTypes[1]) {
          for (const f of this.fcCols[this.project.files[ind].name]) {
            cols.push({name: f, columnType: "foldChange"})
          }
          for (const f of this.significantCols[this.project.files[ind].name]) {
            cols.push({name: f, columnType: "significant"})
          }
        }

      }
      if (this.selectedCols[this.project.files[ind].name].length > 0) {
        for (const s of this.selectedCols[this.project.files[ind].name]) {
          this.project.files[ind].sampleColumns.push({name: s, columnType: "sample"})
        }
      }
      this.project.files[ind].sampleColumns = cols
    }
    this.project.comparison = this.comparisons
    this.web.submitProject(this.project).subscribe(data=> {
      if (data) {
        // @ts-ignore
        this.web.uniqueID = data["id"]
        // @ts-ignore
        //this.project = data
        if (this.web.uniqueID !== "") {
          this.uploadProjectFiles();
        }
      }
    })
  }

  uploadProjectFiles() {
    if (this.project.files.length > 0) {
      for (const f of this.project.files) {
        console.log(f)
         {
          this.fileUploadError[f.name] = false
          this.progress[f.name] = {progress: 0, status: "uploading"}
          this.uploadFile(f);
        }
      }
    }
  }

  uploadFile(f: any) {
    this.web.uploadFile(this.filesForUpload[f.name]).subscribe(ev => {
      if (ev.type == HttpEventType.UploadProgress) {
        console.log(this.progress)
        console.log(ev)
        // @ts-ignore
        this.progress[f.name].progress = Math.round(100 * (ev.loaded / ev.total));
      }
      if (ev.type == HttpEventType.Response) {
        this.progress[f.name].status = "completed"
      }
    }, error => {
      console.log(error)
      alert("Failed to upload " + f.name)
      this.fileUploadError[f.name] = true
      this.progress[f.name]["status"] = "error"
    })
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

  handleFile(e: any, ind: number) {
    if (e.target.files.length > 0) {
      for (const f of e.target.files) {
        this.filesForUpload[f.name] = f
        this.project.files[ind].name = f.name
        if (this.project.files[ind].fileType == this.fileTypes[0] || this.project.files[ind].fileType == this.fileTypes[1]) {

          const reader = new FileReader();
          reader.onload = (event) => {

            const loadedFile = reader.result;
            if (f.name.endsWith(".txt") || f.name.endsWith(".tsv")) {
              // @ts-ignore
              this.dfMap[f.name] = fromCSV(<string>loadedFile, {delimiter: "\t"})
            } else {
              this.dfMap[f.name] = fromCSV(<string>loadedFile)
            }
            this.selectedCols[f.name] = []
            this.primaryIDCols[f.name] = ""
            if (this.project.files[ind].fileType == this.fileTypes[1]) {
              this.fcCols[f.name] = []
              this.significantCols[f.name] = []
            }
          }
          reader.readAsText(f)
        }
      }
    }
  }

  createComparison(filename: string) {
    const comparisons: any[] = []
    for (const c of this.fcCols[filename]) {
      comparisons.push({fc: "", significant: "", filename: filename, name: ""})
    }
    this.comparisons = comparisons
  }

  updateSampleColumn(ind: number) {
    const cols: any[] = []
    for (const i of this.selectedCols[this.project.files[ind].name]) {
      cols.push({name: i, columnType: "sample"})
    }
    this.project.files[ind].sampleColumns = cols
  }
}
