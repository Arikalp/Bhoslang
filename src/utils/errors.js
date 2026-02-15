class MiniLangError extends Error {
  constructor(message) {
    super(message);
    this.name = "MiniLangError";
  }
}

module.exports = MiniLangError;
