import { Component, OnInit } from '@angular/core';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  OperatorFunction,
  switchMap,
  tap
} from "rxjs";
import {WebService} from "../../service/web.service";
import {QuickResults} from "../../classes/quick-results";

@Component({
  selector: 'app-create-custom-view',
  templateUrl: './create-custom-view.component.html',
  styleUrls: ['./create-custom-view.component.scss']
})
export class CreateCustomViewComponent implements OnInit {
  projectModel: any = {}
  searching: boolean = false
  searchFailed: boolean = false
  results: QuickResults = new QuickResults()
  comparisonMap: any = {}
  projects: any[] = []
  proteinModel: any = {}

  searchProject: OperatorFunction<string, readonly any[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term => this.getProjects(term).pipe(
        tap(() => this.searchFailed = false),
        catchError(() => {
          this.searchFailed = true
          return of([])
        }))),
      tap(() => this.searching = false)
    )
  constructor(private web: WebService) { }

  ngOnInit(): void {
  }

  getProjects(term: string) {
    // @ts-ignore
    return this.web.getQuickData(term, "project", []).pipe(tap(data => this.results = data), map(
      data => {
        return data.results
      }
    ))
  }

  inputFormatter(i: any) {
    return i.title
  }

  addProject() {
    this.projects.push(this.projectModel)
    this.comparisonMap[this.projectModel.id.toString()] = []
  }

  remove(id: number, type: string) {
    switch (type) {
      case "project":
        this.projects = this.projects.filter(p => p.id !== id)
        break
      case "comparison":
        break
    }
    delete this.comparisonMap[id.toString()]
  }

  submit() {
    const filter: any = {
      "comparison_id": [],
      "primary_id": [],
      "project_id": [],
      "gene_names": [],
    }
    for (const p in this.comparisonMap) {
      filter["project_id"].push(parseInt(p))
      filter["comparison_id"] = filter["comparison_id"].concat(this.comparisonMap[p])
    }
  }
}
