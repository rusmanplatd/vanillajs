import { BehaviorSubject } from '../../packages/rxjs/esm/index.js';

/**
 * Validators namespace containing common validation functions
 */
export const Validators = {
  /**
   * Validator that requires the control have a non-empty value
   * @param {FormControl} control - The form control to validate
   * @returns {object | null} Validation error object or null if valid
   */
  required(control) {
    const { value } = control;
    if (
      value === null ||
      value === undefined ||
      value === '' ||
      (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return { required: { message: 'This field is required' } };
    }
    return null;
  },

  /**
   * Validator that requires a control to be truthy (for checkboxes)
   * @param {FormControl} control - The form control to validate
   * @returns {object | null} Validation error object or null if valid
   */
  requiredTrue(control) {
    return control.value === true ? null : { requiredTrue: true };
  },

  /**
   * Validator that requires the control's value to be a valid email
   * @param {FormControl} control - The form control to validate
   * @returns {object | null} Validation error object or null if valid
   */
  email(control) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (control.value && !emailRegex.test(control.value)) {
      return {
        email: { message: 'Please enter a valid email address' },
      };
    }
    return null;
  },

  /**
   * Validator that requires the control's value to be a valid URL
   * @param {FormControl} control - The form control to validate
   * @returns {object | null} Validation error object or null if valid
   */
  url(control) {
    try {
      if (control.value) {
        new URL(control.value);
      }
      return null;
    } catch {
      return { url: { message: 'Please enter a valid URL' } };
    }
  },

  /**
   * Validator that requires the control's value length to be greater than or equal to the provided minimum length
   * @param {number} min - Minimum length
   * @returns {Function} Validator function
   */
  minLength(min) {
    return (control) => {
      if (control.value && control.value.length < min) {
        return {
          minLength: {
            requiredLength: min,
            actualLength: control.value.length,
          },
        };
      }
      return null;
    };
  },

  /**
   * Validator that requires the control's value length to be less than or equal to the provided maximum length
   * @param {number} max - Maximum length
   * @returns {Function} Validator function
   */
  maxLength(max) {
    return (control) => {
      if (control.value && control.value.length > max) {
        return {
          maxLength: {
            requiredLength: max,
            actualLength: control.value.length,
          },
        };
      }
      return null;
    };
  },

  /**
   * Validator that requires the control's value to match a regex pattern
   * @param {RegExp|string} pattern - Regular expression pattern
   * @returns {Function} Validator function
   */
  pattern(pattern) {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    return (control) => {
      if (control.value && !regex.test(control.value)) {
        return {
          pattern: { requiredPattern: pattern, actualValue: control.value },
        };
      }
      return null;
    };
  },

  /**
   * Validator that requires the control's value to be greater than or equal to the provided minimum
   * @param {number} min - Minimum value
   * @returns {Function} Validator function
   */
  min(min) {
    return (control) => {
      if (
        control.value !== null &&
        control.value !== undefined &&
        control.value < min
      ) {
        return { min: { min: min, actual: control.value } };
      }
      return null;
    };
  },

  /**
   * Validator that requires the control's value to be less than or equal to the provided maximum
   * @param {number} max - Maximum value
   * @returns {Function} Validator function
   */
  max(max) {
    return (control) => {
      if (
        control.value !== null &&
        control.value !== undefined &&
        control.value > max
      ) {
        return { max: { max: max, actual: control.value } };
      }
      return null;
    };
  },

  /**
   * Validator that requires two controls to have matching values
   * @param {string} controlName - Name of control to match against
   * @returns {Function} Validator function
   */
  matchControl(controlName) {
    return (control) => {
      if (!control.parent) {
        return null;
      }
      const matchingControl = control.parent.get(controlName);
      if (!matchingControl) {
        return null;
      }
      if (control.value !== matchingControl.value) {
        return {
          matchControl: {
            message: 'Values do not match',
            requiredValue: matchingControl.value,
            actualValue: control.value,
          },
        };
      }
      return null;
    };
  },

  /**
   * Validator that requires the control's value to be a valid phone number
   * @param {string} format - Phone format ('US', 'INTL', or custom regex)
   * @returns {Function} Validator function
   */
  phone(format = 'US') {
    return (control) => {
      if (!control.value) {
        return null;
      }

      let regex;
      if (format === 'US') {
        // US phone: (123) 456-7890 or 123-456-7890 or 1234567890
        regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
      } else if (format === 'INTL') {
        // International: +1234567890
        regex = /^\+?[1-9]\d{1,14}$/;
      } else if (format instanceof RegExp) {
        regex = format;
      } else {
        regex = new RegExp(format);
      }

      if (!regex.test(control.value)) {
        return {
          phone: {
            message: 'Please enter a valid phone number',
            format,
          },
        };
      }
      return null;
    };
  },

  /**
   * Validator that requires the control's value to be a valid credit card number
   * @param {FormControl} control - The form control to validate
   * @returns {object | null} Validation error object or null if valid
   */
  creditCard(control) {
    if (!control.value) {
      return null;
    }

    // Remove spaces and dashes
    const cleaned = control.value.replace(/[\s-]/g, '');

    // Must be digits only
    if (!/^\d+$/.test(cleaned)) {
      return { creditCard: { message: 'Invalid credit card number' } };
    }

    // Luhn algorithm
    let sum = 0;
    let isEven = false;
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i], 10);
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      sum += digit;
      isEven = !isEven;
    }

    if (sum % 10 !== 0) {
      return { creditCard: { message: 'Invalid credit card number' } };
    }
    return null;
  },

  /**
   * Validator that requires the control's value to be a valid date
   * @param {string} format - Date format ('ISO', 'US', or custom)
   * @returns {Function} Validator function
   */
  date(format = 'ISO') {
    return (control) => {
      if (!control.value) {
        return null;
      }

      let isValid = false;
      if (format === 'ISO') {
        // ISO 8601: YYYY-MM-DD
        isValid = /^\d{4}-\d{2}-\d{2}$/.test(control.value);
        if (isValid) {
          const date = new Date(control.value);
          isValid = !isNaN(date.getTime());
        }
      } else if (format === 'US') {
        // US format: MM/DD/YYYY
        isValid = /^\d{2}\/\d{2}\/\d{4}$/.test(control.value);
        if (isValid) {
          const [month, day, year] = control.value.split('/');
          const date = new Date(year, month - 1, day);
          isValid = !isNaN(date.getTime());
        }
      } else {
        const date = new Date(control.value);
        isValid = !isNaN(date.getTime());
      }

      if (!isValid) {
        return {
          date: { message: `Please enter a valid date (${format})` },
        };
      }
      return null;
    };
  },

  /**
   * Validator that requires the control's value to be before a certain date
   * @param {Date|string} maxDate - Maximum date
   * @returns {Function} Validator function
   */
  dateBefore(maxDate) {
    return (control) => {
      if (!control.value) {
        return null;
      }
      const controlDate = new Date(control.value);
      const compareDate = new Date(maxDate);
      if (controlDate >= compareDate) {
        return {
          dateBefore: {
            message: `Date must be before ${compareDate.toLocaleDateString()}`,
            maxDate: compareDate,
          },
        };
      }
      return null;
    };
  },

  /**
   * Validator that requires the control's value to be after a certain date
   * @param {Date|string} minDate - Minimum date
   * @returns {Function} Validator function
   */
  dateAfter(minDate) {
    return (control) => {
      if (!control.value) {
        return null;
      }
      const controlDate = new Date(control.value);
      const compareDate = new Date(minDate);
      if (controlDate <= compareDate) {
        return {
          dateAfter: {
            message: `Date must be after ${compareDate.toLocaleDateString()}`,
            minDate: compareDate,
          },
        };
      }
      return null;
    };
  },

  /**
   * Validator that requires the control's value to contain only numbers
   * @param {FormControl} control - The form control to validate
   * @returns {object | null} Validation error object or null if valid
   */
  numeric(control) {
    if (!control.value && control.value !== 0) {
      return null;
    }
    if (!/^-?\d*\.?\d+$/.test(String(control.value))) {
      return { numeric: { message: 'Please enter a numeric value' } };
    }
    return null;
  },

  /**
   * Validator that requires the control's value to contain only alphabetic characters
   * @param {boolean} allowSpaces - Whether to allow spaces
   * @returns {Function} Validator function
   */
  alpha(allowSpaces = false) {
    return (control) => {
      if (!control.value) {
        return null;
      }
      const regex = allowSpaces ? /^[a-zA-Z\s]+$/ : /^[a-zA-Z]+$/;
      if (!regex.test(control.value)) {
        return {
          alpha: {
            message: `Please enter only alphabetic characters${allowSpaces ? ' and spaces' : ''}`,
          },
        };
      }
      return null;
    };
  },

  /**
   * Validator that requires the control's value to contain only alphanumeric characters
   * @param {boolean} allowSpaces - Whether to allow spaces
   * @returns {Function} Validator function
   */
  alphanumeric(allowSpaces = false) {
    return (control) => {
      if (!control.value) {
        return null;
      }
      const regex = allowSpaces ? /^[a-zA-Z0-9\s]+$/ : /^[a-zA-Z0-9]+$/;
      if (!regex.test(control.value)) {
        return {
          alphanumeric: {
            message: `Please enter only alphanumeric characters${allowSpaces ? ' and spaces' : ''}`,
          },
        };
      }
      return null;
    };
  },

  /**
   * Validator that requires the control's value to be a valid IP address
   * @param {string} version - IP version ('v4', 'v6', or 'both')
   * @returns {Function} Validator function
   */
  ipAddress(version = 'v4') {
    return (control) => {
      if (!control.value) {
        return null;
      }

      const ipv4Regex =
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

      let isValid = false;
      if (version === 'v4') {
        isValid = ipv4Regex.test(control.value);
      } else if (version === 'v6') {
        isValid = ipv6Regex.test(control.value);
      } else if (version === 'both') {
        isValid = ipv4Regex.test(control.value) || ipv6Regex.test(control.value);
      }

      if (!isValid) {
        return {
          ipAddress: {
            message: `Please enter a valid IPv${version === 'both' ? '4 or IPv6' : version} address`,
          },
        };
      }
      return null;
    };
  },

  /**
   * Validator that requires the control's value to be a valid JSON string
   * @param {FormControl} control - The form control to validate
   * @returns {object | null} Validation error object or null if valid
   */
  json(control) {
    if (!control.value) {
      return null;
    }
    try {
      JSON.parse(control.value);
      return null;
    } catch {
      return { json: { message: 'Please enter valid JSON' } };
    }
  },

  /**
   * Validator that requires the control's value to be within a specific range
   * @param {number} min - Minimum value (inclusive)
   * @param {number} max - Maximum value (inclusive)
   * @returns {Function} Validator function
   */
  range(min, max) {
    return (control) => {
      if (control.value === null || control.value === undefined) {
        return null;
      }
      const value = Number(control.value);
      if (isNaN(value) || value < min || value > max) {
        return {
          range: {
            message: `Value must be between ${min} and ${max}`,
            min,
            max,
            actual: control.value,
          },
        };
      }
      return null;
    };
  },

  /**
   * Validator that requires the control's value to be one of the allowed values
   * @param {Array} allowedValues - Array of allowed values
   * @returns {Function} Validator function
   */
  oneOf(allowedValues) {
    return (control) => {
      if (!control.value) {
        return null;
      }
      if (!allowedValues.includes(control.value)) {
        return {
          oneOf: {
            message: `Value must be one of: ${allowedValues.join(', ')}`,
            allowedValues,
            actual: control.value,
          },
        };
      }
      return null;
    };
  },

  /**
   * Validator that requires the control's value to NOT be one of the forbidden values
   * @param {Array} forbiddenValues - Array of forbidden values
   * @returns {Function} Validator function
   */
  notOneOf(forbiddenValues) {
    return (control) => {
      if (!control.value) {
        return null;
      }
      if (forbiddenValues.includes(control.value)) {
        return {
          notOneOf: {
            message: `Value cannot be one of: ${forbiddenValues.join(', ')}`,
            forbiddenValues,
            actual: control.value,
          },
        };
      }
      return null;
    };
  },

  /**
   * Validator that requires the control's value to be a strong password
   * @param {Object} requirements - Password requirements
   * @returns {Function} Validator function
   */
  password(requirements = {}) {
    const defaults = {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    };
    const config = { ...defaults, ...requirements };

    return (control) => {
      if (!control.value) {
        return null;
      }

      const errors = [];
      if (
        config.minLength &&
        control.value.length < config.minLength
      ) {
        errors.push(`at least ${config.minLength} characters`);
      }
      if (config.requireUppercase && !/[A-Z]/.test(control.value)) {
        errors.push('an uppercase letter');
      }
      if (config.requireLowercase && !/[a-z]/.test(control.value)) {
        errors.push('a lowercase letter');
      }
      if (config.requireNumbers && !/\d/.test(control.value)) {
        errors.push('a number');
      }
      if (
        config.requireSpecialChars &&
        !/[!@#$%^&*(),.?":{}|<>]/.test(control.value)
      ) {
        errors.push('a special character');
      }

      if (errors.length > 0) {
        return {
          password: {
            message: `Password must contain ${errors.join(', ')}`,
            requirements: config,
          },
        };
      }
      return null;
    };
  },

  /**
   * Compose multiple validators into a single validator
   * @param {Array<Function>} validators - Array of validator functions
   * @returns {Function} Composed validator function
   */
  compose(validators) {
    if (!validators || validators.length === 0) {
      return () => null;
    }
    return (control) => {
      for (const validator of validators) {
        const result = validator(control);
        if (result !== null) {
          return result;
        }
      }
      return null;
    };
  },

  /**
   * Custom validator that accepts a validation function
   * @param {Function} validatorFn - Custom validation function
   * @param {string} errorKey - Error key for validation errors
   * @returns {Function} Validator function
   */
  custom(validatorFn, errorKey = 'custom') {
    return (control) => {
      const result = validatorFn(control.value, control);
      if (result === false || result === null || result === undefined) {
        return null;
      }
      if (result === true) {
        return { [errorKey]: { message: 'Validation failed' } };
      }
      if (typeof result === 'string') {
        return { [errorKey]: { message: result } };
      }
      if (typeof result === 'object') {
        return { [errorKey]: result };
      }
      return null;
    };
  },
};

