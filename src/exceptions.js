class Exception {
  constructor(message) {
    this.type = 'GenericException';
    this.message = message;
  }

  toString() {
    return `${this.type}: ${this.message}`;
  }
}

module.exports = Exception;
