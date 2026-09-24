import React, { useState } from "react";

function StudentRegistration({ onRegister }) {
  const [student, setStudent] = useState({
    studentID: "",
    fullName: "",
    email: "",
    faculty: "",
    programme: "",
    graduationYear: ""
  });

  function handleChange(e) {
    setStudent({
      ...student,
      [e.target.name]: e.target.value
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    onRegister(student);

    setStudent({
      studentID: "",
      fullName: "",
      email: "",
      faculty: "",
      programme: "",
      graduationYear: ""
    });
  }

  return (
    <div>
      <h2>Register Student</h2>

      <form onSubmit={handleSubmit}>

        <input
          name="studentID"
          placeholder="Student ID"
          value={student.studentID}
          onChange={handleChange}
        />

        <input
          name="fullName"
          placeholder="Full Name"
          value={student.fullName}
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          value={student.email}
          onChange={handleChange}
        />

        <input
          name="faculty"
          placeholder="Faculty"
          value={student.faculty}
          onChange={handleChange}
        />

        <input
          name="programme"
          placeholder="Programme"
          value={student.programme}
          onChange={handleChange}
        />

        <input
          name="graduationYear"
          placeholder="Graduation Year"
          value={student.graduationYear}
          onChange={handleChange}
        />

        <button type="submit">
          Register Student
        </button>

      </form>
    </div>
  );
}

export default StudentRegistration;