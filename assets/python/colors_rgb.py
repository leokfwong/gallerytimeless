from PIL import Image
import pandas as pd
import os
import re
import matplotlib.pyplot as plt

# Get current working directory
cwd = os.getcwd()

# Initialize empty array used to store json snippets
tmp = []
json_array = ""

# Get current size
fig_size = matplotlib.pyplot.rcParams["figure.figsize"]

# Set figure width to 12 and height to 9
fig_size[0] = 6
fig_size[1] = 4
matplotlib.pyplot.rcParams["figure.figsize"] = fig_size


def convertToJSON(path, pic):
    # Get image
    url = path + pic
    img = Image.open(url)
    # Convert color to RGB and aggregate colors
    colors = img.convert("RGB").getcolors()

    # Transform image into dataframe (count, rgb[])
    df = pd.DataFrame(colors)
    df.columns = ["count", "rgb"]
    # Sort by count descending order
    df = df.sort_values(by="count", ascending=False)
    # Create new id to identify order ranking
    df.insert(0, "order", range(1, 257))

    # Transform dataframe to json
    json = df[["order", "rgb"]].to_json()

    # Create painting id
    pic_id = (re.findall("\d+", pic))[0]
    json = re.sub("\"order", "\"id\":\"" + pic_id + "\", \"order", json)

    return (json)


# Iterate through every folder to fetch images
for year in range(2008, 2021):

    # Set up path to image and get list of all image names within each
    path = cwd + "/assets/images/paintings/" + str(year) + "/"
    pictures = os.listdir(path)

    # For each image
    for pic in pictures:
        # Get json
        json = convertToJSON(path, pic)

        # Push json to tmp array containing json for each painting
        tmp.append(json)

# Iterate through every json
for i in range(0, len(tmp)):

    # Set up condition to properly format string
    if i == 0:
        json_array = "[" + json_array + tmp[i] + ", "
    elif i + 1 == len(tmp):
        json_array = json_array + tmp[i] + "]"
    else:
        json_array = json_array + tmp[i] + ", "

# Add variable initialization at the beginning        
json_array = "var colorsRGB = " + json_array

# Write string to .json file
print("Writing to file...")
with open(cwd + "/assets/json/colors_rgb.json", "w") as outfile:
    outfile.write(json_array)