/**
 * Represents a single form control with value, validation, and status tracking
 */
export class FormControl {
  /**
   * Creates a new FormControl instance
   * @param {*} initialValue - Initial value for the control
   * @param {Array<Function>|object} validatorsOrOptions - Array of validator functions or options object
   * @param {Array<Function>} asyncValidators - Array of async validator functions
   */
  constructor(
    initialValue = '',
    validatorsOrOptions = [],
    asyncValidators = []
  ) {
    // Handle options object or validators array
    let validators = [];
    let options = {};

    if (Array.isArray(validatorsOrOptions)) {
      validators = validatorsOrOptions;
    } else if (validatorsOrOptions && typeof validatorsOrOptions === 'object') {
      options = validatorsOrOptions;
      validators = options.validators || [];
      asyncValidators = options.asyncValidators || asyncValidators;
    }

    this._value$ = new BehaviorSubject(initialValue);
    this._status$ = new BehaviorSubject('VALID');
    this._errors$ = new BehaviorSubject(null);
    this._touched$ = new BehaviorSubject(false);
    this._dirty$ = new BehaviorSubject(false);
    this._disabled$ = new BehaviorSubject(false);
    this._validators = validators;
    this._asyncValidators = asyncValidators;
    this._pristineValue = initialValue;
    this._parent = null;
    this._updateOn = options.updateOn || 'change';

    this.validate();
  }

