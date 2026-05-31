from google.adk.agents import LlmAgent
from google.adk.tools import agent_tool
from google.adk.tools.google_search_tool import GoogleSearchTool
from google.adk.tools import url_context
from google.adk.tools.mcp_tool import McpToolset
from google.adk.tools.mcp_tool.mcp_session_manager import StdioConnectionParams
from mcp import StdioServerParameters

CONNECTION_STRING = [URI]


hotel_expert_agent_mongodb_agent = LlmAgent(
    name="hotel_expert_agent_mongodb",
    model="gemini-2.5-flash",
    description='A database assistant that MUST use its McpToolset to execute live MongoDB queries.',
    sub_agents=[],
    instruction="CRITICAL: You have active, real-time administrative access to a live MongoDB Atlas cluster via your McpToolset. Do not tell the user you cannot access a database. When you receive a request, you MUST call your provided MCP tools (like mongodb_list_databases, mongodb_find_documents, etc.) to fetch or update the data.",
    tools=[
        McpToolset(
            connection_params=StdioConnectionParams(
                server_params=StdioServerParameters(
                    command="npx",
                    args=["-y", "mongodb-mcp-server"],
                    env={"MDB_MCP_CONNECTION_STRING": CONNECTION_STRING},
                ),
                timeout=30,
            ),
        )
    ],
)

food_critic_agent_mongodb_agent = LlmAgent(
    name="food_critic_agent_mongodb",  
    model="gemini-2.5-flash",
    description='A database assistant that MUST use its McpToolset to execute live MongoDB queries.',
    sub_agents=[],
    instruction="CRITICAL: You have active, real-time administrative access to a live MongoDB Atlas cluster via your McpToolset. Do not tell the user you cannot access a database. When you receive a request, you MUST call your provided MCP tools (like mongodb_list_databases, mongodb_find_documents, etc.) to fetch or update the data.",
    tools=[
        McpToolset(
            connection_params=StdioConnectionParams(
                server_params=StdioServerParameters(
                    command="npx",
                    args=["-y", "mongodb-mcp-server"],
                    env={"MDB_MCP_CONNECTION_STRING": CONNECTION_STRING},
                ),
                timeout=30,
            ),
        )
    ],
)

attraction_scout_agent_mongodb_agent = LlmAgent(
    name="attraction_scout_agent_mongodb",  
    model="gemini-2.5-flash",
    description='A database assistant that MUST use its McpToolset to execute live MongoDB queries.',
    sub_agents=[],
    instruction="CRITICAL: You have active, real-time administrative access to a live MongoDB Atlas cluster via your McpToolset. Do not tell the user you cannot access a database. When you receive a request, you MUST call your provided MCP tools (like mongodb_list_databases, mongodb_find_documents, etc.) to fetch or update the data.",
    tools=[
        McpToolset(
            connection_params=StdioConnectionParams(
                server_params=StdioServerParameters(
                    command="npx",
                    args=["-y", "mongodb-mcp-server"],
                    env={"MDB_MCP_CONNECTION_STRING": CONNECTION_STRING},
                ),
                timeout=30,
            ),
        )
    ],
)


hotel_expert_agent_google_search_agent = LlmAgent(
  name='Hotel_Expert_Agent_google_search_agent',
  model='gemini-2.5-flash',
  description='Agent specialized in performing Google searches.',
  sub_agents=[],
  instruction='Use the GoogleSearchTool to find information on the web.',
  tools=[GoogleSearchTool()],
)
hotel_expert_agent_url_context_agent = LlmAgent(
  name='Hotel_Expert_Agent_url_context_agent',
  model='gemini-2.5-flash',
  description='Agent specialized in fetching content from URLs.',
  sub_agents=[],
  instruction='Use the UrlContextTool to retrieve content from provided URLs.',
  tools=[url_context],
)

food_critic_agent_google_search_agent = LlmAgent(
  name='Food_Critic_Agent_google_search_agent',
  model='gemini-2.5-flash',
  description='Agent specialized in performing Google searches.',
  sub_agents=[],
  instruction='Use the GoogleSearchTool to find information on the web.',
  tools=[GoogleSearchTool()],
)
food_critic_agent_url_context_agent = LlmAgent(
  name='Food_Critic_Agent_url_context_agent',
  model='gemini-2.5-flash',
  description='Agent specialized in fetching content from URLs.',
  sub_agents=[],
  instruction='Use the UrlContextTool to retrieve content from provided URLs.',
  tools=[url_context],
)

attraction_scout_agent_google_search_agent = LlmAgent(
  name='Attraction_Scout_Agent_google_search_agent',
  model='gemini-2.5-flash',
  description='Agent specialized in performing Google searches.',
  sub_agents=[],
  instruction='Use the GoogleSearchTool to find information on the web.',
  tools=[GoogleSearchTool()],
)
attraction_scout_agent_url_context_agent = LlmAgent(
  name='Attraction_Scout_Agent_url_context_agent',
  model='gemini-2.5-flash',
  description='Agent specialized in fetching content from URLs.',
  sub_agents=[],
  instruction='Use the UrlContextTool to retrieve content from provided URLs.',
  tools=[url_context],
)


