import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataFrame, IDataFrame} from "data-forge";
import {WebService} from "../../service/web.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ProjectModalComponent} from "../project-modal/project-modal.component";
import {DataService} from "../../service/data.service";
import {RawDataModalComponent} from "../raw-data-modal/raw-data-modal.component";
import {BatchSelectionPromptComponent} from "../batch-selection-prompt/batch-selection-prompt.component";

@Component({
  selector: 'app-data-viewer',
  templateUrl: './data-viewer.component.html',
  styleUrls: ['./data-viewer.component.scss']
})
export class DataViewerComponent implements OnInit {
  _data: IDataFrame = new DataFrame()
  displayDF: IDataFrame = new DataFrame()
  projectNameFilterModel: string = ""
  comparisonNameFilterModel: string = ""
  primaryIDFilterModel: string = ""
  geneNamesFilterModel: string = ""
  sessionID: string = ""
  filterToggleMap: any = {"project_id": {"activeFilter": 0}, "primary_id": {"activeFilter": 0}, "comparison_id": {"activeFilter": 0}}
  filter: any = {
    "comparison_id": [],
    "primary_id": [],
    "project_id": [],
    "gene_names": []
  }
  expandView: any = {
    "comparison_id": false,
    "primary_id": false,
    "project_id": false,
    "gene_names": false
  }
  currentPage = 1
  per_page = 20
  private _session: any = {}
  updateSessionLater: boolean = true
  _geneNames: string[] = []
  get geneNames(): string[] {
    return this.dataService.geneNames.filter(a => this.filterSearch(this.geneNamesFilterModel, a))
  }

  @Input() set session(value: any) {
    this._session = value
    // if ("_id" in value) {
    //   for (const f in this.filterToggleMap) {
    //     this.filterToggleMap[f] = value[f]
    //   }
    //   console.log(this.filterToggleMap)
    //   if(this.dataService.comparisonMap) {
    //     this.updateSessionLater = false
    //     this.performUpdate()
    //   } else {
    //     this.updateSessionLater = true
    //   }
    // }
  }

  private _selectedInput: any[] = []

  @Output() selected: EventEmitter<any> = new EventEmitter<any>()
  @Input() set selectedInput(value: any[]) {
    this._selectedInput = value
    if (value.length > 0) {
      if(this.dataService.comparisonMap) {
        for (const r of value) {
          const comparison = this.dataService.comparisonMap[r["comparison_id"].toString()]
          this.updateFilterCounter("primary_id", r["primary_id"])
          if (this.filterToggleMap["comparison_id"][r["comparison_id"].toString()] !== true) {
            this.updateFilterCounter("comparison_id", r["comparison_id"].toString())
          }
          if (this.filterToggleMap["project_id"][comparison["project_id"].toString()] !== true) {
            this.filterToggleMap["project_id"][comparison["project_id"].toString()] = true
            this.updateFilterCounter("project_id", comparison["project_id"].toString())
          }
        }
        this.performUpdate()
      }
    }
  }
  @Input() project_id: number = 0
  @Input() ignoreAvailability: boolean = false
  @Input() set data(value: any[]) {
    this._data = new DataFrame(value)
    this.filterToggleMap = {"project_id": {"activeFilter": 0}, "primary_id": {"activeFilter": 0}, "comparison_id": {"activeFilter": 0}, "gene_names": {"activeFilter": 0}}
    this.currentPage = 1
    this.displayDF = new DataFrame(value)
    if (this.dataService.projectIDs.length > 0) {
      this.web.getProjects(this.dataService.projectIDs).subscribe(data => {
        // @ts-ignore
        if (data["results"]) {
          // @ts-ignore
          for (const p of data["results"]) {
            this.dataService.projects[p.id.toString()] = p
          }
          if (!("_id" in this._session)) {
            this.filterToggleMap["project_id"] = {"activeFilter": 0}
            // @ts-ignore
            for (const p of data["results"]) {
              this.filterToggleMap["project_id"][p.id.toString()] = false
            }
          }
          if (this.updateSessionLater) {
            for (const f in this.filterToggleMap) {
              if (this._session[f]) {
                this.filterToggleMap[f] = this._session[f]
              }
            }
            this.displayDF = new DataFrame(value)
            this.performUpdate()
          }
        }
      })
    }
  }

  constructor(public web: WebService, private modal: NgbModal, public dataService: DataService) { }

  ngOnInit(): void {
  }

  updateFilter(e: any, section: string, id: string) {
    this.updateFilterCounter(section, id);
    this.performUpdate();
    //this.displayDF = this._data.where(r =>  comparison_id_list.includes(r["comparison_id"].toString()) && primary_id_list.includes(r["primary_id"]) && project_id_list.includes(r["comparison"]["project_id"].toString())).bake()
  }

