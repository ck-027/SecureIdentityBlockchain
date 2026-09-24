import React from "react";

function StudentTable({ students }) {
  return (
    <div>

      <h2>Registered Students</h2>

      <table border="1" cellPadding="10">

        <thead>
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Programme</th>
            <th>Graduation Year</th>
          </tr>
        </thead>

        <tbody>

          {students.map((student, index) => (

            <tr key={index}>

              <td>{student.studentID}</td>

              <td>{student.fullName}</td>

              <td>{student.programme}</td>

              <td>{student.graduationYear}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default StudentTable;