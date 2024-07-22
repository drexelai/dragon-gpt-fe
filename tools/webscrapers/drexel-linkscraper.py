from bs4 import BeautifulSoup
import requests

url = "https://catalog.drexel.edu/coursedescriptions/quarter/undergrad/"

# The text file variable
text_file = open("majors.txt", "w")

def parse_major_links(url):
  # Fetch the content from the URL
  response = requests.get(url)
  html_content = response.content

  # Parse the HTML content using BeautifulSoup
  soup = BeautifulSoup(html_content, 'html.parser')

  columns = ['listCol1', 'listCol2']

  for col in columns:
        # Find the div with the given id
        div = soup.find('div', {'id': col})
        if div:
            # Find all 'a' tags within the div and write their href to the file
            for link in div.find_all('a'):
                href = link.get('href')
                if href:
                    text_file.write(href + '\n')
                    
  return "It's finished."

print(parse_major_links(url))

# Close it
text_file.close()
