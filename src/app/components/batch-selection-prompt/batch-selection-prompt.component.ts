import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {WebService} from "../../service/web.service";

@Component({
  selector: 'app-batch-selection-prompt',
  templateUrl: './batch-selection-prompt.component.html',
  styleUrls: ['./batch-selection-prompt.component.scss']
})
export class BatchSelectionPromptComponent implements OnInit {
  builtInList: string[] = []
  data = {
    title: "",
    data: "",
    searchType: "gene_names"
  }
  constructor(public modal: NgbActiveModal, public web: WebService) {
    this.builtInList = Object.keys(this.web.filters)
  }

  ngOnInit(): void {
  }

  submit() {
    this.modal.close(this.data)
  }

  updateTextArea(categoryName: string) {
    this.web.getFilter(categoryName).then(r => {
      this.data.data = r
      this.data.title = this.web.filters[categoryName].name
    })
  }
}
