from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

def generate_seo_blog_pack(topic, target_audience, city=""):
    
    prompt = f"""
    Create a complete SEO Blog Pack.

    Topic: {topic}
    Target Audience: {target_audience}
    Location: {city}

    Include:

    1. Keyword Research
       - Primary Keyword
       - Secondary Keywords
       - Long-tail Keywords

    2. SEO Blog Outline
       - H1
       - H2
       - H3

    3. Long-form SEO Blog (1500+ words)

    4. SEO Metadata
       - SEO Title
       - Meta Description
       - URL Slug

    5. Internal Linking Ideas

    6. FAQ Section

    7. Strong Call To Action

    Make it SEO optimized, human-friendly, and business-focused.
    """

    response = client.chat.completions.create(
        model="gpt-5",
        messages=[
            {
                "role": "system",
                "content": "You are an expert SEO content strategist."
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.choices[0].message.content


def save_blog(content, filename):
    with open(filename, "w", encoding="utf-8") as file:
        file.write(content)


if __name__ == "__main__":

    topic = input("Enter Blog Topic: ")
    audience = input("Enter Target Audience: ")
    city = input("Enter City (Optional): ")

    blog_pack = generate_seo_blog_pack(
        topic,
        audience,
        city
    )

    print("\nGenerating SEO Blog Pack...\n")
    print(blog_pack)

    save_blog(blog_pack, "seo_blog_pack.txt")

    print("\nSaved as seo_blog_pack.txt")