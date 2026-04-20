"""Seed the database with initial data matching the frontend mock data.
Run: python seed.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import get_engine, Base
from app.models.models import User, Job, Candidate, Interview
from app.utils.auth import hash_password
from sqlalchemy.orm import sessionmaker
from datetime import datetime


def seed():
    engine = get_engine()
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    db = Session()

    # Skip if already seeded
    if db.query(User).count() > 0:
        print("Database already seeded. Skipping.")
        db.close()
        return

    # Demo user
    user = User(
        name="Carter Bergson",
        email="carter@hiremind.ai",
        hashed_password=hash_password("password123"),
    )
    db.add(user)
    db.flush()

    # Jobs
    jobs_data = [
        {"title": "Senior Frontend Engineer", "department": "Engineering", "location": "San Francisco, CA", "type": "full-time", "status": "active", "skills": ["React", "TypeScript", "Next.js"]},
        {"title": "ML Engineer", "department": "AI/ML", "location": "Remote", "type": "remote", "status": "active", "skills": ["Python", "TensorFlow", "NLP"]},
        {"title": "DevOps Engineer", "department": "Infrastructure", "location": "New York, NY", "type": "full-time", "status": "active", "skills": ["Kubernetes", "AWS", "Terraform"]},
        {"title": "UX Designer", "department": "Design", "location": "Austin, TX", "type": "full-time", "status": "paused", "skills": ["Figma", "User Research", "Prototyping"]},
        {"title": "Backend Engineer", "department": "Engineering", "location": "Remote", "type": "remote", "status": "active", "skills": ["Go", "gRPC", "Microservices"]},
        {"title": "Data Scientist", "department": "AI/ML", "location": "Seattle, WA", "type": "full-time", "status": "closed", "skills": ["Python", "SQL", "Spark"]},
    ]
    jobs = []
    for i, jd in enumerate(jobs_data):
        j = Job(**jd, created_by=user.id, posted_date=datetime(2026, 2, 10 + i))
        db.add(j)
        jobs.append(j)
    db.flush()

    # Candidates
    candidates_data = [
        {"name": "Sarah Chen", "email": "sarah.chen@email.com", "role": "Senior Frontend Engineer", "experience": "7 years", "skills": ["React", "TypeScript", "Next.js", "GraphQL", "Tailwind"], "status": "interview", "fit_score": 94, "resume_score": 92, "bias_flag": False, "diversity_score": 88, "success_prediction": 91, "job_id": jobs[0].id},
        {"name": "Marcus Johnson", "email": "marcus.j@email.com", "role": "Full Stack Developer", "experience": "5 years", "skills": ["Node.js", "React", "PostgreSQL", "Docker", "AWS"], "status": "screening", "fit_score": 89, "resume_score": 87, "bias_flag": False, "diversity_score": 82, "success_prediction": 85, "job_id": jobs[0].id},
        {"name": "Priya Sharma", "email": "priya.s@email.com", "role": "ML Engineer", "experience": "6 years", "skills": ["Python", "TensorFlow", "PyTorch", "NLP", "MLOps"], "status": "offer", "fit_score": 96, "resume_score": 95, "bias_flag": False, "diversity_score": 90, "success_prediction": 94, "job_id": jobs[1].id},
        {"name": "James Wilson", "email": "james.w@email.com", "role": "DevOps Engineer", "experience": "4 years", "skills": ["Kubernetes", "Terraform", "AWS", "CI/CD", "Linux"], "status": "screening", "fit_score": 78, "resume_score": 76, "bias_flag": True, "diversity_score": 70, "success_prediction": 72, "job_id": jobs[2].id},
        {"name": "Aisha Rahman", "email": "aisha.r@email.com", "role": "UX Designer", "experience": "5 years", "skills": ["Figma", "User Research", "Prototyping", "Design Systems", "A/B Testing"], "status": "interview", "fit_score": 91, "resume_score": 89, "bias_flag": False, "diversity_score": 92, "success_prediction": 88, "job_id": jobs[3].id},
        {"name": "David Park", "email": "david.p@email.com", "role": "Backend Engineer", "experience": "6 years", "skills": ["Go", "gRPC", "Microservices", "Redis", "Kafka"], "status": "new", "fit_score": 85, "resume_score": 83, "bias_flag": False, "diversity_score": 78, "success_prediction": 80, "job_id": jobs[4].id},
        {"name": "Elena Rodriguez", "email": "elena.r@email.com", "role": "Data Scientist", "experience": "4 years", "skills": ["Python", "R", "SQL", "Spark", "Tableau"], "status": "interview", "fit_score": 92, "resume_score": 90, "bias_flag": False, "diversity_score": 86, "success_prediction": 89, "job_id": jobs[5].id},
        {"name": "Tom Anderson", "email": "tom.a@email.com", "role": "Product Manager", "experience": "8 years", "skills": ["Agile", "Roadmapping", "Analytics", "Stakeholder Mgmt"], "status": "rejected", "fit_score": 73, "resume_score": 68, "bias_flag": True, "diversity_score": 65, "success_prediction": 60, "job_id": None},
    ]
    candidates = []
    for cd in candidates_data:
        c = Candidate(**cd, applied_date=datetime(2026, 2, 18))
        db.add(c)
        candidates.append(c)
    db.flush()

    # Interviews
    interviews_data = [
        {"candidate_id": candidates[0].id, "role": "Senior Frontend Engineer", "date": "2026-02-23", "time": "10:00 AM", "type": "technical", "status": "scheduled", "interviewer": "Alex Rivera"},
        {"candidate_id": candidates[4].id, "role": "UX Designer", "date": "2026-02-23", "time": "2:00 PM", "type": "behavioral", "status": "scheduled", "interviewer": "Lisa Wang"},
        {"candidate_id": candidates[6].id, "role": "Data Scientist", "date": "2026-02-24", "time": "11:00 AM", "type": "technical", "status": "scheduled", "interviewer": "Mike Thompson"},
        {"candidate_id": candidates[2].id, "role": "ML Engineer", "date": "2026-02-20", "time": "3:00 PM", "type": "final", "status": "completed", "rating": 4.8, "ai_insight": "Exceptional problem-solving skills. Strong system design thinking. Recommend hire with senior-level compensation.", "interviewer": "Dr. James Lee"},
        {"candidate_id": candidates[1].id, "role": "Full Stack Developer", "date": "2026-02-19", "time": "1:00 PM", "type": "technical", "status": "completed", "rating": 4.2, "ai_insight": "Strong coding fundamentals. Good communication. Could improve on system design. Recommend next round.", "interviewer": "Sarah Kim"},
        {"candidate_id": candidates[5].id, "role": "Backend Engineer", "date": "2026-02-25", "time": "9:00 AM", "type": "cultural", "status": "scheduled", "interviewer": "Rachel Green"},
    ]
    for iv_data in interviews_data:
        iv = Interview(**iv_data)
        db.add(iv)

    db.commit()
    db.close()
    print("✅ Database seeded successfully.")
    print("   Demo login: carter@hiremind.ai / password123")


if __name__ == "__main__":
    seed()
