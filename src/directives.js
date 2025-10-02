/**
 * Structural directives for template engine
 * Similar to Angular's *ngIf, *ngFor, *ngSwitch
 */

/**
 * Process *ngIf directive
 * @param {HTMLElement} element - Element with *ngIf
 * @param {Function} evaluator - Expression evaluator
 * @returns {Object} Directive binding
 */
export function processNgIf(element, evaluator) {
  const condition = element.getAttribute('*ngIf');
  const placeholder = document.createComment(`ngIf: ${condition}`);
  const parent = element.parentNode;
  const nextSibling = element.nextSibling;

  // Store original element
  const originalElement = element.cloneNode(true);
  originalElement.removeAttribute('*ngIf');

  let currentElement = null;
  let isVisible = false;

  // Replace element with placeholder
  parent.replaceChild(placeholder, element);

  const update = () => {
    const shouldShow = evaluator(condition);

    if (shouldShow && !isVisible) {
      // Show element
      const newElement = originalElement.cloneNode(true);
      parent.insertBefore(newElement, placeholder.nextSibling);
      currentElement = newElement;
      isVisible = true;
    } else if (!shouldShow && isVisible) {
      // Hide element
      if (currentElement && currentElement.parentNode) {
        currentElement.remove();
      }
      currentElement = null;
      isVisible = false;
    }
  };

  update();

  return {
    type: 'ngIf',
    element: placeholder,
    update,
    destroy: () => {
      if (currentElement && currentElement.parentNode) {
        currentElement.remove();
      }
    },
  };
}

/**
 * Process *ngFor directive
 * @param {HTMLElement} element - Element with *ngFor
 * @param {Function} evaluator - Expression evaluator
 * @returns {Object} Directive binding
 */
export function processNgFor(element, evaluator) {
  const expression = element.getAttribute('*ngFor');
  const match = expression.match(
    /let\s+(\w+)\s+of\s+([^;]+)(?:;\s*let\s+(\w+)\s*=\s*index)?(?:;\s*trackBy:\s*(\w+))?/
  );

  if (!match) {
    console.error('Invalid *ngFor expression:', expression);
    return null;
  }

  const [, itemName, arrayExpr, indexName, trackByFn] = match;
  const placeholder = document.createComment(`ngFor: ${expression}`);
  const parent = element.parentNode;

  // Store template
  const template = element.cloneNode(true);
  template.removeAttribute('*ngFor');

  // Track generated elements
  let renderedElements = [];

  // Replace original element with placeholder
  parent.replaceChild(placeholder, element);

  const update = () => {
    // Get array from expression
    const array = evaluator(arrayExpr.trim());

    if (!Array.isArray(array)) {
      console.warn('*ngFor expression did not return an array:', arrayExpr);
      return;
    }

    // Remove old elements
    renderedElements.forEach((el) => {
      if (el.parentNode) {
        el.remove();
      }
    });
    renderedElements = [];

    // Render new elements
    array.forEach((item, index) => {
      const newElement = template.cloneNode(true);

      // Replace interpolations with item data
      const html = newElement.innerHTML;
      const processed = html
        .replace(new RegExp(`\\{\\{\\s*${itemName}\\s*\\}\\}`, 'g'), item)
        .replace(
          new RegExp(`\\{\\{\\s*${itemName}\\.(\\w+)\\s*\\}\\}`, 'g'),
          (match, prop) => {
            return item && typeof item === 'object' && prop in item
              ? item[prop]
              : '';
          }
        );

      if (indexName) {
        newElement.innerHTML = processed.replace(
          new RegExp(`\\{\\{\\s*${indexName}\\s*\\}\\}`, 'g'),
          index
        );
      } else {
        newElement.innerHTML = processed;
      }

      // Insert into DOM
      parent.insertBefore(newElement, placeholder.nextSibling);
      renderedElements.push(newElement);
    });
  };

  update();

  return {
    type: 'ngFor',
    element: placeholder,
    update,
    destroy: () => {
      renderedElements.forEach((el) => {
        if (el.parentNode) {
          el.remove();
        }
      });
      renderedElements = [];
    },
  };
}

/**
 * Process *ngSwitch directive
 * @param {HTMLElement} element - Element with [ngSwitch]
 * @param {Function} evaluator - Expression evaluator
 * @returns {Object} Directive binding
 */
