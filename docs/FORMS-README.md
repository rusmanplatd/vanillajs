# Reactive Forms for Vanilla JavaScript

A powerful reactive forms library for vanilla JavaScript inspired by Angular's Reactive Forms, built with RxJS for reactive state management.

## Features

- ✅ **FormControl** - Individual form field management with validation
- ✅ **FormGroup** - Group multiple controls together
- ✅ **FormArray** - Dynamic arrays of form controls
- ✅ **Built-in Validators** - required, email, minLength, maxLength, pattern, min, max
- ✅ **Reactive State** - RxJS-powered observables for value and status changes
- ✅ **Touch & Dirty Tracking** - Track user interaction and modifications
- ✅ **Custom Validators** - Easy to add your own validation logic
- ✅ **Enable/Disable Controls** - Enable or disable controls dynamically
- ✅ **Manual Error Control** - Set custom errors programmatically
- ✅ **Parent Tracking** - Controls know their parent forms
- ✅ **Status Management** - VALID, INVALID, DISABLED, PENDING states
- ✅ **getRawValue()** - Get values including disabled controls

## Installation

The reactive forms module is already included in your project. Simply import it:

```javascript
import { FormControl, FormGroup, FormArray, Validators } from './src/forms.js';
```

## Quick Start

### Basic FormControl

```javascript
import { FormControl, Validators } from './src/forms.js';

// Create a control with initial value and validators
const nameControl = new FormControl('', [Validators.required]);

// Subscribe to value changes
nameControl.valueChanges.subscribe((value) => {
  console.log('Name changed:', value);
});

// Update the value
nameControl.setValue('John Doe');

// Check validation status
console.log(nameControl.valid); // true
console.log(nameControl.errors); // null
```

### FormGroup - Multiple Controls

```javascript
import { FormControl, FormGroup, Validators } from './src/forms.js';

const loginForm = new FormGroup({
  email: new FormControl('', [Validators.required, Validators.email]),
  password: new FormControl('', [Validators.required, Validators.minLength(8)]),
});

// Subscribe to form value changes
loginForm.valueChanges.subscribe((value) => {
  console.log('Form value:', value);
  // { email: '...', password: '...' }
});

// Set all values at once
loginForm.setValue({
  email: 'user@example.com',
  password: 'mypassword123',
});

// Patch only some values
loginForm.patchValue({ email: 'new@example.com' });

// Check if form is valid
if (loginForm.valid) {
  console.log('Submit form:', loginForm.value);
}
```

### FormArray - Dynamic Controls

```javascript
import { FormControl, FormArray, Validators } from './src/forms.js';

const phoneNumbers = new FormArray([
  new FormControl('', [Validators.required]),
  new FormControl('', [Validators.required]),
]);

// Add a new phone number
phoneNumbers.push(new FormControl(''));

// Access controls
const firstPhone = phoneNumbers.at(0);

// Remove a control
phoneNumbers.removeAt(1);

// Get all values
console.log(phoneNumbers.value); // ['123-456-7890', '098-765-4321']
```

## Available Validators

### Built-in Validators

```javascript
import { Validators } from './src/forms.js';

// Required - field cannot be empty
Validators.required;

// Email - must be valid email format
Validators.email;

// Min Length - minimum string length
Validators.minLength(5);

// Max Length - maximum string length
Validators.maxLength(100);

// Pattern - must match regex pattern
Validators.pattern(/^\d{3}-\d{3}-\d{4}$/);
Validators.pattern('^[A-Z].*');

// Min Value - minimum numeric value
Validators.min(18);

// Max Value - maximum numeric value
Validators.max(100);
```

### Combining Validators

```javascript
const passwordControl = new FormControl('', [
  Validators.required,
  Validators.minLength(8),
  Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9])/),
]);
```

### Custom Validators

Create your own validator functions:

```javascript
function customValidator(control) {
  if (control.value === 'forbidden') {
    return { forbidden: true };
  }
  return null;
}

const control = new FormControl('', [customValidator]);
```

## Advanced Features