  /**
   * Gets the current value of the control
   * @returns {*} Current value
   */
  get value() {
    return this._value$.getValue();
  }

  /**
   * Observable stream of value changes
   * @returns {BehaviorSubject} Value observable
   */
  get valueChanges() {
    return this._value$;
  }

  /**
   * Observable stream of status changes (VALID, INVALID, PENDING)
   * @returns {BehaviorSubject} Status observable
   */
  get statusChanges() {
    return this._status$;
  }

  /**
   * Gets the current validation errors
   * @returns {object | null} Errors object or null if valid
   */
  get errors() {
    return this._errors$.getValue();
  }

  /**
   * Observable stream of error changes
   * @returns {BehaviorSubject} Errors observable
   */
  get errorChanges() {
    return this._errors$;
  }

  /**
   * Checks if the control is valid
   * @returns {boolean} True if valid
   */
  get valid() {
    return this._status$.getValue() === 'VALID';
  }

  /**
   * Checks if the control is invalid
   * @returns {boolean} True if invalid
   */
  get invalid() {
    return this._status$.getValue() === 'INVALID';
  }

  /**
   * Checks if the control has been touched (blurred)
   * @returns {boolean} True if touched
   */
  get touched() {
    return this._touched$.getValue();
  }

  /**
   * Checks if the control has not been touched
   * @returns {boolean} True if untouched
   */
  get untouched() {
    return !this._touched$.getValue();
  }

