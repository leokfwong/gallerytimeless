from PIL import Image
import os
import re

all_files = os.listdir("../images/paintings/2008")
regex = re.compile(".*\.png$")
print(list(filter(regex.match, all_files)))

def resizeImages(): 

	folder_path = "../images/paintings/2008/"
	image = Image.open('../images/paintings/2008/')

	ratio = 0.1

	new_width = round(image.size[0] * ratio)
	new_height = round(image.size[1] * ratio)

	image.thumbnail((new_width, new_height), Image.ANTIALIAS)

	image.save('../images/paintings/2008/resized-img-001.png')