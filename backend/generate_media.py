from openai import OpenAI
import time

start_time = time.time()

client = OpenAI(api_key="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")

chunk = 'As the sun began to set over the small town of Willow Creek, the streets were quiet and the only sound was the rustling of leaves in the gentle breeze. The town was known for its peacefulness and tight-knit community, but tonight, something was different.'

response = client.completions.create(
        model="gpt-3.5-turbo-instruct",
        prompt="please condense this text into a 5-word image generation prompt: " + chunk,
        max_tokens=500,
        temperature=0
    )
image_desc = response.choices[0].text.strip()
print("image desc:", image_desc)


response = client.images.generate(
  model="dall-e-3",
  prompt="children's storybook illustration of a: " + image_desc,
  size="1024x1024",
  quality="standard",
  n=1,
)

image_url = response.data[0].url
print(image_url)

end_time = time.time()
elapsed_time = end_time - start_time
print(f"Time taken to generate and print the image: {elapsed_time} seconds")

