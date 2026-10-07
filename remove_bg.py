from PIL import Image

def remove_white_bg_and_crop(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    new_data = []
    # Set tolerance for white background
    tolerance = 230
    for item in datas:
        # Check if the pixel is close to white
        if item[0] > tolerance and item[1] > tolerance and item[2] > tolerance:
            # Change to transparent
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    
    # Crop the image to its non-transparent bounding box
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(output_path, "PNG")
    print("Successfully processed the image.")

remove_white_bg_and_crop('assets/one-piece-logo.png', 'assets/one-piece-logo-transparent.png')