### Enable/Disable Controls

Controls can be enabled or disabled dynamically:

```javascript
const emailControl = new FormControl('user@example.com');

// Disable the control
emailControl.disable();
console.log(emailControl.disabled);  // true
console.log(emailControl.enabled);   // false
console.log(emailControl.status);    // 'DISABLED'

// Enable the control
emailControl.enable();
console.log(emailControl.enabled);   // true
```

For FormGroups and FormArrays, you can disable all child controls:

```javascript
const form = new FormGroup({
  name: new FormControl(''),
  email: new FormControl('')
});

form.disable();  // Disables all controls
form.enable();   // Enables all controls
```

### Get Raw Values

Get values including disabled controls:

```javascript
const form = new FormGroup({
  name: new FormControl('John'),
  email: new FormControl('john@example.com')
});

form.get('email').disable();

console.log(form.value);        // { name: 'John' } - excludes disabled
console.log(form.getRawValue()); // { name: 'John', email: 'john@example.com' } - includes disabled
```

### Manual Error Control

Set errors manually (useful for server-side validation):

```javascript
const usernameControl = new FormControl('');

// Set custom error
usernameControl.setErrors({ serverError: 'Username already exists' });

// Check for specific error
if (usernameControl.hasError('serverError')) {
  const error = usernameControl.getError('serverError');
  console.log(error); // 'Username already exists'
}

// Clear errors
usernameControl.setErrors(null);
```

For nested forms, use path parameter:

```javascript
const form = new FormGroup({
  username: new FormControl(''),
  email: new FormControl('')
});

// Check error on specific control
if (form.hasError('required', 'username')) {
  console.log('Username is required');
}
```

### Parent Tracking

Controls maintain references to their parent forms:

```javascript
const addressGroup = new FormGroup({
  street: new FormControl(''),
  city: new FormControl('')
});

const userForm = new FormGroup({
  name: new FormControl(''),
  address: addressGroup
});

// Update control and notify parent
addressGroup.get('city').updateValueAndValidity({ onlySelf: false });

// Update without notifying parent
addressGroup.get('city').updateValueAndValidity({ onlySelf: true });
```

### Dynamic Control Management

Add, remove, and check for controls dynamically:

```javascript
const form = new FormGroup({
  name: new FormControl('')
});

// Check if control exists
console.log(form.contains('name'));  // true
console.log(form.contains('email')); // false

// Add control
form.addControl('email', new FormControl(''));

// Remove control
form.removeControl('email');
```

### Status Management

Controls have detailed status tracking:

```javascript
const control = new FormControl('', [Validators.required]);

console.log(control.status);   // 'INVALID'
console.log(control.valid);    // false
console.log(control.invalid);  // true

control.setValue('value');
console.log(control.status);   // 'VALID'

control.disable();
console.log(control.status);   // 'DISABLED'
```

## FormControl API

### Properties

```javascript
control.value          // Current value
control.valid          // Boolean: is valid
control.invalid        // Boolean: is invalid
control.errors         // Validation errors object
control.touched        // Boolean: has been touched (blurred)
control.untouched      // Boolean: has not been touched
control.dirty          // Boolean: value has changed
control.pristine       // Boolean: value unchanged
control.enabled        // Boolean: is enabled (NEW)
control.disabled       // Boolean: is disabled (NEW)
control.status         // String: 'VALID', 'INVALID', 'DISABLED', 'PENDING' (NEW)
```

### Methods

```javascript
control.setValue(value)              // Set new value
control.patchValue(value)           // Same as setValue
control.reset(value)                // Reset to initial value
control.markAsTouched()             // Mark as touched
control.markAsUntouched()           // Mark as untouched
control.markAsDirty()               // Mark as dirty
control.markAsPristine()            // Mark as pristine
control.setValidators([...])        // Replace validators
control.addValidators([...])        // Add validators
control.clearValidators()           // Remove all validators
control.validate()                  // Run validation
control.disable(options)            // Disable control (NEW)
control.enable(options)             // Enable control (NEW)
control.setErrors(errors, options)  // Set custom errors (NEW)
control.hasError(errorCode, path)   // Check for specific error (NEW)
control.getError(errorCode, path)   // Get specific error value (NEW)
control.getRawValue()               // Get value (same as value for FormControl) (NEW)
control.updateValueAndValidity(opts) // Update value and validity (NEW)
```

