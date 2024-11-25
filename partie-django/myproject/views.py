from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from urllib.parse import unquote
import base64
import requests
from ultralytics import YOLO
import numpy as np
import cv2
from colorthief import ColorThief
import webcolors
import os
from PIL import Image
import torch
import torch.nn as nn
import torchvision
from torchvision import transforms
from scipy.spatial.distance import cdist
import shutil

import inspect
from typing import List, Optional, Union
import PIL
from diffusers import StableDiffusionInpaintPipeline
from io import BytesIO


@api_view(['GET'])
@csrf_exempt
def data(request):
    ch = 'yyy'
    return Response(ch)


@api_view(['GET'])
@csrf_exempt
def search(request):
    param = request.GET.get('param', '') # param contient image sous forme base64
    decoded_param = unquote(param)
    decoded_data = base64.b64decode(decoded_param)  # decoder param du l'url
    np_data = np.frombuffer(decoded_data, np.uint8)  # convertir en tableau numpy
    image_cv2 = cv2.imdecode(np_data, cv2.IMREAD_COLOR)  # lire l'image avec cv2
    chemin_dossier = r"C:\Users\msime\PycharmProjects\searx"
    nom_repertoire_images = "images"
    chemin_repertoire_images = os.path.join(chemin_dossier, nom_repertoire_images)
    query = get_query(image_cv2)
    res = search_searx(query)
    # down_im(res, image_cv2, chemin_repertoire_images)
    # list_lien = get_closet_img(res, chemin_repertoire_images)
    # return Response(list_lien)
    return Response(res[:5])


@api_view(['GET'])
@csrf_exempt
def inpaint(request):
    param_image = request.GET.get('image', '')
    prompt = 'A man wearing ' + request.GET.get('prompt', '')
    decoded_param = unquote(param_image)
    decoded_data = base64.b64decode(decoded_param)  # decoder param du l'url
    np_data = np.frombuffer(decoded_data, np.uint8)  # convertir en tableau numpy
    image_cv2 = cv2.imdecode(np_data, cv2.IMREAD_COLOR)  # lire l'image avec cv2

    image_pil, mask_pil = get_mask(image_cv2)
    image_resp = inpaint_def(image_pil, mask_pil, prompt)
    image_res = cv2.resize(image_resp, (400, 400))

    _, encoded_image = cv2.imencode('.jpg', image_res)
    base64_image = base64.b64encode(encoded_image)
    ch = base64_image.decode('utf-8')
    return Response(ch)
    # return Response("hello world")


def get_color():
    ct = ColorThief('resres.jpg')
    dominant = ct.get_color(quality=1)
    try:
        name_col = webcolors.rgb_to_name(dominant)
        print(name_col, "exact")
        return name_col
    except ValueError:
        name_col = closet_color(dominant)
        print(name_col)
        return name_col


def closet_color(rgb):
    diff = {}
    for color_hex, color_name in webcolors.CSS3_HEX_TO_NAMES.items():
        r, g, b = webcolors.hex_to_rgb(color_hex)
        diff[sum([(r - rgb[0]) ** 2,
                  (g - rgb[1]) ** 2,
                  (b - rgb[2]) ** 2])] = color_name
    return diff[min(diff.keys())]


def search_searx(query):
    url = "http://127.0.0.1:8080/search"
    params = {
         "q": query,
         "categories": 'images',
         # "format": 'json',
    }
    headers = {
        'User-Agent': 'python-requests/2.26.0'
    }

    response = requests.get(url, params=params, headers=headers).text
    res = response[response.index("<img src"):response.index('id="backToTop"')].split('<img src=""')
    res.pop(0)

    for i in range(len(res)):
        res[i] = {"im": res[i][res[i].index("http"):res[i].index("alt") - 2], "site": res[i][res[i].index(
            'rel="noreferrer"') + 23:res[i].index('>htt', res[i].index('rel="nore')) - 1]}
    for x in res:
        print(x["im"], "\n", x["site"], "\n\n")

    return res


