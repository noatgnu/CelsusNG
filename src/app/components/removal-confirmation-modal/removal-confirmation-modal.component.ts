import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-removal-confirmation-modal',
  templateUrl: './removal-confirmation-modal.component.html',
  styleUrls: ['./removal-confirmation-modal.component.scss']
})
export class RemovalConfirmationModalComponent implements OnInit {
  @Input() project: any = {}
  constructor(public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
