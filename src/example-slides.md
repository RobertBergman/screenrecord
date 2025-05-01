# Web Development Basics

A simple introduction to web development

---

## Front-End Technologies

The three core technologies of the web:

* HTML - Structure
* CSS - Styling
* JavaScript - Interactivity

---

## HTML Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Web Page</title>
</head>
<body>
  <h1>Hello World!</h1>
  <p>This is a simple webpage.</p>
</body>
</html>
```

---

## CSS Example

```css
body {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #4285f4;
}
```

---

## JavaScript Example

```javascript
// Simple interactive element
document.querySelector('button').addEventListener('click', () => {
  const name = prompt('What is your name?');
  alert(`Hello, ${name}! Welcome to web development.`);
});
```

---

layout: split

# Responsive Design

<!-- Right side -->
* Mobile-first approach
* Flexible grid layouts
* Media queries
* Fluid images
* Viewport meta tag

---

layout: cover
background: linear-gradient(135deg, #4285f4 0%, #34a853 100%)

# Thank You!

Happy Coding!

<!-- Notes:
Remember to mention additional resources for learning
-->
