const pokemonInput = document.querySelector('#pokemonInput');
const searchBtn = document.querySelector('#searchBtn');
const randomBtn = document.querySelector('#randomBtn');
const loadingIndicator = document.querySelector('#loadingIndicator');
const errorMessage = document.querySelector('#errorMessage');
const errorText = document.querySelector('#errorText');
const pokemonCard = document.querySelector('#pokemonCard');
const darkModeToggle = document.querySelector('#darkModeToggle');
const recentSearches = document.querySelector('#recentSearches');
const clearHistoryBtn = document.querySelector('#clearHistoryBtn');
const historyEmptyState = document.querySelector('#historyEmptyState');

const pokemonName = document.querySelector('#pokemonName');
const pokemonId = document.querySelector('#pokemonId');
const pokemonImages = document.querySelector('#pokemonImages');
const pokemonHeight = document.querySelector('#pokemonHeight');
const pokemonWeight = document.querySelector('#pokemonWeight');
const pokemonExperience = document.querySelector('#pokemonExperience');
const pokemonTypes = document.querySelector('#pokemonTypes');

const HISTORY_STORAGE_KEY = 'pokemonFinderRecentSearches';
const THEME_STORAGE_KEY = 'pokemonFinderDarkMode';
const MAX_RECENT_SEARCHES = 6;

let isDarkMode = false;
let recentSearchHistory = [];

function applyTheme() {
    const toggleKnob = darkModeToggle.querySelector('span');

    if (isDarkMode) {
        document.body.classList.add('bg-gray-900');
        document.body.classList.remove('bg-gradient-to-br', 'from-blue-400', 'via-purple-500', 'to-pink-500');
        darkModeToggle.classList.add('bg-purple-600');
        darkModeToggle.classList.remove('bg-gray-300');
        toggleKnob.classList.add('translate-x-6');
        return;
    }

    document.body.classList.remove('bg-gray-900');
    document.body.classList.add('bg-gradient-to-br', 'from-blue-400', 'via-purple-500', 'to-pink-500');
    darkModeToggle.classList.remove('bg-purple-600');
    darkModeToggle.classList.add('bg-gray-300');
    toggleKnob.classList.remove('translate-x-6');
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function convertHeight(decimeters) {
    const meters = (decimeters / 10).toFixed(2);
    return `${meters} m`;
}

function convertWeight(hectograms) {
    const kilograms = (hectograms / 10).toFixed(2);
    return `${kilograms} kg`;
}

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

function showElement(element) {
    element.classList.remove('hidden');
}

function hideElement(element) {
    element.classList.add('hidden');
}

function loadRecentSearches() {
    const storedSearches = localStorage.getItem(HISTORY_STORAGE_KEY);

    if (!storedSearches) {
        recentSearchHistory = [];
        return;
    }

    try {
        recentSearchHistory = JSON.parse(storedSearches);
    } catch (error) {
        console.error('Unable to parse recent searches:', error);
        recentSearchHistory = [];
    }
}

function saveRecentSearches() {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(recentSearchHistory));
}

function renderRecentSearches() {
    recentSearches.innerHTML = '';

    if (recentSearchHistory.length === 0) {
        recentSearches.appendChild(historyEmptyState);
        showElement(historyEmptyState);
        hideElement(clearHistoryBtn);
        return;
    }

    hideElement(historyEmptyState);
    showElement(clearHistoryBtn);

    recentSearchHistory.forEach((searchTerm) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.textContent = capitalize(searchTerm);
        chip.classList.add(
            'px-3',
            'py-2',
            'rounded-full',
            'bg-purple-100',
            'text-purple-700',
            'text-sm',
            'font-medium',
            'hover:bg-purple-200',
            'transition-colors'
        );
        chip.addEventListener('click', () => {
            pokemonInput.value = searchTerm;
            fetchPokemon(searchTerm);
        });

        recentSearches.appendChild(chip);
    });
}

function updateRecentSearches(searchTerm) {
    const normalizedSearch = searchTerm.toLowerCase();
    recentSearchHistory = recentSearchHistory.filter((item) => item !== normalizedSearch);
    recentSearchHistory.unshift(normalizedSearch);
    recentSearchHistory = recentSearchHistory.slice(0, MAX_RECENT_SEARCHES);
    saveRecentSearches();
    renderRecentSearches();
}

function showLoading() {
    hideElement(pokemonCard);
    hideElement(errorMessage);
    showElement(loadingIndicator);
    searchBtn.disabled = true;
    searchBtn.textContent = 'Searching...';
    randomBtn.disabled = true;
}

function hideLoading() {
    hideElement(loadingIndicator);
    searchBtn.disabled = false;
    searchBtn.textContent = 'Search';
    randomBtn.disabled = false;
}

function showError(message) {
    hideLoading();
    hideElement(pokemonCard);
    errorText.textContent = message;
    showElement(errorMessage);
}

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
    data.types.forEach((typeInfo) => {
        const typeElement = document.createElement('span');
        typeElement.textContent = capitalize(typeInfo.type.name);
        typeElement.classList.add(
            'px-4',
            'py-2',
            'rounded-full',
            'text-white',
            'font-semibold',
            'text-sm',
            getTypeColor(typeInfo.type.name)
        );
        pokemonTypes.appendChild(typeElement);
    });

    showElement(pokemonCard);
}

function getRandomPokemonId() {
    return Math.floor(Math.random() * 1025) + 1;
}

function submitSearch(searchTerm) {
    const input = searchTerm.trim();

    if (input === '') {
        showError('Please enter a Pokemon name or ID!');
        return;
    }

    fetchPokemon(input);
}

async function fetchPokemon(nameOrId) {
    showLoading();

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId.toLowerCase()}`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Pokemon not found! Please check the name or ID and try again.');
            }

            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        displayPokemon(data);
        updateRecentSearches(nameOrId);
    } catch (error) {
        console.error('Error fetching Pokemon:', error);

        if (error.message.includes('Pokemon not found')) {
            showError(error.message);
        } else if (error.message.includes('Failed to fetch')) {
            showError('Network error! Please check your internet connection.');
        } else {
            showError('Something went wrong! Please try again.');
        }
    }
}

darkModeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(isDarkMode));
    applyTheme();
});

searchBtn.addEventListener('click', () => {
    submitSearch(pokemonInput.value);
});

randomBtn.addEventListener('click', () => {
    const randomId = String(getRandomPokemonId());
    pokemonInput.value = randomId;
    fetchPokemon(randomId);
});

clearHistoryBtn.addEventListener('click', () => {
    recentSearchHistory = [];
    saveRecentSearches();
    renderRecentSearches();
});

pokemonInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        submitSearch(pokemonInput.value);
    }
});

window.addEventListener('DOMContentLoaded', () => {
    isDarkMode = JSON.parse(localStorage.getItem(THEME_STORAGE_KEY) || 'false');
    applyTheme();
    loadRecentSearches();
    renderRecentSearches();
    fetchPokemon('pikachu');
});
