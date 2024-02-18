import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

openai_key = os.environ.get('OPENAI_KEY')
client = OpenAI(api_key=openai_key)

def generate_desc(chunk):
  response = client.completions.create(
          model="gpt-3.5-turbo-instruct",
          prompt="please condense this text into a 5-word image generation prompt: " + chunk,
          max_tokens=500,
          temperature=0
      )
  image_desc = response.choices[0].text.strip()
  print("image desc:", image_desc)
  return image_desc


def generate_image_url(image_desc):
  response = client.images.generate(
    model="dall-e-3",
    prompt="children's storybook illustration of a: " + image_desc,
    size="1024x1024",
    quality="standard",
    n=1,
  )

  image_url = response.data[0].url
  return image_url