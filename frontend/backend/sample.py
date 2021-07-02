from tika import parser  
import unicodedata
import os
import sys
import json
import nltk

# nltk.download('stopwords')

## use OCR to convert PDF/DOCX files to text files
 
# python object that containes the JSON data
reqBody = json.loads(sys.argv[1]) 

# get directory names where resumes are stored - call it 'RESUMES'
resumesDir = reqBody["dirName"]
# resumesDir = "resumes"
# resumesDir = "resumes" # hard-coded now

# path to 'RESUMES' directory
pathResumesDir = os.getcwd()
pathResumesDir = os.path.dirname(pathResumesDir)
pathResumesDir = os.path.join(pathResumesDir,"userData\\" + resumesDir)

pathJobFile = os.path.dirname(pathResumesDir)
pathJobFile = os.path.join(pathJobFile,"JobDescription\\" + reqBody["jobFile"])

tagsList= reqBody["tags"]
tags_string = ""
for tag in tagsList:
        tags_string = tags_string + tag
# pathJobFile = os.path.join(pathJobFile,"JobDescription\\" + "jobFile.txt")

##

## use AI model to shortlist the required resumes

# add data of job-description input to jobFile
# if(reqBody["jobFile"]): 
#     pathJobFile = os.path.dirname(pathResumesDir)
#     jobFile = open(os.path.join(pathJobFile,"\\jobDescription\\" + reqBody["jobFile"]),'w+')        
#     jobFile.append(


#!/usr/bin/env python
# coding: utf-8

# # Automatic AI Resume Screening 

# # preprocessing

# ### lemma tagger






import sys
import nltk
from nltk.corpus import wordnet
def get_wordnet_pos(word):
    """Map POS tag to first character lemmatize() accepts"""
    tag = nltk.pos_tag([word])[0][1][0].upper()
    tag_dict = {"J": wordnet.ADJ,
                "N": wordnet.NOUN,
                "V": wordnet.VERB,
                "R": wordnet.ADV}
    return tag_dict.get(tag, wordnet.NOUN)


# ### file processing



from pathlib import Path
import re
def get_content_as_string(document_path):
    txt = Path(document_path).read_text()
    txt = txt.replace('\n', ' ')
    txt = re.sub('\W+', ' ', txt) #Select only alpha numerics
    txt = re.sub('[^A-Za-z]+', ' ', txt) #select only alphabet characters
    txt = txt.lower()
    return txt


# ### nltk tokenizer

import nltk
def tokenize_document(text_file):
    tokens = nltk.word_tokenize(text_file)
    return tokens

def tag_tokens(tokens):
    tagged_tokens = nltk.pos_tag(tokens)
    return tagged_tokens


# ### tf_idf_lemmetizer



from nltk.stem.wordnet import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.corpus import stopwords as stp

lemmatizer = WordNetLemmatizer()
analyzer = TfidfVectorizer().build_analyzer()
def stemmed_words(doc):
    return (lemmatizer.lemmatize(w,get_wordnet_pos(w)) for w in analyzer(doc) if w not in set(stp.words('english')))


# # Text_processing

# ### cv_cosine_similarity


from sklearn.metrics.pairwise import cosine_similarity
from nltk.stem.wordnet import WordNetLemmatizer
from nltk.corpus import stopwords as stp
from sklearn.feature_extraction.text import CountVectorizer


def get_binay_cosine_similarity(compare_doc,doc_corpus):
    count_vect = CountVectorizer(binary=True,analyzer=stemmed_words)
    cv_req_vector = count_vect.fit_transform([compare_doc]).todense()
    print('Features are:' ,count_vect.get_feature_names())
    cv_resume_vector = count_vect.transform(doc_corpus).todense()
    cosine_similarity_list = []
    for i in range(len(cv_resume_vector)):
        cosine_similarity_list.append(cosine_similarity(cv_req_vector,cv_resume_vector[i])[0][0])
    return cosine_similarity_list


# ### tf_idf_cosine_similarity


from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from nltk.stem.wordnet import WordNetLemmatizer
from nltk.corpus import stopwords as stp

def get_tf_idf_cosine_similarity(compare_doc,doc_corpus):
    tf_idf_vect = TfidfVectorizer(analyzer=stemmed_words)
    tf_idf_req_vector = tf_idf_vect.fit_transform([compare_doc]).todense()
    tf_idf_resume_vector = tf_idf_vect.transform(doc_corpus).todense()
    cosine_similarity_list = []
    for i in range(len(tf_idf_resume_vector)):
        cosine_similarity_list.append(cosine_similarity(tf_idf_req_vector,tf_idf_resume_vector[i])[0][0])
    return cosine_similarity_list


# # Name Extraction from Resume


