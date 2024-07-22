import json
from bs4 import BeautifulSoup
import requests

# Example HTML content as input
url = "https://catalog.drexel.edu/coursedescriptions/quarter/undergrad/cs/"

# Fetch the content from the URL
response = requests.get(url)
html_content = response.content

# Parse the HTML content using BeautifulSoup
soup = BeautifulSoup(html_content, 'html.parser')


# Define a list to hold course information
courses = []

# Function to parse a course section
def parse_course_section(section):
    
    course = {}

    cdspacing_elements = section.find_all('span', class_='cdspacing')
    if len(cdspacing_elements) >= 3:
        course['Identifier'] = cdspacing_elements[0].get_text(strip=True).replace('\u00a0', ' ')
        course['Title'] = cdspacing_elements[1].get_text(strip=True)
        course['Number_of_credits'] = cdspacing_elements[2].get_text(strip=True)

    description = section.find('p', class_='courseblockdesc')
    course['Description'] = description.get_text(strip=True) if description else ''

    for b_tag in section.find_all('b'):
        text = b_tag.get_text(strip=True)
        next_sibling_text = b_tag.next_sibling.strip()
        
        if 'College/Department' in text:
            course['College/Department'] = next_sibling_text
        elif 'Repeat Status' in text:
            course['Repeat Status'] = next_sibling_text
        elif 'Prerequisites' in text:
            course['Prerequisites'] = next_sibling_text
        
    if 'Prerequisites' not in course:
        course['Prerequisites'] = 'Null'

    return course

# Find all sections containing course information
sections = soup.find_all('div', class_='courseblock')

for section in sections:
    course = parse_course_section(section)
    courses.append(course)

# Write the data to a JSON file
with open('courses.json', 'w') as f:
    json.dump(courses, f, indent=4)

print("Course information has been saved to courses.json")