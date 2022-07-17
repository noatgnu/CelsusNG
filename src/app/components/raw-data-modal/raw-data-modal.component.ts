import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {WebService} from "../../service/web.service";
import {DataService} from "../../service/data.service";

@Component({
  selector: 'app-raw-data-modal',
  templateUrl: './raw-data-modal.component.html',
  styleUrls: ['./raw-data-modal.component.scss']
})
export class RawDataModalComponent implements OnInit {
  rawData: any[] = []
  @Input() set data(value: any) {
    this.web.getRawData(value.primary_id, this.dataService.comparisonMap[value.comparison_id.toString()].project_id).subscribe(res => {
      // @ts-ignore
      this.rawData = res["results"]
    })
  }
  constructor(public modal: NgbActiveModal, private web: WebService, private dataService: DataService) { }

  ngOnInit(): void {
  }

}
