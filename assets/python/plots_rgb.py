from PIL import Image
import os
import re
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import axes3d, Axes3D
import random

# Get current size
fig_size = plt.rcParams["figure.figsize"]
 
# Set figure width to 12 and height to 9
fig_size[0] = 9
fig_size[1] = 6
plt.rcParams["figure.figsize"] = fig_size

# Set up path to image and get list of all image names within each
path = "F:/Website Projects/gallerytimeless/assets/images/paintings/full/"
pictures = os.listdir(path)

# For each image
for pic in pictures:        

    # Get image
    url = path + pic
    img = Image.open(url)
    # Convert color to RGB and aggregate colors
    colors = img.convert("RGB").getcolors()
        
    pixels = list(img.convert("RGB").getdata())
    pixel_sample = random.sample(pixels, 5000)

    fig = plt.figure()
    ax1 = Axes3D(fig)
        
    for i in pixel_sample:
        xs = i[0]
        ys = i[1]
        zs = i[2]
        r, g, b = xs/255, ys/255, zs/255
        c = (r, g, b)
        ax1.scatter(xs, ys, zs, c=c, s=8)
            
    ax1.set_xlabel('R')
    ax1.set_ylabel('G')
    ax1.set_zlabel('B')
        
    ax1.w_xaxis.set_pane_color((.3, .3, .3, .3))
    ax1.w_yaxis.set_pane_color((.3, .3, .3, .3))
    ax1.w_zaxis.set_pane_color((.3, .3, .3, .3))
        
    ax1.tick_params(axis='x',colors='white')
    ax1.tick_params(axis='y',colors='white')
    ax1.tick_params(axis='z',colors='white')
        
    ax1.xaxis.label.set_color('white')
    ax1.yaxis.label.set_color('white')
    ax1.zaxis.label.set_color('white')
    
    # Create painting id
    pic_id = (re.findall('\d+', pic))[0]
    
    plt.savefig("F:/Website Projects/gallerytimeless/assets/images/plots/" + pic_id + '_plot.png', transparent=True)
    plt.show()