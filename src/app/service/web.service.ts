import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Project} from "../classes/project";

@Injectable({
  providedIn: 'root'
})
export class WebService {
  username = "admin"
  password = ""
  hostURL = "http://localhost:8000"
  uniqueID = ""
  justSearched: string[] = []
  currentPage = 1
  per_page = 20
  access_token = ""
  constructor(private http: HttpClient) { }

  submitProject(project: Project) {
    return this.http.post(this.hostURL + "/api/project/", JSON.stringify(project), {responseType: "json", observe: "body"})
  }

  searchDifferentialAnalysis(term: string[] = [], page: number = 1, per_page: number = 20, type: string = "initial search", filter: any = {}, ignoreAvailability: boolean = false, all:boolean = false, format: string = "json") {
    if (type !== "initial search") {
      if (term.length == 0) {
        term = this.justSearched.slice()
      }
    } else {
      this.justSearched = term.slice()
    }
    return this.http.post(this.hostURL + "/api/search/", JSON.stringify({"term": term, "page": page, "per_page": per_page, "type": type, "filter": filter, "ignoreAvailability": ignoreAvailability, "all": all, format: format}), {responseType: "text", observe: "body"})
  }

  getProjects(ids: string[]) {
    return this.http.get(this.hostURL + "/api/project/"+ids.join(",")+"/", {responseType: "json", observe: "body"})
  }

  uploadFile(file: File) {
    const formData = new FormData()
    formData.append(file.name, file)
    let headers = new HttpHeaders()
      .set("Content-Type", "text/plain")
      .set("Unique-ID", this.uniqueID.toString())
      .set("Filename", file.name)
    console.log(headers)
    return this.http.put(
      this.hostURL + "/api/upload/", formData, {
        headers: headers,
        reportProgress: true,
        observe: "events",
        responseType: "blob"
      }
    )
  }

  login(username: string, password: string) {
    return this.http.post(this.hostURL + "/api/login/", {username, password},{responseType: "json", observe: "response"})
  }

  adminCheckToken(username: string) {
    return this.http.post(this.hostURL + "/api/admin/check/", {username, access_token: this.access_token}, {responseType: "json", observe: "response"})
  }

  adminGetProjects(page: number, term: string = "") {
    const headers = new HttpHeaders().set("Access-Token", this.access_token)
    return this.http.post(this.hostURL + "/api/admin/", {username: this.username, page, per_page: 20, type: "project", term: term}, {responseType: "json", observe: "body", headers: headers})
  }

  adminUpdateProject(project: any, updateProperties: string[]) {
    const headers = new HttpHeaders().set("Access-Token", this.access_token)
    return this.http.patch(this.hostURL + "/api/project/", {username: this.username, project: project, updateProperties: updateProperties}, {responseType: "json", observe: "response", headers: headers})
  }

  getFileColumn(file: any) {
    const headers = new HttpHeaders().set("Access-Token", this.access_token)
    return this.http.post(this.hostURL + "/api/columns/", {username: this.username, file: file},{responseType: "json", observe: "body", headers: headers})

  }

  getUnipot(uniprotId: string) {
    const Re = /([OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2})(-\d+)?/;
    const match = Re.exec(uniprotId)
    if (match) {
      return this.http.get("https://rest.uniprot.org/uniprotkb/" + match[1], {responseType: "json", observe: "body"})
    } else {
      return this.http.get("https://rest.uniprot.org/uniprotkb/" + uniprotId, {responseType: "json", observe: "body"})
    }
  }

  getRawData(primary_id: string, project_id: string) {
    return this.http.get(this.hostURL + "/api/raw/" + primary_id + "/" + project_id + "/", {responseType: "json", observe: "body"})
  }
}