export function processNgSwitch(element, evaluator) {
  const switchExpr = element.getAttribute('[ngSwitch]');
  const cases = Array.from(element.querySelectorAll('[*ngSwitchCase]'));
  const defaultCase = element.querySelector('[*ngSwitchDefault]');

  const update = () => {
    const switchValue = evaluator(switchExpr);

    // Hide all cases
    cases.forEach((caseEl) => {
      caseEl.style.display = 'none';
    });
    if (defaultCase) {
      defaultCase.style.display = 'none';
    }

    // Show matching case
    let matched = false;
    for (const caseEl of cases) {
      const caseValue = caseEl.getAttribute('*ngSwitchCase');
      const evalCaseValue = evaluator(caseValue);

      if (switchValue === evalCaseValue) {
        caseEl.style.display = '';
        matched = true;
        break;
      }
    }

    // Show default if no match
    if (!matched && defaultCase) {
      defaultCase.style.display = '';
    }
  };

  update();

  return {
    type: 'ngSwitch',
    element,
    update,
    destroy: () => {},
  };
}

/**
 * Process *ngClass directive
 * @param {HTMLElement} element - Element with [ngClass]
 * @param {Function} evaluator - Expression evaluator
 * @returns {Object} Directive binding
 */
export function processNgClass(element, evaluator) {
  const expression = element.getAttribute('[ngClass]');
  const previousClasses = new Set();

  const update = () => {
    const classObj = evaluator(expression);

    // Remove previous dynamic classes
    previousClasses.forEach((className) => {
      element.classList.remove(className);
    });
    previousClasses.clear();

    if (typeof classObj === 'string') {
      // String: space-separated classes
      const classes = classObj.split(/\s+/).filter(Boolean);
      classes.forEach((className) => {
        element.classList.add(className);
        previousClasses.add(className);
      });
    } else if (Array.isArray(classObj)) {
      // Array: list of class names
      classObj.forEach((className) => {
        if (className) {
          element.classList.add(className);
          previousClasses.add(className);
        }
      });
    } else if (typeof classObj === 'object') {
      // Object: { className: condition }
      Object.entries(classObj).forEach(([className, condition]) => {
        if (condition) {
          element.classList.add(className);
          previousClasses.add(className);
        }
      });
    }
  };

  update();

  return {
    type: 'ngClass',
    element,
    update,
    destroy: () => {
      previousClasses.forEach((className) => {
        element.classList.remove(className);
      });
    },
  };
}

/**
 * Process *ngStyle directive
 * @param {HTMLElement} element - Element with [ngStyle]
 * @param {Function} evaluator - Expression evaluator
 * @returns {Object} Directive binding
 */
export function processNgStyle(element, evaluator) {
  const expression = element.getAttribute('[ngStyle]');
  const previousStyles = new Set();

  const update = () => {
    const styleObj = evaluator(expression);

    // Clear previous dynamic styles
    previousStyles.forEach((prop) => {
      element.style[prop] = '';
    });
    previousStyles.clear();

    if (typeof styleObj === 'object' && styleObj !== null) {
      Object.entries(styleObj).forEach(([prop, value]) => {
        if (value !== null && value !== undefined) {
          element.style[prop] = value;
          previousStyles.add(prop);
        }
      });
    }
  };

  update();

  return {
    type: 'ngStyle',
    element,
    update,
    destroy: () => {
      previousStyles.forEach((prop) => {
        element.style[prop] = '';
      });
    },
  };
}

/**
 * Directive manager to handle all directives
 */
export class DirectiveManager {
  /**
   * Creates a directive manager
   * @param {HTMLElement} root - Root element
   * @param {Function} evaluator - Expression evaluator
   */
  constructor(root, evaluator) {
    this.root = root;
    this.evaluator = evaluator;
    this.directives = [];
  }

  /**
   * Process all directives in the DOM
   */
  process() {
    if (!this.root) {
      return;
    }

    // Process structural directives (order matters)
    this._processDirective('*ngIf', processNgIf);
    this._processDirective('*ngFor', processNgFor);
    this._processDirective('[ngSwitch]', processNgSwitch);

    // Process attribute directives
    this._processDirective('[ngClass]', processNgClass);
    this._processDirective('[ngStyle]', processNgStyle);
  }

  /**
   * Process a specific directive type
   * @param {string} selector - Directive selector
   * @param {Function} processor - Directive processor function
   */
  _processDirective(selector, processor) {
    const elements = Array.from(this.root.querySelectorAll(selector));

    elements.forEach((element) => {
      try {
        const directive = processor(element, this.evaluator.bind(this));
        if (directive) {
          this.directives.push(directive);
        }
      } catch (error) {
        console.error(
          `Error processing directive ${selector} on element:`,
          element,
          error
        );
      }
    });
  }

  /**
   * Update all directives
   */
  update() {
    this.directives.forEach((directive) => {
      if (directive.update) {
        try {
          directive.update();
        } catch (error) {
          console.error('Error updating directive:', directive, error);
        }
      }
    });
  }

  /**
   * Destroy all directives
   */
  destroy() {
    this.directives.forEach((directive) => {
      if (directive.destroy) {
        directive.destroy();
      }
    });
    this.directives = [];
  }
}
