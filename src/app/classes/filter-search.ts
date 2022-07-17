import {debounce, debounceTime, distinctUntilChanged, filter, map, OperatorFunction, switchMap, tap} from "rxjs";

export class FilterSearch {
  data: string[] = []
  constructor(data: string[]) {
    this.data = data
  }

  search: OperatorFunction<string, string[]> = (text$) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter(term => term.length >= 2),
      map(term => this.data.filter(d => new RegExp(term, "mi").test(d)).slice(0,10))
    )

}
