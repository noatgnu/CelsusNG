import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-raw-data-bar-chart',
  templateUrl: './raw-data-bar-chart.component.html',
  styleUrls: ['./raw-data-bar-chart.component.scss']
})
export class RawDataBarChartComponent implements OnInit {
  graphData: any = []
  graphLayout: any = {
    title: {
      text: "",
      font: {
        family: "Arial Black",
        size: 24,
      }
    },
    margin: {l:300, r:50, t:50, b:50},
    height: 400,
    xaxis: {
      "title": "<b>Intensity</b>"
    },
    yaxis: {
      "title" : "<b>Samples</b>",
      "type" : "category",
      "tickmode": "array",
      "tickvals": [],
      "ticktext": [],
      "tickfont": {
        "size": 17,
        "color": 'black'
      }
    },
    shapes: []
  }

  @Input() set data(value: any[]) {
    console.log(value)
    this.graphLayout.yaxis.tickvals = []
    this.graphLayout.yaxis.ticktext = []
    const temp: any = {}
    let sampleNumber = 0
    let height = 400
    for (const r of value) {
      const names = r.sampleColumn.name.split(".")
      let condition = r.sampleColumn.name
      if (names.length > 1) {
        condition = names.slice(0, names.length-1).join(".")
      }
      if (!temp[condition]) {
        temp[condition] = {
          type: "bar",
          x: [],
          y: [],
          orientation: "h",
          showlegend: false,
          name: condition
        }
      }
      sampleNumber ++
      temp[condition].x.push(r.value)
      temp[condition].y.push(r.sampleColumn.name)
      height = height + 50
    }
    let currentSampleNumber: number = 0
    const graphData: any[] = []
    const shapes: any[] = []
    for (const t in temp) {
      currentSampleNumber = currentSampleNumber + temp[t].x.length
      graphData.push(temp[t])
      this.graphLayout.yaxis.tickvals.push(temp[t].y[Math.round(temp[t].y.length/2)-1])
      this.graphLayout.yaxis.ticktext.push(t)
      if (sampleNumber !== currentSampleNumber) {
        shapes.push({
          type: "line",
          xref: "paper",
          yref: "paper",
          x0: 0,
          x1: 1,
          y0: currentSampleNumber/sampleNumber,
          y1: currentSampleNumber/sampleNumber,
          line: {
            dash: "dash",
          },

        })
      }
    }
    this.graphLayout.height = height
    this.graphLayout.shapes = shapes
    this.graphData = graphData
  }
  constructor() { }

  ngOnInit(): void {
  }

}
