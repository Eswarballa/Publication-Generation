document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    //console.log(urlParams);
    const authorId = urlParams.get('author_id');
    let currentPageUrl = `http://localhost:3001/publications?author_id=${encodeURIComponent(authorId)}`;

    const loader = document.getElementById('loader');
    const contentSections = document.querySelectorAll('.profile-content, .pagination');
    const yearDropdown = document.getElementById('year-dropdown');
    const groupDropdown = document.getElementById('group-options');
    const publicationsContainer = document.getElementById('reposync-container');
    let allPublications = [];
    if (authorId) {
        //console.log(currentPageUrl);
        fetchAuthorDetails(currentPageUrl);
    }


    async function fetchAuthorDetails(url) {
        try {
            showLoader();
    
            const response = await fetch(`${url}&_=${Date.now()}`);
            const data = await response.json();
            console.log(data);
            
            allPublications = data.articles || [];
            populateYearsDropdown(allPublications);

            // Populate profile fields with API data
            document.querySelector('.profile-intro h1').textContent = data.author.name;
            document.querySelector('.designation').textContent = data.author.affiliations;
    
            // Update Google Scholar link and add API and Website buttons
            const profileLinks = document.querySelector('.profile-links');
            profileLinks.innerHTML = `
                <a href="${data.search_metadata.google_scholar_author_url}" class="social-link" target="_blank">Google Scholar</a>
                <a href="${data.author.website}" class="social-link" target="_blank">Visit My Website</a>
            `;
    
            // Remove existing citation table to prevent duplication
            const existingCitationTable = document.querySelector('.citation-table');
            if (existingCitationTable) {
                existingCitationTable.remove();
            }
    
            // Add citation details in a table to the About Me section
            const aboutSection = document.querySelector('.about-section');
            const citationTable = document.createElement('table');
            citationTable.classList.add('citation-table');
            if (data.cited_by && data.cited_by.table) {
                const citationData = data.cited_by.table;
                citationTable.innerHTML = `
                    <thead>
                        <tr>
                            <th></th>
                            <th>All</th>
                            <th>Since 2019</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Citations</td>
                            <td>${citationData[0].citations.all}</td>
                            <td>${citationData[0].citations.since_2019}</td>
                        </tr>
                        <tr>
                            <td>H-Index</td>
                            <td>${citationData[1].h_index.all}</td>
                            <td>${citationData[1].h_index.since_2019}</td>
                        </tr>
                        <tr>
                            <td>I10-Index</td>
                            <td>${citationData[2].i10_index.all}</td>
                            <td>${citationData[2].i10_index.since_2019}</td>
                        </tr>
                    </tbody>
                `;
            } else {
                citationTable.innerHTML = `<p>No citation data available.</p>`;
            }
    
            aboutSection.appendChild(citationTable);
    
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
                    <p><strong>Cited by:</strong> ${article.cited_by.value}</p>
                    <a href="${article.link}" target="_blank">Read More</a>
                `;
                publicationsContainer.appendChild(articleItem);
            });
    
            // Handle pagination
            setupPagination(data.serpapi_pagination);
            //grouping
            populatePublications(allPublications);
    
        } catch (error) {
            console.error("Error fetching author details:", error);
        } finally {
            hideLoader();
        }
    }
    
    function populateYearsDropdown(publications) {
        const years = Array.from(new Set(
            publications
                .map(pub => pub.year)
                .filter(year => year !== 'Unknown Year') // Exclude 'Unknown Year'
        ));
        years.sort((a, b) => (b === 'Unknown Year' ? 1 : b - a)); // Sort in descending order

        yearDropdown.innerHTML = '<option value="all">All Years</option>'; // Add "All Years" option
        years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearDropdown.appendChild(option);
        });
    }

    function populatePublications(publications) {
        publicationsContainer.innerHTML = '';

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
                <p><strong>Cited by:</strong> ${article.cited_by.value || 0} </p>
                <a href="${article.link}" target="_blank">Read More</a>
            `;
            publicationsContainer.appendChild(articleItem);
        });
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
    const yearDropdown = document.getElementById('year-dropdown');
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
        publicationsContainer.innerHTML = ''; 

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
                <p><strong>Cited by:</strong> ${article.cited_by.value || 0} </p>
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
                    <p><strong>Cited by:</strong> ${article.cited_by.value || 0} </p>
                    <a href="${article.link}" target="_blank">Read More</a>
                `;
                yearContainer.appendChild(articleItem);
            });
            publicationsContainer.appendChild(yearContainer);
        });
    }
    yearDropdown.addEventListener('change', () => {
        const selectedYear = yearDropdown.value;
        const filteredPublications = selectedYear === 'all'
            ? allPublications
            : allPublications.filter(pub => pub.year === selectedYear);
        
        populatePublications(filteredPublications);
    });
    
    // Handle group by year dropdown change
    groupDropdown.addEventListener('change', () => {
        const selectedGroupOption = groupDropdown.value;
        if (selectedGroupOption === 'asc' || selectedGroupOption === 'desc') {
            groupPublicationsByYear(allPublications, selectedGroupOption);
        } else {
            populatePublications(allPublications);
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
                       // alert(`Error: ${errorResponse.error}`);
                       reposyncContainer.innerHTML = '<p><strong>No Authors found.</strong></p>';
                        return;
                    }

                    const data = await response.json();
                    displayAuthors(data.profiles);

                } else if (searchType === 'id') {
                    // Redirect to researcher page with author ID
                    
                    window.location.href = `../Researchers-page/index.html?author_id=${encodeURIComponent(searchTerm)}`;
                }

            } catch (error) {
                console.error(error.message);
                alert(`An error occurred: ${error.message}`);
            }
        });
    }
    
   
    function displayAuthors(authors) {
        // Display the loader before processing the authors
        reposyncContainer.innerHTML = `
            <div class="spinner-container">
                <div class="spinner"></div>
            </div>
        `;
    
        setTimeout(() => {
            if (authors && authors.length > 0) {
                reposyncContainer.innerHTML = ''; // Clear previous results and loader
    
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
        }, 500); 
    }
    
   
});
