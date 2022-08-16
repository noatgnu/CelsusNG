import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Project} from "../classes/project";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {QuickResults} from "../classes/quick-results";

@Injectable({
  providedIn: 'root'
})
export class WebService {
  username = "admin"
  password = ""
  hostURL = environment.host
  uniqueID = ""
  justSearched: string[] = []
  currentPage = 1
  per_page = 20
  access_token = ""

  filters: any = {
    Kinases: {filename: "kinases.txt", name: "Kinases"},
    LRRK2: {filename: "lrrk2.txt", name: "LRRK2 Pathway"},
    Phosphatases: {filename: "phosphatases.txt", name: "Phosphatases"},
    PD: {filename: "pd.txt", name: "PD Genes (Mendelian)"},
    PINK1: {filename: "pink1.txt", name: "PINK1 Pathway"},
    PDGWAS: {filename: "pd.gwas.txt", name: "PD Genes (GWAS)"},
    DUBS: {filename: "dubs.txt", name: "Deubiquitylases (DUBs)"},
    E1_E2_E3Ligase: {filename: "e3ligase.txt", name: "E1, E2, E3 Ligases"},
    AD: {filename: "AD.txt", name: "AD Genes"},
    Mito: {filename: "Mito.txt", name: "Mitochondrial Proteins"},
    Golgi: {filename: "Golgi.txt", name: "Golgi Proteins"},
    Lysosome: {filename: "Lysosome.txt", name: "Lysosomal Proteins"},
    Glycosylation: {filename: "glyco.txt", name: "Glycosylation Proteins"},
    Metabolism: {filename: "metabolism.txt", name: "Metabolism Pathway"},
    Cathepsins: {filename: "cathepsins.txt", name: "Cathepsins"},
    MacrophageLRRK2Inhibition: {filename: "macrophages.lrrk2.inhibition", name: "LRRK2 inhibition in iPSC-derived macrophages"}
  }

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

  adminDeleteProject(project_ids: number[]) {
    const headers = new HttpHeaders().set("Access-Token", this.access_token)
    return this.http.patch(this.hostURL + "/api/admin/", {username: this.username, project_ids}, {responseType: "json", observe: "body", headers: headers})
  }

  getRawData(primary_id: string, project_id: string) {
    return this.http.get(this.hostURL + "/api/raw/" + primary_id + "/" + project_id + "/", {responseType: "json", observe: "body"})
  }

  saveSession(filterData: any) {
    return this.http.post(this.hostURL + "/api/session/", filterData, {responseType: "json", observe: "body"})
  }

  getSession(id: string) {
    return this.http.get(this.hostURL + "/api/session/" + id + "/", {responseType: "json", observe: "body"})
  }

  async getFilter(categoryName: string) {
    if (this.filters[categoryName]) {
      const res = await this.http.get("assets/proteinLists/" + this.filters[categoryName].filename, {observe: "body", responseType: "text"}).toPromise()
      if (res) {
        return res
      }
    }
    return ""
  }

  getQuickData(term: string, type: string, project: number[] = []): Observable<QuickResults> {
    return this.http.post<QuickResults>(this.hostURL + "/api/quick/", {term, type, project}, {observe: "body", responseType: "json"})
  }
}
