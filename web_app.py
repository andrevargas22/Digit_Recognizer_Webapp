import re
import base64
import json
import numpy as np
import tensorflow as tf

from flask import Flask, render_template, request
from io import BytesIO
from PIL import Image

app = Flask(__name__)

# Default route: Render canvas for drawing
@app.route("/")
def hello_world():
    return render_template('drawing_canvas.html')
