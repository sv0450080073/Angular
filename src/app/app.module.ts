import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { StudentComponent } from './student/student.component';
import { AppRoutingModule } from './app-routing.module';
import { APP_BASE_HREF } from '@angular/common';
import { StudentService } from './Service/student.service';
import { HttpClientModule } from '@angular/common/http';
import { ClassComponent } from './class/class.component';
import { AddEditStudentComponent } from './student/add-edit-student/add-edit-student.component';
import { ShowStudentComponent } from './student/show-student/show-student.component';
import { ToastrModule } from 'ngx-toastr';
import { LoaderComponent } from './loader/loader.component';
import { MetricReprocessComponent } from './metric-reprocess/metric-reprocess.component';


@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    StudentComponent,
    ClassComponent,
    AddEditStudentComponent,
    ShowStudentComponent,
    LoaderComponent,
    MetricReprocessComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 1000,
      positionClass:'toast-top-right',
      preventDuplicates:false,
     })

  ],
  providers: [ { provide: APP_BASE_HREF, useValue: "/" },StudentService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
