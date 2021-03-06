/**
 * Thrown when an error occurs while handling Repository events.
 */
export default class RepositoryHandlerError extends Error {
  /**
   * @param {String} message - message
   * @param {String} cause - original cause
   */
  constructor(message, cause = null) {
    super(message)
    this.code = 404
    this.cause = cause
  }
}
