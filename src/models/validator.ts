// create helper functions for validator modules same file and exported
const emailRx =
  "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";

/** validate that a given string is a valid email address if the input is invalid. If the input is invalid,
 *  throws an error with the descprition
 * @param {string email} the email is valid
 * @throws {Error} if email is valid
 * */

export function validateEmail(email: string) {
  if (!email) {
    throw new Error("Email address is required");
  }
  if (!email.match(emailRx)) {
    throw new Error("Invalid email format");
  }
} // need to be wrapped in a try catch block when used

export function validatePassword(password: string) {
  // password logic here, and all other validators to be turned into methods.
  // the password logic should only be what db cares about.
}
