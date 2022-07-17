import {Component, Input, OnInit} from '@angular/core';
import {DataFrame, IDataFrame} from "data-forge";
import {WebService} from "../../service/web.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ProjectModalComponent} from "../project-modal/project-modal.component";
import {DataService} from "../../service/data.service";
import {RawDataModalComponent} from "../raw-data-modal/raw-data-modal.component";
import {FilterSearch} from "../../classes/filter-search";

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
  @Input() project_id: number = 0
  @Input() ignoreAvailability: boolean = false
  @Input() set data(value: any[]) {
    console.log(this.ignoreAvailability)
    this._data = new DataFrame(value)
    this.filterToggleMap = {"project_id": {"activeFilter": 0}, "primary_id": {"activeFilter": 0}, "comparison_id": {"activeFilter": 0}, "gene_names": {"activeFilter": 0}}
    this.currentPage = 1
    this.displayDF = new DataFrame(value)
    if (this.dataService.projectIDs.length > 0) {
      this.web.getProjects(this.dataService.projectIDs).subscribe(data => {
        // @ts-ignore
        if (data["results"]) {
          this.filterToggleMap["project_id"] = {"activeFilter": 0}
          // @ts-ignore
          for (const p of data["results"]) {
            this.filterToggleMap["project_id"][p.id.toString()] = false
            this.dataService.projects[p.id.toString()] = p
          }
        }
      })
    }
  }

  constructor(public web: WebService, private modal: NgbModal, public dataService: DataService) { }

  ngOnInit(): void {
  }

  updateFilter(e: any, section: string, id: string) {
    if (this.filterToggleMap[section][id] === false) {
      this.filterToggleMap[section]["activeFilter"] = this.filterToggleMap[section]["activeFilter"] - 1
    } else {
      this.filterToggleMap[section]["activeFilter"] = this.filterToggleMap[section]["activeFilter"] + 1
    }
    this.filter = {
      "comparison_id": [],
      "primary_id": [],
      "project_id": [],
      "gene_names": []
    }
    for (const s in this.filterToggleMap) {
      if (this.filterToggleMap[s]["activeFilter"] !== 0) {
        for (const f in this.filterToggleMap[s]) {
          if (f !== "activeFilter") {
            if (this.filterToggleMap[s][f] === true) {
              switch (s) {
                case "primary_id":
                  this.filter[s].push(f)
                  break
                case "project_id":
                  this.filter[s].push(parseInt(f))
                  break
                case "comparison_id":
                  this.filter[s].push(parseInt(f))
                  break
                case "gene_names":
                  this.filter[s].push(f)
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

    this.web.searchDifferentialAnalysis([],1,20,"filter",this.filter, this.ignoreAvailability).subscribe(data => {
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
    //this.displayDF = this._data.where(r =>  comparison_id_list.includes(r["comparison_id"].toString()) && primary_id_list.includes(r["primary_id"]) && project_id_list.includes(r["comparison"]["project_id"].toString())).bake()
  }

  openProjectModal(p: any) {
    const ref = this.modal.open(ProjectModalComponent, {size: "xl"})
    ref.componentInstance.project = p
  }

  updateViewer(e: number) {
    this.web.searchDifferentialAnalysis([],e,20,"filter",this.filter).subscribe(data => {
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
    console.log(term)
    if (term !== "") {
      const match = new RegExp(term, "mi").test(source)
      return match
    } else {
      return true
    }

  }
}
