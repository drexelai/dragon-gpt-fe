import os
import json

def find_json_files(directory):
    """Recursively find all JSON files in the given directory."""
    json_files = []
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.json'):
                json_files.append(os.path.join(root, file))
    return json_files

def combine_json_files(json_files):
    """Combine the content of multiple JSON files into a single JSON array."""
    combined_data = []
    for file in json_files:
        with open(file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            combined_data.extend(data)
    return combined_data

def save_combined_json(combined_data, output_file):
    """Save the combined JSON data to the output file."""
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(combined_data, f, indent=4)

def main():
    input_directory = 'data/grad_json-1/'  # Replace with your input directory
    output_file = 'grad_combined.json'  # Replace with your desired output file name

    json_files = find_json_files(input_directory)
    combined_data = combine_json_files(json_files)
    save_combined_json(combined_data, output_file)

if __name__ == "__main__":
    main()
