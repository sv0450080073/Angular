import { Component, OnInit } from '@angular/core';
import { StudentService } from '../Service/student.service';
import { Student } from '../shared/student.model';
@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {
  data: any[];
  //sformData : Student = <Student>{};
  constructor(public studentService: StudentService) {

   }

  ngOnInit() {
    this.getStudents();
    console.log(this.data);
  }

   getStudents() : void  {
     this.studentService.getStudents()
     .subscribe((response: Student[]) => {
       this.data = response;
       console.log(this.data);
       console.log(typeof(this.data));
    })
   }
}
