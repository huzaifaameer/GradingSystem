import json, os, io
from pathlib import Path
import openai
from django.shortcuts import render
from django.http import HttpResponse  # Add this import
from xhtml2pdf import pisa
from django.views.decorators.csrf import csrf_exempt
from urllib.parse import parse_qs
from dotenv import load_dotenv

load_dotenv()


api_key = os.environ.get('API_KEY', None)
openai.api_key = api_key

BASE_DIR = Path(__file__).resolve().parent.parent



# Create your views here.

def index(request):
    # print(os.getcwd())
    file = os.path.join(BASE_DIR,'questions.json')
 
    questions = ""
    # Opening JSON file
    with open(file) as my_file:
        questions =  json.loads(my_file.read())
     
    return render(request, 'index.html', {"questions":questions})
    
def result(request):

    if request.method == 'GET':
        supervisor = request.GET.get('supervisor')
        studentId = request.GET.get('studentId')
        studentName = request.GET.get('studentName')
        projectTitle = request.GET.get('projectTitle')
        programme = request.GET.get('programme')
        score = request.GET.get('score', 0)
        if(not score or score ==None or score == ""):
            score = 0
        if(int (score)>=100):
            score = 100
        prompt = _getResultPrompt(score)
        if (prompt is None):
            prompt = _getResultPrompt(0)
        prompt_response = _send_prompt_to_chat(prompt)
        data = {
            "studentInfo":{
        "supervisor" :supervisor,
        "studentName" : studentName,
        "studentId" : studentId,
        "projectTitle" : projectTitle,
        "programme" : programme
            }
        }
        data["prompt"] = prompt
        data["prompt_response"] = prompt_response

        return render(request, 'result.html' , data)
        # return JsonResponse({"data" : prompt_response})
    
    if request.method == 'POST':
        supervisor = request.POST.get('supervisor')
        studentName = request.POST.get('studentName')
        studentId = request.POST.get('studentId')
        projectTitle = request.POST.get('projectTitle')
        programme = request.POST.get('programme')
        prompt = request.POST.get('prompt')
        prompt_response = request.POST.get('prompt_response')

        print(studentId, studentName)
        html = ""
        html_path = os.path.join(BASE_DIR, 'test.html')

        
        with open(html_path, 'r') as html_file:
            html =  html_file.read()
        html = html.replace('Supervisior 1', supervisor).replace("John Doe", studentName).replace("ABX-28-2023", studentId).replace("projectTitlehereforReplace", projectTitle).replace("programmeReplacehere", programme).replace("remarkstoreplacefromhere", prompt).replace("promptresponsetoreplace", prompt_response)

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="output.pdf"'

        pisa_status = pisa.CreatePDF(html, dest=response)
        if pisa_status.err:
            return HttpResponse('An error occurred while generating PDF.')

        return response



def _send_prompt_to_chat(prompt):
    if(api_key is None):
        return "API key required to communicate with OPEN AI..."
    try:
        response = openai.ChatCompletion.create(
            model='gpt-3.5-turbo',
            messages=[
                {
                    'role' : 'user',
                    'content' : prompt
                }
            ] ,
            max_tokens=120,
            n=1,
            stop=None,
            temperature=0.7,
            top_p=1.0,
            frequency_penalty=0.0,
            presence_penalty=0.0
        )
        generated_text = response['choices'][0]['message']['content']
        # data = {
        #     "success":True,
        #     "generatedText": str(generated_text),
        #     "message":""
        # }
        return generated_text
    except Exception as e:
        # data = {
        #     "success":False,
        #     "generatedText": None,
        #     "message":str(e)
        # }
        return e

def _getResultPrompt(score):
    file = os.path.join(BASE_DIR,'scores.json')
    prompts = ""
    # Opening JSON file
    with open(file) as my_file:
        prompts =  json.loads(my_file.read())
    
    for prompt in prompts:
        if int(score) in prompt["scores"]:
            return(prompt["value"])


@csrf_exempt
def getPDF(request):
    if request.method == 'POST':
        try:
            data_str = request.body.decode('utf-8')
            # Parse the JSON data
            json_data = json.loads(data_str)
            scores = json_data['selections']
            user_info = json_data['userInfo']
            questions = []
            # Opening JSON file
            file = os.path.join(BASE_DIR,'questions.json')
            with open(file) as my_file:
                questions =  json.loads(my_file.read())

            selected_questions = []
            for score, question in zip(scores, questions):
                question["Selection"] = int(score)+1
                selected_questions.append(question)
                # print(score)
                # for key, value in enumerate(question):
                #     print(key, value)
                options_list = list(question["options"].items())
                _opt, _desc = options_list[5-int(score)]
                
                question["GPTResponse"] = _send_prompt_to_chat(_desc)
                
            html = render(request, 'pdfTemplate.html', {"selected_questions":selected_questions, "user" : user_info}).content   
            # html = render(request, 'pdftest.html').content   
            # print(html)
            response = HttpResponse(content_type='application/pdf')
            response['Content-Disposition'] = 'attachment; filename="output.pdf"'

            pisa_status = pisa.CreatePDF(html, dest=response)
            if pisa_status.err:
                return HttpResponse('An error occurred while generating PDF.')

            return response

        except Exception as ex:
            print(ex,"=================~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
            pass

