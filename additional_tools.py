import csv
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
        ("Course1: Course1Name", "Description1", "Prereq1"),
        ("Course2: Course2Name", "Description2", "Prereq2"),
        ...
    ]

    courses = [
    (
        "ARTH 101: History of Art I", 
        "This course explores the history of visual culture from a global perspective from ancient times to the advent of the early modern period, ca. 1400. Selected cultures from around the world will be examined in terms of their regional traditions as well as their impactful interactions with other cultures. The historical use, value, and meaning of images, buildings, and artifacts will be analyzed in relation to social, political, economic, religious, intellectual, technological, and aesthetic developments. Attention will also be paid to how various cultural constructs affect the ways we interpret art.", 
        "None"
    ),
    (
        "ARTH 102: History of Art II", 
        "This course explores the history of visual culture from a global perspective during the early modern period, ca. 1400-1850. Selected cultures from across the world will be examined in terms of their regional traditions as well as their impactful interactions with other cultures. The historical use, value, and meaning of visual images, buildings, and artifacts will be analyzed in relation to social, political, economic, religious, intellectual, technological, and aesthetic developments. Attention will also be placed on how various cultural constructs affect the ways we interpret art.", 
        "None"
    ),
    (
        "ARTH 103: History of Art III", 
        "This course explores the history of visual culture from a global perspective from the onset of Modernism, ca. 1850, to the present. Selected cultures from across the world will be examined in terms of their regional traditions as well as their impactful interactions with other cultures. The historical use, value, and meaning of visual images, buildings, and artifacts will be analyzed in relation to social, political, economic, religious, intellectual, technological, and aesthetic developments. Attention will also be placed on how various cultural constructs affect the ways we interpret art.", 
        "None"
    ),
    (
        "ARTH 150: Building Skills in Object Analysis", 
        "This course introduces students to hands-on methods of object study and to research methods that guide the physical, contextual and interpretive analysis of fabricated objects and structures.", 
        "None"
    ),
    (
        "ARTH 200: Principles and Methods of Art History", 
        "This course will critically examine the interpretive principles and methods that have been used in the discourse of art history from the Renaissance to the present day.", 
        "None"
    )
    ]

    """
    header = ["Course Name", "Description", "Prereqs"]

    with open(filename, 'w', newline='') as csvfile:
        csvwriter = csv.writer(csvfile)

        csvwriter.writerow(header)

        for course in courses:
            csvwriter.writerow(course)
