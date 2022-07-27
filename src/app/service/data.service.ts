import { Injectable } from '@angular/core';
import {FilterSearch} from "../classes/filter-search";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  get projectIDs(): string[] {
    return this._projectIDs;
  }

  experimentTypes: string[] = [
    "Shotgun proteomics",
    "Cross-linking (CX-MS)",
    "Affinity purification (AP-MS)",
    "SRM/MRM",
    "SWATH MS",
    "MS Imaging",
    "TMT"
  ]

  set projectIDs(value: string[]) {
    this._projectIDs = value;
  }

  get primaryIDs(): string[] {
    return this._primaryIDs;
  }

  set primaryIDs(value: string[]) {
    this._primaryIDs = value;
  }

  get comparisonIDs(): string[] {
    return this._comparisonIDs;
  }

  set comparisonIDs(value: string[]) {
    this._comparisonIDs = value;
  }
  searchModel: string = ""
  comparisonMap: any = {}
  primary_id_filter: FilterSearch | undefined
  private _projectIDs: string[] = []
  private _primaryIDs: string[] = []
  private _comparisonIDs: string[] = []
  projects: any = {}
  geneNameMap: any = {}
  totalPages: number = 1
  totalResultCount: number = 0
  geneNames: string[] = []
  adminProjects: any[] = []

  constructor() { }
}
