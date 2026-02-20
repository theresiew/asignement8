
const pokemonInput = document.querySelector('#pokemonInput');
const searchBtn = document.querySelector('#searchBtn');
const loadingIndicator = document.querySelector('#loadingIndicator');
const errorMessage = document.querySelector('#errorMessage');
const errorText = document.querySelector('#errorText');
const pokemonCard = document.querySelector('#pokemonCard');
const darkModeToggle = document.querySelector('#darkModeToggle');

const pokemonName = document.querySelector('#pokemonName');
const pokemonId = document.querySelector('#pokemonId');
const pokemonImages = document.querySelector('#pokemonImages');
const pokemonHeight = document.querySelector('#pokemonHeight');
const pokemonWeight = document.querySelector('#pokemonWeight');
const pokemonExperience = document.querySelector('#pokemonExperience');
const pokemonTypes = document.querySelector('#pokemonTypes');

let isDarkMode = false;

darkModeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    
    if (isDarkMode) {
        document.body.classList.add('bg-gray-900');
        document.body.classList.remove('bg-gradient-to-br', 'from-blue-400', 'via-purple-500', 'to-pink-500');
        darkModeToggle.classList.add('bg-purple-600');
        darkModeToggle.classList.remove('bg-gray-300');
        darkModeToggle.querySelector('span').classList.add('translate-x-6');
    } else {
        document.body.classList.remove('bg-gray-900');
        document.body.classList.add('bg-gradient-to-br', 'from-blue-400', 'via-purple-500', 'to-pink-500');
        darkModeToggle.classList.remove('bg-purple-600');
        darkModeToggle.classList.add('bg-gray-300');
        darkModeToggle.querySelector('span').classList.remove('translate-x-6');
    }
});


/**
 * Capitalize first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert decimeters to meters
 * @param {number} decimeters - Height in decimeters
 * @returns {string} - Height in meters with unit
 */
function convertHeight(decimeters) {
    const meters = (decimeters / 10).toFixed(2);
    return `${meters} m`;
}

/**
 * Convert hectograms to kilograms
 * @param {number} hectograms - Weight in hectograms
 * @returns {string} - Weight in kilograms with unit
 */
function convertWeight(hectograms) {
    const kilograms = (hectograms / 10).toFixed(2);
    return `${kilograms} kg`;
}

/**
 * Get type color for styling
 * @param {string} type - Pokemon type
 * @returns {string} - Tailwind color classes
 */
function getTypeColor(type) {
    const typeColors = {
        normal: 'bg-gray-400',
        fire: 'bg-red-500',
        water: 'bg-blue-500',
        electric: 'bg-yellow-400',
        grass: 'bg-green-500',
        ice: 'bg-blue-200',
        fighting: 'bg-red-700',
        poison: 'bg-purple-500',
        ground: 'bg-yellow-600',
        flying: 'bg-indigo-400',
        psychic: 'bg-pink-500',
        bug: 'bg-green-400',
        rock: 'bg-yellow-700',
        ghost: 'bg-purple-700',
        dragon: 'bg-indigo-700',
        dark: 'bg-gray-800',
        steel: 'bg-gray-500',
        fairy: 'bg-pink-300'
    };
    return typeColors[type] || 'bg-gray-400';
}

/**
 * Show/hide elements
 */
function showElement(element) {
    element.classList.remove('hidden');
}

function hideElement(element) {
    element.classList.add('hidden');
}

/**
 * Display loading state
 */
function showLoading() {
    hideElement(pokemonCard);
    hideElement(errorMessage);
    showElement(loadingIndicator);
    searchBtn.disabled = true;
    searchBtn.textContent = 'Searching...';
}

/**
 * Hide loading state
 */
function hideLoading() {
    hideElement(loadingIndicator);
    searchBtn.disabled = false;
    searchBtn.textContent = 'Search';
}

/**
 * Display error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    hideLoading();
    hideElement(pokemonCard);
    errorText.textContent = message;
    showElement(errorMessage);
}

/**
 * Display Pokemon data
 * @param {object} data - Pokemon data from API
 */
function displayPokemon(data) {
    hideLoading();
    hideElement(errorMessage);

    pokemonName.textContent = capitalize(data.name);
    pokemonId.textContent = `#${String(data.id).padStart(3, '0')}`;

    pokemonImages.innerHTML = '';
    
    const imageUrls = [
        { url: data.sprites.front_default, label: 'Front' },
        { url: data.sprites.back_default, label: 'Back' },
        { url: data.sprites.front_shiny, label: 'Shiny Front' },
        { url: data.sprites.back_shiny, label: 'Shiny Back' }
    ];

    imageUrls.forEach(({ url, label }) => {
        if (url) {
            const imgContainer = document.createElement('div');
            imgContainer.classList.add('text-center');

            const img = document.createElement('img');
            img.src = url;
            img.alt = `${data.name} ${label}`;
            img.classList.add('w-32', 'h-32', 'mx-auto', 'hover:scale-110', 'transition-transform', 'duration-200');

            const imgLabel = document.createElement('p');
            imgLabel.textContent = label;
            imgLabel.classList.add('text-sm', 'text-gray-600', 'mt-1');

            imgContainer.appendChild(img);
            imgContainer.appendChild(imgLabel);
            pokemonImages.appendChild(imgContainer);
        }
    });

    pokemonHeight.textContent = convertHeight(data.height);
    pokemonWeight.textContent = convertWeight(data.weight);
    pokemonExperience.textContent = data.base_experience;

    pokemonTypes.innerHTML = '';
    data.types.map(typeInfo => {
        const typeElement = document.createElement('span');
        typeElement.textContent = capitalize(typeInfo.type.name);
        
        const colorClass = getTypeColor(typeInfo.type.name);
        typeElement.classList.add(
            'px-4', 
            'py-2', 
            'rounded-full', 
            'text-white', 
            'font-semibold', 
            'text-sm',
            colorClass
        );
        
        pokemonTypes.appendChild(typeElement);
    });

    showElement(pokemonCard);
}


/**
 * Fetch Pokemon data from PokeAPI
 * @param {string} nameOrId - Pokemon name or ID
 */
async function fetchPokemon(nameOrId) {

    showLoading();

    try {
        
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId.toLowerCase()}`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Pokémon not found! Please check the name or ID and try again.');
            }
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();

        displayPokemon(data);

    } catch (error) {
       s
        console.error('Error fetching Pokemon:', error);
        
        if (error.message.includes('Pokémon not found')) {
            showError(error.message);
        } else if (error.message.includes('Failed to fetch')) {
            showError('Network error! Please check your internet connection.');
        } else {
            showError('Something went wrong! Please try again.');
        }
    }
}

searchBtn.addEventListener('click', () => {
    const input = pokemonInput.value.trim();
    
    if (input === '') {
        showError('Please enter a Pokémon name or ID!');
        return;
    }
    
    fetchPokemon(input);
});

pokemonInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const input = pokemonInput.value.trim();
        
        if (input === '') {
            showError('Please enter a Pokémon name or ID!');
            return;
        }
        
        fetchPokemon(input);
    }
});

window.addEventListener('DOMContentLoaded', () => {
    fetchPokemon('pikachu');
});