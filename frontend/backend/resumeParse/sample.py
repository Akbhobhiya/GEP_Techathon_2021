# import parser object from tike
from tika import parser  
import unicodedata
import os

def is_pua(c):
    return unicodedata.category(c) == 'Co'

# current working dir
cwd = os.getcwd()

# loop through the 'RESUMES' directory to parse resumes
directory = os.fsencode(os.path.join(cwd,"resumes"))
if not os.path.isdir(os.path.join(cwd,"parsedResumes")):
    os.mkdir(os.path.join(cwd,"parsedResumes"))

for file in os.listdir(directory):
    filename = os.fsdecode(file)
    if filename.endswith(".pdf"):  
        # parse the current file      
        parsed_pdf = parser.from_file(os.path.join(os.fsdecode(directory),filename))
        data = parsed_pdf['content'] 
        
        # remove invalid chars like '\uf0b7' from the text
        data = "".join([char for char in data if not is_pua(char)])
        
        # write parsed text to textfile
        print(os.path.splitext(filename)[0])
        newFile = open(os.path.join(os.path.join(cwd,"parsedResumes"),os.path.splitext(filename)[0] + ".txt"),"w")
        newFile.write(data)
        newFile.close()
    else:
     continue

# # opening pdf file
# parsed_pdf = parser.from_file("./resumes/rahulworld-resume.pdf")

# # saving content of pdf
# # you can also bring text only, by parsed_pdf['text'] 
# # parsed_pdf['content'] returns string 
# data = parsed_pdf['content'] 
  
# # Printing of content 
# print(data)
