// create helper functions for validator modules same file and exported
const emailRx =
  "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";

/** validate that a given string is a valid email address if the input is invalid. If the input is invalid,
 *  throws an error with the descprition
 * @param {string} email - the email is valid
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
  if (!password) {
    throw new Error("password is missing");
  }
  if (password.length < 8 || password.length > 32) {
    throw new Error("password must be between 8, and 32 characters");
  }
}

export function validateName(firstName: string, lastName: string) {
  if (!firstName || !lastName) {
    // first and last are present
    throw new Error("First and last name are required");
  }
  if (firstName.length < 3 || lastName.length < 3) {
    // first and last are present
    throw new Error("First and last shoud be a minimum of three characters");
  }
}

export function validateTitle(title: string) {
  if (!title) {
    // data validation
    throw new Error("Title is missing");
  }
}

export function validateContent(content: string) {
  if (!content) {
    // data validation
    throw new Error("content is missing");
  }
}

export function validateUserId(userId: string) {
  if (!userId) {
    // data validation
    throw new Error("user id is missing");
  }
  if (userId && isNaN(parseInt(userId))) {
    // data validation
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

export function validateSnippetId(snippetId: string) {
  if (!snippetId) {
    // data validation
    throw new Error("Snippet id is missing");
  }
  if (snippetId && isNaN(parseInt(snippetId))) {
    // data validation
    throw new Error("snippet id must be a number");
  }
}
