# Digit Recognizer Webapp

This repository contains a small web app that runs a MNIST trained model for handwritten digit recognition.

### Step 1 - Clone this repository

### Step 2 - Install Requirements:

```
> pip install -r requirements.txt
```

### Step 3 - Run train.py to generate the model:
```
> python train.py
```

### Step 4 - Set the web_app as FLASK_APP

On cmd:
```
> set FLASK_APP=web_app
```
On PowerShell:
```
> $env:FLASK_APP="web_app.py"
```

### Step 5 - Run server
```
> flask run
```

### Results:

![alt text](https://github.com/andrevargas22/Digit_Recognizer_Webapp/blob/main/static/digit1.PNG)
![alt text](https://github.com/andrevargas22/Digit_Recognizer_Webapp/blob/main/static/digit2.PNG)

This app is also currently available here: http://andrevargas22.pythonanywhere.com/digit_recognizer
