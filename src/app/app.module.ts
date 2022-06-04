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


@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    StudentComponent,
    ClassComponent,
    AddEditStudentComponent,
    ShowStudentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule

  ],
  providers: [ { provide: APP_BASE_HREF, useValue: "/" },StudentService ],
  bootstrap: [AppComponent]
})
export class AppModule { }