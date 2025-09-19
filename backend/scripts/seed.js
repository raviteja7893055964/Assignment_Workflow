require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');

const seed = async () => {
  try {
    await connectDB();
    await User.deleteMany({});

    const teacherPassword = await bcrypt.hash('teacherTest123', 10);
    const studentPassword = await bcrypt.hash('studentTest123', 10);

    const teacher = new User({ name: 'Teacher', email: 'teacherTest@example.com', password: teacherPassword, role: 'teacher' });
    const student = new User({ name: 'Student', email: 'studentTest@example.com', password: studentPassword, role: 'student' });

    await teacher.save();
    await student.save();

    console.log('Seeded users:');
    console.log('teacherTest@example.com / teacherTest123');
    console.log('studentTest@example.com / studentTest123');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
