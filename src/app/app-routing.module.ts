import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {ProjectFormComponent} from "./components/project-form/project-form.component";
import {ProjectViewerComponent} from "./components/project-viewer/project-viewer.component";
import {AdminManagementComponent} from "./components/admin-management/admin-management.component";
import {ProteinViewerComponent} from "./components/protein-viewer/protein-viewer.component";

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "submission", component:ProjectFormComponent},
  {path: "project/:id", component: ProjectViewerComponent},
  {path: "project/:id/:session", component: ProjectViewerComponent},
  {path: "protein/:protein_id/:project_id", component: ProteinViewerComponent},
  {path: "protein/:protein_id/:project_id/:session", component: ProteinViewerComponent},
  {path: "admin", component: AdminManagementComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
