document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const authorId = urlParams.get('author_id');
    let currentPageUrl = `http://localhost:3001/publications?author_id=${encodeURIComponent(authorId)}`;

    const loader = document.getElementById('loader');
    const contentSections = document.querySelectorAll('.profile-content, .pagination');

    if (authorId) {
        console.log(currentPageUrl);
        fetchAuthorDetails(currentPageUrl);
    }

    // async function fetchAuthorDetails(url) {
    //     try {
    //         showLoader();

    //         const response = await fetch(`${url}&_=${Date.now()}`);
    //         const data = await response.json();
    //         console.log(data);

    //         // Populate profile fields with API data
    //         document.querySelector('.profile-intro h1').textContent = data.author.name;
    //         document.querySelector('.designation').textContent = data.author.affiliations;
           
           
    //         // Update interests
    //         const interestsList = document.querySelector('.interests-list');
    //         interestsList.innerHTML = '';
    //         data.author.interests.forEach(interest => {
    //             const listItem = document.createElement('li');
    //             listItem.textContent = interest.title;
    //             interestsList.appendChild(listItem);
    //         });

    //         // Update Google Scholar link
    //         document.querySelector('.profile-links .social-link:nth-child(1)').href = data.search_metadata.google_scholar_author_url;
    //         document.querySelector('.profile-links .social-link:nth-child(1)').href = data.author.website;

            

    //         // Handle pagination
    //         setupPagination(data.serpapi_pagination);

    //     } catch (error) {
    //         console.error("Error fetching author details:", error);
    //     } finally {
    //         hideLoader();
    //     }
    // }

    async function fetchAuthorDetails(url) {
        try {
            showLoader();
    
            const response = await fetch(`${url}&_=${Date.now()}`);
            const data = await response.json();
            console.log(data);
    
            // Populate profile fields with API data
            document.querySelector('.profile-intro h1').textContent = data.author.name;
            document.querySelector('.designation').textContent = data.author.affiliations;
    
            // Update Google Scholar link and add API and Website buttons
            const profileLinks = document.querySelector('.profile-links');
            profileLinks.innerHTML = `
                <a href="${data.search_metadata.google_scholar_author_url}" class="social-link" target="_blank">Google Scholar</a>
                <a href="${data.author.website}" class="social-link" target="_blank">Visit My Website</a>
            `;
    
            // Add citation details to the About Me section
            const aboutSection = document.querySelector('.about-section');
            const citationDetails = document.createElement('div');
            citationDetails.classList.add('citation-details');
    
            if (data.cited_by && data.cited_by.table) {
                const citationData = data.cited_by.table;
                citationDetails.innerHTML = `
                    <div class="citation-row">
                        <div>
                            <p><strong>Total Citations:</strong> ${citationData[0].citations.all}</p>
                            <p><strong>H-Index (All):</strong> ${citationData[1].h_index.all}</p>
                            <p><strong>I10-Index (All):</strong> ${citationData[2].i10_index.all}</p>
                        </div>
                        <div>
                            <p><strong>Citations Since 2019:</strong> ${citationData[0].citations.since_2019}</p>
                            <p><strong>H-Index (Since 2019):</strong> ${citationData[1].h_index.since_2019}</p>
                            <p><strong>I10-Index (Since 2019):</strong> ${citationData[2].i10_index.since_2019}</p>
                        </div>
                    </div>
                `;
            } else {
                citationDetails.innerHTML = `<p>No citation data available.</p>`;
            }
    
            aboutSection.appendChild(citationDetails);
    
            // Update interests
            const interestsList = document.querySelector('.interests-list');
            interestsList.innerHTML = '';
            data.author.interests.forEach(interest => {
                const listItem = document.createElement('li');
                listItem.textContent = interest.title;
                interestsList.appendChild(listItem);
            });
    
            // Populate publications
            const publicationsContainer = document.getElementById('reposync-container');
            publicationsContainer.innerHTML = '';
            data.articles.forEach(article => {
                const articleItem = document.createElement('div');
                articleItem.classList.add('publication');
                articleItem.innerHTML = `
                    <h3>${article.title}</h3>
                    <p><strong>Authors:</strong> ${article.authors}</p>
                    <p><strong>Published in:</strong> ${article.publication}</p>
                    <p><strong>Cited by:</strong> ${article.cited_by.value} times</p>
                    <a href="${article.link}" target="_blank">Read More</a>
                `;
                publicationsContainer.appendChild(articleItem);
            });
    
            // Handle pagination
            setupPagination(data.serpapi_pagination);
    
        } catch (error) {
            console.error("Error fetching author details:", error);
        } finally {
            hideLoader();
        }
    }


    

    function setupPagination(paginationData) {
        const prevButton = document.getElementById('prev-page');
        const nextButton = document.getElementById('next-page');
    
        // Disable buttons by default if no pagination data is available
        if (!paginationData) {
            prevButton.disabled = true;
            nextButton.disabled = true;
            return;
        }
    
        // Configure previous button
        if (paginationData.previous) {
            prevButton.disabled = false;
            prevButton.onclick = () => {
                fetchAuthorDetails(`http://localhost:3001/publications?next_url=${encodeURIComponent(paginationData.previous)}`);
            };
        } else {
            prevButton.disabled = true;
        }
    
        // Configure next button
        if (paginationData.next) {
            nextButton.disabled = false;
            nextButton.onclick = () => {
                fetchAuthorDetails(`http://localhost:3001/publications?next_url=${encodeURIComponent(paginationData.next)}`);
            };
        } else {
            nextButton.disabled = true;
        }
    }
    
    function showLoader() {
        loader.style.display = 'block';
        contentSections.forEach(section => section.style.display = 'none');
    }

    function hideLoader() {
        loader.style.display = 'none';
        contentSections.forEach(section => section.style.display = 'block');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const groupDropdown = document.getElementById('group-options');
    const publicationsContainer = document.getElementById('reposync-container');
    let allPublications = []; // Store all publications for grouping and sorting

    async function fetchAuthorDetails(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();

            // Store publications
            allPublications = data.articles || [];

            // Populate publications by default
            populatePublications(allPublications);
        } catch (error) {
            console.error('Error fetching author details:', error);
            publicationsContainer.innerHTML = '<p>Error loading publications.</p>';
        }
    }

    function populatePublications(publications) {
        publicationsContainer.innerHTML = ''; // Clear the container

        if (publications.length === 0) {
            publicationsContainer.innerHTML = '<p>No publications available.</p>';
            return;
        }

        publications.forEach(article => {
            const articleItem = document.createElement('div');
            articleItem.classList.add('publication');
            articleItem.innerHTML = `
                <h4>${article.title}</h4>
                <p><strong>Authors:</strong> ${article.authors}</p>
                <p><strong>Published in:</strong> ${article.publication}</p>
                <p><strong>Cited by:</strong> ${article.cited_by.value || 0} times</p>
                <a href="${article.link}" target="_blank">Read More</a>
            `;
            publicationsContainer.appendChild(articleItem);
        });
    }

    function groupPublicationsByYear(publications, order) {
        const grouped = publications.reduce((acc, article) => {
            const year = article.year || 'Unknown Year';
            if (!acc[year]) acc[year] = [];
            acc[year].push(article);
            return acc;
        }, {});

        // Sort the groups by year
        const sortedYears = Object.keys(grouped).sort((a, b) => {
            if (order === 'asc') return parseInt(a) - parseInt(b);
            if (order === 'desc') return parseInt(b) - parseInt(a);
            return 0; // Default order
        });

        // Render grouped publications
        publicationsContainer.innerHTML = '';
        sortedYears.forEach(year => {
            const yearContainer = document.createElement('div');
            yearContainer.classList.add('year-group');
            yearContainer.innerHTML = `<h3>${year}</h3>`;
            grouped[year].forEach(article => {
                const articleItem = document.createElement('div');
                articleItem.classList.add('publication');
                articleItem.innerHTML = `
                    <h4>${article.title}</h4>
                    <p><strong>Authors:</strong> ${article.authors}</p>
                    <p><strong>Published in:</strong> ${article.publication}</p>
                    <p><strong>Cited by:</strong> ${article.cited_by.value || 0} times</p>
                    <a href="${article.link}" target="_blank">Read More</a>
                `;
                yearContainer.appendChild(articleItem);
            });
            publicationsContainer.appendChild(yearContainer);
        });
    }

    // Handle group by year dropdown change
    groupDropdown.addEventListener('change', () => {
        const groupValue = groupDropdown.value;

        if (groupValue === 'asc') {
            groupPublicationsByYear(allPublications, 'asc');
        } else if (groupValue === 'desc') {
            groupPublicationsByYear(allPublications, 'desc');
        } else {
            populatePublications(allPublications); // Default view
        }
    });

    // Fetch initial data
    const authorId = new URLSearchParams(window.location.search).get('author_id');
    if (authorId) {
        fetchAuthorDetails(`http://localhost:3001/publications?author_id=${encodeURIComponent(authorId)}`);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const searchTypeSelect = document.getElementById('facultyFilter');
    const searchInput = document.getElementById('yearFilter');
    const reposyncContainer = document.getElementById('reposync-container');

    // Only add event listener if all elements exist
    if (searchButton && searchTypeSelect && searchInput && reposyncContainer) {
        searchButton.addEventListener('click', async () => {
            const searchType = searchTypeSelect.value;
            const searchTerm = searchInput.value.trim();

            // Clear previous results
            reposyncContainer.innerHTML = '';

            if (searchTerm === '') {
                alert("Please enter a search term.");
                return;
            }

            try {
                if (searchType === 'name') {
                    // Search by author name
                    const response = await fetch(`http://localhost:3001/api/search?author_name=${encodeURIComponent(searchTerm)}`);
                    
                    if (!response.ok) {
                        const errorResponse = await response.json();
                        console.error(`Error: ${response.status} ${errorResponse.error}`);
                        alert(`Error: ${errorResponse.error}`);
                        return;
                    }

                    const data = await response.json();
                    displayAuthors(data.profiles);

                } else if (searchType === 'id') {
                    // Redirect to researcher page with author ID
                    window.location.href = `../researcher-page/index.html?author_id=${encodeURIComponent(searchTerm)}`;
                }

            } catch (error) {
                console.error(error.message);
                alert(`An error occurred: ${error.message}`);
            }
        });
    }

    // Function to display authors in reposyncContainer
    function displayAuthors(authors) {
        if (authors && authors.length > 0) {
            reposyncContainer.innerHTML = ''; // Clear previous results

            authors.forEach(author => {
                const authorDiv = document.createElement('div');
                authorDiv.className = 'author';
                authorDiv.innerHTML = `
                    <p><strong><a href="../Researchers-page/index.html?author_id=${encodeURIComponent(author.author_id)}">${author.name}</a></strong></p>
                    <p>${author.affiliations || ''}</p>
                `;
                reposyncContainer.appendChild(authorDiv);
            });
        } else {
            reposyncContainer.innerHTML = '<p>No authors found.</p>';
        }
    }
});