  private performUpdate(title: string = "") {
    const filter: any = {
      "comparison_id": [],
      "primary_id": [],
      "project_id": [],
      "gene_names": [],
      "title": title
    }
    for (const s in this.filterToggleMap) {
      if (this.filterToggleMap[s]["activeFilter"] !== 0) {
        for (const f in this.filterToggleMap[s]) {
          if (f !== "activeFilter") {
            if (this.filterToggleMap[s][f] === true) {
              switch (s) {
                case "primary_id":
                  filter[s].push(f)
                  break
                case "project_id":
                  filter[s].push(parseInt(f))
                  break
                case "comparison_id":
                  filter[s].push(parseInt(f))
                  break
                case "gene_names":
                  filter[s].push(f)
                  break
              }
            }
          }
        }
      }
      /*else {
        switch (s) {
          case "primary_id":
            primary_id_list = this.dataService.primaryIDs.slice()
            break
          case "project_id":
            project_id_list = this.dataService.projectIDs.slice()
            break
          case "comparison_id":
            comparison_id_list = this.dataService.comparisonIDs.slice()
        }
      }*/
    }
    this.filter = filter

    console.log(filter)
    this.selected.emit(this.filter)

    this.web.searchDifferentialAnalysis([], 1, 20, "filter", this.filter, this.ignoreAvailability).subscribe(data => {
      data = data.replace(/NaN/g, "null")
      const res = JSON.parse(data)
      this.displayDF = new DataFrame(res["results"])
      console.log(this.displayDF)
      if ("total_pages" in res) {
        // @ts-ignore
        this.dataService.totalPages = res["total_pages"]
      }
      if ("count" in res) {
        // @ts-ignore
        this.dataService.totalResultCount = res["count"]
      }
    })
  }

  private updateFilterCounter(section: string, id: string) {
    if (this.filterToggleMap[section][id] === undefined) {
      this.filterToggleMap[section][id] = true
    }
    if (this.filterToggleMap[section][id] === false) {
      this.filterToggleMap[section]["activeFilter"] = this.filterToggleMap[section]["activeFilter"] - 1
    } else {
      this.filterToggleMap[section]["activeFilter"] = this.filterToggleMap[section]["activeFilter"] + 1
    }
  }

  openProjectModal(p: any) {
    const ref = this.modal.open(ProjectModalComponent, {size: "xl"})
    ref.componentInstance.project = p
  }

  updateViewer(e: number) {
    this.web.searchDifferentialAnalysis([],e,20,"filter",this.filter, this.ignoreAvailability).subscribe(data => {
      console.log(data)
      console.log(this.filter)
      data = data.replace(/NaN/g, "null")
      const res = JSON.parse(data)
      this.displayDF = new DataFrame(res["results"])
      if ("total_pages" in res) {
        // @ts-ignore
        this.dataService.totalPages = res["total_pages"]
      }
      if ("count" in res) {
        // @ts-ignore
        this.dataService.totalResultCount = res["count"]
      }
    })
  }

  toggleView(section: string) {
    this.expandView[section] = !this.expandView[section]
  }

  openRawDataModal(r: any) {
    const ref = this.modal.open(RawDataModalComponent, {size: "xl"})
    ref.componentInstance.data = r
  }

  filterSearch(term: string, source: string) {
    if (term !== "") {
      return new RegExp(term, "mi").test(source)
    } else {
      return true
    }

  }

  downloadDifferentialAnalysis() {
    this.web.searchDifferentialAnalysis([], 1,20,"filter",this.filter, this.ignoreAvailability, false, "txt").subscribe(data => {
      const res = data.replace(/NaN/g, "null")
      const body = JSON.parse(res)
      // @ts-ignore
      if (body["download-token"]) {
        // @ts-ignore
        window.open(this.web.hostURL + "/api/download/" + body["download-token"] + "/", "_blank")
      }
    })
  }

  saveSession() {
    this.web.saveSession(this.filterToggleMap).subscribe(data => {
      // @ts-ignore
      this.sessionID = data["_id"]
    })
  }

  getCurrentSession() {
    if ("_id" in this._session) {
      return window.location.href.replace(this._session["_id"], "") + this.sessionID
    }
    return window.location.href + "/" + this.sessionID
  }

  openBatchSearch() {
    const ref = this.modal.open(BatchSelectionPromptComponent)
    ref.closed.subscribe(data => {
      this.filterToggleMap = {"project_id": {"activeFilter": 0}, "primary_id": {"activeFilter": 0}, "comparison_id": {"activeFilter": 0}, "gene_names": {"activeFilter": 0}}
      let res: string[] = []
      for (const r of data.data.split("\n")) {
        const n = r.replace(/\n/g, "").replace(/\r/g, "")
        if (n !== "") {
          const pattern = new RegExp(n.toUpperCase() +"?\\s")
          let result: string[] = []
          switch (data.searchType) {
            case "gene_names":
              result = this.dataService.geneNames.filter(a => {
                if (a) {
                  return pattern.test(a.toUpperCase());
                }
                return false
              })
              break
            case "primary_ids":
              result = this.dataService.primaryIDs.filter(a => {
                if (a) {
                  return pattern.test(a.toUpperCase());
                }
                return false
              })
              break
          }
          if (result.length > 0) {
            res = res.concat(result)
          }
        }
      }
      for (const r of res) {
        switch (data.searchType) {
          case "gene_names":
            this.updateFilterCounter("gene_names", r);
            break
          case "primary_ids":
            this.updateFilterCounter("primary_id", r);
            break
        }
      }
      if (res.length > 0) {
        this.performUpdate(data.title)
      }
    })
  }
}
