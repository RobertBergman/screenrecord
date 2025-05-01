# Web Development Basics

A simple introduction to web development

<!-- Script:
Welcome to our presentation on Web Development Basics. Today we'll explore the fundamental concepts and technologies that make up modern web development. This should give you a solid foundation to start building your own websites.
-->

---

## Front-End Technologies

The three core technologies of the web:

* HTML - Structure
* CSS - Styling
* JavaScript - Interactivity

<!-- Script:
The front-end of web development consists of three core technologies. HTML provides the structure of web pages, CSS handles styling and appearance, and JavaScript adds interactivity and dynamic behavior. Together, these technologies form the foundation of modern web development.
-->

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

<!-- Script:
Here's a simple HTML example. HTML uses tags to define the structure of a page. The DOCTYPE declaration specifies the HTML version, the html element is the root element, and the head contains meta information while the body contains the visible content. Tags like h1 for headings and p for paragraphs define different content types.
-->

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

<!-- Script:
Moving on to CSS, which stands for Cascading Style Sheets. CSS controls the visual presentation of HTML elements. In this example, we're styling the body element with a specific font, line height, and color. We're also centering the content and adding padding. The h1 heading is given a blue color to make it stand out.
-->

---

## JavaScript Example

```javascript
// Simple interactive element
document.querySelector('button').addEventListener('click', () => {
  const name = prompt('What is your name?');
  alert(`Hello, ${name}! Welcome to web development.`);
});
```

<!-- Script:
JavaScript adds interactivity to web pages. In this example, we're selecting a button element and adding a click event listener. When clicked, it prompts the user for their name and then displays a personalized welcome message. This demonstrates how JavaScript can respond to user actions and create dynamic experiences.
-->

---

layout: split

# Responsive Design

<!-- Right side -->
* Mobile-first approach
* Flexible grid layouts
* Media queries
* Fluid images
* Viewport meta tag

<!-- Script:
Responsive design is crucial in today's multi-device world. A mobile-first approach means designing for mobile devices first, then enhancing for larger screens. Flexible grid layouts, media queries, and fluid images help content adapt to different screen sizes. The viewport meta tag ensures proper scaling on mobile devices.
-->

---

layout: cover
background: linear-gradient(135deg, #4285f4 0%, #34a853 100%)

# Thank You!

Happy Coding!

<!-- Notes:
Remember to mention additional resources for learning
-->

<!-- Script:
Thank you for joining us for this introduction to web development basics. We've covered the fundamental technologies of HTML, CSS, and JavaScript, as well as responsive design principles. I encourage you to continue exploring these topics and start building your own web projects. Happy coding and best of luck on your web development journey!
-->