// document.addEventListener("DOMContentLoaded", function() {
//     // Get references to HTML elements
//     const searchButton = document.getElementById('searchButton');
//     const searchTypeSelect = document.getElementById('facultyFilter');
//     const searchInput = document.getElementById('yearFilter');
//     const reposyncContainer = document.getElementById('reposync-container');

//     searchButton.addEventListener('click', async () => {
//         const searchType = searchTypeSelect.value;
//         const searchTerm = searchInput.value.trim();

//         // Clear previous results
//         reposyncContainer.innerHTML = '';

//         if (searchTerm === '') {
//             alert("Please enter a search term.");
//             return;
//         }

//         try {
//             if (searchType === 'name') {
//                 // Search by author name
//                 const response = await fetch(`http://localhost:3001/api/search?author_name=${encodeURIComponent(searchTerm)}`);
                
//                 if (!response.ok) {
//                     const errorResponse = await response.json();
//                     console.error(`Error: ${response.status} ${errorResponse.error}`);
//                     alert(`Error: ${errorResponse.error}`);
//                     return;
//                 }

//                 const data = await response.json();
//                 displayAuthors(data.profiles);

//             } else if (searchType === 'id') {
//                 // Redirect to researcher page with author ID
//                 window.location.href = `../Researchers-page/index.html?author_id=${encodeURIComponent(searchTerm)}`;
//             }