### Observables

```javascript
control.valueChanges.subscribe((value) => {
  console.log('Value changed:', value);
});

control.statusChanges.subscribe((status) => {
  console.log('Status:', status); // 'VALID' or 'INVALID'
});

control.errorChanges.subscribe((errors) => {
  console.log('Errors:', errors);
});
```

## FormGroup API

### Properties

```javascript
formGroup.value; // Object with all control values
formGroup.valid; // Boolean: all controls valid
formGroup.errors; // Object with all control errors
formGroup.touched; // Boolean: any control touched
formGroup.dirty; // Boolean: any control dirty
```

### Methods

```javascript
formGroup.get('controlName')                    // Get a control
formGroup.setValue({ field1: 'val', ... })      // Set all values
formGroup.patchValue({ field1: 'val' })         // Update some values
formGroup.reset()                               // Reset all controls
formGroup.addControl('name', control)           // Add new control
formGroup.removeControl('name')                 // Remove control
formGroup.markAsTouched()                       // Mark all as touched
formGroup.markAsPristine()                      // Mark all as pristine
formGroup.disable(options)                      // Disable all controls (NEW)
formGroup.enable(options)                       // Enable all controls (NEW)
formGroup.getRawValue()                         // Get all values including disabled (NEW)
formGroup.contains(name)                        // Check if control exists (NEW)
formGroup.hasError(errorCode, path)             // Check for specific error (NEW)
formGroup.getError(errorCode, path)             // Get specific error value (NEW)
formGroup.updateValueAndValidity(options)       // Update value and validity (NEW)
```

## FormArray API

### Properties

```javascript
formArray.value; // Array of all control values
formArray.length; // Number of controls
formArray.controls; // Array of controls
formArray.valid; // Boolean: all controls valid
```

### Methods

```javascript
formArray.at(index)                      // Get control at index
formArray.push(control)                  // Add control to end
formArray.insert(index, control)         // Insert at index
formArray.removeAt(index)                // Remove at index
formArray.clear()                        // Remove all controls
formArray.setValue([val1, val2])         // Set all values
formArray.patchValue([val1])             // Update some values
formArray.disable(options)               // Disable all controls (NEW)
formArray.enable(options)                // Enable all controls (NEW)
formArray.getRawValue()                  // Get all values including disabled (NEW)
formArray.hasError(errorCode, path)      // Check for specific error (NEW)
formArray.getError(errorCode, path)      // Get specific error value (NEW)
formArray.updateValueAndValidity(options) // Update value and validity (NEW)
```

## Usage with HTML Forms

### Binding to Input Elements

```javascript
const emailControl = new FormControl('', [
  Validators.required,
  Validators.email,
]);

// Bind input value
document.getElementById('email').addEventListener('input', (e) => {
  emailControl.setValue(e.target.value);
});

// Mark as touched on blur
document.getElementById('email').addEventListener('blur', () => {
  emailControl.markAsTouched();
});

// Display errors
emailControl.errorChanges.subscribe((errors) => {
  const errorEl = document.getElementById('email-error');

  if (errors && emailControl.touched) {
    if (errors.required) {
      errorEl.textContent = 'Email is required';
    } else if (errors.email) {
      errorEl.textContent = 'Invalid email format';
    }
  } else {
    errorEl.textContent = '';
  }
});
```

### Form Submission

```javascript
const form = new FormGroup({
  username: new FormControl('', [Validators.required]),
  email: new FormControl('', [Validators.required, Validators.email]),
});

document.getElementById('myForm').addEventListener('submit', (e) => {
  e.preventDefault();

  // Mark all as touched to show errors
  form.markAsTouched();

  if (form.valid) {
    console.log('Submit:', form.value);
    // Send to server...
  }
});
```

