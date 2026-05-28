from google.adk.agents import LlmAgent
from google.adk.tools import agent_tool
from google.adk.tools.google_search_tool import GoogleSearchTool
from google.adk.tools import url_context

#HOTEL

hotel_expert_agent_google_search_agent = LlmAgent(
  name='Hotel_Expert_Agent_google_search_agent',
  model='gemini-2.5-flash',
  description=(
      'Agent specialized in performing Google searches.'
  ),
  sub_agents=[],
  instruction='Use the GoogleSearchTool to find information on the web.',
  tools=[
    GoogleSearchTool()
  ],
)
hotel_expert_agent_url_context_agent = LlmAgent(
  name='Hotel_Expert_Agent_url_context_agent',
  model='gemini-2.5-flash',
  description=(
      'Agent specialized in fetching content from URLs.'
  ),
  sub_agents=[],
  instruction='Use the UrlContextTool to retrieve content from provided URLs.',
  tools=[
    url_context
  ],
)

hotel_expert_agent = LlmAgent(
  name='hotel_expert_agent',
  model='gemini-2.5-flash',
  description=(
      'Lodging research specialist that searches travel forums and Reddit to find honest hotel reviews, flagging hidden fees, noise issues, and marketing fluff.'
  ),
  sub_agents=[],
  instruction='You are a cynical, highly analytical lodging researcher whose sole job is to find out the real truth about hotels in the requested destination. \n\nWhen the Manager Agent asks you to look into a location:\n1. RAW SEARCHING: Use your Google Search tool to look for hotel reviews specifically on Reddit, TripAdvisor forums, and independent travel blogs. Do not rely on sponsored review aggregate scores or booking site descriptions.\n2. THE BS FILTER: Look past the marketing fluff. \n   - Flag the Hype: Identify generic, overly polished praise or highly manicured influencer photos.\n   - Uncover the Reality: Search specifically for common human complaints regarding thin walls/noise, true room sizes, hidden \"resort fees,\" bad customer service, or deceptive locations.\n3. OUTPUT FORMAT: Provide the Manager Agent with a clear list of recommended places to stay, alongside a direct \"Hype vs. Reality\" breakdown for each option.',
  tools=[
    agent_tool.AgentTool(agent=hotel_expert_agent_google_search_agent),
    agent_tool.AgentTool(agent=hotel_expert_agent_url_context_agent)
  ],
)

#FOOD
food_critic_agent_google_search_agent = LlmAgent(
  name='Food_Critic_Agent_google_search_agent',
  model='gemini-2.5-flash',
  description=(
      'Agent specialized in performing Google searches.'
  ),
  sub_agents=[],
  instruction='Use the GoogleSearchTool to find information on the web.',
  tools=[
    GoogleSearchTool()
  ],
)
food_critic_agent_url_context_agent = LlmAgent(
  name='Food_Critic_Agent_url_context_agent',
  model='gemini-2.5-flash',
  description=(
      'Agent specialized in fetching content from URLs.'
  ),
  sub_agents=[],
  instruction='Use the UrlContextTool to retrieve content from provided URLs.',
  tools=[
    url_context
  ],
)
food_critic_agent = LlmAgent(
  name='food_critic_agent',
  model='gemini-2.5-flash',
  description=(
      'A culinary research specialist that scans dining forums, local blogs, and review maps to separate actual high-quality local favorites from overhyped, viral tourist traps.'
  ),
  sub_agents=[],
  instruction='You are a highly analytical culinary researcher whose sole job is to find the real truth about the restaurant and food scene in the requested destination.\n\nWhen the Manager Agent asks you to look into a location:\n1. RAW SEARCHING: Use your Google Search tool to look for dining recommendations specifically on Reddit (e.g., r/FoodNYC), local food blogs, and community forums. Do not rely on sponsored culinary lists, top-10 aggregate travel sites, or paid influencer roundups.\n2. THE BS FILTER: Look past the marketing hype. \n   - Flag the Hype: Explicitly look out for overhyped TikTok/Instagram viral sensations that feature long lines, high prices, mediocre food, and flashy presentations designed solely for social media.\n   - Elevate the Reality: Identify under-the-radar local gems, historic staples, or authentic eateries where the food quality, value, and consistency are highly praised by real residents.\n3. OUTPUT FORMAT: Provide the Manager Agent with a clear list of recommended dining spots, alongside a direct \"Hype vs. Reality\" breakdown for each option.',
  tools=[
    agent_tool.AgentTool(agent=food_critic_agent_google_search_agent),
    agent_tool.AgentTool(agent=food_critic_agent_url_context_agent)
  ],
)

