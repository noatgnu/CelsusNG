import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataFrame, IDataFrame} from "data-forge";
import {DataService} from "../../service/data.service";

@Component({
  selector: 'app-protein-scatter-plot',
  templateUrl: './protein-scatter-plot.component.html',
  styleUrls: ['./protein-scatter-plot.component.scss']
})
export class ProteinScatterPlotComponent implements OnInit {
  private _data: IDataFrame = new DataFrame()
  @Output() selected: EventEmitter<any[]> = new EventEmitter<any[]>()
  layoutMaxMin: any = {
    xMin: 0, xMax: 0, yMin: 0, yMax: 0
  }
  graphData: any = []
  graphLayout: any = {
    height: 600, width: 600, xaxis: {title: "Log2FC"}, yaxis: {title: "-log10(p-value)"},
    title: "Differential Analysis Data Distribution", annotations: [], legend: {
      orientation: 'h'
    }
  }
  background: boolean = true
  backgroundColor: string = "#EEEEEE"
  fcCutoff = 0.6
  significantCutoff = 0.05
  private _externalSelectionFilter: any = {
    "comparison_id": [],
    "primary_id": [],
    "project_id": [],
    "gene_names": []
  }
  @Input() set externalSelectionFilter(value: any) {
    this._externalSelectionFilter = value
    console.log(value)
    this.draw()
  }
  get externalSelectionFilter(): any {
    return this._externalSelectionFilter
  }

  @Input() set data(value: IDataFrame) {
    this._data = value
    this.draw();
  }
  dataMap: Map<string, any> = new Map<string, any>()
  draw() {
    this.dataMap = new Map<string, any>()
    this.layoutMaxMin = {
      xMin: 0, xMax: 0, yMin: 0, yMax: 0
    }

    this.layoutMaxMin.xMin = this._data.getSeries("foldChange").min()
    this.layoutMaxMin.xMax = this._data.getSeries("foldChange").max()
    this.layoutMaxMin.yMin = -Math.log10(this._data.getSeries("significant").max())
    this.layoutMaxMin.yMax = -Math.log10(this._data.getSeries("significant").min())
    this.graphLayout.xaxis.range =
      [this.layoutMaxMin.xMin - 0.5, this.layoutMaxMin.xMax + 0.5]

    this.graphLayout.yaxis.range =
      [0,  this.layoutMaxMin.yMax + this.layoutMaxMin.yMin*2]

    const temp: any = {}
    for (const r of this._data) {
      const comparison = this.dataService.comparisonMap[r["comparison_id"].toString()]
      const comparisonName = comparison.name
      let text = `<b>Gene:</b>${r["gene_names"]}<br>`
      text = `${text}<b>Primary ID:</b>${r["primary_id"]}<br>`
      let project = ""
      if (this.dataService.projects[comparison.project_id.toString()]) {
        text = `${text}<b>Comparison:</b>${comparison.name}<br>`
        text = `${text}<b>Project:</b>${this.dataService.projects[comparison.project_id.toString()].title}<br>`
        project = this.dataService.projects[comparison.project_id.toString()].title
      } else {
        text = text + "<b>Comparison:</b>" + comparison.name + "<br>"
      }
      text = `${text}<b>Log2FC:</b>${r["foldChange"]}<br><b>Significant:</b>${r["significant"]}<br>`
      this.dataMap.set(text, r)
      let group = ""
      if (this.externalSelectionFilter["comparison_id"].length > 0 || this.externalSelectionFilter["project_id"].length > 0) {
        if (this.externalSelectionFilter["comparison_id"].includes(r["comparison_id"]) || this._externalSelectionFilter["project_id"].includes(comparison["project_id"])) {
          if (group === "") {
            if (this.externalSelectionFilter["primary_id"].length > 0) {
              if (this.externalSelectionFilter["primary_id"].includes(r["primary_id"]) && this.externalSelectionFilter["comparison_id"].includes(r["comparison_id"])) {
                group = r["gene_names"]
              }
            } else if (this.externalSelectionFilter["gene_names"].length > 0 ) {
              if (this.externalSelectionFilter["gene_names"].includes(r["gene_names"]) && this.externalSelectionFilter["comparison_id"].includes(r["comparison_id"])) {
                group = r["gene_names"]
              }
            }
          }
        }
      } else {
        if (this.externalSelectionFilter["primary_id"].length > 0) {
          if (this.externalSelectionFilter["primary_id"].includes(r["primary_id"])) {
            group = r["gene_names"]
          }
        } else if (this.externalSelectionFilter["gene_names"].length > 0 ) {
          if (this.externalSelectionFilter["gene_names"].includes(r["gene_names"])) {
            group = r["gene_names"]
          }
        }
      }
      if (group === "") {
        group = this.significantGroup(r["foldChange"], r["significant"], this.background)
      }
      if (group !== "background") {
        if (comparisonName !== "") {
          group = group + " <b>" + comparison.name + "</b>"
        }
        if (project !== "") {
          group = group + "(" + project + ")"
        }
      }
      if (!temp[group]) {
        temp[group] = {
          x: [],
          y: [],
          text: [],
          // hovertemplate:
          //   `<b>Log2FC:</b> %{x:.2f}<br><b>-log10(p-value):</b>%{y:.2f}<br>%{text}`,
          type: "scattergl",
          mode: "markers",
          name: group
        }
        if (group === "background") {
          temp[group].marker = {
            color: this.backgroundColor
          }
        }
      }
      temp[group].x.push(r["foldChange"])
      temp[group].y.push(-Math.log10(r["significant"]))
      temp[group].text.push(text)
    }
    const graph: any[] = []
    for (const g in temp) {
      graph.push(temp[g])
    }
    this.drawCutoffShape()
    this.graphData = graph
    console.log(this.graphData)
  }

