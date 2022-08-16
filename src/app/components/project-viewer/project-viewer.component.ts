import { Component, OnInit } from '@angular/core';
import {WebService} from "../../service/web.service";
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../../service/data.service";
import {DataFrame, IDataFrame} from "data-forge";

@Component({
  selector: 'app-project-viewer',
  templateUrl: './project-viewer.component.html',
  styleUrls: ['./project-viewer.component.scss']
})
export class ProjectViewerComponent implements OnInit {
  project: any = {}
  finished: boolean = false
  results: any[] = []
  df: IDataFrame = new DataFrame()
  dataViewerSelection: any = {
    "comparison_id": [],
    "primary_id": [],
    "project_id": [],
    "gene_names": []
  }

  sessionData: any = {}

  plotSelection: any[] = []
  constructor(public web: WebService, private route: ActivatedRoute, private data: DataService) {
    this.route.params.subscribe(params => {
      if (params) {
        if (params["id"]) {
          this.web.getProjects([params["id"]]).subscribe(data => {
            // @ts-ignore
            if (data['results'].length > 0) {
              // @ts-ignore
              this.project = data["results"][0]
              console.log(this.project)
              this.web.searchDifferentialAnalysis(
                [],1,20,"initial search",{"project_id": [this.project.id]},
                true, true).subscribe(data => {
                const res = JSON.parse(data.replace(/NaN/g, "null"))
                if (res["results"]) {
                  // @ts-ignore
                  if (res["results"].length > 0) {
                    this.df = new DataFrame(res["all_results"])
                    this.results = res["results"]
                    if ("unique_comparison" in res) {
                      // @ts-ignore
                      for (const c of res["unique_comparison"]) {
                        this.data.comparisonMap[c.id] = c
                      }
                      this.data.comparisonIDs = Object.keys(this.data.comparisonMap)
                    }
                    if ("unique_project_ids" in res) {
                      // @ts-ignore
                      this.data.projectIDs = res["unique_project_ids"].map(a => a.toString())

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
                  }
                }
              })
              this.finished = true
              if (params["session"]) {
                this.web.getSession(params["session"]).subscribe(data => {
                  this.sessionData = data
                })
              }
            }
          })
        }
      }
    })
  }

  handleDataViewerSelection(e: any) {
    this.dataViewerSelection = e
  }

  ngOnInit(): void {
  }

  handlePlotSelection(e: any[]) {
    this.plotSelection = e
    console.log(this.plotSelection)
  }
}
