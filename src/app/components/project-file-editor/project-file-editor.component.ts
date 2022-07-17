import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbDateStruct, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {WebService} from "../../service/web.service";
import {HttpEventType} from "@angular/common/http";
import {fromCSV} from "data-forge";

@Component({
  selector: 'app-project-file-editor',
  templateUrl: './project-file-editor.component.html',
  styleUrls: ['./project-file-editor.component.scss']
})
export class ProjectFileEditorComponent implements OnInit {
  project: any = {}
  finished: boolean = false
  fileTypes: string[] = [
    "Raw",
    "Differential analysis",
    "Other"
  ]
  progress: any = {}
  dfMap: any = {}
  selectedCols: any = {}
  primaryIDCols: any = {}

  fcCols: any = {}

  significantCols: any = {}

  fileUploadError: any = {}

  comparisons: any[] = []
  editPanelShow: any = {}

  sampleColumnMap: any = {}
  columnNameObjectMap: any = {}
  columnsMap: any = {}

  comparisonMap: any = {}
  comparisonIDListMap: any = {}
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
      for (const f of this.project.files) {
        this.editPanelShow[f.id.toString()] = false
        this.columnsMap[f.id.toString()] = []
        this.columnNameObjectMap[f.id.toString()] = {}
        this.comparisonMap[f.id.toString()] = {}
        this.comparisonIDListMap[f.id.toString()] = []
        for (const c of this.project.comparison) {
          this.comparisonMap[f.id.toString()][c.id.toString()] = c
          this.comparisonIDListMap[f.id.toString()].push(c.id.toString())
        }
      }
      console.log(this.project)
      this.finished = true
    })
  }
  constructor(public web: WebService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  removeValue(ind: number, dataType: string) {
    // @ts-ignore
    this.project[dataType].splice(ind, 1)
  }

  addFile() {
    this.project.files.push({name: "", fileType: "", sampleColumns: []})
  }

  startEdit(ind: number) {
    // @ts-ignore
    this.web.getFileColumn(this.project.files[ind]).subscribe(data => {
      // @ts-ignore
      this.project.files[ind].sampleColumns = data["sampleColumns"]
      this.sampleColumnMap[this.project.files[ind].id.toString()] = {}
      // @ts-ignore
      this.columnsMap[this.project.files[ind].id.toString()] = data["results"]
      for (const s of this.project.files[ind].sampleColumns) {
        if (!(s.columnType in this.sampleColumnMap[this.project.files[ind].id.toString()])) {
          this.sampleColumnMap[this.project.files[ind].id.toString()][s.columnType] = []
        }

        this.sampleColumnMap[this.project.files[ind].id.toString()][s.columnType].push(s.name)
        this.columnNameObjectMap[this.project.files[ind].id.toString()][s.name] = s
      }
      this.editPanelShow[this.project.files[ind].id.toString()] = true
    })
  }

  submitUpdate() {
    for (let ind = 0; ind < this.project.files.length; ind++) {
      if (this.project.files[ind].id) {
        const sampleColumns: any[] = []
        for (const ct in this.sampleColumnMap[this.project.files[ind].id.toString()]) {
          for (const c of this.sampleColumnMap[this.project.files[ind].id.toString()][ct]) {
            if (c in this.columnNameObjectMap[this.project.files[ind].id.toString()]) {
              sampleColumns.push(this.columnNameObjectMap[this.project.files[ind].id.toString()][c])
            } else {
              sampleColumns.push({name: c, columnType: ct})
            }
          }
        }
        this.project.files[ind].sampleColumns = sampleColumns
      } else {
        const cols: any[] = []
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
        this.project.files[ind].sampleColumns = cols
        if (this.selectedCols[this.project.files[ind].name].length > 0) {
          for (const s of this.selectedCols[this.project.files[ind].name]) {
            this.project.files[ind].sampleColumns.push({name: s, columnType: "sample"})
          }
        }

      }

    }
    this.project.comparison = this.comparisons
    console.log(this.project)
    this.web.adminUpdateProject(this.project, [
      "files", "comparison"
    ]).subscribe(data=> {
      if (data) {
        console.log(data)
        // @ts-ignore
        this.web.uniqueID = data.body["results"][0]["id"]
        if (this.web.uniqueID !== "") {
          this.uploadProjectFiles();
        }
      }
    })
  }

  uploadProjectFiles() {
    if (this.project.files.length > 0) {
      for (const f of this.project.files) {
        if (f.name in this.dfMap) {
          this.fileUploadError[f.name] = false
          if (this.progress[f.name] !== undefined) {
            if (this.progress[f.name] === 100) {
              //continue
            }
          }
          this.progress[f.name] = 0
          this.uploadFile(f);
        }
      }
    }
  }
  filesForUpload: any = {}
  uploadFile(f: any) {
    this.web.uploadFile(this.filesForUpload[f.name]).subscribe(ev => {
      if (ev.type == HttpEventType.UploadProgress) {
        console.log(ev)
        // @ts-ignore
        this.progress[f.name] = Math.round(100 * (ev.loaded / ev.total));
      }
    }, error => {
      console.log(error)
      alert("Failed to upload " + f.name)
      this.fileUploadError[f.name] = true
    })
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

}