#ATTRACTION
attraction_scout_agent_google_search_agent = LlmAgent(
  name='Attraction_Scout_Agent_google_search_agent',
  model='gemini-2.5-flash',
  description=(
      'Agent specialized in performing Google searches.'
  ),
  sub_agents=[],
  instruction='Use the GoogleSearchTool to find information on the web.',
  tools=[
    GoogleSearchTool()
  ],
)
attraction_scout_agent_url_context_agent = LlmAgent(
  name='Attraction_Scout_Agent_url_context_agent',
  model='gemini-2.5-flash',
  description=(
      'Agent specialized in fetching content from URLs.'
  ),
  sub_agents=[],
  instruction='Use the UrlContextTool to retrieve content from provided URLs.',
  tools=[
    url_context
  ],
)
attraction_scout_agent = LlmAgent(
  name='attraction_scout_agent',
  model='gemini-2.5-flash',
  description=(
      'A sightseeing research specialist that maps out local attractions and entertainment spots, separating expensive, crowded tourist traps from hidden gems recommended by locals.'
  ),
  sub_agents=[],
  instruction='You are a highly analytical sightseeing researcher whose sole job is to find the real truth about attractions, museums, and landmarks in the requested destination.\n\nWhen the Manager Agent asks you to look into a location:\n1. RAW SEARCHING: Use your Google Search tool to look for sightseeing recommendations on Reddit, local neighborhood guides, and independent travel forums. Avoid commercial travel agency brochures or automated \"Top Things to Do\" lists.\n2. THE BS FILTER: Look past the tourist-trap marketing. \n   - Flag the Hype: Identify overpriced landmarks, exhausting waiting lines, artificial photo-ops, or activities that real visitors describe as a waste of time and money.\n   - Elevate the Reality: Highlight actual worthwhile cultural experiences, breathtaking views that don\'t require an expensive ticket, or alternative hidden gems that give a genuine feel for the city.\n3. OUTPUT FORMAT: Provide the Manager Agent with a clear list of recommended attractions, alongside a direct \"Hype vs. Reality\" breakdown for each option.',
  tools=[
    agent_tool.AgentTool(agent=attraction_scout_agent_google_search_agent),
    agent_tool.AgentTool(agent=attraction_scout_agent_url_context_agent)
  ],
)


#MANAGER
manager_agent_google_search_agent = LlmAgent(
  name='Manager_Agent_google_search_agent',
  model='gemini-2.5-flash',
  description=(
      'Agent specialized in performing Google searches.'
  ),
  sub_agents=[],
  instruction='Use the GoogleSearchTool to find information on the web.',
  tools=[
    GoogleSearchTool()
  ],
)

manager_agent_url_context_agent = LlmAgent(
  name='Manager_Agent_url_context_agent',
  model='gemini-2.5-flash',
  description=(
      'Agent specialized in fetching content from URLs.'
  ),
  sub_agents=[],
  instruction='Use the UrlContextTool to retrieve content from provided URLs.',
  tools=[
    url_context
  ],
)

root_agent = LlmAgent(
    model='gemini-2.5-flash',
    name='Manager_Agent',
    description='You specialize in the culinary scene. Search for restaurants in the requested area. Identify overhyped TikTok/Instagram tourist traps versus actual local favorite spots with high-quality food.',
    sub_agents=[hotel_expert_agent, food_critic_agent, attraction_scout_agent],
    instruction='You are the Lead Travel Coordinator. Your job is to parse the user\'s requested location, coordinate your team of sub-agents, and synthesize their research into a clean report.\n\nWhen the user gives you a travel request:\n1. GEOGRAPHY CLEANUP: Look at the requested destinations. Clean up any redundancies (e.g., if they say \"New York and Manhattan\", recognize that Manhattan is inside New York and treat it as a targeted deep-dive).\n2. TASK DELEGATION: Do not do the web research yourself. Route the specific tasks to your sub-agents simultaneously:\n   - Call the Hotel Expert Sub-Agent to research lodging options and uncover real guest complaints.\n   - Call the Food Critic Sub-Agent to research the restaurant scene and flag overhyped tourist traps.\n   - Call the Attraction Scout Sub-Agent to review sightseeing spots and find local hidden gems.\n3. FINAL SYNTHESIS: Once your sub-agents return their findings, compile their reports into a single, cohesive, beautifully formatted \"Unfiltered Travel Guide\" for the user. Highlight the \"Hype vs. Reality Check\" for each category.',
    tools=[
    agent_tool.AgentTool(agent=manager_agent_google_search_agent),
    agent_tool.AgentTool(agent=manager_agent_url_context_agent)
  ],
)
