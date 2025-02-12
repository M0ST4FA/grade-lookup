function fetchGrades() {
  const studentNumber = document.getElementById('studentNumber').value.trim();
  const semester = document.getElementById('semester').value.trim();

  if (!studentNumber || !semester) {
    alert('Please enter both Student Number and Semester.');
    return;
  }

  if (!/(\d{4}-\d{1})/.exec(semester))
    return alert(
      'Please enter a valid Semester. A valid semester looks like this: 2024-2.',
    );

  if (studentNumber.length != 12)
    return alert(
      'Please enter a valid Student Number. A valid Student Number must have 12 digits.',
    );

  // Fetch data from backend (Replace the URL with your actual backend endpoint)
  fetch(`/students/${studentNumber}?semester=${semester}`)
    .then(response => response.json())
    .then(data => {
      if (!data || !data.subjects) {
        alert('Student not found or no data available.');
        return;
      }

      const semesterData = data;
      console.log(semesterData);

      displayGrades(semesterData.subjects);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      alert('Error retrieving student data.');
    });
}

function displayGrades(subjects) {
  const tableHeader = document.getElementById('tableHeader');
  const tableBody = document.getElementById('tableBody');

  // Clear previous data
  tableHeader.innerHTML = '';
  tableBody.innerHTML = '';

  // Add table headers
  const subjectHeader = document.createElement('th');
  subjectHeader.textContent = 'Subject';
  tableHeader.appendChild(subjectHeader);

  const gradeHeader = document.createElement('th');
  gradeHeader.textContent = 'Grade';
  tableHeader.appendChild(gradeHeader);

  const scoreHeader = document.createElement('th');
  scoreHeader.textContent = 'Score';
  tableHeader.appendChild(scoreHeader);

  // Add rows with subjects, grades, and scores
  for (const [subject, details] of Object.entries(subjects)) {
    const row = document.createElement('tr');

    const subjectCell = document.createElement('td');
    subjectCell.textContent = subject;
    row.appendChild(subjectCell);

    const gradeCell = document.createElement('td');
    gradeCell.textContent = details.grade;
    row.appendChild(gradeCell);

    const scoreCell = document.createElement('td');
    scoreCell.textContent = details.score;
    row.appendChild(scoreCell);

    tableBody.appendChild(row);
  }
}