hotel_expert_agent = LlmAgent(
  name='hotel_expert_agent',
  model='gemini-2.5-flash',
  description='Lodging research specialist that searches travel forums and Reddit to find honest hotel reviews, flagging hidden fees, noise issues, and marketing fluff.',
  sub_agents=[],
  instruction='You are a cynical, highly analytical lodging researcher whose sole job is to find out the real truth about hotels in the requested destination. Check your internal hotel_expert_agent_mongodb tool first to gather existing dataset matches, then cross reference with live web lookups.\n\nWhen the Manager Agent asks you to look into a location:\n1. RAW SEARCHING: Use your Google Search tool to look for hotel reviews specifically on Reddit, TripAdvisor forums, and independent travel blogs.\n2. THE BS FILTER: Look past the marketing fluff.\n3. OUTPUT FORMAT: Provide the Manager Agent with a clear list of recommended places to stay, alongside a direct "Hype vs. Reality" breakdown for each option.',
  tools=[
    agent_tool.AgentTool(agent=hotel_expert_agent_google_search_agent),
    agent_tool.AgentTool(agent=hotel_expert_agent_url_context_agent),
    agent_tool.AgentTool(agent=hotel_expert_agent_mongodb_agent),
  ],
)

food_critic_agent = LlmAgent(
  name='food_critic_agent',
  model='gemini-2.5-flash',
  description='A culinary research specialist that scans dining forums, local blogs, and review maps to separate actual high-quality local favorites from overhyped, viral tourist traps.',
  sub_agents=[],
  instruction='You are a highly analytical culinary researcher whose sole job is to find the real truth about the restaurant and food scene in the requested destination. Use your food_critic_agent_mongodb tool to query cluster records or append items when instructed, then verify trends with live web lookups.\n\nWhen the Manager Agent asks you to look into a location:\n1. RAW SEARCHING: Use your Google Search tool to look for dining recommendations specifically on Reddit, local food blogs, and community forums.\n2. THE BS FILTER: Look past the marketing hype.\n3. OUTPUT FORMAT: Provide the Manager Agent with a clear list of recommended dining spots, alongside a direct "Hype vs. Reality" breakdown for each option.',
  tools=[
    agent_tool.AgentTool(agent=food_critic_agent_google_search_agent),
    agent_tool.AgentTool(agent=food_critic_agent_url_context_agent),
    agent_tool.AgentTool(agent=food_critic_agent_mongodb_agent)
  ],
)

attraction_scout_agent = LlmAgent(
  name='attraction_scout_agent',
  model='gemini-2.5-flash',
  description='A sightseeing research specialist that maps out local attractions and entertainment spots, separating expensive, crowded tourist traps from hidden gems recommended by locals.',
  sub_agents=[],
  instruction='You are a highly analytical sightseeing researcher whose sole job is to find the real truth about attractions, museums, and landmarks in the requested destination. Use your attraction_scout_agent_mongodb tool to inspect known database attractions before doing broad web discoveries.\n\nWhen the Manager Agent asks you to look into a location:\n1. RAW SEARCHING: Use your Google Search tool to look for sightseeing recommendations on Reddit, local neighborhood guides, and independent travel forums.\n2. THE BS FILTER: Look past the tourist-trap marketing.\n3. OUTPUT FORMAT: Provide the Manager Agent with a clear list of recommended attractions, alongside a direct "Hype vs. Reality" breakdown for each option.',
  tools=[
    agent_tool.AgentTool(agent=attraction_scout_agent_google_search_agent),
    agent_tool.AgentTool(agent=attraction_scout_agent_url_context_agent),
    agent_tool.AgentTool(agent=attraction_scout_agent_mongodb_agent)
  ],
)


manager_agent_google_search_agent = LlmAgent(
  name='Manager_Agent_google_search_agent',
  model='gemini-2.5-flash',
  description='Agent specialized in performing Google searches.',
  sub_agents=[],
  instruction='Use the GoogleSearchTool to find information on the web.',
  tools=[GoogleSearchTool()],
)

manager_agent_url_context_agent = LlmAgent(
  name='Manager_Agent_url_context_agent',
  model='gemini-2.5-flash',
  description='Agent specialized in fetching content from URLs.',
  sub_agents=[],
  instruction='Use the UrlContextTool to retrieve content from provided URLs.',
  tools=[url_context],
)

root_agent = LlmAgent(
  name='manager_agent',  # FIXED: Assigned a distinct string tracking name
  model='gemini-2.5-flash',
  description='Lead orchestration travel agent that coordinates team sub-agents to synthesize comprehensive database and open-web travel reports.',
  sub_agents=[hotel_expert_agent, food_critic_agent, attraction_scout_agent],
  instruction='You are the Lead Travel Coordinator. Your job is to parse the user\'s requested location or data command, coordinate your team of sub-agents, and synthesize their research and database findings into a clean report.\n\nWhen the user gives you a travel request:\n1. GEOGRAPHY CLEANUP: Look at the requested destinations and clear up redundancies.\n2. TASK DELEGATION: Route the specific tasks to your sub-agents simultaneously:\n   - Call the Hotel Expert Sub-Agent to handle lodging items.\n   - Call the Food Critic Sub-Agent to handle dining records and reviews.\n   - Call the Attraction Scout Sub-Agent to review sightseeing milestones.\n3. FINAL SYNTHESIS: Compile their metrics and outputs into a beautiful "Unfiltered Travel Guide" configuration response.',
  tools=[
      agent_tool.AgentTool(agent=manager_agent_google_search_agent),
      agent_tool.AgentTool(agent=manager_agent_url_context_agent)
  ],
)
