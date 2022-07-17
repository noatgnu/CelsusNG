import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {WebService} from "../../service/web.service";
import {DataService} from "../../service/data.service";

@Component({
  selector: 'app-search-data',
  templateUrl: './search-data.component.html',
  styleUrls: ['./search-data.component.scss']
})
export class SearchDataComponent implements OnInit {

  @Output() result: EventEmitter<any[]> = new EventEmitter<any[]>()
  constructor(private web: WebService, public data: DataService) { }

  ngOnInit(): void {
  }

  handleSearch(e: any) {
    if (this.data.searchModel !== "") {
      this.web.searchDifferentialAnalysis(this.data.searchModel.split(" ")).subscribe(data => {
        data = data.replace(/NaN/g, "null")
        const res = JSON.parse(data)
        // @ts-ignore
        if (res["results"]) {
          // @ts-ignore
          if (res["results"].length > 0) {
            if ("unique_comparison" in res) {
              // @ts-ignore
              for (const c of res["unique_comparison"]) {
                this.data.comparisonMap[c.id] = c
              }
              this.data.comparisonIDs = Object.keys(this.data.comparisonMap)
            }
            if ("unique_project_ids" in res) {
              // @ts-ignore
              this.data.projectIDs = res["unique_project_ids"]
            }
            if ("unique_gene_names" in res) {
              // @ts-ignore
              this.data.geneNames = res["unique_gene_names"]
            }
            if ("gene_name_map" in res) {
              // @ts-ignore
              this.data.geneNameMap = res["gene_name_map"]
            }
            if ("unique_primary_ids" in res) {
              // @ts-ignore
              this.data.primaryIDs = res["unique_primary_ids"]
            }
            if ("total_pages" in res) {
              // @ts-ignore
              this.data.totalPages = res["total_pages"]
            }
            if ("count" in res) {
              // @ts-ignore
              this.data.totalResultCount = res["count"]
            }
            // @ts-ignore
            this.result.emit(res["results"])
          }
        }
      })
    }
  }
}
