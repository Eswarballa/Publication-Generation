document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('searchButton').addEventListener('click', async () => {
        const searchType = document.getElementById('searchType').value;
        const searchInput = document.getElementById('searchInput').value;
        const resultsDiv = document.getElementById('results');
        const paginationDiv = document.getElementById('pagination');

        // Clear previous results and pagination
        resultsDiv.innerHTML = '';
        resultsDiv.classList.add('hidden');
        paginationDiv.innerHTML = '';
        paginationDiv.classList.add('hidden');

        try {
            if (searchType === 'name') {
                // Search by author name
                const response = await fetch(`http://localhost:3000/api/search?author_name=${encodeURIComponent(searchInput)}`);
                if (!response.ok) {
                    const errorResponse = await response.json();
                    console.error(`Error: ${response.status} ${errorResponse.error}`);
                    throw new Error(`Error: ${errorResponse.error}`);
                }

                const data = await response.json();
                displayAuthors(data.profiles);
            } else {
                // Search by unique ID
                const response = await fetch(`http://localhost:3000/publications?author_id=${encodeURIComponent(searchInput)}`);
                if (!response.ok) {
                    const errorResponse = await response.json();
                    console.error(`Error: ${response.status} ${errorResponse.error}`);
                    throw new Error(`Error: ${errorResponse.error}`);
                }

                const data = await response.json();
                displayPublications(data.articles,data.author, 1); // Start with page 1
            }
        } catch (error) {
            console.error(error.message);
            alert(`An error occurred: ${error.message}`);
        }
    });


    
    function displayAuthors(authors) {
        const resultsDiv = document.getElementById('results');
    
        // Clear previous results
        resultsDiv.innerHTML = '';
    
        if (authors && authors.length > 0) {
            const limitedAuthors = authors.slice(0, 5);
            
            limitedAuthors.forEach(author => {
                const authorDiv = document.createElement('div');
                authorDiv.className = 'author';
    
                // Added structure for author display
                authorDiv.innerHTML = `
                    <div class="author-info">
                        <a href="#" class="author-link" data-author-id="${author.author_id}">${author.name}</a>
                        <p class="author-affiliation">${author.affiliations || 'Affiliation not provided'}</p>
                    </div>
                    <hr class="author-separator" />
                `;
    
                resultsDiv.appendChild(authorDiv);
            });
    
            const authorLinks = document.querySelectorAll('.author-link');
            authorLinks.forEach(link => {
                link.addEventListener('click', async (e) => {
                    e.preventDefault();
                    const authorId = e.target.getAttribute('data-author-id');
    
                    try {
                        const response = await fetch(`http://localhost:3000/publications?author_id=${authorId}`);
                        if (!response.ok) {
                            const errorResponse = await response.json();
                            console.error(`Error: ${response.status} ${errorResponse.error}`);
                            alert(`Error fetching publications: ${errorResponse.error}`);
                            return;
                        }
    
                        const data = await response.json();
                        displayPublications(data.articles,data.author, 1);
                    } catch (error) {
                        console.error('Network error:', error);
                        alert('Network error occurred while fetching publications.');
                    }
                });
            });
    
            resultsDiv.classList.remove('hidden');
        } else {
            resultsDiv.innerHTML = 'No authors found.';
            resultsDiv.classList.remove('hidden');
        }
    }
    

function displayPublications(articles, author, page = 1, pageSize = 5) {
    const resultsDiv = document.getElementById('results');
    const paginationDiv = document.getElementById('pagination');

    resultsDiv.innerHTML = '';
    paginationDiv.innerHTML = '';

    const totalArticles = articles.length;
    const totalPages = Math.ceil(totalArticles / pageSize);

    const authorHeader = document.createElement('h3');
    authorHeader.textContent = `${author.name} Publications`;
    resultsDiv.appendChild(authorHeader);

    if (totalArticles > 0) {
        
        const groupedByYear = articles.reduce((acc, article) => {
            const year = article.year || 'Unknown';
            if (!acc[year]) acc[year] = [];
            acc[year].push(article);
            return acc;
        }, {});

        
        const paginatedArticles = Object.entries(groupedByYear)
            .slice((page - 1) * pageSize, page * pageSize);

        for (const [year, articles] of paginatedArticles) {
            const yearDiv = document.createElement('div');
            yearDiv.className = 'year-box';
            yearDiv.innerHTML = `<strong class="year-header">Year: ${year}</strong>`;

            articles.forEach(article => {
                const pubDiv = document.createElement('div');
                pubDiv.className = 'publication';
                pubDiv.innerHTML = `
                    <strong>Publication: <a href="${article.link}" target="_blank">${article.title || 'No Title'}</a></strong><br>
                    <strong>Authors: ${article.authors || 'Unknown Authors'}</strong>
                `;
                yearDiv.appendChild(pubDiv);
            });

            resultsDiv.appendChild(yearDiv);
        }

        // Add pagination links
        for (let i = 1; i <= totalPages; i++){
            const pageLink = document.createElement('span');
            pageLink.className = 'page-link';
            pageLink.innerText = i;

            // Use the correct author object here
            pageLink.addEventListener('click', () => displayPublications(articles, author, i, pageSize));
            paginationDiv.appendChild(pageLink);
        }

        resultsDiv.classList.remove('hidden');
        paginationDiv.classList.remove('hidden');
    } else {
        resultsDiv.innerHTML = 'No publications found.';
        resultsDiv.classList.remove('hidden');
    }
}


});
