import { Component, Input,OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { StudentService } from 'src/app/Service/student.service';
import { Student } from 'src/app/shared/student.model';
@Component({
  selector: 'app-add-edit-student',
  templateUrl: './add-edit-student.component.html',
  styleUrls: ['./add-edit-student.component.scss']
})
export class AddEditStudentComponent implements OnInit {

  constructor(private studentService:StudentService) { }
  exform:FormGroup;

  @Input() student: Student;
  Id:number  = 0 ;
  Name:string = "";
  Age:number = 0;
  Address: string = "tttttt";
  ngOnInit() : void {
  this.Id = this.student.Id;
  this.Name = this.student.Name;
  this.Age = this.student.Age;
  this.Address = this.student.Address;
  //validate
    this.exform = new FormGroup({
      'name' : new FormControl('Manh',Validators.required),
      'age' : new FormControl('1',Validators.required),
      'address' : new FormControl('1',Validators.required)
    })


  }
  addStudent(){
    var studenttemp = {
      Name:this.Name,
      Age:this.Age,
      Address:this.Address
    }
    console.log(studenttemp);
    this.studentService.createStudent(studenttemp).subscribe(res=> {
      var closeModalBtn = document.getElementById('add-edit-modal-close');
      if(closeModalBtn)
      {
        closeModalBtn.click();
      }
      var showAddSuccess =  document.getElementById('add-success-alert');
      if(showAddSuccess)
      {
        showAddSuccess.style.display = "block";
      }
      setTimeout(function() {
        if(showAddSuccess) {
          showAddSuccess.style.display = "none";
        }
      }, 4000);
    })
  }
  updateStudent(){
    var studenttemp = {
      Id:this.Id,
      Name:this.Name,
      Age:this.Age,
      Address:this.Address
    }
      var id:number   = this.Id;
       this.studentService.updateStudent(studenttemp).subscribe(res=> {
      var closeModalBtn = document.getElementById('add-edit-modal-close');
      if(closeModalBtn)
      {
        closeModalBtn.click();
      }
      var showUpdateSuccess =  document.getElementById('update-success-alert');
      if(showUpdateSuccess)
      {
        showUpdateSuccess.style.display = "block";
      }
      setTimeout(function() {
        if(showUpdateSuccess) {
          showUpdateSuccess.style.display = "none";
        }
      }, 4000);
    })
  }

  //#region  Property
  get name()
  {
    return this.exform.get('name');
  }
  get age()
  {
    return this.exform.get('age');
  }
  get address()
  {
    return this.exform.get('address');
  }
  //#endregion
}
