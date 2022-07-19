import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProjectFormComponent } from './components/project-form/project-form.component';
import {QuillModule} from "ngx-quill";
import { HomeComponent } from './components/home/home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { SearchDataComponent } from './components/search-data/search-data.component';
import { DataViewerComponent } from './components/data-viewer/data-viewer.component';
import { ProjectModalComponent } from './components/project-modal/project-modal.component';
import { ProjectViewerComponent } from './components/project-viewer/project-viewer.component';
import { AdminManagementComponent } from './components/admin-management/admin-management.component';
import { LoginComponent } from './components/login/login.component';
import { ProjectEditorComponent } from './components/project-editor/project-editor.component';
import { ProjectFileEditorComponent } from './components/project-file-editor/project-file-editor.component';
import { ProteinViewerComponent } from './components/protein-viewer/protein-viewer.component';

import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
import { ProteinScatterPlotComponent } from './components/protein-scatter-plot/protein-scatter-plot.component';
import { RawDataModalComponent } from './components/raw-data-modal/raw-data-modal.component';
import { RawDataBarChartComponent } from './components/raw-data-bar-chart/raw-data-bar-chart.component';
import { LatestProjectComponent } from './components/latest-project/latest-project.component';
import { RemovalConfirmationModalComponent } from './components/removal-confirmation-modal/removal-confirmation-modal.component';

PlotlyModule.plotlyjs = PlotlyJS;
@NgModule({
  declarations: [
    AppComponent,
    ProjectFormComponent,
    HomeComponent,
    NavBarComponent,
    SearchDataComponent,
    DataViewerComponent,
    ProjectModalComponent,
    ProjectViewerComponent,
    AdminManagementComponent,
    LoginComponent,
    ProjectEditorComponent,
    ProjectFileEditorComponent,
    ProteinViewerComponent,
    ProteinScatterPlotComponent,
    RawDataModalComponent,
    RawDataBarChartComponent,
    LatestProjectComponent,
    RemovalConfirmationModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    QuillModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    PlotlyModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
