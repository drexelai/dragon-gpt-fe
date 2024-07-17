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
        ("Course1", "Description1", "Prereq1"),
        ("Course2", "Description2", "Prereq2"),
        ...
    ]
    """
    header = ["Course Name", "Description", "Prereqs"]
    
    with open(filename, 'w', newline='') as csvfile:
        csvwriter = csv.writer(csvfile)
        
        csvwriter.writerow(header)
        
        for course in courses:
            csvwriter.writerow(course)
