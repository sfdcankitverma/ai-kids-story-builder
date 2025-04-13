import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
  import fs from "node:fs";
  import mime from "mime-types";
  
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseModalities: [
    ],
    responseMimeType: "application/json",
  };
  
    export const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "create kids story on description for 5-8 Years kids, Educational story, and all images in\nPaper cut style: story of boy and Magic School, give me 5 chapter, With detailed image\ntext prompt for each of chapter and image prompt for story cover book with story name\nall in JSON field format"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Here's a breakdown of the thought process behind creating the JSON story structure:\n\n1.  **Understand the Core Request:** The user wants a 5-chapter kids' story (ages 5-8) about a boy and a magic school. Key requirements are:\n    *   Educational element.\n    *   Paper cut art style for all images.\n    *   JSON format for the entire output.\n    *   Detailed image text prompts for each chapter image.\n    *   An image prompt for the story cover.\n    *   A story name.\n\n2.  **Target Audience (5-8 Years):**\n    *   **Language:** Simple sentences, clear vocabulary, repetition is okay.\n    *   **Themes:** Friendship, discovery, learning new things, overcoming small challenges, wonder, kindness. Avoid complex conflicts or scary elements.\n    *   **Pacing:** Keep chapters relatively short and focused on one main event or idea.\n    *   **Educational Element:** Integrate learning naturally, not didactically. Focus on simple concepts like colors, shapes, basic nature facts, or the idea of practice and patience.\n    *   **Visuals:** Bright, clear, engaging. Paper cut style fits well with this age group – it's tangible and charming.\n\n3.  **Brainstorming the Story:**\n    *   **Character:** A relatable boy. Let's call him Leo. He shouldn't be perfect; maybe a little curious, perhaps slightly hesitant initially.\n    *   **Setting:** A magic school. Make it whimsical and inviting, not intimidating. \"Whispering Woods Academy\" sounds nice and evocative.\n    *   **Plot Arc (Simple):**\n        *   **Chapter 1: Introduction:** Leo discovers/gets invited to the school. Initial wonder and maybe slight nervousness. Introduce the setting.\n        *   **Chapter 2: First Lesson:** A simple, visually engaging magic lesson. Focus on a basic concept (e.g., colors, shapes, nature). Introduce a friendly teacher and maybe a classmate. Educational element: Learning about colors/plants.\n        *   **Chapter 3: A Small Challenge:** Leo tries a spell, maybe it doesn't work perfectly at first. Emphasize practice and trying again. Educational element: Patience, observation.\n        *   **Chapter 4: Teamwork/Friendship:** Leo works with a friend on a task. Success through cooperation. Educational element: Importance of friendship/teamwork.\n        *   **Chapter 5: Reflection/Looking Forward:** Leo feels happy and accomplished. He looks forward to more learning. Reinforce the positive experience.\n    *   **Educational Tie-in:** Let's focus on nature magic – growing plants, understanding colors in flowers, maybe gentle weather effects. This is visually appealing and relatable.\n\n4.  **Structuring the JSON:**\n    *   Need a main JSON object.\n    *   Top-level keys: `storyTitle`, `storyCoverPrompt`, `chapters`.\n    *   `chapters` will be an array of objects.\n    *   Each chapter object needs: `chapterNumber`, `chapterTitle`, `storyText`, `imagePrompt`.\n\n5.  **Drafting Content - Chapter by Chapter (with Image Prompts in Mind):**\n\n    *   **Story Title:** \"Leo and the Sparkle Sprouts\" or \"Leo's First Day at Whispering Woods\". Let's go with \"Leo and the Whispering Woods Academy\". Simple and clear.\n    *   **Cover Prompt:** Needs Leo, the magical school, whimsical elements, paper cut style. Keywords: *boy, magical school, whimsical forest, smiling, friendly, bright colors, layered paper cut illustration, children's book cover.*\n    *   **Chapter 1: The Shimmering Letter:**\n        *   *Story:* Leo finds a special, sparkly letter. It invites him to the school. He travels there (maybe through a special tree). First glimpse of the school.\n        *   *Image Prompt:* Leo holding the letter, looking amazed. Background: His ordinary room/garden *contrasting* with the magical letter/portal. Keywords: *boy, holding glowing letter, surprised expression, cozy room background, magical portal hint, layered paper cut style, warm lighting, detailed textures.*\n    *   **Chapter 2: The Giggling Greenhouse:**\n        *   *Story:* First class in a greenhouse. Teacher (Miss Petal) teaches how to make seeds sprout with a simple word/action and focus. Focus on colors of first sprouts. Educational: Plant growth basics, colors.\n        *   *Image Prompt:* Leo and other kids with Miss Petal in a greenhouse. Focus on magical plants and Leo trying. Keywords: *children, friendly teacher (Miss Petal), magical greenhouse, glowing plants, colorful flowers, kids concentrating, watering can, layered paper cut style, bright daylight.*\n    *   **Chapter 3: The Wobbly Water Spell:**\n        *   *Story:* Leo tries a spell to water a plant, but it goes a bit wrong (wobbly stream, maybe splashes). He gets slightly discouraged but Miss Petal encourages him to try again, focusing. Educational: Practice, patience, observation.\n        *   *Image Prompt:* Leo looking slightly frustrated as water wobbles strangely from his hand/wand towards a plant. A small splash nearby. Keywords: *boy, trying magic spell, wobbly water stream, potted plant, funny mishap, slight frustration, greenhouse setting, layered paper cut style, action focus.*\n    *   **Chapter 4: Friendship Blooms:**\n        *   *Story:* Partner activity. Leo works with a shy classmate (Lily) to grow a rainbow flower. They combine their efforts (maybe Leo focuses, Lily whispers the right word). Success! Educational: Teamwork, friendship making things easier/better.\n        *   *Image Prompt:* Leo and Lily smiling, working together. A beautiful rainbow flower blooming between them. Keywords: *boy and girl, working together, smiling, magical rainbow flower blooming, greenhouse, teamwork, friendship, layered paper cut style, vibrant colors.*\n    *   **Chapter 5: Homeward Bound with a Sparkle:**\n        *   *Story:* End of the day. Leo feels proud. He gets a small, glowing seed to take home. He's excited to return. Recap the fun.\n        *   *Image Prompt:* Leo waving goodbye to the school (visible in background), holding a small glowing seed. Happy and content expression. Keywords: *boy, waving goodbye, magical school in background, holding small glowing seed, happy expression, sunset/evening light, whimsical path, layered paper cut style.*\n\n6.  **Refining Prompts:** Ensure prompts specify:\n    *   **Style:** \"layered paper cut illustration\", \"paper cut style\", \"textured paper\".\n    *   **Subject:** Clear description of characters, actions, setting.\n    *   **Mood/Atmosphere:** \"whimsical\", \"magical\", \"friendly\", \"bright\", \"warm lighting\".\n    *   **Composition:** Mention key elements and their placement if important (e.g., \"Leo in foreground\", \"school in background\").\n    *   **Details:** \"glowing\", \"sparkly\", \"colorful\".\n\n7.  **Writing Story Text:** Keep sentences short and direct. Use descriptive but simple words (sparkly, wobbly, giggling, bright). Add dialogue snippets. Ensure the educational points are woven in naturally. Check for flow between chapters.\n\n8.  **Final JSON Assembly:** Put all the pieces together in the specified JSON structure. Double-check syntax (commas, brackets, quotes). Ensure all required fields are present.\n\n9.  **Review:** Read through the story and prompts. Does it fit the age group? Is it educational? Is the paper cut style consistently requested? Are the prompts detailed enough? Make minor edits for clarity and consistency. (Self-correction: Initially, the challenge in Chapter 3 might have been too complex; simplified it to a wobbly spell). Ensure the ending feels satisfying and hopeful."},
            {text: "```json\n{\n  \"storyTitle\": \"Leo and the Whispering Woods Academy\",\n  \"storyCoverPrompt\": {\n    \"style\": \"Paper cut illustration\",\n    \"description\": \"A cheerful young boy with brown hair (Leo) stands smiling in front of a whimsical, slightly crooked magical school building nestled in a friendly forest. The school has glowing windows and twisty chimneys puffing colorful smoke. Tiny friendly magical creatures peek from behind trees. The overall mood is welcoming and wondrous. Layered paper textures are evident throughout.\",\n    \"keywords\": [\"boy\", \"magic school\", \"whimsical forest\", \"friendly creatures\", \"smiling\", \"welcoming\", \"layered paper cut style\", \"children's book cover\", \"bright colors\"]\n  },\n  \"chapters\": [\n    {\n      \"chapterNumber\": 1,\n      \"chapterTitle\": \"The Sparkly Invitation\",\n      \"storyText\": \"Leo loved exploring the woods behind his house. One sunny afternoon, nestled under the oldest oak tree, he found something unusual. It wasn't a smooth stone or a funny-shaped leaf. It was a letter! The envelope sparkled with all the colors of the rainbow. Inside, fancy swirling letters read: 'Leo, you are invited to the Whispering Woods Academy for Young Mages!' Leo's eyes went wide. Magic School? Was it real? A little path he'd never seen before shimmered nearby, leading deeper into the woods.\",\n      \"imagePrompt\": {\n        \"style\": \"Paper cut illustration\",\n        \"description\": \"A young boy (Leo) with wide, amazed eyes sits under a large, friendly-looking oak tree. He holds open a sparkling, colorful envelope with visible magical text inside. A faint, shimmering pathway starts near the tree, leading into a slightly mystical-looking forest background. Use layered paper textures to create depth, especially for the tree bark and sparkling letter.\",\n        \"keywords\": [\"boy\", \"surprised\", \"magical letter\", \"sparkling\", \"oak tree\", \"forest path\", \"invitation\", \"wonder\", \"layered paper cut style\", \"bright daytime\"]\n      }\n    },\n    {\n      \"chapterNumber\": 2,\n      \"chapterTitle\": \"Welcome to Whispering Woods\",\n      \"storyText\": \"Leo followed the shimmering path. It tickled his feet! Soon, he saw it – Whispering Woods Academy! It looked like cozy cottages stacked together, with twisty slides instead of stairs and roofs made of moss and flowers. A kind lady with twinkly eyes and a hat shaped like a mushroom greeted him. 'Welcome, Leo! I'm Professor Elara. Your first class is about Nature's Colors!' she smiled. Leo saw other kids, some nervous, some excited, just like him. Everything felt buzzing with gentle magic.\",\n      \"imagePrompt\": {\n        \"style\": \"Paper cut illustration\",\n        \"description\": \"Leo stands at the entrance of a whimsical, multi-part school building made of stacked cottages with mossy roofs and flower decorations. A friendly female teacher (Professor Elara) with a mushroom-shaped hat smiles warmly at him. Other diverse children are visible nearby, looking curious. The scene is set in a magical forest clearing. Use distinct paper layers for the school, characters, and foliage.\",\n        \"keywords\": [\"boy\", \"magic school\", \"whimsical architecture\", \"friendly teacher\", \"mushroom hat\", \"children\", \"welcoming\", \"forest clearing\", \"layered paper cut style\", \"gentle magic\"]\n      }\n    },\n    {\n      \"chapterNumber\": 3,\n      \"chapterTitle\": \"Learning to Listen to Leaves\",\n      \"storyText\": \"Professor Elara led them to a sunny garden filled with amazing plants. 'Today,' she said, 'we'll learn that colors have feelings, and plants whisper secrets if you listen closely!' She showed them how to gently touch a leaf and think of a color. Leo chose bright yellow, like sunshine. He touched a small green sprout, closed his eyes, and thought 'Yellow! Happy yellow!' Slowly, slowly, tiny golden sparkles appeared on the leaf! **Educational Point:** Professor Elara explained how different colors can make us feel different things – yellow for happy, blue for calm, red for excited.\",\n      \"imagePrompt\": {\n        \"style\": \"Paper cut illustration\",\n        \"description\": \"Leo and a few other children are gathered around Professor Elara in a magical garden. Leo is gently touching a leaf on a small potted plant. Tiny golden sparkles are faintly appearing on the leaf. Professor Elara points towards the leaf, explaining. The garden is full of unusual, colorful plants. Use layered paper for flowers, leaves, and sparkles.\",\n        \"keywords\": [\"children\", \"teacher\", \"magical garden\", \"learning magic\", \"touching leaf\", \"sparkles\", \"colors\", \"plants\", \"concentration\", \"layered paper cut style\", \"educational moment\"]\n      }\n    },\n    {\n      \"chapterNumber\": 4,\n      \"chapterTitle\": \"The Wobbly Water Trick\",\n      \"storyText\": \"Next, they learned a simple spell to water the plants without a watering can. Professor Elara showed them how to cup their hands and whisper 'Aqua Flow.' A gentle stream of water flowed from her hands. Leo tried. He whispered, 'Aqua Flow!' but the water wobbled, sprayed sideways, and made a little puddle! Leo felt a bit silly. 'Oops!' he giggled. Professor Elara smiled kindly. 'That happens! Magic takes practice. Try focusing on a thirsty flower.' Leo took a deep breath, looked right at a droopy daisy, and whispered again. This time, a small, steady stream went right to the flower! **Educational Point:** Trying again, even if you wobble, is how you learn!\",\n      \"imagePrompt\": {\n        \"style\": \"Paper cut illustration\",\n        \"description\": \"Leo stands with his hands cupped, a wobbly stream of water spraying slightly sideways, missing a potted flower and creating a small puddle on the ground. He has a slightly surprised/giggling expression. Professor Elara is nearby, smiling encouragingly. Focus on the playful mishap and the water effect using paper cut layers.\",\n        \"keywords\": [\"boy\", \"magic spell\", \"water magic\", \"wobbly\", \"mishap\", \"practice\", \"giggling\", \"teacher encouraging\", \"garden setting\", \"layered paper cut style\", \"learning process\"]\n      }\n    },\n    {\n      \"chapterNumber\": 5,\n      \"chapterTitle\": \"A Seed of Magic\",\n      \"storyText\": \"The magical school day flew by! Leo learned about sparkling stones and breezes that could sing. He even made friends with a girl named Willow who could make flowers bloom instantly. As it was time to go home, Professor Elara gave each student a tiny, smooth seed. 'Plant this at home,' she said. 'Care for it, practice what you learned, and watch the magic grow.' Leo held his seed carefully. It felt warm and full of promise. He couldn't wait to come back to Whispering Woods Academy tomorrow! **Educational Point:** Taking care of something small, like a seed or a new skill, helps it grow strong.\",\n      \"imagePrompt\": {\n        \"style\": \"Paper cut illustration\",\n        \"description\": \"Leo stands smiling, holding a small, subtly glowing seed in his open palm. He is looking at the seed with a happy and hopeful expression. In the background, the whimsical Whispering Woods Academy is visible as he walks away on the shimmering path. The lighting suggests late afternoon. Use layered paper to give the seed a special texture.\",\n        \"keywords\": [\"boy\", \"smiling\", \"holding magic seed\", \"hopeful\", \"magic school background\", \"shimmering path\", \"end of day\", \"layered paper cut style\", \"warm light\", \"promise\"]\n      }\n    }\n  ]\n}\n```"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "create kids story on description for 5-8 Years kids, Educational story, and all images in\nPaper cut style: story of boy and Magic School, give me 5 chapter, With detailed image\ntext prompt for each of chapter and image prompt for story cover book with story name\nalt in JSON field format"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n{\n  \"storyTitle\": \"Milo's Magical Mishaps at Willowbrook Academy\",\n  \"storyCoverPrompt\": {\n    \"alt\": \"A paper-cut illustration of a boy, Milo, with bright, curious eyes, wearing a slightly oversized wizard's robe, stands in front of a whimsical, multi-level school building built into a large, old willow tree.  The tree's branches are intertwined with glowing vines and magical creatures.  The overall style is cheerful and vibrant, with layered paper cut textures.\",\n    \"keywords\": [\"boy, Milo, wizard's robe, magical school, willow tree, glowing vines, whimsical, creatures, layered paper cut, bright colors, children's book cover\"]\n  },\n  \"chapters\": [\n    {\n      \"chapterNumber\": 1,\n      \"chapterTitle\": \"The Whispering Willow\",\n      \"storyText\": \"Milo loved exploring the woods behind his house. One day, he stumbled upon a giant willow tree, its branches drooping low to the ground.  As he touched a branch, it whispered, \\\"Welcome, Milo! Willowbrook Academy awaits!\\\"  Milo gasped. A magical school? Hidden inside a tree?\",\n      \"imagePrompt\": {\n        \"alt\": \"A paper-cut illustration of Milo, a boy with curious eyes, standing beneath a giant willow tree whose branches whisper.  The tree's trunk is partially hidden behind layered paper cut leaves, hinting at a magical interior. The overall style is whimsical and slightly mysterious, with warm, inviting colors.\",\n        \"keywords\": [\"Milo, boy, willow tree, whispering, magical, mysterious, discovery, layered paper cut, warm colors, curious\"]\n      }\n    },\n    {\n      \"chapterNumber\": 2,\n      \"chapterTitle\": \"The Floating Feather\",\n      \"storyText\": \"Inside the tree, Milo found a classroom filled with giggling children and a kind teacher, Ms. Willow.  Their first lesson?  Levitation!  Ms. Willow showed them how to focus their thoughts to lift a feather.  Milo concentrated hard, picturing the feather rising.  Slowly, it floated! Educational Point: Focus and concentration are key to achieving your goals.\",\n      \"imagePrompt\": {\n        \"alt\": \"A paper-cut illustration of Milo and other children in a classroom inside the willow tree.  Ms. Willow, a kind-looking teacher, guides them.  A feather floats gently in the air above Milo's focused face.  The room is decorated with whimsical details and layered paper cut leaves, creating depth.\",\n        \"keywords\": [\"Milo, children, teacher, Ms. Willow, classroom, willow tree interior, floating feather, concentration, focus, layered paper cut, bright colors\"]\n      }\n    },\n    {\n      \"chapterNumber\": 3,\n      \"chapterTitle\": \"Rainbow Bubbles\",\n      \"storyText\": \"Next, they learned about color magic!  Milo tried to make rainbow bubbles, but his first attempts were only wobbly, clear bubbles.  He didn't give up!  He focused on the colors he wanted, and slowly, his bubbles shimmered with every color of the rainbow! Educational Point: Persistence and practice lead to success.\",\n      \"imagePrompt\": {\n        \"alt\": \"A paper-cut illustration of Milo blowing bubbles.  His early bubbles are clear and wobbly, while his later bubbles are filled with vibrant rainbow colors.  The background is a whimsical classroom inside the willow tree, showcasing layered paper-cut designs of rainbow hues.\",\n        \"keywords\": [\"Milo, bubbles, rainbow, color magic, persistence, practice, layered paper cut, bright colors, whimsical, success\"]\n      }\n    },\n    {\n      \"chapterNumber\": 4,\n      \"chapterTitle\": \"The Giggle-inducing Glowing Gourds\",\n      \"storyText\": \"For their final lesson, they had to make glowing gourds giggle.  Milo teamed up with Lily, a girl who was shy at first.  Together, they combined their magic, and their gourd giggled so hard, it rolled around the classroom! Educational Point: Teamwork makes the dream work!\",\n      \"imagePrompt\": {\n        \"alt\": \"A paper-cut illustration of Milo and Lily, a shy-looking girl, working together to make a glowing gourd giggle inside the willow tree classroom.  The gourd is brightly lit, and its features hint at amusement. The background features layered paper cut designs of leaves and other whimsical elements.\",\n        \"keywords\": [\"Milo, Lily, teamwork, glowing gourd, giggling, laughter, friendship, layered paper cut, whimsical, collaboration\"]\n      }\n    },\n    {\n      \"chapterNumber\": 5,\n      \"chapterTitle\": \"A Magical Memory\",\n      \"storyText\": \"As the day ended, Ms. Willow gave each student a small, glowing acorn.  Milo planted his acorn in his garden, remembering his magical day.  He knew he would return to Willowbrook Academy soon, ready for more magical adventures! Educational Point: Cherishing memories and learning from experiences.\",\n      \"imagePrompt\": {\n        \"alt\": \"A paper-cut illustration of Milo holding a small glowing acorn, smiling happily, as he stands in his garden.  In the background, a faint image of the willow tree school is visible. The overall style is peaceful and heartwarming, with soft lighting and layered paper cut textures.\",\n        \"keywords\": [\"Milo, glowing acorn, happy, garden, magical memory, Willowbrook Academy, peaceful, heartwarming, layered paper cut, soft lighting\"]\n      }\n    }\n  ]\n}\n```\n"},
          ],
        },
      ],
    });
