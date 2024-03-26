/**
 * Define a function to fetch random characters.
 * @param {number} numberOfCharactersToFetch - is the number of characters to fetch - default value is 12
 * @param {string} status - is the status of the character - default value is an empty string
 * @return void
 */
const fetchRandomCharacters = (numberOfCharactersToFetch = 12, status = '') => {
    // Perform an initial fetch to determine the number of pages available.
    fetch(`https://rickandmortyapi.com/api/character/?status=${status}`)
        .then(response => response.json())
        .then(data => handleInitialFetchSuccess(data, numberOfCharactersToFetch, status)) // Using the new function to handle the success of the initial fetch
        .catch(error => console.error('Error fetching pages: ', error)); // Handle any errors during the initial fetch.
};

/**
 * Define a function to handle the success of the initial fetch.
 * @param {object} data 
 * @param {number} numberOfCharactersToFetch 
 * @param {string} status 
 * @returns void
 */
const handleInitialFetchSuccess = (data, numberOfCharactersToFetch, status) => {
    const totalPages = data.info.pages; // Get the total number of pages from the response.
    let fetchedCharacters = new Set(); // Initialize a Set to store unique characters.
    let fetchedCharacterIds = new Set(); // Initialize a Set to store unique character IDs.
    let fetchesDone = 0; // Track the number of successful fetches.

    // Define a success callback function for handling fetched characters.
    const onSuccess = (character) => {
        if (!fetchedCharacterIds.has(character.id)) { // Check if the character's ID is not already fetched.
            fetchedCharacters.add(character); // Add the character to the Set of characters.
            fetchedCharacterIds.add(character.id); // Also add the character's ID to the Set of IDs.
            fetchesDone++; // Increment the counter.
            if (fetchesDone < numberOfCharactersToFetch) { // If the desired number of characters is not yet fetched.
                fetchCharacter(Math.floor(Math.random() * totalPages) + 1, status, onSuccess, onError); // fetch another character.
            } else { // If all characters are fetched.
                displayCharacters(Array.from(fetchedCharacters)); // display the characters.
            }
        } else { // If the character is already fetched.
            fetchCharacter(Math.floor(Math.random() * totalPages) + 1, status, onSuccess, onError); // try to fetch a different character.
        }
    };

    // Define an error callback function.
    const onError = (error) => {
        console.error('Error fetching character: ', error); // Log the error.
    };

    // Start fetching characters.
    fetchCharacter(Math.floor(Math.random() * totalPages) + 1, status, onSuccess, onError);
}

/**
 * Define a function to fetch a single character based on page number and status.
 * @param {number} page - is a random number between 1 and the total number of pages
 * @param {string} status - is the status of the character
 * @param {function} onSuccess - is a callback function to handle the successful response
 * @param {function} onError - is a callback function to handle errors
 * @return void
 */
const fetchCharacter = (page, status, onSuccess, onError) => {
    // Perform an HTTP GET request to the Rick and Morty API to get characters by status and page.
    fetch(`https://rickandmortyapi.com/api/character/?status=${status}&page=${page}`)
        .then(response => response.json()) // Convert the response to JSON.
        .then(data => {
            const characters = data.results; // Extract characters from the response.
            const randomIndex = Math.floor(Math.random() * characters.length); // Generate a random index.
            const character = characters[randomIndex]; // Select a random character.
            onSuccess(character); // Call the onSuccess callback with the selected character.
        })
        .catch(error => onError(error)); // If an error occurs, call the onError callback.
}

/**
 * Define a function to display characters on the page.
 * @param {object} characters  - is an array of character objects
 * @returns void
 */
const displayCharacters = (characters) => {
    const charactersContainer = document.getElementById('characters'); // Get the container element.
    charactersContainer.innerHTML = ''; // Clear the container.

    characters.forEach(character => {
        constructCharacterCard(character, charactersContainer); // Create and add character cards to the container.
    });
}

/**
 * Define a function to construct a character card and add it to the page.
 * @param {object} character - is a character object
 * @param {object} charactersContainer - is the container element for characters
 * @returns void
 */
