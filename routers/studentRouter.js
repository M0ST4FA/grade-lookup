import e from 'express';
import StudentController from '../controllers/studentController.js';

const router = e.Router();

router.route('/:number').get(StudentController.getStudentInfo);

export default router;
