// create helper functions for validator modules same file and exported
const emailRx =
  "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";

/** validate that a given string is a valid email address if the input is invalid. If the input is invalid,
 *  throws an error with the descprition
 * @param {string email} the email is valid
 * @throws {Error} if email is valid
 * */

// All validation logic should only be what db cares about.
export function validateEmail(email: string) {
  if (!email) {
    throw new Error("Email address is required");
  }
  if (!email.match(emailRx)) {
    throw new Error("Invalid email format");
  }
} // need to be wrapped in a try catch block when used

export function validatePassword(password: string) {
  // password validation logic here.
  if (password === null) {
    throw new Error("Invalid password. Password is required");
  }
  if (!password) {
    throw new Error("password is missing");
  }
  if (password.length < 8 || password.length > 500) {
    throw new Error("password must be between 8, and 500 characters");
  }
}

export function validateName(firstName: string, lastName: string) {
  if (firstName || lastName) {
    // validate that first and last does not exist already
    throw new Error("Name already exists");
  }
  if (!firstName || !lastName) {
    // first and last are present
    throw new Error("First an last name is required");
  }
}
