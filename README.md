**Project:** List Publications from Publication Repositories for Research Centres

**Context:** Computer Research Labs and Computer Researchers (especially in Computer Science) face challenges on manually listing their publication information on their personal webpages or research centers. **Sulochana** is a PhD Research Scholar at one of the research labs at IIT Kashmir and is was tasked to update the publication page of their research center on month-on-month basis. This activity needs to be automated so as to avoid manual updates on personal pages of researchers and also on the Research Lab websites.

Sulochana needs your help to build a JavaScript library which can be used on her personal page and research website and list of the publication data ondemand.

**Resources:** 
* DBLP Publication API: https://dblp.org/faq/How+to+use+the+dblp+search+API.html
* Google Scholar API: https://serpapi.com/google-scholar-api
* Google Scholar Playground: https://serpapi.com/playground?engine=google_scholar&q=Coffee&hl=en

**Input:** Read the researcher details and sent it to the respective API

**Output:** Generate a list of publications coming through the API and display them group by year, author, type of publication in a pagingation format

**Chornology of Tasks:**
* Identify list of authors and read the data from the publication APIs in BIB format
* Write a JavaScript library to parse the BIB file and display publication data group by year, author and type of publication in a pagination format
* Any research center should be able to use the JavaScript library to fetch, parse BIB files and display

**Stakeholders:**
* Sulochana: uses the JavaScript library on her personal website and her research center website so that the required publications can be fetched, parsed and displayed.

**Technology Stack:**  HTML, CSS, JS

**Team Size:** 4 

**Point of Contact:** Sai Anirudh Karre (saianirudh.karre@iiit.ac.in)