  /**
   * Checks if the control value has been changed
   * @returns {boolean} True if dirty
   */
  get dirty() {
    return this._dirty$.getValue();
  }

  /**
   * Checks if the control value has not been changed
   * @returns {boolean} True if pristine
   */
  get pristine() {
    return !this._dirty$.getValue();
  }

  /**
   * Sets a new value for the control
   * @param {*} value - New value
   * @param {object} options - Options for emitting events
   */
  setValue(value, options = {}) {
    const emitEvent = options.emitEvent !== false;

    if (value !== this._pristineValue) {
      this._dirty$.next(true);
    }

    this._value$.next(value);

    if (emitEvent) {
      this.validate();
    }
  }

  /**
   * Patches the value (alias for setValue)
   * @param {*} value - New value
   * @param {object} options - Options for emitting events
   */
  patchValue(value, options = {}) {
    this.setValue(value, options);
  }

  /**
   * Marks the control as touched
   */
  markAsTouched() {
    this._touched$.next(true);
  }

  /**
   * Marks the control as untouched
   */
  markAsUntouched() {
    this._touched$.next(false);
  }

  /**
   * Marks the control as dirty
   */
  markAsDirty() {
    this._dirty$.next(true);
  }

  /**
   * Marks the control as pristine
   */
  markAsPristine() {
    this._dirty$.next(false);
    this._pristineValue = this.value;
  }

  /**
   * Resets the control to its initial value
   * @param {*} value - Optional new initial value
   */
  reset(value = '') {
    this._value$.next(value);
    this._pristineValue = value;
    this._dirty$.next(false);
    this._touched$.next(false);
    this.validate();
  }

  /**
   * Validates the control against all validators
   */
  validate() {
    let errors = null;

    for (const validator of this._validators) {
      const error = validator(this);
      if (error) {
        errors = { ...errors, ...error };
      }
    }

    this._errors$.next(errors);
    this._status$.next(errors ? 'INVALID' : 'VALID');
  }

  /**
   * Sets validators for the control
   * @param {Array<Function>} validators - Array of validator functions
   */
  setValidators(validators) {
    this._validators = validators;
    this.validate();
  }

  /**
   * Adds validators to the control
   * @param {Array<Function>} validators - Array of validator functions to add
   */
  addValidators(validators) {
    this._validators = [...this._validators, ...validators];
    this.validate();
  }

  /**
   * Clears all validators from the control
   */
  clearValidators() {
    this._validators = [];
    this.validate();
  }

  /**
   * Checks if control is disabled
   * @returns {boolean} True if disabled
   */
  get disabled() {
    return this._disabled$.getValue();
  }

  /**
   * Checks if control is enabled
   * @returns {boolean} True if enabled
   */
  get enabled() {
    return !this._disabled$.getValue();
  }

  /**
   * Gets the status (VALID, INVALID, DISABLED, PENDING)
   * @returns {string} Status string
   */
  get status() {
    if (this._disabled$.getValue()) {
      return 'DISABLED';
    }
    return this._status$.getValue();
  }

  /**
   * Disables the control
   * @param {object} options - Options for emitting events
   */
  disable(options = {}) {
    this._disabled$.next(true);
    if (options.emitEvent !== false) {
      this._status$.next('DISABLED');
    }
    if (this._parent && options.onlySelf !== true) {
      this._parent._updateStatus();
    }
  }

