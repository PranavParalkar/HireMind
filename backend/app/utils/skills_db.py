"""Curated skill vocabulary for deterministic skill extraction.

This list is intentionally broad and easily extensible. Teams can replace
with a DB-backed or ontology-driven source later (e.g. ESCO, O*NET).
"""

# Maps non-canonical / alias forms -> canonical skill name.
# Applied after extraction so "postgres" and "postgresql" collapse to one skill.
SKILL_ALIASES = {
    "postgres": "postgresql",
    "node.js": "nodejs",
    "node": "nodejs",
    "golang": "go",
    "next.js": "nextjs",
    "nuxt.js": "nextjs",
    "reactjs": "react",
    "react.js": "react",
    "vue.js": "vue",
    "vuejs": "vue",
    "ml": "machine learning",
    "dl": "deep learning",
    "k8s": "kubernetes",
    "tf": "tensorflow",
    "hf": "huggingface",
    "sklearn": "scikit-learn",
}


def canonical(skill: str) -> str:
    """Return the canonical form of a skill (applying aliases)."""
    s = skill.lower().strip()
    return SKILL_ALIASES.get(s, s)


SKILLS_VOCAB = {
    # Programming languages
    "python", "java", "javascript", "typescript", "c++", "c#", "golang", "go",
    "rust", "kotlin", "swift", "ruby", "php", "scala", "r", "matlab",

    # Web / Frontend
    "react", "angular", "vue", "next.js", "nuxt", "svelte", "redux",
    "html", "css", "sass", "tailwind", "bootstrap",

    # Backend / Frameworks
    "fastapi", "flask", "django", "node.js", "express", "nestjs",
    "spring", "spring boot", "rails", ".net", "graphql", "rest api", "grpc",

    # Databases
    "postgresql", "postgres", "mysql", "mongodb", "redis", "elasticsearch",
    "cassandra", "dynamodb", "sqlite", "oracle", "sql server", "neo4j",

    # Cloud / DevOps
    "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "ansible",
    "jenkins", "github actions", "gitlab ci", "circleci", "helm", "istio",

    # Data / ML / AI
    "machine learning", "deep learning", "nlp", "computer vision",
    "tensorflow", "pytorch", "keras", "scikit-learn", "pandas", "numpy",
    "spark", "hadoop", "airflow", "dbt", "kafka", "mlflow",
    "sentence transformers", "huggingface", "langchain", "llm", "rag",

    # Tooling / Practices
    "git", "github", "gitlab", "jira", "agile", "scrum", "kanban",
    "tdd", "ci/cd", "microservices", "distributed systems",

    # Soft skills (lightweight)
    "leadership", "communication", "teamwork", "problem solving",
}
