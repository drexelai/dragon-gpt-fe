## Overview

DragonGPT is an intelligent assistant designed to answer questions related to Drexel University. It provides detailed information about courses, course navigation, admission procedures, and various programs offered by the university. This tool aims to assist students, faculty, and prospective applicants by providing accurate and comprehensive information in a convenient manner.

## Sources:

It is essential for DragonGPT to utilize the latest and most accurate sources when answering a question or giving a recommendation. The following Official sources from Drexel Administration are used:

- Official Drexel College Websites (drexel.edu)
- Drexel Course Catalog (https://catalog.drexel.edu/)
- Dragonlink (dragonlink.drexel.edu/organizations)

And it does **search the web** for any information that is not available in the sources above.

Dev:

1. Webscrape more official Drexel data:
   - [ ] remaining course catalog (Colleges Info, Majors, Minors, Undergraduate Programs & plan of studies, Graduate Programs, and additional programs) https://catalog.drexel.edu/colleges/
         **Daniel & Kyler**
   - [x] Drexel Official Website [www.drexel.edu)](https://drexel.edu/) and all its sub pages, and the official websites for each college and their subpages. Obtain all the links via selenium/bs4 and try them all out in [webloader](https://python.langchain.com/v0.2/docs/integrations/document_loaders/web_base/). If it's too slow, have mechanism for deciding which link to use. **Raja and Alex**
   - [ ] Drexel TMS Course Offerings [TMS Scraper](https://github.com/Zohair-coder/drexel-scraper)
2. Develop Fullstack app with frontend

3. Use Webscraped dataset to develop benchmarking Drexel Q/A dataset to use to compare between different LLMs and ChatGPT, Perplexity, Gemini & Google Search. We want to quantify how much % better our app and model are compared to others. Use UNIV101 topics as a basis