  drawCutoffShape() {
    const cutOff: any[] = []
    cutOff.push({
      type: "line",
      x0: -this.fcCutoff,
      x1: -this.fcCutoff,
      y0: 0,
      y1: this.graphLayout.yaxis.range[1]+10,
      line: {
        color: 'rgb(21,4,4)',
        width: 1,
        dash: 'dot'
      }
    })
    cutOff.push({
      type: "line",
      x0: this.fcCutoff,
      x1: this.fcCutoff,
      y0: 0,
      y1: this.graphLayout.yaxis.range[1]+10,
      line: {
        color: 'rgb(21,4,4)',
        width: 1,
        dash: 'dot'
      }
    })

    cutOff.push({
      type: "line",
      x0: this.layoutMaxMin.xMin - 10,
      x1: this.layoutMaxMin.xMax + 10,
      y0: -Math.log10(this.significantCutoff),
      y1: -Math.log10(this.significantCutoff),
      line: {
        color: 'rgb(21,4,4)',
        width: 1,
        dash: 'dot'
      }
    })
    this.graphLayout.xaxis.autoscale = true
    this.graphLayout.yaxis.autoscale = true
    this.graphLayout.shapes = cutOff
  }

  get data(): IDataFrame {
    return this._data
  }
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
  }

  significantGroup(x: number, y: number, returnBackground: boolean = false) {
    const ylog = this.significantCutoff
    const groups: string[] = []
    if (ylog > y) {
      groups.push("P-value < " + this.significantCutoff)
    } else {
      if (returnBackground){
        return "background"
      }
      groups.push("P-value >= " + this.significantCutoff)
    }

    if (Math.abs(x) > this.fcCutoff) {
      groups.push("FC > " + this.fcCutoff)
    } else {
      if (returnBackground){
        return "background"
      }
      groups.push("FC <= " + this.fcCutoff)
    }

    return groups.join(";")
  }

  selectData(e: any) {
    if ("points" in e) {
      const selected: string[] = []
      for (const p of e["points"]) {
        selected.push(this.dataMap.get(p.text))
      }
      if (selected.length > 0) {
        this.selected.emit(selected)
      }
    }
  }
}