  /**
   * Enables the control
   * @param {object} options - Options for emitting events
   */
  enable(options = {}) {
    this._disabled$.next(false);
    if (options.emitEvent !== false) {
      this.validate();
    }
    if (this._parent && options.onlySelf !== true) {
      this._parent._updateStatus();
    }
  }

  /**
   * Sets errors on the control
   * @param {object|null} errors - Errors object or null
   * @param {object} options - Options for emitting events
   */
  setErrors(errors, options = {}) {
    this._errors$.next(errors);
    this._status$.next(errors ? 'INVALID' : 'VALID');

    if (this._parent && options.emitEvent !== false) {
      this._parent._updateStatus();
    }
  }

  /**
   * Checks if the control has a specific error
   * @param {string} errorCode - Error code to check
   * @param {string} path - Path to check (for nested errors)
   * @returns {boolean} True if error exists
   */
  hasError(errorCode, path) {
    const errors = this.getError(errorCode, path);
    return errors !== null && errors !== undefined;
  }

  /**
   * Gets a specific error
   * @param {string} errorCode - Error code to get
   * @param {string} path - Path to check (for nested errors)
   * @returns {*} Error value or null
   */
  getError(errorCode, path) {
    if (path) {
      return null; // FormControl doesn't have nested paths
    }
    const { errors } = this;
    return errors && errors[errorCode] ? errors[errorCode] : null;
  }

  /**
   * Sets the parent control
   * @param {FormGroup|FormArray} parent - Parent control
   * @private
   */
  _setParent(parent) {
    this._parent = parent;
  }

  /**
   * Updates the value and validity based on the updateOn strategy
   * @param {object} options - Options for emitting events
   */
  updateValueAndValidity(options = {}) {
    if (this._disabled$.getValue()) {
      return;
    }

    if (options.emitEvent !== false) {
      this.validate();
    }

    if (this._parent && options.onlySelf !== true) {
      this._parent._updateStatus();
    }
  }

  /**
   * Gets the raw value (same as value for FormControl, included for API consistency)
   * @returns {*} Current value
   */
  getRawValue() {
    return this.value;
  }
}

/**
 * Represents a group of form controls
 */
export class FormGroup {
  /**
   * Creates a new FormGroup instance
   * @param {object} controls - Object containing FormControl instances
   */
  constructor(controls = {}) {
    this._controls = controls;
    this._value$ = new BehaviorSubject(this._calculateValue());
    this._status$ = new BehaviorSubject('VALID');
    this._errors$ = new BehaviorSubject(null);
    this._touched$ = new BehaviorSubject(false);
    this._dirty$ = new BehaviorSubject(false);
    this._parent = null;

    // Set parent reference for all controls
    Object.values(this._controls).forEach((control) => {
      if (control._setParent) {
        control._setParent(this);
      }
    });

    // Subscribe to all control changes
    this._subscriptions = [];
    this._subscribeToControlChanges();
    this._updateStatus();
  }

  /**
   * Subscribes to all control value and status changes
   * @private
   */
  _subscribeToControlChanges() {
    Object.keys(this._controls).forEach((key) => {
      const control = this._controls[key];

      const valueSub = control.valueChanges.subscribe(() => {
        this._value$.next(this._calculateValue());
        this._updateStatus();
        this._updateTouchedDirty();
      });

      const statusSub = control.statusChanges.subscribe(() => {
        this._updateStatus();
      });

      this._subscriptions.push(valueSub, statusSub);
    });
  }

  /**
   * Calculates the current value of all controls
   * @private
   * @returns {object} Object with all control values
   */
  _calculateValue() {
    const value = {};
    Object.keys(this._controls).forEach((key) => {
      value[key] = this._controls[key].value;
    });
    return value;
  }

  /**
   * Updates the group status based on control statuses
   * @private
   */
  _updateStatus() {
    const errors = {};
    let hasErrors = false;

    Object.keys(this._controls).forEach((key) => {
      const control = this._controls[key];
      if (control.invalid) {
        errors[key] = control.errors;
        hasErrors = true;
      }
    });

    this._errors$.next(hasErrors ? errors : null);
    this._status$.next(hasErrors ? 'INVALID' : 'VALID');
  }

  /**
   * Updates touched and dirty status based on controls
   * @private
   */
  _updateTouchedDirty() {
    const anyTouched = Object.values(this._controls).some((c) => c.touched);
    const anyDirty = Object.values(this._controls).some((c) => c.dirty);

    this._touched$.next(anyTouched);
    this._dirty$.next(anyDirty);
  }

  /**
   * Gets a control by name
   * @param {string} name - Control name
   * @returns {FormControl|FormGroup|FormArray} The control
   */
  get(name) {
    return this._controls[name];
  }

  /**
   * Gets the current value of all controls
   * @returns {object} Current values object
   */
  get value() {
    return this._value$.getValue();
  }

  /**
   * Observable stream of value changes
   * @returns {BehaviorSubject} Value observable
   */
  get valueChanges() {
    return this._value$;
  }

  /**
   * Observable stream of status changes
   * @returns {BehaviorSubject} Status observable
   */
  get statusChanges() {
    return this._status$;
  }

