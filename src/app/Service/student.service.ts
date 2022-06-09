import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Student } from '../shared/student.model';
import { Observable } from 'rxjs';
import { Result } from '../shared/result';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
formData: Student;
url = 'https://localhost:44333/Employee';
  constructor(private httpClient:HttpClient) { }

  getStudentsV1():Observable<Student[]> {
    return this.httpClient.get<Student[]>(this.url+ '/GetStudent');
  }
  getStudentByIdV1(id:number|string):Observable<Student[]>  {
    return this.httpClient.get<Student[]>(this.url + "/GetStudent/" + `${id}` );
  }
  createStudentV1(student: Student) : Observable<Student>
  {
    return this.httpClient.post<Student>(this.url + "/",student);
  }
  updateStudentV1(id:number|string,data:any) : Observable<Student> {
    return this.httpClient.put<Student>(this.url + "/" , data);
  }
  deleteStudentV1(id:number|string ): Observable<number>{
    return this.httpClient.delete<number>(this.url + "/" + `${id}`);
  }



  getStudents() {
    return this.httpClient.get("https://localhost:44333/Student/GetStudent");
  }
  createStudent(student: any):Observable<Result>
  {
    return this.httpClient.post<Result>("https://localhost:44333/Student/InsertStudent",student);
  }
  updateStudent(student:any):Observable<Result> {
    return this.httpClient.put<Result>("https://localhost:44333/Student/UpdateStudent", student);
  }
  deleteStudent(id:number|string ):Observable<Result>{
    return this.httpClient.delete<Result>("https://localhost:44333/Student/DeleteStudentById/" + `${id}`);
  }
  getStudentById(id:number|string) {
    return this.httpClient.get("https://localhost:44333/Student/GetStudent/" + `${id}` );
  }


}
