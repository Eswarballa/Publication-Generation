# README: Publication Generation Project

## Overview

The **Publication Generation Project** is a JavaScript-based tool that allows users to fetch, parse, and display publication data from authors listed on Google Scholar. It supports two search modes: **by author name** or **unique ID**. The results include paginated publications grouped by year, which can be sorted in ascending or descending order. The project also provides a plugin-friendly JavaScript codebase for seamless integration with other websites, catering to researchers and academicians.

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js

## Features

### Search Options

1. **By Name**: Fetches relevant author names and links them to their unique ID for publication retrieval.
2. **By Unique ID**: Directly retrieves publications for the given author ID.

### API Pagination

Handles large sets of publications by fetching additional results through links provided in the API response.

### Grouping and Sorting

Publications are grouped by year and can be sorted in **ascending** or **descending** order.

### Plugin Support

The JavaScript library is modular, enabling easy integration into external websites for researchers.

## How to Run

1. Clone the project repository to your local machine.
2. Navigate to the server directory and install the required Node.js modules.
3. Start the server by running `node server.js`.
4. Navigate to the frontend directory and run the application.
5. Open the `index.html` file in your browser or host it using a local server.
6. You’re now ready to fetch author publications!

## APIs Used

### Fetch Author Profiles by Name

- **Endpoint**:  
  `https://serpapi.com/search.json?engine=google_scholar_profiles&mauthors=<author_name>`
- **Description**: Retrieves a list of authors matching the search name along with their unique IDs.

### Fetch Publications by Unique ID

- **Endpoint**:  
  `https://serpapi.com/search.json?engine=google_scholar_author&author_id=<author_id>`
- **Description**: Fetches publications for the specified author using their unique ID.

## User Flow

### Search by Name

1. Input an author's name.
2. The application hits the first API to fetch a list of matching author names.
3. Each name is displayed as a clickable link. Clicking a link triggers the second API with the selected author's unique ID, displaying their publications.

### Search by Unique ID

1. Directly input the unique ID of an author.
2. The application skips the name search and directly fetches publications using the second API.

## API Pagination

Google Scholar's API response includes a link for fetching the next set of publications. The application dynamically processes this link to retrieve additional data as needed, ensuring seamless pagination.

## Additional Features

### Year Grouping and Sorting

- Publications are grouped by year.
- Users can sort them in ascending or descending order for easier navigation.

### Plugin Integration

- The JavaScript codebase is modular and easy to integrate.
- External websites can quickly adopt the tool for displaying publication data.

## Future Enhancements

- Adding support for more academic publication APIs.
- Enhanced UI/UX for improved user experience.
- Support for multi-language search queries.

## Author Information

- Eswar Chandra Balla
- Kondru Karan Reddy
- Chandana Pappula
- Shreya Koka
- Ganesh Shukla