//         } catch (error) {
//             console.error(error.message);
//             alert(`An error occurred: ${error.message}`);
//         }
//     });

//     // Function to display authors in reposyncContainer
//     function displayAuthors(authors) {
//         if (authors && authors.length > 0) {
//             reposyncContainer.innerHTML = ''; // Clear previous results

//             authors.forEach(author => {
//                 const authorDiv = document.createElement('div');
//                 authorDiv.className = 'author';
//                 authorDiv.innerHTML = `
//                     <p><strong><a href="../Researchers-page/index.html?author_id=${encodeURIComponent(author.author_id)}"><p id="affiliations">${author.name}</p></a></strong>${author.affiliations}</p>
//                 `;
//                 reposyncContainer.appendChild(authorDiv);
//             });
//         } else {
//             reposyncContainer.innerHTML = '<p>No authors found.</p>';
//         }
//     }
// });

// document.addEventListener('DOMContentLoaded', () => {
//     const sortDropdown = document.getElementById('sort-options');
//     const publicationsContainer = document.getElementById('reposync-container');
//     let allPublications = []; // Store all publications for sorting and grouping

//     async function fetchAuthorDetails(url) {
//         try {
//             const response = await fetch(url);
//             const data = await response.json();

//             // Store publications
//             allPublications = data.articles || [];