def get_query(image):
    model = YOLO('../../bestSeg.pt').to("cpu")
    model_logo = YOLO('../../bestLogoDetect.pt', task='detect').to("cpu")

    resultss = model(image)
    mask = cv2.resize(np.uint8(resultss[0].masks.data[0].numpy() * 255), (640, 480))

    logo = model_logo(image)
    try:
        logo_name = logo[0].names[int(logo[0].boxes.cls)]
    except:
        logo_name = ""
    clothes_name = resultss[0].names[int(resultss[0].boxes.cls)]
    print(logo_name)
    print(clothes_name)
    image_r = cv2.resize(image, (640, 480))

    masked_image = cv2.bitwise_and(image_r, image_r, mask=mask)
    masked_image[mask == 0] = 255
    cv2.imwrite('resres.jpg', masked_image)

    color_name = get_color()
    if os.path.exists('resres.jpg'):
        os.remove('resres.jpg')
    return clothes_name + " " + logo_name + " " + color_name


def down_im(res, image_cv, chemin_repertoire_images):
    try:

        if not os.path.exists(chemin_repertoire_images):
            os.makedirs(chemin_repertoire_images)
        os.chdir(chemin_repertoire_images)
        cv2.imwrite("im.jpg", image_cv)
        for i in range(20):
            im_res = requests.get(res[i]['im'])
            chemin_image = os.path.join(chemin_repertoire_images, 'im' + str(i) + '.jpg')
            if im_res.status_code == 200:
                with open(chemin_image, 'wb') as fichier:
                    fichier.write(im_res.content)
            print('down image{}'.format(i))
    except Exception as e:
        print("Une erreur s'est produite :", e)


def get_closet_img(res, chemin_repertoire_images):
    chemin_dossier = r"C:\Users\msime\PycharmProjects\searx"
    os.chdir(chemin_dossier)
    model = torchvision.models.resnet18(weights="DEFAULT")
    # C:\Users\msime /.cache\torch\hub\checkpoints\resnet18 - f37072fd.pth
    all_names = []
    all_vecs = None
    model.eval()
    root = "./images/"
    images = os.listdir(root)
    transform = transforms.Compose([
        transforms.Resize((256, 256)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    activation = {}

    def get_activation(name):
        def hook(model, input, output):
            activation[name] = output.detach()

        return hook

    model.avgpool.register_forward_hook(get_activation("avgpool"))
    with torch.no_grad():
        for file in images:
            try:
                img = Image.open(root + file)
                img = transform(img)
                out = model(img[None, ...])
                vec = activation["avgpool"].numpy().squeeze()[None, ...]
                if all_vecs is None:
                    all_vecs = vec
                else:
                    all_vecs = np.vstack([all_vecs, vec])
                all_names.append(file)
            except:
                if file == "im.jpg":
                    return("erreur", file)
                print('erreur', file)
                continue
    idx = all_names.index('im.jpg')
    target_vec = all_vecs[idx]
    top5 = cdist(target_vec[None, ...], all_vecs).squeeze().argsort()[1:6]
    if idx in top5:
        top5 = np.delete(top5, np.where(top5 == idx)[0])
    lll = []
    for i in top5:
        x = int(all_names[i][2])
        lll.append(res[x])

    shutil.rmtree('./images')
    print(top5)
    return lll


def get_mask(image_cv):
    model = YOLO('../../bestSeg.pt').to('cpu')
    image = cv2.resize(image_cv, (512, 512))
    resultss = model(image)
    ker = np.ones((5, 5), np.uint8)
    mask = cv2.dilate(cv2.resize(np.uint8(resultss[0].masks.data[0].numpy() * 255), (512, 512)), ker, iterations=1)
    # cv2.imshow('image', image)
    # cv2.imshow('mask', mask)
    # cv2.waitKey(0)
    # cv2.destroyAllWindows()
    image_pillow = Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    mask_pillow = Image.fromarray(mask)
    return image_pillow, mask_pillow


def inpaint_def(img, mask_img, prompt):
    device = "cuda"
    model_path = "runwayml/stable-diffusion-inpainting"

    pipe = StableDiffusionInpaintPipeline.from_pretrained(
        model_path,
        torch_dtype=torch.float16,
    ).to(device)

    guidance_scale = 7.5
    num_samples = 3
    generator = torch.Generator(device="cuda").manual_seed(0)  # change the seed to get different results

    images = pipe(
        prompt=prompt,
        image=img,
        mask_image=mask_img,
        guidance_scale=guidance_scale,
        generator=generator,
        num_images_per_prompt=num_samples,
    ).images[0]
    image_cv = cv2.cvtColor(np.array(images), cv2.COLOR_RGB2BGR)
    # cv2.imshow('im', image_cv)
    # cv2.waitKey(0)
    # cv2.destroyAllWindows()
    return image_cv
