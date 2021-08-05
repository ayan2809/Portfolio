#added by me
from django.shortcuts import render
from django.http import HttpResponse
import re
def index(request):
    return render(request, 'index.html')
def about(request):
    return HttpResponse("About Ayan")

def removepunc(request):
    djtext = request.GET.get('text', 'default')
    removepunc = request.GET.get('removepunc', 'off')
    uppercase= request.GET.get('capitalize','off')
    removespace= request.GET.get('spaceRemover','off')
    
    params = {'analyzed_text': '','count': 0}
    if removepunc == "on":
        djtext = re.sub(r'[^\w\s]', '', djtext)
    if uppercase=="on":
        djtext=djtext.upper()

    if removespace=="on":
        djtext=" ".join(djtext.split())
    count=0
    for i in djtext:
        if(i!=' '):
            count=count+1
    
    params['analyzed_text']= djtext
    params['count']=count

    return render(request, 'analyze.html', params)

