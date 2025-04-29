# JavaScript Best Practices

This document outlines important JavaScript best practices to improve your code quality, readability, and maintainability.

## Table of Contents

1. [Declare and initialize variables at the top](#declare-and-initialize-variables-at-the-top)
2. [Build modular, specialized functions](#build-modular-specialized-functions)
3. [Recognize and remove duplicate code](#recognize-and-remove-duplicate-code)
4. [Comment your code often](#comment-your-code-often)
5. [Beware of recursion overuse](#beware-of-recursion-overuse)
6. [Be efficient with DOM manipulations](#be-efficient-with-dom-manipulations)
7. [Avoid global variables at all costs](#avoid-global-variables-at-all-costs)
8. [Make use of shorthand notation](#make-use-of-shorthand-notation)
9. [Use Strict Mode to catch silent errors](#use-strict-mode-to-catch-silent-errors)
10. [Set default values](#set-default-values)
11. [Use template literals to combine strings](#use-template-literals-to-combine-strings)
12. [Solve existence testing with includes](#solve-existence-testing-with-includes)
13. [Shorten conditionals with falsy values](#shorten-conditionals-with-falsy-values)
14. [Sharing methods with inheritance](#sharing-methods-with-inheritance)
15. [Write shorter loops with array methods](#write-shorter-loops-with-array-methods)

## Declare and initialize variables at the top

Nothing disrupts readability like a late declaration. Just as it's easier to take out all your tools before starting a job, it's simpler to declare all variables before getting into the nitty-gritty of your function. This gives easy access should we need to tweak any name or value later down the line.

While on the topic of variables, it's best practice to initialize your variables at the time of creation so you and your team can ensure none are left undefined.

```javascript
var x = 5;
```

## Build modular, specialized functions

No one function should have to do it all, for both efficiency and readability's sake. Instead, when designing functions, consider a single task that it should accomplish and write it to complete that task only. Name the function to match that task.

This makes the code easier for others to read. The function will inherently be simpler and less extensive if only working toward one task. Further, it allows you and your team to lift this function to another program should you need it later.

```javascript
// Poor practice - one function does multiple things
function table(columns, rows, item) {
  // creates table and searches it for the passed item
}

// Better practice - specialized functions
function createTable(columns, rows) {
  // creates table
}

function searchTable(table, item) {
  // searches table for the passed item
}
```

## Recognize and remove duplicate code

You should look out for instances in your code where you have identical lines of duplicate code.

In cases like these, you should move the duplicated code into a function and call the function in all the instances that it was used before. This reduces visual clutter and aids in debugging later as the team can look at the one function rather than its multiple usage sections.

```javascript
// Duplicate code
var x = 5;
var y = 6;
var x = x * 2;
var y = y * 2;

// Better approach
var x = 5;
var y = 6;

function double(value) {
  return value * 2;
}
x = double(x);
y = double(y);
```

## Comment your code often

Comments are a great way to summarize a code fragment's purpose, saving your fellow developers the time it would take to determine it on their own.

It also allows them to catch possible mistakes if the code does not complete the task it is commented to complete. In general, it's best to leave one comment on every function.

If you're unsure if you should leave a comment, just do it! It can always be deleted later if it's too much clutter.

```javascript
// Declares and initializes var x
var x = 5;
```

## Beware of recursion overuse

Be mindful of nesting recursive functions too many levels. While capable of solving many problems, nesting is notoriously difficult to understand at a glance.

To avoid confusion, be mindful of where recursive functions can be pulled out of their nested place without significant runtime cost and do so whenever possible. If you have 3+ levels of nested functions, chances are your fellow developers will have a hard time following it.

```javascript
// Too complex and hard to follow
function function1(a, b) {
  function function2() {
    function function3() {
      // this is too hard to follow and can likely be solved another way
    }
  }
}
```

## Be efficient with DOM manipulations

Accessing the DOM is essential for getting the most out of your program, but doing so repeatedly causes visual clutter and will slow down the program.

Instead, access it once and cache it for later use in a variable. From then on, you can access that variable instead of the DOM directly. This process is visually cleaner and more efficient.

Note: It's best practice to mark any DOM reference with the $ symbol.

```javascript
// Inefficient - multiple DOM accesses
function accountInfo() {
  var email = $("#accounts").find(".email").val();
  var accountNumber = $("#accounts").find(".accountNumber").val();
}

// Better - caching DOM reference
function accountInfo() { 
  var $accounts = $("#accounts");
  var email = $accounts.find(".email").val(); 
  var accountNumber = $accounts.find(".accountNumber").val();
}
```

## Avoid global variables at all costs

In JavaScript, variables have a scope in which they can be used, either global or local. These scopes decide where in your code these variables are defined or can be accessed. Global variables can be defined anywhere in the program and exist outside of functions. Local variables are only visible within the function it is defined.

If there are a local variable and a global variable with the same name, JavaScript will prioritize the local variable and ignore the global variable. Global variables should still be avoided, as they can accidentally overwrite window variables resulting in errors.

Further, having many global variables will slow down your program since they are not deleted until the window is closed, whereas local variables are deleted once the function is completed.

```html
<html>
  <script>
    var myVar = "my global variable"; // This variable is declared as global
    function localVariable() {
      var myVar = "my local variable";  // This is a locally declared variable
    }
  </script>
</html>
```

## Make use of shorthand notation

When designing objects or arrays in JavaScript, line space can be saved by opting for shorthand notation. This is accomplished by setting the properties or cells of an object or array during declaration rather than after.

This saves you having to identify which object or array you're setting for on each line, making the section easier to read. While this may seem like a small change, it can save a lot of eye strain for your team as the objects and arrays get more complex.

```javascript
// Longhand Object
var computer = new Object();
computer.caseColor = 'black';
computer.brand = 'Dell';
computer.value = 1200;
computer.onSale = true;

// Shorthand Object
var computer = {
    caseColor: 'black',
    brand: 'Dell',
    value: 1200,
    onSale: true
};

// Shorthand Array
var computerBrands = [
    'Dell',
    'Apple',
    'Lenovo',
    'HP',
    'Toshiba',
    'Sony'
];
```

## Use Strict Mode to catch silent errors

JavaScript is a very forgiving language compared to other hardcoded languages like C++ and Java. While helpful for getting code to run without throwing errors, this leniency can lead to silent errors that pass without correction. This can also lead to inconsistent behavior if JavaScript can resolve the silent error in multiple ways.

To bypass this, opt into Strict Mode. This setting makes two major changes:

1. Silent errors that would previously make it past the compiler now throw errors, allowing you to fine-tune your code before it reaches your team members.
2. Fixes mistakes that prevent JavaScript from optimizing your code

JavaScript Strict Mode programs often run faster than their "sloppy" counterparts.

To opt into strict mode, add the line `'use strict';` either at the top of your script section (if you want the whole section to be strict) or before the desired function (if only certain sections should be strict).

## Set default values

When creating objects, you can set default values for some or all properties of the object. Doing so ensures the values of each attribute are not undefined. It also demonstrates what type of data is expected for that attribute. Additionally, by not setting default values for certain properties, you can communicate to your team that those values are not required for the object to function correctly.

```javascript
function logProperty({
    address = '111 11th Street, 11111', 
    unit,   // optional
    landlord = 'Sara', 
    tenant = 'Raj', 
    rent = 500, 
}) {
    // Function body
}
```

Above, not all properties will have a unit number, but all will have the other four properties, which are populated with the data type expected. To demonstrate this, we leave unit blank.

## Use template literals to combine strings

Putting strings together is a pain, especially when combining strings and variables. To make this process simpler, you can use template literals (marked by backticks), which take both a string and variable.

```javascript
function greet(name) {
    return `Hi, ${name}`; // template literal
}
console.log(greet('Leo')); // Output: Hi, Leo
```

Notice here that by using the template literal, we can log a greeting to any user based on the name passed to us, combining the string `Hi, ` and the value of the passed variable `name`.

## Solve existence testing with includes

Testing the existence of a value within an array is a common problem. Thankfully, JavaScript comes with a special array method, `includes()`, which will return a Boolean if the array contains the searched value. Rather than searching the array, this method provides an efficient, easy-to-read solution.

```javascript
const sections = ['contact', 'shipping'];
 
function displayShipping(sections) {
    return sections.includes('shipping');
}
 
console.log(displayShipping(sections)); // Output: true
```

## Shorten conditionals with falsy values

In JavaScript, there are many values that are equivalent to false across multiple types of variables. This includes:

- the Boolean `false`
- `null`
- `0`
- `NaN` (not a number)
- `''` (empty string)
- `""` (empty string)

In JavaScript, equivalent `==` means that the two objects share the same values, but they may not be the same type. Identical `===` means that the two objects are both the same type and same value.

You can use falsy values to simplify conditionals. Consider this example where you need to check if a given employee has equipment training:

```javascript
const employee = {
    name: 'Eric',
    equipmentTraining: '',
}
 
if (!employee.equipmentTraining) {
    console.log('Not authorized to operate machinery');
}
```

As a result, our if statement checks if `equipmentTraining` still has a falsy value, the default empty string. If it does, the if statement executes and returns that the employee is not authorized. If `equipmentTraining` contains any string other than the default, it will have a truthy value and therefore not execute the if statement.

## Sharing methods with inheritance

Inheritance concerns a way of sharing properties or methods between classes. This is done using the `super` tag to allow the constructor in a child class to access the parent constructor. In doing so, you enhance the readability of your code by only defining the methods once (in the parent class). This makes your code more modular since inheritor classes can be specialized for a given task.

```javascript
class Coupon {
  constructor(price, expiration) {
    this.price = price;
    this.expiration = expiration || 'Two Weeks';
  }
  getExpirationMessage() {
    return `This offer expires in ${this.expiration}`;
  }
}

class FlashCoupon extends Coupon {
    constructor(price, expiration) {
        super(price);
        this.expiration = expiration || 'two hours';
    }
}
 
const flash = new FlashCoupon(10);
console.log(flash.getExpirationMessage()); // Output: This offer expires in two hours
```

## Write shorter loops with array methods

Loops are a common way to create and populate arrays. However, they cause a lot of clutter and can be hard to read due to the number of lines required.

Instead, you can use array methods to accomplish similar effects as for loops with only a fraction of the lines. Take this for loop for example:

```javascript
// Using traditional for loop
const prices = ['1.0', 'negotiable', '2.15'];
 
const formattedPrices = [];
for (let i = 0; i < prices.length; i++) {
    const price = parseFloat(prices[i]);
    if (price) {
        formattedPrices.push(price);
    }
}
console.log(formattedPrices); // Output: [1, 2.15]

// Using array methods
const prices = ['1.0', 'negotiable', '2.15'];
const formattedPrices = prices
  .map(price => parseFloat(price))
  .filter(price => !isNaN(price));
  
console.log(formattedPrices); // Output: [1, 2.15]
```

By using array methods like `map()`, `filter()`, `reduce()`, etc., you can write more concise, readable, and maintainable code.
