# DragonGPT

## Overview

DragonGPT is an intelligent assistant designed to answer questions related to Drexel University. It provides detailed information about courses, course navigation, admission procedures, and various programs offered by the university. This tool aims to assist students, faculty, and prospective applicants by providing accurate and comprehensive information in a convenient manner.

## Features

- **Course Details:** Get detailed information on undergraduate and graduate courses, including descriptions, prerequisites, and schedules.
- **Course Navigation:** Assistance with navigating through different courses and understanding their requirements.
- **Admission Information:** Guidance on the admission process, application deadlines, and necessary documents.
- **Program Information:** Detailed descriptions of various programs offered by Drexel University.

## Tasks

### Completed Tasks
- **Web Scrape Courses from Grad and Undergrad:** Successfully scraped detailed information on courses offered at both the graduate and undergraduate levels.
- **Proof of Concept (POC) for Retrieval-Augmented Generation (RAG):** Implemented and tested a proof of concept for RAG, enhancing the accuracy and relevance of responses.

### Yet to be Done
- **Include Credits for Each Course:** Add the number of credits for each course to the existing data.
- **Web Scrape Reddit + Drexel Site:** Extract relevant information from Reddit discussions and the official Drexel University website.
- **Restrict LLM Thought to Provided Data:** Ensure that the language model generates responses strictly based on the provided data to maintain accuracy and relevance.

## Getting Started

To use DragonGPT, follow these steps:

1. Clone the repository.
2. Install the necessary dependencies using Poetry.
3. Run the setup script to initialize the application.
4. Start querying DragonGPT for information about Drexel University.

### Prerequisites

Ensure you have the following installed on your system:

- Python 3.8 or higher
- Poetry package manager

### Installation

```bash
git clone https://github.com/yourusername/DragonGPT.git
cd DragonGPT
poetry install
```

### Usage

Run the application using the command:

```bash
poetry run python app.py
```

Once the application is running, you can start querying DragonGPT for information about Drexel University.

## Contributing

We welcome contributions to DragonGPT. If you have suggestions for new features or improvements, please open an issue or submit a pull request.

### How to Contribute

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push them to your branch.
4. Open a pull request with a detailed description of your changes.
>>>>>>> f9a292a (chore: Update README.md with DragonGPT overview, features, and tasks)
