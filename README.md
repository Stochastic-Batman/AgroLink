# AgroLink - formerly RandomRouting

## **This code was never fully completed, though I did my part backend + DB + translation model. Due to our lack of time and frontend expertise, Lovable coded the while website, unfortunately...**

A marketplace linking organic and bio-food farmers with restaurants, hotels, and food producers for wholesale, bulk purchases.

Ozurgeti Hackathon 2025 (Hackathon: ტექნოლოგიები მცირე ბიზნესისთვის) Project.

## Setup

This project uses Python 3.14.0. After making sure you are using the same version of Python, create virtual environment by:

`python -m venv rr_venv`

and install requirements via:

`pip install -r requirements.txt`

## Launching the chat from the same computer

Run:

`python -m tarjimani.networking server ka 5035`

and 

`python -m tarjimani.networking client en localhost 5035`

in separate windows.