import spacy
from spacy.matcher import Matcher
nlp = spacy.load('en_core_web_sm')
matcher = Matcher(nlp.vocab)
def extract_name(resume_text):
    nlp_text = nlp(resume_text)
    pattern = [{'POS': 'PROPN'}, {'POS': 'PROPN'}]
    matcher.add('FULL_NAME', [pattern])
    matches = matcher(nlp_text)
    for match_id, start, end in matches:
        span = nlp_text[start:end]
        return span.text
    
    




# nltk.download('maxent_ne_chunker')
# nltk.download('words')


from pathlib import Path
def get_resume_txt(document_path):
    txt = Path(document_path).read_text()
    txt = txt.replace('\n', ' ')
    return txt


# # Email Extraction from Resume



EMAIL_REG = re.compile(r'[a-z0-9\.\-+_]+@[a-z0-9\.\-+_]+\.[a-z]+')
def extract_emails(resume_text):
    return re.findall(EMAIL_REG, resume_text)


# # processing 
# ### resume_matcher


# nltk.download('averaged_perceptron_tagger')
# nltk.download('wordnet')
# nltk.download('punkt')


from tika import parser  
import unicodedata
import os
import sys
import re


def is_pua(c):
    return unicodedata.category(c) == 'Co'



def process_files(req_document,resume_docs,tags_string):
    if req_document.endswith(".pdf") or req_document.endswith(".txt") or req_document.endswith(".docx") or req_document.endswith(".doc"):   
        parsed_pdf = parser.from_file(req_document)
        job_description_txt = parsed_pdf['content']
        if (job_description_txt == None):
            job_description_txt = " "
        job_description_txt = job_description_txt + tags_string 
        job_description_txt = "".join([char for char in job_description_txt if not is_pua(char)])
        job_description_txt = job_description_txt.replace('\n', ' ')
        job_description_txt = re.sub('\W+', ' ', job_description_txt) #Select only alpha numerics
        job_description_txt = re.sub('[^A-Za-z]+', ' ', job_description_txt) #select only alphabet characters
        job_description_txt = job_description_txt.lower()
    
    all_resume_txt = []
    for filename in resume_docs:
        if filename.endswith(".pdf") or filename.endswith(".txt") or filename.endswith(".docx") or filename.endswith(".doc"):
            
            parsed_pdf = parser.from_file(filename)           
            data = parsed_pdf['content'] 
            if (data == None):
                data = " "
            data = "".join([char for char in data if not is_pua(char)])
            data = data.replace('\n', ' ')
            data = re.sub('\W+', ' ', data) #Select only alpha numerics
            data = re.sub('[^A-Za-z]+', ' ', data) #select only alphabet characters
            data = data.lower()
            all_resume_txt.append(data)
            
    req_doc_text = job_description_txt
    resume_doc_text = all_resume_txt
    list_name = []
    list_email = []
    for filename in resume_docs:
        if filename.endswith(".pdf") or filename.endswith(".txt") or filename.endswith(".docx") or filename.endswith(".doc"):
            parsed_pdf = parser.from_file(filename)
            data = parsed_pdf['content'] 
            if data == None:
                data = "temp"
            name = extract_name(data)
            data = "".join([char for char in data if not is_pua(char)])
            list_name.append(name)
            data = data.lower()
            email = extract_emails(data)
            list_email.append(email)
        
    cos_sim_list = get_tf_idf_cosine_similarity(req_doc_text,resume_doc_text)
    final_doc_rating_list = []
    zipped_docs = zip(cos_sim_list,resume_docs,list_name,list_email)
    sorted_doc_list = sorted(zipped_docs, key = lambda x: x[0], reverse=True)
    

    for element in sorted_doc_list:
        doc_rating_list = []
        doc_rating_list.append(os.path.basename(element[1]))
        doc_rating_list.append("{:.0%}".format(element[0]))
        doc_rating_list.append(element[2])
        doc_rating_list.append(element[3])
        final_doc_rating_list.append(doc_rating_list)
    return final_doc_rating_list
    

 
# for detail in final_doc_rating_list:
#     print(detail[2],", Email: ",detail[3], ", Resume File name: ", detail[0],", Score: ",detail[1])



# result = {
#     "msg": "task done"
# }
# print(json.dumps(result))

directory = os.fsencode(pathResumesDir)
listResumes = []
for file in os.listdir(directory):
    filename = os.fsdecode(file)
    listResumes.append(os.path.join(pathResumesDir,filename))    

if __name__ == "__main__":    
    req_document = pathJobFile
    resume_docs = listResumes

    final_doc_rating_list = process_files(req_document,resume_docs,tags_string)
    # result = {
    #     "finalList": ["list","element"]
    # }
    result = {
        "finalList": final_doc_rating_list
    }
    print(json.dumps(result))



