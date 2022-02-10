# Digit Recognizer Webapp

This repository contains a small web app that runs a MNIST trained model for handwritten digit recognition.

### Step 1 - Clone this repository

### Step 2 - Install Requirements:

```
> pip install -r requirements.txt
```

### Step 3 - Run train.py to generate the model Digit_Recognition_Model.h5:
```
> python train.py
```

### Step 4 - Set web_app as FLASK_APP

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

It should work on local address: http://127.0.0.1:5000/

### Expected Results:
