class Student {
  constructor(name, scores) {
    this.name = name;
    this.scores = scores;
  }

  calculateAverage() {
    let total = 0;

    for (let i = 0; i < this.scores.length; i++) {
      total += this.scores[i];
    }

    return total / this.scores.length;
  }

  getLetterGrade() {
    const average = this.calculateAverage();

    if (average >= 90) {
      return "A";
    } else if (average >= 80) {
      return "B";
    } else if (average >= 70) {
      return "C";
    } else if (average >= 60) {
      return "D";
    } else {
      return "F";
    }
  }
}

module.exports = Student;