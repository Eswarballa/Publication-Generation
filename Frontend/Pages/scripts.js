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

    async function fetchAuthorDetails(url) {
        try {
            showLoader();

            const response = await fetch(`${url}&_=${Date.now()}`);
            const data = await response.json();
            console.log(data);

            // Populate profile fields with API data
            document.querySelector('.profile-intro h1').textContent = data.author.name;
            document.querySelector('.designation').textContent = data.author.affiliations;
            document.querySelector('.profile-links .social-link').textContent = "Google Scholar";
            // Update website link in About Me section
            const aboutSectionLink = document.querySelector('.about-section a');
            aboutSectionLink.href = data.author.website;
            aboutSectionLink.textContent = "Visit My Website";

            // Update interests
            const interestsList = document.querySelector('.interests-list');
            interestsList.innerHTML = '';
            data.author.interests.forEach(interest => {
                const listItem = document.createElement('li');
                listItem.textContent = interest.title;
                interestsList.appendChild(listItem);
            });

            // Update Google Scholar link
            document.querySelector('.profile-links .social-link:nth-child(1)').href = data.search_metadata.google_scholar_author_url;

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

        function convertToLocalUrl(serpApiUrl) {
            if (!serpApiUrl) return null;
            const url = new URL(serpApiUrl);
            return `http://localhost:3001/publications?${url.searchParams.toString()}`;
        }

        // Configure previous button
        if (paginationData.previous) {
            prevButton.disabled = false;
            const prevUrl = convertToLocalUrl(paginationData.previous);
            prevButton.onclick = () => {
                console.log('Fetching previous page:', prevUrl);
                fetchAuthorDetails(prevUrl);
            };
        } else {
            prevButton.disabled = true;
        }

        // Configure next button
        if (paginationData.next) {
            nextButton.disabled = false;
            const nextUrl = convertToLocalUrl(paginationData.next);
            nextButton.onclick = () => {
                console.log('Fetching next page:', nextUrl);
                fetchAuthorDetails(nextUrl);
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
