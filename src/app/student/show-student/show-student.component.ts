import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StudentService } from 'src/app/Service/student.service';
import { Student } from 'src/app/shared/student.model';

@Component({
  selector: 'app-show-student',
  templateUrl: './show-student.component.html',
  styleUrls: ['./show-student.component.scss']
})
export class ShowStudentComponent implements OnInit {

  students : Observable<Student[]>;

  constructor(private studentService : StudentService) { }

  ngOnInit() {
    this.students = this.studentService.getStudentsV1();
  }
  modalTile: string ='';
  activeAddEditStudentComponent : boolean =false;
  student : Student;

modalAdd() {
  this.student = {
    Id:0 ,
    Name:null,
    Age:0,
    Address:null
  }
  this.modalTile  = "Add Student ";
  this.activeAddEditStudentComponent = true;
}
modalEdit(item:any){
  this.activeAddEditStudentComponent = true;
  this.student = item;
  this.modalTile = "Edit Student "
}
modalClose() {
  this.activeAddEditStudentComponent = false;
  this.students = this.studentService.getStudentsV1();
}
delete(item:any) {
  if(confirm(`Are you sure you want to delete student ${item.Id}`)) {
    this.studentService.deleteStudent(item.Id).subscribe(res => {
      var closeModalBtn = document.getElementById('add-edit-modal-close');
      if(closeModalBtn)
      {
        closeModalBtn.click();
      }
      var showDeleteSuccess =  document.getElementById('Delete-success-alert');
      if(showDeleteSuccess)
      {
        showDeleteSuccess.style.display = "block";
      }
      setTimeout(function() {
        if(showDeleteSuccess) {
          showDeleteSuccess.style.display = "none";
        }
      }, 4000);
      this.studentService.getStudentsV1();
    })
  }
}

}
