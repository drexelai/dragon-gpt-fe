import csv
import requests
from bs4 import BeautifulSoup
from langchain.tools import tool

@tool("This_tool_creates_a_csv_file_with_course_details")
def write_courses_to_csv(filename, courses):
    """
    Write course details to a CSV file.

    Args:
    filename (str): The name of the CSV file to create.
    courses (list of tuples): Each tuple contains (Course Name, Description, Prereqs).

    Example:
    courses = [
        ("ARTH 101: History of Art I", "Explores the history of visual culture globally from ancient times to early modern period, ca. 1400. Examines regional traditions and impactful interactions with other cultures, analyzing images, buildings, and artifacts in relation to social, political, economic, religious, intellectual, technological, and aesthetic developments. Attention to cultural constructs affecting art interpretation.", "None"),
        ("ARTH 150: Building Skills in Object Analysis", "Introduces students to hands-on methods of object study and research methods for physical, contextual, and interpretive analysis of fabricated objects and structures.", "None")
    ]
    """
    header = ["Course Name", "Description", "Prereqs"]

    with open(filename, 'w', newline='') as csvfile:
        csvwriter = csv.writer(csvfile)

        csvwriter.writerow(header)

        for course in courses:
            csvwriter.writerow(course)