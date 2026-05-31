const Student = require("./Student");

// Capture command-line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log("Usage: node reportCard.js <StudentName> <Score1> <Score2> ...");
  process.exit(1);
}

const studentName = args[0];
const examScores = args.slice(1).map(score => parseInt(score));

const student = new Student(studentName, examScores);

const average = student.calculateAverage();
const grade = student.getLetterGrade();

const reportCard = `
==============================
       STUDENT REPORT
==============================
Name:    ${student.name}
Scores:  [${student.scores.join(", ")}]
Average: ${average.toFixed(2)}
Grade:   ${grade}
==============================
`;

console.log(reportCard);