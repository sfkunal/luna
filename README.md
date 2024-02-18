# Luna

## Inspiration

Bedtime stories are a tradition as old as time, and Luna aims to bring a new level of immersion to these childhood favorite memories by seamlessly integrating visual elements into these spoken narratives. Luna aims to provide a dynamic and engaging platform that transcends traditional storytelling formats, offering users a unique blend of auditory and visual immersion to make storytelling all the more enchanting.

## What it does

Luna displays AI-powered images as users speak. To capture each moment in the spoken story, Luna listens word-for-word for voice input to transcribe audio into text and then subsequently generates vivid images using OpenAI and Dall-E 3. These pictures are exhibited alongside live subtitles and users can additionally title their storybooks.

Recognizing the prevalence of visual learning, Luna goes beyond traditional storytelling by promoting an image-driven approach. The vast majority of people are visual learners, which is how Luna induces growth and the holistic development of young children, fostering advancements in crucial areas such as imagination, language proficiency, emotional intelligence, and the foundation for future relationships. We similarly catered towards a simplistic, intuitive user interface to reinforce our generative visual components and ensure ease of use for all individuals.

## How we built it

We utilized Figma to construct the framework for general UX semantics, workflow, theming, and animations. The website is built using React and written using Python. Its functionalities are supplemented by IBM Watson Speech To Text for voice transcription, FastAPI for API calls, and OpenAI and Dall-E 3 for image generation. We deployed our backend on RailWay and our frontend Vercell. 

## Challenges we ran into

Manipulating voice input was one of our biggest challenges. Not only was the data format finicky, but we found it difficult to chunk our input string in a grammatically meaningful way such that we could then feed this into a POST API call to generate relevant visuals. We had to test with various tools such as NLTK, timeout, and subprocess management in an attempt to properly split our text into paragraphs as verbal speech can be highly arbitrary in terms of parsing, segregation, and formatting.

Another glaring issue was efficiency because making OpenAI calls and generating high-quality images was costly, hence significantly slowing down our program. More specifically, our underlying issue was that we were bottlenecked by OpenAI high-quality image generation latency with Dall-E 3. Therefore, we employed improvement in all areas that we could. We noticed initial runtimes of 14 seconds when we first employed our calls with other computations, and our goal was to acquire at least single-digits in wait time, since we needed to leave up the graphics for a period of viewing. Over time, we managed to nearly halve this delay by optimizing our image queries, and pictures per second, as well as minimizing extra operations and image parameters.

## Accomplishments that we're proud of

Designing a minimal, whimsical UX experience with proper components and text display, getting the speech to text to image transcription to be fully functional, and integrating the frontend and backend.

During the outline of our interface, meticulous attention was devoted to creating an intuitive and visually appealing interface. The design process prioritized the implementation of proper components, ensuring a seamless navigation experience for users. We thoughtfully considered and strategically placed each element to enhance overall usability. The color palette and typography were carefully chosen to evoke a magical and engaging ambiance and user interactions were optimized to be intuitive, with a focus on delivering an enjoyable experience.

Our project’s core functionality hinged on fully operational Speech-to-Text (STT) and image transcription features. Henceforth, we put a lot of effort in polishing these aspects. Rigorous testing and fine-tuning were conducted to ensure the robustness and accuracy of the STT system, enabling immediate, precise transcription. Similarly, the image transcription process was meticulously implemented and validated, leveraging OpenAI and Dall-E 3 to generate vivid and contextually relevant visuals from the transcribed text. This bidirectional integration, seamlessly linking spoken words to visually compelling images, required intricate synchronization between backend processes. The outcome is a sophisticated system that not only translates spoken words accurately but also transforms them into visually captivating images, enriching the storytelling experience on the platform.

As our work progressed, we saw concurrent development in both the frontend and backend. At the very end, our team had to come together to synthesize our ideas and devise strategies to synchronize the frontend with the backend. After long and careful discussion, trial and error, research, and debugging, we successfully and seamlessly connected these two pivotal components together.

