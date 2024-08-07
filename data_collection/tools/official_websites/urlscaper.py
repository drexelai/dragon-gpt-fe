import requests
from bs4 import BeautifulSoup
import json
from urllib.parse import urljoin

def get_all_urls(base_url):
    try:
        response = requests.get(base_url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        links = soup.find_all('a', href=True)
        urls = [urljoin(base_url, link['href']) for link in links if not link['href'].startswith('tel:')]
        return urls
    except requests.exceptions.RequestException as e:
        print(f"Error accessing {base_url}: {e}")
        return []

def build_url_tree(base_urls_dict):
    url_tree = {}
    for name, base_url in base_urls_dict.items():
        urls = get_all_urls(base_url)
        url_tree[name] = urls
    return url_tree

base_urls_dict = {
    "Main Page": "https://drexel.edu",
    "College of Arts and Sciences": "https://drexel.edu/coas/",
    "College of Computing and Informatics": "https://drexel.edu/cci/",
    "College of Biomedical Engineering": "https://drexel.edu/biomed/",
    "College of Engineering": "https://drexel.edu/engineering/",
    "LeBow College of Business": "https://www.lebow.drexel.edu/",
    "School of Economics": "https://www.lebow.drexel.edu/faculty-research/schools-and-academic-departments/school-economics",
    "School of Education": "https://drexel.edu/soe/",
    "Close School of Entrepreneurship": "https://drexel.edu/close/",
    "Graduate College": "https://drexel.edu/graduatecollege/",
    "Pennoni Honors College": "https://drexel.edu/pennoni/",
    "Kline School of Law": "https://drexel.edu/law/",
    "Westphal College of Media Arts & Design": "https://drexel.edu/westphal/",
    "College of Medicine": "https://drexel.edu/medicine/",
    "College of Nursing and Health Professions": "https://drexel.edu/cnhp/",
    "Goodwin College of Professional Studies": "https://drexel.edu/goodwin/",
    "Dornsife School of Public Health": "https://drexel.edu/dornsife/",
    "Salus University": "https://www.salus.edu/"
}

url_tree = build_url_tree(base_urls_dict)

json_output = json.dumps(url_tree, indent=4)

with open("drexel_urls.json", "w") as outfile:
    outfile.write(json_output)

print("URLs have been written to drexel_urls.json")
