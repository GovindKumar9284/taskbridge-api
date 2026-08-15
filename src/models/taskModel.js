// Task model definition
export default class Task {
  constructor({ id, title, description = '', completed = false }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.completed = completed;
  }

  markCompleted() {
    this.completed = true;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      completed: this.completed,
    };
  }
}