  /**
   * Gets the current validation errors
   * @returns {object | null} Errors object or null if valid
   */
  get errors() {
    return this._errors$.getValue();
  }

  /**
   * Checks if the group is valid
   * @returns {boolean} True if valid
   */
  get valid() {
    return this._status$.getValue() === 'VALID';
  }

  /**
   * Checks if the group is invalid
   * @returns {boolean} True if invalid
   */
  get invalid() {
    return this._status$.getValue() === 'INVALID';
  }

  /**
   * Checks if any control has been touched
   * @returns {boolean} True if touched
   */
  get touched() {
    return this._touched$.getValue();
  }

  /**
   * Checks if no controls have been touched
   * @returns {boolean} True if untouched
   */
  get untouched() {
    return !this._touched$.getValue();
  }

  /**
   * Checks if any control value has been changed
   * @returns {boolean} True if dirty
   */
  get dirty() {
    return this._dirty$.getValue();
  }

  /**
   * Checks if no control values have been changed
   * @returns {boolean} True if pristine
   */
  get pristine() {
    return !this._dirty$.getValue();
  }

  /**
   * Sets values for multiple controls
   * @param {object} values - Object with control values
   * @param {object} options - Options for emitting events
   */
  setValue(values, options = {}) {
    Object.keys(values).forEach((key) => {
      if (this._controls[key]) {
        this._controls[key].setValue(values[key], options);
      }
    });
  }

  /**
   * Patches values for multiple controls (only updates provided keys)
   * @param {object} values - Object with control values to update
   * @param {object} options - Options for emitting events
   */
  patchValue(values, options = {}) {
    Object.keys(values).forEach((key) => {
      if (this._controls[key]) {
        this._controls[key].patchValue(values[key], options);
      }
    });
  }

  /**
   * Marks all controls as touched
   */
  markAsTouched() {
    Object.values(this._controls).forEach((control) => control.markAsTouched());
    this._touched$.next(true);
  }

  /**
   * Marks all controls as untouched
   */
  markAsUntouched() {
    Object.values(this._controls).forEach((control) =>
      control.markAsUntouched()
    );
    this._touched$.next(false);
  }

  /**
   * Marks all controls as dirty
   */
  markAsDirty() {
    Object.values(this._controls).forEach((control) => control.markAsDirty());
    this._dirty$.next(true);
  }

  /**
   * Marks all controls as pristine
   */
  markAsPristine() {
    Object.values(this._controls).forEach((control) =>
      control.markAsPristine()
    );
    this._dirty$.next(false);
  }

  /**
   * Resets all controls to their initial values
   * @param {object} values - Optional new values
   */
  reset(values = {}) {
    Object.keys(this._controls).forEach((key) => {
      const value = values[key] !== undefined ? values[key] : '';
      this._controls[key].reset(value);
    });
  }

  /**
   * Adds a new control to the group
   * @param {string} name - Control name
   * @param {FormControl|FormGroup|FormArray} control - Control instance
   */
  addControl(name, control) {
    this._controls[name] = control;

    // Set parent reference
    if (control._setParent) {
      control._setParent(this);
    }

    const valueSub = control.valueChanges.subscribe(() => {
      this._value$.next(this._calculateValue());
      this._updateStatus();
      this._updateTouchedDirty();
    });

    const statusSub = control.statusChanges.subscribe(() => {
      this._updateStatus();
    });

    this._subscriptions.push(valueSub, statusSub);
    this._value$.next(this._calculateValue());
    this._updateStatus();
  }

  /**
   * Removes a control from the group
   * @param {string} name - Control name
   */
  removeControl(name) {
    delete this._controls[name];
    this._value$.next(this._calculateValue());
    this._updateStatus();
  }

  /**
   * Cleans up subscriptions
   */
  destroy() {
    this._subscriptions.forEach((sub) => sub.unsubscribe());
  }

  /**
   * Checks if the group contains a control with the given name
   * @param {string} name - Control name
   * @returns {boolean} True if control exists
   */
  contains(name) {
    return Object.prototype.hasOwnProperty.call(this._controls, name);
  }

  /**
   * Gets the raw value including disabled controls
   * @returns {object} Object with all control values including disabled
   */
  getRawValue() {
    const value = {};
    Object.keys(this._controls).forEach((key) => {
      const control = this._controls[key];
      if (control.getRawValue) {
        value[key] = control.getRawValue();
      } else {
        value[key] = control.value;
      }
    });
    return value;
  }

  /**
   * Disables all controls in the group
   * @param {object} options - Options for emitting events
   */
  disable(options = {}) {
    Object.values(this._controls).forEach((control) => {
      control.disable({ ...options, onlySelf: true });
    });
    this._updateStatus();
  }

  /**
   * Enables all controls in the group
   * @param {object} options - Options for emitting events
   */
  enable(options = {}) {
    Object.values(this._controls).forEach((control) => {
      control.enable({ ...options, onlySelf: true });
    });
    this._updateStatus();
  }

  /**
   * Checks if the group has a specific error
   * @param {string} errorCode - Error code to check
   * @param {string} path - Path to nested control
   * @returns {boolean} True if error exists
   */
  hasError(errorCode, path) {
    return this.getError(errorCode, path) !== null;
  }

