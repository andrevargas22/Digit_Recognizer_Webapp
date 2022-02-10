import re
import base64
import json
import numpy as np
import tensorflow as tf
import cv2

from flask import Flask, render_template, request
from io import BytesIO
from PIL import Image

app = Flask(__name__)

# Default route: Render canvas for drawing
@app.route("/", methods=['POST', 'GET'])
def hello_world():
    return render_template('drawing_canvas.html')

# Prediction on call
@app.route("/hook", methods=['POST', 'GET'])
def hook():

    # Open image from Javascript
    image_data = re.sub('^data:image/.+;base64,', '', request.form['imageBase64'])
    im = Image.open(BytesIO(base64.b64decode(image_data))).convert("RGBA")

    # Convert image background to white (otherwise it'll be transparent)
    new_image = Image.new("RGBA", im.size, "WHITE")
    new_image.paste(im, mask=im)
    new_image.convert("RGB")
    
    # Save image as png
    file = 'image.png'
    filename = 'static/'+file
    new_image.save(filename)

    # Open image using python cv
    image = cv2.imread(filename, cv2.IMREAD_GRAYSCALE)
    image = cv2.resize(image, (28, 28))
    image = image.astype('float32')
    image = image.reshape(1, 28, 28, 1)
    image = 255-image
    image /= 255

    # Load model
    digit_model = tf.keras.models.load_model('Digit_Recognition_Model.h5')

    # Make prediction
    prediction = digit_model.predict(image.reshape(1, 28, 28, 1), batch_size=1)

    # Convert argmax values to percentages in a list
    middle = prediction.tolist()
    percentages = [item for sublist in middle for item in sublist]
    percentages = [element * 100 for element in percentages]
    percentages.append(file)

    # Create dictionary percentagens of all possibilities
    res = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'name']
    zip_iterator = zip(res, percentages)
    a_dict = dict(zip_iterator)

    # Json dump the solution and send it back to Javascript
    sol = json.dumps(a_dict)
    return sol

# Redirect page with the results
@app.route("/results/<filen>/<result>/<prob>", methods=['POST', 'GET'])
def results(filen, result, prob):
    return render_template('digit_results.html', filen=filen, result=result, prob=prob)