import {
  required,
  email,
  min,
  max,
  // eslint-disable-next-line @typescript-eslint/camelcase
  alpha_spaces,
  regex
} from "vee-validate/dist/rules";

const customEmail = { ...email, message: "Email must be valid" };
const customRequired = { ...required, message: "{_field_} can not be empty" };
const customMin = {
  ...min,
  message: "The {_field_} field must be at least {length} characters"
};
const customMax = {
  ...max,
  message: "The {_field_} field may not be greater than {length} characters"
};
const customAlphaSpaces = {
  // eslint-disable-next-line @typescript-eslint/camelcase
  ...alpha_spaces,
  message:
    "{_field_} field may only contain alphabetic characters as well as spaces"
};
const customRegex = {
  ...regex,
  message:
    "The {_field_} field must between 5 and 30 characters. It must contain at least one uppercase letter, one lowercase letter, one symbol and a number."
};

export {
  customEmail,
  customRequired,
  customMin,
  customMax,
  customAlphaSpaces,
  customRegex
};