  /**
   * Gets a specific error from a control
   * @param {string} errorCode - Error code to get
   * @param {string} path - Path to nested control
   * @returns {*} Error value or null
   */
  getError(errorCode, path) {
    if (path) {
      const control = this.get(path);
      return control ? control.getError(errorCode) : null;
    }
    return null;
  }

  /**
   * Sets the parent control
   * @param {FormGroup|FormArray} parent - Parent control
   * @private
   */
  _setParent(parent) {
    this._parent = parent;
  }

  /**
   * Updates the value and validity
   * @param {object} options - Options for emitting events
   */
  updateValueAndValidity(options = {}) {
    this._value$.next(this._calculateValue());
    this._updateStatus();

    if (this._parent && options.onlySelf !== true) {
      this._parent._updateStatus();
    }
  }
}

/**
 * Represents an array of form controls
 */
export class FormArray {
  /**
   * Creates a new FormArray instance
   * @param {Array<FormControl|FormGroup>} controls - Array of controls
   */
  constructor(controls = []) {
    this._controls = controls;
    this._value$ = new BehaviorSubject(this._calculateValue());
    this._status$ = new BehaviorSubject('VALID');
    this._errors$ = new BehaviorSubject(null);
    this._touched$ = new BehaviorSubject(false);
    this._dirty$ = new BehaviorSubject(false);
    this._parent = null;

    // Set parent reference for all controls
    this._controls.forEach((control) => {
      if (control._setParent) {
        control._setParent(this);
      }
    });

    this._subscriptions = [];
    this._subscribeToControlChanges();
    this._updateStatus();
  }

  /**
   * Subscribes to all control changes
   * @private
   */
  _subscribeToControlChanges() {
    this._controls.forEach((control) => {
      const valueSub = control.valueChanges.subscribe(() => {
        this._value$.next(this._calculateValue());
        this._updateStatus();
        this._updateTouchedDirty();
      });

      const statusSub = control.statusChanges.subscribe(() => {
        this._updateStatus();
      });

      this._subscriptions.push(valueSub, statusSub);
    });
  }

  /**
   * Calculates the current value array
   * @private
   * @returns {Array} Array of control values
   */
  _calculateValue() {
    return this._controls.map((control) => control.value);
  }

  /**
   * Updates the array status based on control statuses
   * @private
   */
  _updateStatus() {
    const errors = [];
    let hasErrors = false;

    this._controls.forEach((control, index) => {
      if (control.invalid) {
        errors[index] = control.errors;
        hasErrors = true;
      }
    });

    this._errors$.next(hasErrors ? errors : null);
    this._status$.next(hasErrors ? 'INVALID' : 'VALID');
  }

  /**
   * Updates touched and dirty status
   * @private
   */
  _updateTouchedDirty() {
    const anyTouched = this._controls.some((c) => c.touched);
    const anyDirty = this._controls.some((c) => c.dirty);

    this._touched$.next(anyTouched);
    this._dirty$.next(anyDirty);
  }

  /**
   * Gets a control at the specified index
   * @param {number} index - Control index
   * @returns {FormControl|FormGroup} The control
   */
  at(index) {
    return this._controls[index];
  }

  /**
   * Gets the length of the array
   * @returns {number} Number of controls
   */
  get length() {
    return this._controls.length;
  }

  /**
   * Gets all controls
   * @returns {Array} Array of controls
   */
  get controls() {
    return this._controls;
  }

  /**
   * Gets the current value array
   * @returns {Array} Current values
   */
  get value() {
    return this._value$.getValue();
  }

  /**
   * Observable stream of value changes
   * @returns {BehaviorSubject} Value observable
   */
  get valueChanges() {
    return this._value$;
  }

  /**
   * Observable stream of status changes
   * @returns {BehaviorSubject} Status observable
   */
  get statusChanges() {
    return this._status$;
  }

  /**
   * Gets the current validation errors
   * @returns {Array|null} Errors array or null if valid
   */
  get errors() {
    return this._errors$.getValue();
  }

  /**
   * Checks if the array is valid
   * @returns {boolean} True if valid
   */
  get valid() {
    return this._status$.getValue() === 'VALID';
  }

  /**
   * Checks if the array is invalid
   * @returns {boolean} True if invalid
   */
  get invalid() {
    return this._status$.getValue() === 'INVALID';
  }

  /**
   * Checks if any control has been touched
   * @returns {boolean} True if touched
   */
  get touched() {
    return this._touched$.getValue();
  }

  /**
   * Checks if no controls have been touched
   * @returns {boolean} True if untouched
   */
  get untouched() {
    return !this._touched$.getValue();
  }

  /**
   * Checks if any control has been changed
   * @returns {boolean} True if dirty
   */
  get dirty() {
    return this._dirty$.getValue();
  }

  /**
   * Checks if no controls have been changed
   * @returns {boolean} True if pristine
   */
  get pristine() {
    return !this._dirty$.getValue();
  }

