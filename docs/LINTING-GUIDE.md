# Linting and Formatting Guide

This project uses comprehensive linting and formatting tools to maintain code quality and
consistency across all file types.

## Tools Overview

### JavaScript Linting - ESLint

- **Config file**: `.eslintrc.json`
- **Purpose**: Enforces code quality rules and JSDoc documentation standards
- **Key rules**:
  - No `var`, use `const` or `let`
  - Require curly braces for all control statements
  - Strict equality (`===`) required
  - JSDoc comments required for functions and classes
  - Modern ES6+ features preferred

### CSS Linting - Stylelint

- **Config file**: `.stylelintrc.json`
- **Purpose**: Enforces CSS code quality and consistency
- **Key rules**:
  - No named colors (use hex/rgb/hsl)
  - Kebab-case for selectors (when enforced)
  - Consistent spacing and formatting
  - Maximum nesting depth of 4

### HTML Linting - HTMLHint

- **Config file**: `.htmlhintrc`
- **Purpose**: Validates HTML structure and best practices
- **Key rules**:
  - HTML5 doctype required
  - Lowercase tag names and attributes
  - Double quotes for attribute values
  - Unique IDs
  - Alt text for images

### Markdown Linting - markdownlint

- **Config file**: `.markdownlint.json`
- **Purpose**: Enforces consistent Markdown formatting
- **Key rules**:
  - ATX-style headings (`#` not underline)
  - Dash-style unordered lists
  - Maximum line length of 100 characters
  - Fenced code blocks with language specified

### Code Formatting - Prettier

- **Config file**: `.prettierrc.json`
- **Purpose**: Auto-formats all file types consistently
- **Settings**:
  - Single quotes for JS (double for CSS)
  - Semicolons required
  - 2-space indentation
  - 80 character line width for code
  - LF line endings

### Editor Configuration - EditorConfig

- **Config file**: `.editorconfig`
- **Purpose**: Ensures consistent editor settings across different IDEs
- **Settings**:
  - UTF-8 encoding
  - LF line endings
  - Trim trailing whitespace
  - 2-space indentation for most files

## Available Scripts

### Linting

```bash
# Run all linters (JS, CSS, HTML, MD)
npm run lint

# Run individual linters
npm run lint:js       # JavaScript only
npm run lint:css      # CSS only
npm run lint:html     # HTML only
npm run lint:md       # Markdown only
```

### Auto-fixing

```bash
# Auto-fix all issues that can be fixed automatically
npm run lint:fix

# Auto-fix individual file types
npm run lint:js:fix   # JavaScript auto-fix
npm run lint:css:fix  # CSS auto-fix
```

### Formatting

```bash
# Format all files with Prettier
npm run format

# Check formatting without modifying files
npm run format:check
```

### Validation

```bash
# Run all linters and format check (for CI/CD)
npm run validate
```

## Pre-commit Workflow

Before committing code, run:

```bash
npm run lint:fix
npm run format
```

This will auto-fix most issues and format your code consistently.

## Ignored Files

The following directories and files are ignored by linters:

- `node_modules/` - Dependencies
- `docs/` - Generated documentation
- `packages/` - Third-party packages
- `*.min.js`, `*.min.css` - Minified files

## IDE Integration

### VS Code

Install these extensions for the best experience:

- ESLint (`dbaeumer.vscode-eslint`)
- Stylelint (`stylelint.vscode-stylelint`)
- HTMLHint (`mkaufman.htmlhint`)
- markdownlint (`DavidAnson.vscode-markdownlint`)
- Prettier (`esbenp.prettier-vscode`)
- EditorConfig (`EditorConfig.EditorConfig`)

### Configuration

1. Enable "Format on Save" in VS Code settings
2. Set Prettier as default formatter
3. Enable ESLint auto-fix on save

## Troubleshooting

### ESLint errors

If you see ESLint parsing errors:

1. Make sure you're using modern JavaScript syntax
2. Check that files use ES modules (`import`/`export`)
3. Verify JSDoc comments are properly formatted

### Stylelint errors

Common issues:

- Use hex colors instead of named colors (`#ffffff` not `white`)
- Follow kebab-case for class names when required
- Avoid deep nesting (max 4 levels)

### HTMLHint errors

Common issues:

- Use lowercase for tags and attributes
- Use double quotes for attribute values
- Ensure unique IDs across the page
- Add alt text to all images

### Markdown errors

Common issues:

- Keep lines under 100 characters
- Use language tags for code blocks (\`\`\`javascript not \`\`\`)
- Use ATX-style headings (`#` not underlines)

## Custom Rules

### Disabling Rules

You can disable rules inline when necessary:

**JavaScript:**

```javascript
/* eslint-disable no-console */
console.log('Debug output');
/* eslint-enable no-console */
```

**CSS:**

```css
/* stylelint-disable color-named */
background: white;
/* stylelint-enable color-named */
```

**HTML:**

```html
<!-- htmlhint attr-lowercase:false -->
<div dataAttribute="value"></div>
```

**Markdown:**

```markdown
<!-- markdownlint-disable MD013 -->

This is a very long line that exceeds the 100 character limit but we need it for some reason

<!-- markdownlint-enable MD013 -->
```

### Modifying Rules

Edit the respective config files to adjust rules:

- `.eslintrc.json` - ESLint rules
- `.stylelintrc.json` - Stylelint rules
- `.htmlhintrc` - HTMLHint rules
- `.markdownlint.json` - markdownlint rules
- `.prettierrc.json` - Prettier settings

## CI/CD Integration

For continuous integration, add this to your CI workflow:

```yaml
- name: Install dependencies
  run: npm install

- name: Run linters
  run: npm run validate
```

This ensures all code is properly linted and formatted before merging.

## Benefits

- **Consistency**: Code looks the same regardless of who wrote it
- **Quality**: Catches common mistakes and anti-patterns
- **Maintainability**: Makes code easier to read and understand
- **Collaboration**: Reduces style debates in code reviews
- **Automation**: Auto-fix and formatting save time
