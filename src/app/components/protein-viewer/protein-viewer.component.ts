import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {WebService} from "../../service/web.service";
import {DataFrame, IDataFrame} from "data-forge";
import {DataService} from "../../service/data.service";

@Component({
  selector: 'app-protein-viewer',
  templateUrl: './protein-viewer.component.html',
  styleUrls: ['./protein-viewer.component.scss']
})
export class ProteinViewerComponent implements OnInit {
  df: IDataFrame = new DataFrame()
  uniprotData: any = {}
  results: any[] = []
  finsihed: boolean = false
  sessionData: any = {}
  dataViewerSelection: any = {
    "comparison_id": [],
    "primary_id": [],
    "project_id": [],
    "gene_names": []
  }

  plotSelection: any[] = []

  constructor(private route: ActivatedRoute, private web: WebService, public data: DataService) {
    this.route.params.subscribe(params => {
      if (params["protein_id"]) {
        if (params["project_id"]) {
          this.web.getUnipot(params["protein_id"].split(";")[0].split("-")[0]).subscribe(data => {
            this.uniprotData = data
          })

          let project: number[] = []
          if (params["project_id"] !== "0") {
            project = params["project_id"].split(",").map((a: string) => parseInt(a))
            this.web.getProjects(params["project_id"].split(",")).subscribe(data => {
              // @ts-ignore
              if (data["results"]) {
                // @ts-ignore
                for (const p of data["results"]) {
                  this.data.projects[p.id.toString()] = p
                }
                this.getDifferentialData(params, project);

              }
            })
          } else {
            this.web.getProjects(["0"]).subscribe(data => {
              // @ts-ignore
              if (data["results"]) {
                // @ts-ignore
                for (const p of data["results"]) {
                  this.data.projects[p.id.toString()] = p
                }
                this.getDifferentialData(params, project);

              }
            })
          }
        }
      }
    })
  }

  private getDifferentialData(params: any, project: number[]) {
    const term: string[] = [decodeURI(params["protein_id"])]
    for (const p of decodeURI(params["protein_id"]).split(";")) {
      if (!term.includes(p)) {
        term.push(p)
      }

      const Re = /([OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2})(-\d+)?/;
      const match = Re.exec(p)
      if (match) {
        if (!term.includes(match[1])) {
          term.push(match[1])
        }
      }
    }
    this.web.searchDifferentialAnalysis(
      term, 1, 20, "initial search", {
        "project_id": project
      }, false, true
    ).subscribe(data => {
      const res = JSON.parse(data.replace(/NaN/g, "null"))
      this.results = res["results"]
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
        this.df = new DataFrame(res["all_results"])
        console.log(this.df)
        if (params["session"]) {
          this.web.getSession(params["session"]).subscribe(data => {
            this.sessionData = data
          })
        }
      }
      this.finsihed = true
    })
  }

  ngOnInit(): void {
  }
  handleDataViewerSelection(e: any) {
    this.dataViewerSelection = e
  }
}
