from openai import OpenAI
client = OpenAI(api_key="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")

response = client.images.generate(
  model="dall-e-3",
  prompt="a princess in a big red barn, animated",
  size="512x512",
  quality="standard",
  n=1,
)

image_url = response.data[0].url
print(image_url)