function constructCharacterCard(character, charactersContainer) {
    // Create the main container element.
    const element = document.createElement('div');
    element.className = "group relative bg-blue-deep p-4 rounded-3xl border-8 border-yellow-morty flex flex-col items-center justify-center space-y-4 cursor-pointer";

    // Create the title element.
    const nameElement = document.createElement('h2');
    nameElement.className = "text-xl group-hover:scale-110 font-semibold text-slate-900 font-patrick tracking-widest transition-transform duration-300 ease-in-out";
    nameElement.textContent = character.name;

    // Create the image element.
    const imageElement = document.createElement('img');
    imageElement.src = character.image;
    imageElement.alt = character.name;
    imageElement.className = "size-32 rounded-full my-2 group-hover:scale-110 transition-transform duration-300 ease-in-out group-hover:shadow-2xl group-hover:shadow-green-rick";

    // Create a container for species, gender, and status.
    const infoContainer = document.createElement('div');
    infoContainer.className = "text-slate-300 w-full flex justify-between items-center";

    // Create the container for species.
    const speciesElement = document.createElement('div');
    speciesElement.innerHTML = `<span class="font-semibold text-base text-slate-100">${character.gender} ${character.species}</span>`;

    // Create the container for status with visuals indicating alive, dead, or unknown status.
    const statusElement = document.createElement('div');
    statusElement.className = "bg-slate-900 pt-5 pl-5 pb-2 pr-2 absolute -bottom-2 -right-2 rounded-tl-full border-l-8 border-t-8 border-yellow-morty";
    switch (character.status) {
        case 'Alive':
            statusElement.innerHTML = `<svg class="text-green-rick group-hover:scale-110 transition-transform duration-300 ease-in-out" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 36 36"><path fill="currentColor" d="M18 2a16 16 0 1 0 16 16A16 16 0 0 0 18 2M8.89 13.89a2 2 0 1 1 2 2a2 2 0 0 1-2-2m9.24 14.32a8.67 8.67 0 0 1-8.26-6h16.51a8.67 8.67 0 0 1-8.25 6m6.93-12.32a2 2 0 1 1 2-2a2 2 0 0 1-2.01 2Z" class="clr-i-solid clr-i-solid-path-1"/><path fill="none" d="M0 0h36v36H0z"/></svg>`;
            break;
        case 'Dead':
            statusElement.innerHTML = `<svg class="text-rose-summer group-hover:scale-110 transition-transform duration-300 ease-in-out" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><path fill="currentColor" d="M256 19.313c-44.404 0-85.098 25.433-115.248 68.123C110.6 130.126 91.594 189.846 91.594 256c0 66.152 19.005 125.87 49.156 168.563c30.15 42.69 70.845 68.125 115.25 68.125c44.402 0 85.07-25.435 115.22-68.125c30.15-42.69 49.186-102.41 49.186-168.563c0-66.152-19.037-125.87-49.19-168.564c-30.15-42.69-70.812-68.124-115.214-68.124zM204.23 213.88l14.99 9.966l-20.074 30.19l30.192 20.073l-9.965 14.99l-30.19-20.073l-20.074 30.192l-14.99-9.966l20.07-30.192L144 238.99l9.965-14.99l30.19 20.072l20.074-30.19zm103.54 0l20.074 30.192L358.034 224L368 238.99l-30.19 20.072l20.07 30.192l-14.99 9.965l-20.072-30.193l-30.19 20.073l-9.966-14.99l30.192-20.073l-20.073-30.19l14.99-9.966zM256 367c26 0 52.242 8.515 70.363 26.637l-12.726 12.726c-3.28-3.28-7.006-6.198-11.067-8.75c-.06 1.55-.142 3.128-.27 4.737c-.46 5.693-1.33 11.654-3.568 17.257c-2.236 5.603-6.655 11.875-14.228 13.487c-8.496 1.807-15.982-2.58-21.13-7.59c-5.146-5.01-9.12-11.24-12.495-17.422c-4.78-8.754-8.213-17.494-9.83-21.902c-16.58 2.595-31.98 9.477-42.687 20.183l-12.726-12.726C203.757 375.515 230 367 256 367m3.945 18.084c1.67 4.095 3.972 9.312 6.735 14.373c2.885 5.286 6.303 10.28 9.25 13.147c2.8 2.724 4.114 2.98 4.728 2.896c.056-.07.543-.523 1.358-2.564c1.098-2.752 1.965-7.354 2.34-12.032c.333-4.114.343-8.192.257-11.523c-7.827-2.495-16.192-3.952-24.668-4.296z"/></svg>`;
            break;
        case 'unknown':
            statusElement.innerHTML = `<svg class="text-yellow-morty group-hover:scale-110 transition-transform duration-300 ease-in-out" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M11.07 12.85c.77-1.39 2.25-2.21 3.11-3.44c.91-1.29.4-3.7-2.18-3.7c-1.69 0-2.52 1.28-2.87 2.34L6.54 6.96C7.25 4.83 9.18 3 11.99 3c2.35 0 3.96 1.07 4.78 2.41c.7 1.15 1.11 3.3.03 4.9c-1.2 1.77-2.35 2.31-2.97 3.45c-.25.46-.35.76-.35 2.24h-2.89c-.01-.78-.13-2.05.48-3.15M14 20c0 1.1-.9 2-2 2s-2-.9-2-2s.9-2 2-2s2 .9 2 2"/></svg>`;
            break;
    }

    // Add species and status information to the info container.
    infoContainer.appendChild(speciesElement);
    infoContainer.appendChild(statusElement);

    // Assemble the card by adding all elements to the main container.
    element.appendChild(nameElement);
    element.appendChild(imageElement);
    element.appendChild(infoContainer);

    // Attach an event to display character details in a modal on click.
    constructCharacterModal(character, element);

    // Add the character card to the main characters container on the page.
    charactersContainer.appendChild(element);
}