We were also satisfied with our team’s workflow and design process—we meticulously broke down our problem into substeps and developed in iterations such that we had a fully functional Minimum Viable Product (MVP) within 12 hours. Moreover, our ability to iterate on multiple components independently and effectively allowed us to witness dramatic progress as a result, from the speech-to-text, to the image generation, to having both being simultaneously displayed and securely hosted on a vercel app.

## What we learned

Through the development of Luna, we gained valuable insights and learned the following:

- Took an idea from Concept to Production.
- How to utilize AI in the field of speech-to-text and image generation.
- Working with live audio input.
- Efficient text processing.
- Proper design and UX.
- Effective collaboration and version control with Git and GitHub.

## What's next for Luna

OpenAI recently released SOMA, a groundbreaking text-to-video tool. Our next biggest step is to prospectively integrate Luna with this technology to advance storytime imagery into playable video formats. We also want to augment additional features including a storybook history that you can access through a sidebar or by flipping back and forth between pictures, the ability to fullscreen and toggle subtitles on/off, and an option to download the story with its linked images and voiceovers. We can enhance the user interface further to provide a more user-friendly experience. We would also look into ways to speed up our calls to generate the image URL.

In the realm of voice-to-image generation, there are a lot of use cases outside of the storytelling situation we have focused on. Luna can be used as a visualization tool for on-the-fly business pitches or presentations. Its exceptional visual aid enables to students to more competently memorize speeches or facts for an exam or any upcoming event. For individuals who occupy themselves with podcasts, Luna can be used alongside podcasts to curate a more immersive experience.

## Techstack

Frontend: react, dalle-3, ibm watson speech to text, next.js, figma

Backend: python, fastapi, openai

---

## Inspiration

Luna draws inspiration from the timeless tradition of bedtime stories, aiming to elevate this experience by seamlessly incorporating captivating visual elements into spoken narratives. The goal is to create a dynamic and engaging platform that goes beyond traditional storytelling, offering users a unique blend of auditory and visual immersion to enhance the enchantment of storytelling.

## What it does

Luna utilizes AI-powered images that dynamically accompany spoken narratives. The process involves transcribing audio to text and generating images using OpenAI and DALL-E 3, capturing each moment in the story. Users can also title their storybooks and enjoy subtitles, enhancing the experience for visual learners, especially benefiting younger children by fostering imagination, language development, emotional understanding, and future relationship-building.

## How we built it

The project began with the framework, UI/UX design, and theming constructed in Figma. The website, developed using React and Python, incorporates IBM Watson Speech to Text for voice transcription, FastAPI for API calls, and OpenAI and DALL-E 3 for image generation. This comprehensive approach ensures a seamless and engaging user experience.

## Challenges we ran into

Overcoming challenges in manipulating voice input was a significant hurdle. Formatting the data and chunking input strings meaningfully for API calls posed difficulties, requiring experimentation with tools like NLTK, timeout, and subprocess management. Efficiency was also a concern, as the process of generating high-quality images with DALL-E 3 incurred latency, causing program slowdowns. Tackling these challenges involved innovative solutions to streamline the workflow.

## Accomplishments that we're proud of

Key accomplishments include designing a clean, whimsical UI/UX experience, achieving fully functional speech-to-text to image transcription, and successfully integrating the frontend and backend components. These achievements contribute to Luna's overall appeal and usability.

## What we learned

The development of Luna provided valuable insights into utilizing AI for speech-to-text and image generation. The team gained proficiency in efficient text processing and honed collaborative skills using Git and GitHub for effective version control. These learning experiences have equipped the team with a robust skill set for future endeavors.

## What's next for Luna

The next phase involves integrating Luna with OpenAI's SOMA, a groundbreaking text-to-video tool, to advance storytime imagery into playable video formats. Future enhancements include a storybook history accessible through a sidebar, fullscreen capabilities with customizable subtitles, and the option to download the story with linked images and voiceovers. These additions aim to further enrich the Luna experience and broaden its capabilities.

## Techstack

Frontend: react, dalle-3, ibm watson speech to text, next.js, figma

Backend: python, fastapi, openai
