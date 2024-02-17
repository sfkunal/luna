from openai import OpenAI
client = OpenAI(api_key="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")

def get_story_topic():
    topic = input("What do u want the story to be about? ")
    return topic

def generate_story(topic):
    response = client.completions.create(
        model="gpt-3.5-turbo-instruct",
        prompt="generate me a 250 word story about " + topic,
        max_tokens=500,
        temperature=0
    )
    return response.choices[0].text.strip()

if __name__ == "__main__":
    topic = get_story_topic()
    story = generate_story(topic)
    print(story)