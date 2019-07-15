from PIL import Image
import pandas as pd
import numpy as np
import os
import re
import random
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs

tmp = []
json_array = []

# Iterate through every folder to fetch images
for year in range(2008, 2020):
    
    # Set up path to image and get list of all image names within each
    path = "C:/Users/Leo/Documents/GitHub/gallerytimeless/assets/images/paintings/" + str(year) + "/"
    pictures = os.listdir(path)

    # For each image
    for pic in pictures:     

        url = path + pic
        img = Image.open(url)

        pixels = list(img.convert("RGB").getdata())
        pixel_sample = random.sample(pixels, 5000)

        # Transform image into dataframe (count, rgb[])
        df = pd.DataFrame(pixel_sample)
        df.columns = ['R', 'G', 'B']
        
        X = df[["R", "G", "B"]]
        
        kmeans = KMeans(n_clusters=5)
        kmeans = kmeans.fit(X)
        labels = kmeans.predict(X)
        
        centroids = kmeans.cluster_centers_
        cluster_df = pd.DataFrame(np.round(centroids))
        cluster_df.columns = ["R", "G", "B"]
        
        json = cluster_df.to_json()
        
        # Create painting id
        pic_id = (re.findall('\d+', pic))[0]
        json = re.sub("\"R", "\"id\":\"" + pic_id + "\", \"R", json)
        
        json_array.append(json)
        
        # Creating a sample dataset with 5 clusters
        # X, y = make_blobs(n_samples=800, n_features=3, centers=5)
        # fig = plt.figure()
                
        # ax = Axes3D(fig)
        # ax.scatter(X[:, 0], X[:, 1], X[:, 2])
        
# Initialize final string    
final = ""

# Iterate through every json
for i in range(0, len(json_array)):
    
    # Set up condition to properly format string
    if (i == 0):
        final = "[" + final + json_array[i] + ", "
    elif (i+1 == len(json_array)):
        final = final + json_array[i] + "]"
    else:
        final = final + json_array[i] + ", "
        
# Add variable initialization at the beginning        
final = "var paletteRGB = " + final

# Write string to .json file
with open("C:/Users/Leo/Documents/GitHub/gallerytimeless/assets/images/palette.json", "w") as outfile:
    outfile.write(final)