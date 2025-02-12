import { MongoClient } from 'mongodb';

console.log(process.env.DATABASE_CONNECTION_STR);
const client = new MongoClient(process.env.DATABASE_CONNECTION_STR);
const university = client.db();
const students = university.collection('students');

export default class StudentModel {
  constructor() {}

  static async getSemesterData(studentNumber, semester) {
    console.log(studentNumber, semester);

    const student = await students.findOne({ student_number: studentNumber });

    console.log(student);

    return student.semesters.find(sem => sem.semester === semester);
  }
}
