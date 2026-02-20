# Pokémon Finder 🎮

A modern, responsive web application that fetches and displays dynamic Pokémon data from the public PokéAPI. Built with vanilla JavaScript, HTML, and Tailwind CSS.

![Pokemon Finder Screenshot](screenshot.png)

## 📋 Project Description

This web application allows users to search for any Pokémon by name or ID and displays comprehensive information including:
- Name and ID
- Multiple sprite images (front, back, shiny variations)
- Height and weight (converted to meters and kilograms)
- Base experience
- Type(s) with color-coded badges
- Dark mode toggle
- Fully responsive design

## 🛠️ Technologies Used

- **HTML5** - Semantic markup structure
- **Vanilla JavaScript (ES6+)** - Asynchronous programming with async/await
- **Tailwind CSS** - Utility-first CSS framework via CDN
- **PokéAPI** - RESTful Pokémon API (https://pokeapi.co)
- **Git & GitHub** - Version control and repository hosting

## ✨ Features

### Core Features
- ✅ Real-time Pokémon search by name or ID
- ✅ Async/await for clean asynchronous code
- ✅ Comprehensive error handling (404, network errors)
- ✅ Dynamic DOM manipulation
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Loading spinner with disabled button state
- ✅ Capitalized Pokémon names
- ✅ Proper unit conversions (height in meters, weight in kg)

### Bonus Features
- 🌟 **Dark Mode Toggle** - Switch between light and dark themes
- 🌟 **Multiple Sprites** - Display front, back, and shiny variations
- 🌟 **Animated Loading** - Smooth spinner animation during fetch
- 🌟 **Button State Management** - Disabled during API requests
- 🌟 **Gradient Backgrounds** - Beautiful gradient card headers
- 🌟 **Card Animation** - Fade-in effect when Pokémon appears
- 🌟 **Type Colors** - Color-coded type badges for visual appeal
- 🌟 **Hover Effects** - Interactive image scaling on hover
- 🌟 **Enter Key Support** - Search by pressing Enter

## 🚀 How to Run the Project

### Option 1: Open Locally
1. Clone this repository:
   ```bash
   git clone https://github.com/YOUR-USERNAME/pokemon-finder.git
   ```

2. Navigate to the project folder:
   ```bash
   cd pokemon-finder
   ```

3. Open `index.html` in your browser:
   - Double-click the file, or
   - Right-click → Open with → Your browser, or
   - Use Live Server extension in VS Code

### Option 2: GitHub Pages
Visit the live demo: [https://YOUR-USERNAME.github.io/pokemon-finder](https://YOUR-USERNAME.github.io/pokemon-finder)

## 📖 Key Technical Concepts

### 1. The Fetch API
The Fetch API is a modern, promise-based interface for making HTTP requests. It returns a Promise that resolves to the Response object.

```javascript
const response = await fetch('https://pokeapi.co/api/v2/pokemon/pikachu');
const data = await response.json(); // Parse JSON from response body
```

**Why response.json()?** The Response object contains the raw HTTP response. We need to call `.json()` to parse the response body as JSON data.

### 2. Async/Await
Async/await makes asynchronous code look and behave more like synchronous code, improving readability.

```javascript
async function fetchPokemon(name) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await response.json();
    return data;
}
```

**Benefits:**
- Avoids "callback hell" and deeply nested `.then()` chains
- Makes error handling easier with try/catch
- More intuitive code flow

### 3. JSON (JavaScript Object Notation)
JSON is a lightweight data-interchange format. The PokéAPI returns data in JSON format.

```json
{
  "name": "pikachu",
  "id": 25,
  "height": 4,
  "weight": 60
}
```

### 4. DOM Manipulation
Dynamic rendering creates HTML elements in JavaScript based on fetched data. This is better than hard-coding because:
- Data can change without modifying HTML
- Supports multiple searches without page reload
- Separates data from presentation

```javascript
const typeElement = document.createElement('span');
typeElement.textContent = typeName;
pokemonTypes.appendChild(typeElement);
```

### 5. Tailwind CSS Philosophy
Tailwind uses **utility classes** - small, single-purpose classes that do one thing:
- `bg-blue-500` - blue background
- `p-4` - padding of 1rem
- `rounded-lg` - large border radius

**Benefits:**
- Faster development (no custom CSS writing)
- Consistency across the design
- Easier maintenance
- Responsive design with built-in breakpoints (`md:`, `lg:`)

### 6. Error Handling
The application handles two main error types:

**404 Client Error (Pokémon not found):**
```javascript
if (response.status === 404) {
    throw new Error('Pokémon not found!');
}
```

**Network Failure:**
```javascript
catch (error) {
    if (error.message.includes('Failed to fetch')) {
        showError('Network error!');
    }
}
```

## 📚 Key Learnings

1. **Asynchronous JavaScript**: Mastered async/await patterns for cleaner, more readable code compared to callbacks and promise chains.

2. **API Integration**: Learned how to interact with RESTful APIs, handle responses, and parse JSON data.

3. **Error Handling Best Practices**: Implemented comprehensive error handling for both client errors (404) and network failures.

4. **DOM Manipulation**: Gained proficiency in dynamically creating and updating HTML elements based on fetched data.

5. **Tailwind CSS Mastery**: Understood the utility-first approach and how to build fully responsive designs without writing custom CSS.

6. **User Experience**: Implemented loading states, error messages, and disabled button states to provide clear feedback to users.

7. **Code Organization**: Structured JavaScript with clear separation of concerns (utility functions, display functions, API calls).

## 🚧 Challenges Faced

### Challenge 1: Understanding Async/Await
**Problem**: Initially struggled with promise handling and async function execution flow.

**Solution**: Studied how async functions always return promises and how await pauses execution until the promise resolves. Used try/catch for error handling.

### Challenge 2: Dynamic Type Rendering with .map()
**Problem**: Needed to display multiple Pokémon types dynamically with different colors.

**Solution**: Used the `.map()` method to iterate over the types array and dynamically create styled span elements for each type.

```javascript
data.types.map(typeInfo => {
    const typeElement = document.createElement('span');
    // ... styling logic
    pokemonTypes.appendChild(typeElement);
});
```

### Challenge 3: Button State Management During Fetch
**Problem**: Users could click the search button multiple times during an API request, causing multiple simultaneous requests.

**Solution**: Disabled the button when the fetch starts and re-enabled it after completion:
```javascript
searchBtn.disabled = true; // During fetch
searchBtn.disabled = false; // After fetch completes
```

### Challenge 4: Responsive Design Across Devices
**Problem**: Ensuring the layout looks good on mobile, tablet, and desktop screens.

**Solution**: Used Tailwind's responsive prefixes (`md:`, `lg:`) and flexbox utilities:
```html
<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
```

### Challenge 5: Converting API Units
**Problem**: The API returns height in decimeters and weight in hectograms.

**Solution**: Created utility functions to convert to user-friendly units:
```javascript
function convertHeight(decimeters) {
    return (decimeters / 10).toFixed(2) + ' m';
}
```

### Challenge 6: Handling Different Error Types
**Problem**: Needed to differentiate between "Pokémon not found" and network errors.

**Solution**: Checked response status codes and error types:
```javascript
if (response.status === 404) {
    // Handle 404 specifically
} else if (error.message.includes('Failed to fetch')) {
    // Handle network errors
}
```

## 📸 Screenshots

### Desktop View
![Desktop Screenshot](screenshot-desktop.png)

### Mobile View
![Mobile Screenshot](screenshot-mobile.png)

### Dark Mode
![Dark Mode Screenshot](screenshot-dark.png)

## 🎯 Assignment Requirements Checklist

### Technical Requirements
- ✅ Plain HTML and vanilla JavaScript
- ✅ Tailwind CSS integration via CDN
- ✅ No external frameworks (React, Vue, jQuery)
- ✅ index.html, script.js, README.md files

### UI Requirements
- ✅ Modern, clean, and fully responsive design
- ✅ Centered content card
- ✅ Clear card layout
- ✅ Responsive across screen sizes
- ✅ Hover effects and smooth transitions
- ✅ Utility classes for styling

### Required Design Elements
- ✅ Title Header
- ✅ Input Field for search
- ✅ Fetch/Search Button
- ✅ Loading Indicator
- ✅ Pokémon Card Display Area

### JavaScript Requirements
- ✅ Native fetch() API
- ✅ Async/await implementation
- ✅ Try/catch error handling
- ✅ 404 "Pokémon not found" handling
- ✅ DOM manipulation (querySelector, createElement, appendChild, classList)
- ✅ .map() method for types rendering

### Data Display
- ✅ Name (capitalized)
- ✅ ID (formatted as #025)
- ✅ Height (in meters)
- ✅ Weight (in kilograms)
- ✅ Base Experience
- ✅ Types (dynamic list)
- ✅ Pokémon Image

### Bonus Features
- ✅ Disabled button during fetch
- ✅ Animated loading spinner
- ✅ Continuous searching
- ✅ Multiple sprites display
- ✅ Gradient backgrounds
- ✅ Card appearance animation
- ✅ Dark mode toggle

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [PokéAPI](https://pokeapi.co) - The RESTful Pokémon API
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- Pokémon and Pokémon character names are trademarks of Nintendo

---

**Built with ❤️ for learning modern web development**