## Real-World Examples

### User Registration Form

```javascript
const registrationForm = new FormGroup({
  username: new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(20),
  ]),
  email: new FormControl('', [Validators.required, Validators.email]),
  password: new FormControl('', [
    Validators.required,
    Validators.minLength(8),
    Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9])/),
  ]),
  age: new FormControl('', [
    Validators.required,
    Validators.min(18),
    Validators.max(100),
  ]),
});

// Display real-time validation
registrationForm.statusChanges.subscribe(() => {
  document.getElementById('submit-btn').disabled = !registrationForm.valid;
});
```

### Dynamic Phone Numbers List

```javascript
const contactForm = new FormGroup({
  name: new FormControl('', [Validators.required]),
  phones: new FormArray([
    new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{3}-\d{3}-\d{4}$/),
    ]),
  ]),
});

// Add phone number
function addPhone() {
  const phonesArray = contactForm.get('phones');
  phonesArray.push(
    new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{3}-\d{3}-\d{4}$/),
    ])
  );
}

// Remove phone number
function removePhone(index) {
  contactForm.get('phones').removeAt(index);
}
```

### Conditional Validation

```javascript
const form = new FormGroup({
  contactMethod: new FormControl('email'),
  email: new FormControl(''),
  phone: new FormControl(''),
});

// Update validators based on contact method
form.get('contactMethod').valueChanges.subscribe((method) => {
  const emailControl = form.get('email');
  const phoneControl = form.get('phone');

  if (method === 'email') {
    emailControl.setValidators([Validators.required, Validators.email]);
    phoneControl.clearValidators();
  } else {
    phoneControl.setValidators([
      Validators.required,
      Validators.pattern(/^\d{10}$/),
    ]);
    emailControl.clearValidators();
  }

  emailControl.validate();
  phoneControl.validate();
});
```

## Demos

### Basic Examples

Open [forms-example.html](forms-example.html) in your browser to see live examples of:

1. **Simple Form** - Basic form with validation
2. **Registration Form** - Complex form with multiple validators
3. **Dynamic Form Array** - Adding/removing phone numbers dynamically

### Advanced Features Demo

Open [forms-advanced-example.html](forms-advanced-example.html) to see the new Angular-compatible features:

1. **Enable/Disable Controls** - Dynamic control enabling/disabling and getRawValue()
2. **Manual Error Control** - setErrors(), hasError(), getError() methods
3. **Parent Tracking** - Parent references and updateValueAndValidity()
4. **Dynamic Control Management** - contains(), addControl(), removeControl()
5. **Status Management** - Detailed status tracking (VALID, INVALID, DISABLED, PENDING)

To run the demos:

```bash
npm start
# Then navigate to forms-example.html or forms-advanced-example.html
```

## Best Practices

1. **Always validate on submit** - Mark all controls as touched to show errors:

   ```javascript
   form.markAsTouched();
   if (form.valid) {
     /* submit */
   }
   ```

2. **Subscribe to observables** - Use RxJS subscriptions for reactive updates:

   ```javascript
   control.valueChanges.subscribe((value) => {
     // React to changes
   });
   ```

3. **Unsubscribe when done** - Clean up subscriptions to prevent memory leaks:

   ```javascript
   const subscription = control.valueChanges.subscribe(...);
   // Later...
   subscription.unsubscribe();
   ```

4. **Use FormGroup for complex forms** - Group related controls together for better organization

5. **Mark controls as touched on blur** - Show validation errors after user leaves the field

## TypeScript Support

While this is a vanilla JavaScript library, you can add TypeScript definitions if needed. The library follows standard patterns that work well with type inference.

## Browser Compatibility

Works in all modern browsers that support:

- ES2021+ JavaScript features
- ES Modules
- RxJS (included in the packages folder)

## Contributing

The reactive forms system is implemented in [src/forms.js](src/forms.js). Feel free to extend it with additional validators or features.

## License

Part of the vanillajs project.
