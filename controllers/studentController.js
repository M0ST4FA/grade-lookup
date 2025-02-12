import StudentModel from '../models/studentModel.js';

export default class StudentController {
  constructor() {}

  static async getStudentInfo(req, res, next) {
    try {
      const number = req.params.number;
      const semester = req.query.semester;

      const semesterData = await StudentModel.getSemesterData(number, semester);

      res.status(200).json(semesterData);
    } catch (error) {
      res.status(404).end('Error retrieving student info');
      console.log(error);
    }
  }
}
