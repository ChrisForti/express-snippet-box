// create helper functions for validator modules same file and exported
const emailRx =
  "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";

/** validate that a given string is a valid email address if the input is invalid. If the input is invalid,
 *  throws an error with the descprition
 * @param {string} email - the email is valid
 * @throws {Error} if email is valid
 * */

// All validation logic should only be what db cares about, and
// need to be wrapped in a try catchblock when used.
export function validateEmail(email: string) {
  if (!email) {
    throw new Error("Email address is required");
  }
  if (!email.match(emailRx)) {
    throw new Error("Invalid email format");
  }
}

export function validatePassword(password: string) {
  if (!password) {
    throw new Error("password is missing");
  }
  if (password.length < 8 || password.length > 32) {
    throw new Error("password must be between 8, and 32 characters");
  }
}

export function validateName(firstName: string, lastName: string) {
  if (!firstName || !lastName) {
    throw new Error("First and last name are required");
  }
  if (firstName.length < 3 || lastName.length < 3) {
    throw new Error("First and last shoud be a minimum of three characters");
  }
}

export function validateTitle(title: string) {
  if (!title) {
    throw new Error("Title is missing");
  }
}

export function validateContent(content: string) {
  if (!content) {
    throw new Error("content is missing");
  }
}

export function validateId(id: number) {
  if (!id) {
    throw new Error("user id is missing");
  }
  if (!Number.isInteger(id) || id < 1) {
    throw new Error("user id must be a number");
  }
}

export function validateExperationDate(expirationDate: string) {
  if (!expirationDate) {
    throw new Error("expiration date is missing");
  }
  if (expirationDate && isNaN(parseInt(expirationDate))) {
    throw new Error("expiration date is missing");
  }
}
