export class QuickResults {
  results: any[] = []
  type: string = ""

  constructor(results?: any[], type?: string) {
    if (results) {
      this.results = results
    }
    if (type) {
      this.type = type
    }
  }
}
