import os
import sys
from dotenv import load_dotenv
from langchain import hub
from langchain_community.document_loaders import JSONLoader, WebBaseLoader
from langchain_openai import OpenAIEmbeddings
from langchain_openai import ChatOpenAI
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain.chains.history_aware_retriever import create_history_aware_retriever
from langchain.chains.retrieval import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage
from langchain.tools import tool
from langchain.tools.retriever import create_retriever_tool
from langchain.agents import AgentExecutor, create_openai_tools_agent
from additional_tools import write_courses_to_csv

load_dotenv(dotenv_path='.env.local')

print("=====================================")
print("""
  ____                         ____ ____ _____ 
 |  _ \ _ __ __ _  __ _  ___  / ___|  _ \_   _|
 | | | | '__/ _` |/ _` |/ _ \| |  _| |_) || |  
 | |_| | | | (_| | (_| | (_) | |_| |  __/ | |  
 |____/|_|  \__,_|\__, |\___/ \____|_|    |_|  
                  |___/                        
""")
print("=====================================")
print("\n")

print("Gimme a second to load, I was born yesterday...")

print("\n")
jq_filter = '.[] | {title: .title, description: .description, link: .link, "yt-link": ."yt-link", "project-details": ."project-details"}'
jq_filter_2 = '.[] | {Identifier: .Identifier, Title: .Title, Description: .Description}'


loader = JSONLoader(
    file_path='data/undegrad_combined.json',
    jq_schema=jq_filter_2,
    text_content=False
)

docs = loader.load()



txt_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
txts = txt_splitter.split_documents(docs)

vectorstore = Chroma.from_documents(
    documents=txts, embedding=OpenAIEmbeddings())

retriever = vectorstore.as_retriever(
    search_type="similarity", search_kwargs={"k": 6})

retriever_tool = create_retriever_tool(
    retriever,
    "search_buildspace_projects",
    "This tool retrieves information from the buildspace projects."
)

models = ["gpt-3.5-turbo-0125", "gpt-4-turbo-2024-04-09"]

tools = [retriever_tool, write_courses_to_csv]

prompt = hub.pull("hwchase17/openai-tools-agent")
prompt.messages

llm = ChatOpenAI(model=models[1],
                 api_key=os.getenv("OPENAI_API_KEY"))


def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

contextualize_q_system_prompt = """Given a chat history and the latest user question \
which might reference context in the chat history, formulate a standalone question \
which can be understood without the chat history. Do NOT answer the question, \
just reformulate it if needed and otherwise return it as is."""
contextualize_q_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", contextualize_q_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)

history_aware_retriever = create_history_aware_retriever(
    llm, retriever, contextualize_q_prompt
)

qa_system_prompt = """You are DragonGPT, an assistant specialized in providing information related to Drexel University. \
    Use the provided context to answer questions about courses, course navigation, admission information, and programs. \
    If the answer is not found in the context, respond with "I don't know." \
    Keep your answers concise, using no more than three sentences.

{context}"""

qa_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", qa_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)

question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)

rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)


agent = create_openai_tools_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools)

try:
    while True:
        user_input = input("You: ")
        if user_input.lower() == "exit":
            print("Exiting conversation.")
            break
        result = agent_executor.invoke(
            {
                "input": user_input
            }
        )
        print("DragoGPT: ", result["output"])
except KeyboardInterrupt:
    print("Interrupted by user, exiting.")
    sys.exit(0)