/**
 * Define a function to construct the character detail modal.
 * @param {object} character - is a character object
 * @param {object} charactersContainer - is the container element for characters
 * @returns void
 */
function constructCharacterModal(character, charactersContainer) {
    charactersContainer.addEventListener('click', () => {
        // Populate the modal with character details.
        const characterName = document.getElementById('modalCharacterName');
        const characterOrigineName = document.getElementById('modalCharacterOrigin');
        const characterLocationName = document.getElementById('modalCharacterLocation');
        const characterImage = document.getElementById('modalCharacterImage');

        characterName.className = 'text-2xl font-semibold text-slate-900 font-patrick tracking-widest';

        characterImage.src = character.image;
        characterImage.alt = character.name;
        characterName.textContent = character.name;
        characterOrigineName.textContent = character.origin.name;
        characterLocationName.textContent = character.location.name;

        // Clear and populate the episode list.
        const episodesList = document.getElementById('modalCharacterEpisodes');
        episodesList.innerHTML = '';
        character.episode.forEach(episodeUrl => {
            fetchEpisode(episodeUrl, episodesList);
        });

        // Display the modal.
        openModal();
    });
}

/**
 * Define a function to fetch and display episode names in the modal.
 * @param {string} episodeUrl - is the URL of the episode
 * @param {object} episodesList - is the list element to display the episodes
 * @returns void
 */
function fetchEpisode(episodeUrl, episodesList) {
    fetch(episodeUrl)
        .then(response => response.json())
        .then(episodeData => {
            const episodeLi = document.createElement('li');
            episodeLi.className = "text-slate-300 bg-slate-800 py-2 px-3 rounded-full text-xs";
            episodeLi.innerHTML = `<span class="font-bold">${episodeData.episode}</span> ${episodeData.name}`;
            episodesList.appendChild(episodeLi);
        })
        .catch(error => console.error('Erreur lors de la récupération du nom de l\'épisode :', error));
}

/**
 * Define a function to open the modal window.
 * @returns void
 */
function openModal() {
    document.getElementById('characterModal').classList.add('flex');
    document.getElementById('characterModal').classList.remove('hidden');
}

/**
 * Define a function to close the modal window.
 * @returns void
 */
function closeModal() {
    document.getElementById('characterModal').classList.remove('flex');
    document.getElementById('characterModal').classList.add('hidden');
}

/**
 * Fetch random characters when the page loads.
 */
fetchRandomCharacters();