  /**
   * Pushes a new control to the end of the array
   * @param {FormControl|FormGroup} control - Control to add
   */
  push(control) {
    this._controls.push(control);

    // Set parent reference
    if (control._setParent) {
      control._setParent(this);
    }

    const valueSub = control.valueChanges.subscribe(() => {
      this._value$.next(this._calculateValue());
      this._updateStatus();
      this._updateTouchedDirty();
    });

    const statusSub = control.statusChanges.subscribe(() => {
      this._updateStatus();
    });

    this._subscriptions.push(valueSub, statusSub);
    this._value$.next(this._calculateValue());
    this._updateStatus();
  }

  /**
   * Inserts a control at the specified index
   * @param {number} index - Index to insert at
   * @param {FormControl|FormGroup} control - Control to insert
   */
  insert(index, control) {
    this._controls.splice(index, 0, control);

    // Set parent reference
    if (control._setParent) {
      control._setParent(this);
    }

    const valueSub = control.valueChanges.subscribe(() => {
      this._value$.next(this._calculateValue());
      this._updateStatus();
      this._updateTouchedDirty();
    });

    const statusSub = control.statusChanges.subscribe(() => {
      this._updateStatus();
    });

    this._subscriptions.push(valueSub, statusSub);
    this._value$.next(this._calculateValue());
    this._updateStatus();
  }

  /**
   * Removes a control at the specified index
   * @param {number} index - Index to remove
   */
  removeAt(index) {
    this._controls.splice(index, 1);
    this._value$.next(this._calculateValue());
    this._updateStatus();
  }

  /**
   * Clears all controls from the array
   */
  clear() {
    this._controls = [];
    this._value$.next([]);
    this._updateStatus();
  }

  /**
   * Sets the value of all controls
   * @param {Array} values - Array of values
   * @param {object} options - Options for emitting events
   */
  setValue(values, options = {}) {
    values.forEach((value, index) => {
      if (this._controls[index]) {
        this._controls[index].setValue(value, options);
      }
    });
  }

  /**
   * Patches values for controls (only updates provided indices)
   * @param {Array} values - Array of values to update
   * @param {object} options - Options for emitting events
   */
  patchValue(values, options = {}) {
    values.forEach((value, index) => {
      if (this._controls[index]) {
        this._controls[index].patchValue(value, options);
      }
    });
  }

  /**
   * Marks all controls as touched
   */
  markAsTouched() {
    this._controls.forEach((control) => control.markAsTouched());
    this._touched$.next(true);
  }

  /**
   * Marks all controls as untouched
   */
  markAsUntouched() {
    this._controls.forEach((control) => control.markAsUntouched());
    this._touched$.next(false);
  }

  /**
   * Marks all controls as dirty
   */
  markAsDirty() {
    this._controls.forEach((control) => control.markAsDirty());
    this._dirty$.next(true);
  }

  /**
   * Marks all controls as pristine
   */
  markAsPristine() {
    this._controls.forEach((control) => control.markAsPristine());
    this._dirty$.next(false);
  }

  /**
   * Resets all controls
   * @param {Array} values - Optional new values
   */
  reset(values = []) {
    this._controls.forEach((control, index) => {
      const value = values[index] !== undefined ? values[index] : '';
      control.reset(value);
    });
  }

  /**
   * Cleans up subscriptions
   */
  destroy() {
    this._subscriptions.forEach((sub) => sub.unsubscribe());
  }

  /**
   * Gets the raw value including disabled controls
   * @returns {Array} Array of all control values including disabled
   */
  getRawValue() {
    return this._controls.map((control) => {
      if (control.getRawValue) {
        return control.getRawValue();
      }
      return control.value;
    });
  }

  /**
   * Disables all controls in the array
   * @param {object} options - Options for emitting events
   */
  disable(options = {}) {
    this._controls.forEach((control) => {
      control.disable({ ...options, onlySelf: true });
    });
    this._updateStatus();
  }

  /**
   * Enables all controls in the array
   * @param {object} options - Options for emitting events
   */
  enable(options = {}) {
    this._controls.forEach((control) => {
      control.enable({ ...options, onlySelf: true });
    });
    this._updateStatus();
  }

  /**
   * Checks if the array has a specific error
   * @param {string} errorCode - Error code to check
   * @param {string} path - Path to nested control (index)
   * @returns {boolean} True if error exists
   */
  hasError(errorCode, path) {
    return this.getError(errorCode, path) !== null;
  }

  /**
   * Gets a specific error from a control
   * @param {string} errorCode - Error code to get
   * @param {string} path - Path to nested control (index)
   * @returns {*} Error value or null
   */
  getError(errorCode, path) {
    if (path !== undefined) {
      const control = this.at(parseInt(path, 10));
      return control ? control.getError(errorCode) : null;
    }
    return null;
  }

  /**
   * Sets the parent control
   * @param {FormGroup|FormArray} parent - Parent control
   * @private
   */
  _setParent(parent) {
    this._parent = parent;
  }

  /**
   * Updates the value and validity
   * @param {object} options - Options for emitting events
   */
  updateValueAndValidity(options = {}) {
    this._value$.next(this._calculateValue());
    this._updateStatus();

    if (this._parent && options.onlySelf !== true) {
      this._parent._updateStatus();
    }
  }
}
