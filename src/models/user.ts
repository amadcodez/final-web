import mongoose from 'mongoose';

const TeacherSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  employeeCode: { type: String, required: true },
  contactNumber: { type: String, required: true },  // Added the contactNumber field
});

export default mongoose.models.Teacher || mongoose.model('Teacher', TeacherSchema);