//             // Populate publications by default
//             populatePublications(allPublications);
//         } catch (error) {
//             console.error('Error fetching author details:', error);
//             publicationsContainer.innerHTML = '<p>Error loading publications.</p>';
//         }
//     }

//     function populatePublications(publications) {
//         publicationsContainer.innerHTML = ''; // Clear the container

//         if (publications.length === 0) {
//             publicationsContainer.innerHTML = '<p>No publications available.</p>';
//             return;
//         }

//         publications.forEach(article => {
//             const articleItem = document.createElement('div');
//             articleItem.classList.add('publication');
//             articleItem.innerHTML = `
//                 <h4>${article.title}</h4>
//                 <p><strong>Authors:</strong> ${article.authors}</p>
//                 <p><strong>Published in:</strong> ${article.publication}</p>
//                 <p><strong>Cited by:</strong> ${article.cited_by.value || 0} times</p>
//                 <a href="${article.link}" target="_blank">Read More</a>
//             `;
//             publicationsContainer.appendChild(articleItem);
//         });
//     }

//     function groupPublicationsByYear(publications) {
//         const grouped = publications.reduce((acc, article) => {
//             const year = article.year || 'Unknown Year';
//             if (!acc[year]) acc[year] = [];
//             acc[year].push(article);
//             return acc;
//         }, {});

//         // Render grouped publications
//         publicationsContainer.innerHTML = '';
//         Object.keys(grouped)
//             .sort((a, b) => parseInt(b) - parseInt(a)) // Sort years in descending order
//             .forEach(year => {
//                 const yearContainer = document.createElement('div');
//                 yearContainer.classList.add('year-group');
//                 yearContainer.innerHTML = `<h3>${year}</h3>`;
//                 grouped[year].forEach(article => {
//                     const articleItem = document.createElement('div');
//                     articleItem.classList.add('publication');
//                     articleItem.innerHTML = `
//                         <h4>${article.title}</h4>
//                         <p><strong>Authors:</strong> ${article.authors}</p>
//                         <p><strong>Published in:</strong> ${article.publication}</p>
//                         <p><strong>Cited by:</strong> ${article.cited_by.value || 0} times</p>
//                         <a href="${article.link}" target="_blank">Read More</a>
//                     `;
//                     yearContainer.appendChild(articleItem);
//                 });
//                 publicationsContainer.appendChild(yearContainer);
//             });
//     }

//     // Sort publications based on selected option
//     sortDropdown.addEventListener('change', () => {
//         const sortValue = sortDropdown.value;

//         if (sortValue === 'asc') {
//             const sorted = [...allPublications].sort((a, b) => parseInt(a.year || '0') - parseInt(b.year || '0'));
//             populatePublications(sorted);
//         } else if (sortValue === 'desc') {
//             const sorted = [...allPublications].sort((a, b) => parseInt(b.year || '0') - parseInt(a.year || '0'));
//             populatePublications(sorted);
//         } else if (sortValue === 'group') {
//             groupPublicationsByYear(allPublications);
//         } else {
//             populatePublications(allPublications); 
//         }
//     });

//     // Fetch initial data
//     const authorId = new URLSearchParams(window.location.search).get('author_id');
//     if (authorId) {
//         fetchAuthorDetails(`http://localhost:3001/publications?author_id=${encodeURIComponent(authorId)}`);
//     }
// });


