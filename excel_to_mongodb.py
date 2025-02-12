import openpyxl
import pymongo
import json
import sys

# Use: py excel_to_mongodb.py DB_CONN_STR EXCEL_FILE_PATH SEMESTER

# MongoDB Connection
client = pymongo.MongoClient(sys.argv[1])
db = client["university"]  # Database name
collection = db["students"]  # Collection name

# Load the Excel file
file_path = sys.argv[2]
wb = openpyxl.load_workbook(file_path)
ws = wb.active

# Extract semester information
semester = sys.argv[3] or '2024-2'  # Change accordingly

# Extract headers (Subject names spanning two rows)
subjects = []
columns_row1 = [cell for cell in ws[2]]  # First row (merged subjects)
for i in range(0, len(columns_row1) - 3, 2):  # Skip ID, Student Number, Name columns
    if columns_row1[i]:  # Ensure it's not None
        subjects.append(columns_row1[i])

subject_names = [subject.value for subject in subjects]
print([row.value for row in columns_row1])

# Read student data
students = {}
for row in ws.iter_rows(min_row=3, values_only=True):  # Start from row 3 to skip headers
    student_id = str(row[-1])  # First column: Student ID
    student_number = str(row[-2])  # Second column: Student Number
    student_name = row[-3]  # Third column: Student Name
   
    if student_id is None or student_number is None or student_name is None: # Skip empty or invalid rows
        continue

    # Initialize student entry if not already present
    if student_id not in students:
        students[student_id] = {
            "_id": student_id,
            "student_number": student_number,
            "name": student_name,
            "semesters": []
        }
    
    # Initialize semester data structure
    semester_data = {
        "semester": semester,
        "subjects": {}
    }
    
    # Parse subject grades
    for i, subject in enumerate(subjects):
        grade_index = 0 + i * 2  # Numeric grade column index
        letter_index = grade_index + 1  # Letter grade column index
        semester_data["subjects"][subject.value] = {
            "grade": row[letter_index] if row[letter_index] is not None else "N\A",  # Extract letter grade
            "score": row[grade_index] if row[grade_index] is not None else "N\A"# Extract numeric score
        }
    
    # Append semester data to the student's record
    students[student_id]["semesters"].append(semester_data)

# Insert or update student records in MongoDB
for student in students.values():
    if student["_id"] is not None:
        collection.update_one({"_id": student["_id"]}, {"$set": student}, upsert=True)  # Upsert ensures update or insert
    else: 
        continue

print("Data successfully inserted/updated in MongoDB!")
