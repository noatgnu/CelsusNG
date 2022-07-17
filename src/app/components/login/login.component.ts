import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {WebService} from "../../service/web.service";
import {DataService} from "../../service/data.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username = ""
  password = ""
  @Output() loginEvent: EventEmitter<boolean> = new EventEmitter<boolean>()
  constructor(public web: WebService, private data: DataService) { }

  ngOnInit(): void {
  }

  login() {
    this.web.login(this.web.username, this.web.password).subscribe(data => {
      if (data.status === 200) {
        const token = data.headers.get("Access-Token")
        if (token) {
          this.web.access_token = token
          this.password = ""
          this.loginEvent.emit(true)
          /*this.web.adminGetProjects(1).subscribe(data => {
            // @ts-ignore
            if (data["results"]) {
              // @ts-ignore
              this.data.adminProjects = data["results"]
            }
          })*/
        }
      }
    })
  }
}
