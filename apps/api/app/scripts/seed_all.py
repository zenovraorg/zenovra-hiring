"""Seed MongoDB with demo data for ALL collections in Zenovra Hiring Platform.

Extends the base seed data (orgs, depts, locations, users, jobs, candidates, applications)
with interviews, offers, notifications, feedback, and referrals.

Usage:
    python -m app.scripts.seed_all
    # or from the apps/api directory:
    python app/scripts/seed_all.py
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os

MONGODB_URL = os.environ.get("MONGODB_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("MONGODB_DB_NAME", "hiring")


async def seed():
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DB_NAME]

    # Only seed the new collections — do not drop existing ones.
    # If you want a full reset, run the base scripts/seed.py first.
    collections_to_seed = [
        "interviews", "offers", "notifications", "feedback", "referrals",
    ]
    for col in collections_to_seed:
        await db[col].drop()

    # ── Interviews ──────────────────────────────────────────────
    print("Seeding interviews...")
    interviews = [
        {
            "_id": "int1",
            "org_id": "org1",
            "title": "Technical Interview — Frontend",
            "candidate_id": "c1",
            "job_id": "j1",
            "interview_type": "technical",
            "scheduled_at": "2024-09-22T14:00:00Z",
            "duration_minutes": 60,
            "interviewer_ids": ["u2"],
            "location": "",
            "notes": "Focus on React performance and design systems experience.",
            "status": "scheduled",
            "created_by": "u1",
            "is_deleted": False,
            "created_at": "2024-09-15T10:00:00Z",
            "updated_at": "2024-09-15T10:00:00Z",
        },
        {
            "_id": "int2",
            "org_id": "org1",
            "title": "Onsite — System Design",
            "candidate_id": "c2",
            "job_id": "j3",
            "interview_type": "onsite",
            "scheduled_at": "2024-09-23T10:00:00Z",
            "duration_minutes": 90,
            "interviewer_ids": ["u4", "u2"],
            "location": "San Francisco HQ",
            "notes": "Distributed systems design round. Whiteboard session.",
            "status": "scheduled",
            "created_by": "u5",
            "is_deleted": False,
            "created_at": "2024-09-16T09:00:00Z",
            "updated_at": "2024-09-16T09:00:00Z",
        },
        {
            "_id": "int3",
            "org_id": "org1",
            "title": "Product Sense Interview",
            "candidate_id": "c4",
            "job_id": "j2",
            "interview_type": "behavioral",
            "scheduled_at": "2024-09-18T11:00:00Z",
            "duration_minutes": 45,
            "interviewer_ids": ["u3"],
            "location": "",
            "notes": "Assess product intuition and growth mindset.",
            "status": "completed",
            "created_by": "u1",
            "is_deleted": False,
            "created_at": "2024-09-14T08:00:00Z",
            "updated_at": "2024-09-18T12:00:00Z",
        },
        {
            "_id": "int4",
            "org_id": "org1",
            "title": "Phone Screen — Design Portfolio",
            "candidate_id": "c3",
            "job_id": "j4",
            "interview_type": "phone_screen",
            "scheduled_at": "2024-09-20T15:00:00Z",
            "duration_minutes": 30,
            "interviewer_ids": ["u3"],
            "location": "",
            "notes": "Review portfolio and discuss design process.",
            "status": "completed",
            "created_by": "u1",
            "is_deleted": False,
            "created_at": "2024-09-12T10:00:00Z",
            "updated_at": "2024-09-20T16:00:00Z",
        },
        {
            "_id": "int5",
            "org_id": "org1",
            "title": "Culture Fit — Enterprise Sales",
            "candidate_id": "c6",
            "job_id": "j5",
            "interview_type": "culture_fit",
            "scheduled_at": "2024-09-12T13:00:00Z",
            "duration_minutes": 45,
            "interviewer_ids": ["u4", "u5"],
            "location": "New York Office",
            "notes": "Final round. Evaluate team fit and leadership qualities.",
            "status": "completed",
            "created_by": "u5",
            "is_deleted": False,
            "created_at": "2024-09-08T09:00:00Z",
            "updated_at": "2024-09-12T14:00:00Z",
        },
        {
            "_id": "int6",
            "org_id": "org1",
            "title": "Technical Screen — Frontend",
            "candidate_id": "c5",
            "job_id": "j1",
            "interview_type": "phone_screen",
            "scheduled_at": "2024-09-25T16:00:00Z",
            "duration_minutes": 45,
            "interviewer_ids": ["u2"],
            "location": "",
            "notes": "Initial technical assessment for frontend role.",
            "status": "scheduled",
            "created_by": "u1",
            "is_deleted": False,
            "created_at": "2024-09-18T11:00:00Z",
            "updated_at": "2024-09-18T11:00:00Z",
        },
    ]
    await db.interviews.insert_many(interviews)

    # ── Offers ──────────────────────────────────────────────────
    print("Seeding offers...")
    offers = [
        {
            "_id": "off1",
            "org_id": "org1",
            "candidate_id": "c6",
            "job_id": "j5",
            "base_salary": 160000,
            "bonus": 200000,
            "equity": "",
            "start_date": "2024-10-15",
            "expiry_date": "2024-09-30",
            "benefits": ["Health/Dental/Vision", "401k match", "Unlimited PTO", "Home office stipend"],
            "notes": "Competitive package for enterprise AE role. OTE $360K.",
            "status": "sent",
            "created_by": "u5",
            "is_deleted": False,
            "created_at": "2024-09-14T10:00:00Z",
            "updated_at": "2024-09-16T09:00:00Z",
        },
        {
            "_id": "off2",
            "org_id": "org1",
            "candidate_id": "c1",
            "job_id": "j1",
            "base_salary": 210000,
            "bonus": 20000,
            "equity": "0.08%",
            "start_date": "2024-11-01",
            "expiry_date": "2024-10-15",
            "benefits": ["Health/Dental/Vision", "401k match", "Unlimited PTO", "Learning budget"],
            "notes": "Senior frontend offer pending technical interview results.",
            "status": "draft",
            "created_by": "u1",
            "is_deleted": False,
            "created_at": "2024-09-17T14:00:00Z",
            "updated_at": "2024-09-17T14:00:00Z",
        },
        {
            "_id": "off3",
            "org_id": "org1",
            "candidate_id": "c4",
            "job_id": "j2",
            "base_salary": 190000,
            "bonus": 25000,
            "equity": "0.05%",
            "start_date": "2024-11-15",
            "expiry_date": "2024-10-20",
            "benefits": ["Health/Dental/Vision", "401k match", "Unlimited PTO", "Remote work stipend"],
            "notes": "Growth PM offer, pending final approval.",
            "status": "pending_approval",
            "created_by": "u1",
            "is_deleted": False,
            "created_at": "2024-09-19T10:00:00Z",
            "updated_at": "2024-09-19T10:00:00Z",
        },
    ]
    await db.offers.insert_many(offers)

    # ── Notifications ───────────────────────────────────────────
    print("Seeding notifications...")
    notifications = [
        {
            "_id": "notif1",
            "org_id": "org1",
            "user_id": "u1",
            "title": "New Application",
            "message": "Aisha Okafor applied for Senior Frontend Engineer",
            "type": "application",
            "link": "/candidates/c5",
            "is_read": False,
            "is_deleted": False,
            "created_at": "2024-09-18T10:00:00Z",
            "updated_at": "2024-09-18T10:00:00Z",
        },
        {
            "_id": "notif2",
            "org_id": "org1",
            "user_id": "u1",
            "title": "Interview Scheduled",
            "message": "Technical interview with Alex Rivera is scheduled for Sep 22",
            "type": "interview",
            "link": "/interviews",
            "is_read": False,
            "is_deleted": False,
            "created_at": "2024-09-17T15:00:00Z",
            "updated_at": "2024-09-17T15:00:00Z",
        },
        {
            "_id": "notif3",
            "org_id": "org1",
            "user_id": "u1",
            "title": "Offer Sent",
            "message": "Offer sent to David Park for Enterprise AE position",
            "type": "offer",
            "link": "/offers/off1",
            "is_read": True,
            "is_deleted": False,
            "created_at": "2024-09-16T09:00:00Z",
            "updated_at": "2024-09-16T09:30:00Z",
        },
        {
            "_id": "notif4",
            "org_id": "org1",
            "user_id": "u2",
            "title": "Feedback Requested",
            "message": "Please submit feedback for Alex Rivera's technical interview",
            "type": "interview",
            "link": "/feedback",
            "is_read": False,
            "is_deleted": False,
            "created_at": "2024-09-18T14:00:00Z",
            "updated_at": "2024-09-18T14:00:00Z",
        },
        {
            "_id": "notif5",
            "org_id": "org1",
            "user_id": "u3",
            "title": "Offer Pending Approval",
            "message": "Chen Wei's offer for Product Manager — Growth needs your approval",
            "type": "offer",
            "link": "/offers/off3",
            "is_read": False,
            "is_deleted": False,
            "created_at": "2024-09-19T10:30:00Z",
            "updated_at": "2024-09-19T10:30:00Z",
        },
        {
            "_id": "notif6",
            "org_id": "org1",
            "user_id": "u5",
            "title": "New Referral Submitted",
            "message": "Marcus Johnson referred Sam Torres for Staff Backend Engineer",
            "type": "info",
            "link": "/referrals",
            "is_read": False,
            "is_deleted": False,
            "created_at": "2024-09-17T11:00:00Z",
            "updated_at": "2024-09-17T11:00:00Z",
        },
        {
            "_id": "notif7",
            "org_id": "org1",
            "user_id": "u1",
            "title": "Candidate Moved Stage",
            "message": "Jordan Kim moved to Onsite stage for Staff Backend Engineer",
            "type": "success",
            "link": "/pipeline/j3",
            "is_read": True,
            "is_deleted": False,
            "created_at": "2024-09-14T16:00:00Z",
            "updated_at": "2024-09-14T16:30:00Z",
        },
    ]
    await db.notifications.insert_many(notifications)

    # ── Feedback / Scorecards ───────────────────────────────────
    print("Seeding feedback...")
    feedback = [
        {
            "_id": "fb1",
            "org_id": "org1",
            "candidate_id": "c4",
            "job_id": "j2",
            "interviewer_id": "u3",
            "interview_id": "int3",
            "overall_rating": 5,
            "recommendation": "strong_yes",
            "strengths": [
                "Exceptional product intuition",
                "Data-driven approach to growth",
                "Strong communication skills",
            ],
            "concerns": [],
            "notes": "Chen demonstrated outstanding product sense. Clear hire.",
            "created_by": "u3",
            "is_deleted": False,
            "created_at": "2024-09-18T12:30:00Z",
            "updated_at": "2024-09-18T12:30:00Z",
        },
        {
            "_id": "fb2",
            "org_id": "org1",
            "candidate_id": "c6",
            "job_id": "j5",
            "interviewer_id": "u4",
            "interview_id": "int5",
            "overall_rating": 4,
            "recommendation": "yes",
            "strengths": [
                "Strong enterprise sales track record",
                "Excellent relationship building",
                "Deep knowledge of consultative selling",
            ],
            "concerns": [
                "Limited experience in HR tech vertical",
            ],
            "notes": "David has the right skills and mindset. HR tech ramp-up expected but manageable.",
            "created_by": "u4",
            "is_deleted": False,
            "created_at": "2024-09-12T15:00:00Z",
            "updated_at": "2024-09-12T15:00:00Z",
        },
        {
            "_id": "fb3",
            "org_id": "org1",
            "candidate_id": "c6",
            "job_id": "j5",
            "interviewer_id": "u5",
            "interview_id": "int5",
            "overall_rating": 4,
            "recommendation": "yes",
            "strengths": [
                "Great cultural fit",
                "Team-first mentality",
                "Strong leadership presence",
            ],
            "concerns": [],
            "notes": "Would be a strong addition to the sales team.",
            "created_by": "u5",
            "is_deleted": False,
            "created_at": "2024-09-12T15:30:00Z",
            "updated_at": "2024-09-12T15:30:00Z",
        },
        {
            "_id": "fb4",
            "org_id": "org1",
            "candidate_id": "c3",
            "job_id": "j4",
            "interviewer_id": "u3",
            "interview_id": "int4",
            "overall_rating": 4,
            "recommendation": "yes",
            "strengths": [
                "Outstanding design portfolio",
                "Deep Figma expertise",
                "Strong design systems thinking",
            ],
            "concerns": [
                "Most experience is B2C, needs B2B SaaS ramp-up",
            ],
            "notes": "Maya's portfolio is impressive. Recommend moving to next round.",
            "created_by": "u3",
            "is_deleted": False,
            "created_at": "2024-09-20T17:00:00Z",
            "updated_at": "2024-09-20T17:00:00Z",
        },
        {
            "_id": "fb5",
            "org_id": "org1",
            "candidate_id": "c2",
            "job_id": "j3",
            "interviewer_id": "u4",
            "interview_id": "",
            "overall_rating": 5,
            "recommendation": "strong_yes",
            "strengths": [
                "Deep distributed systems expertise",
                "Proven track record at scale (Stripe)",
                "Excellent system design fundamentals",
            ],
            "concerns": [],
            "notes": "Jordan is exactly what we need for this role. Top candidate.",
            "created_by": "u4",
            "is_deleted": False,
            "created_at": "2024-09-16T14:00:00Z",
            "updated_at": "2024-09-16T14:00:00Z",
        },
    ]
    await db.feedback.insert_many(feedback)

    # ── Referrals ───────────────────────────────────────────────
    print("Seeding referrals...")
    referrals = [
        {
            "_id": "ref1",
            "org_id": "org1",
            "candidate_name": "Sam Torres",
            "candidate_email": "sam.torres@email.com",
            "job_id": "j3",
            "referrer_id": "u2",
            "relationship": "Former colleague at Google",
            "notes": "Worked together on infrastructure team. Strong distributed systems engineer.",
            "status": "reviewing",
            "created_by": "u2",
            "is_deleted": False,
            "created_at": "2024-09-17T10:00:00Z",
            "updated_at": "2024-09-17T14:00:00Z",
        },
        {
            "_id": "ref2",
            "org_id": "org1",
            "candidate_name": "Emily Zhang",
            "candidate_email": "emily.zhang@email.com",
            "job_id": "j1",
            "referrer_id": "u2",
            "relationship": "Met at React Conf 2024",
            "notes": "Impressive frontend developer. Currently at Airbnb, looking for new opportunities.",
            "status": "submitted",
            "created_by": "u2",
            "is_deleted": False,
            "created_at": "2024-09-19T09:00:00Z",
            "updated_at": "2024-09-19T09:00:00Z",
        },
        {
            "_id": "ref3",
            "org_id": "org1",
            "candidate_name": "Raj Mehta",
            "candidate_email": "raj.mehta@email.com",
            "job_id": "j2",
            "referrer_id": "u3",
            "relationship": "Former PM at Atlassian",
            "notes": "Excellent growth PM with strong analytics background.",
            "status": "interviewed",
            "created_by": "u3",
            "is_deleted": False,
            "created_at": "2024-09-10T11:00:00Z",
            "updated_at": "2024-09-18T09:00:00Z",
        },
        {
            "_id": "ref4",
            "org_id": "org1",
            "candidate_name": "Laura Kim",
            "candidate_email": "laura.kim@email.com",
            "job_id": "j4",
            "referrer_id": "u1",
            "relationship": "College friend, worked at Spotify design team",
            "notes": "Talented product designer with experience in both B2B and B2C.",
            "status": "submitted",
            "created_by": "u1",
            "is_deleted": False,
            "created_at": "2024-09-20T08:00:00Z",
            "updated_at": "2024-09-20T08:00:00Z",
        },
    ]
    await db.referrals.insert_many(referrals)

    print(f"\nDone! Seeded database '{DB_NAME}' with additional demo data.")
    print(f"  - {len(interviews)} interviews")
    print(f"  - {len(offers)} offers")
    print(f"  - {len(notifications)} notifications")
    print(f"  - {len(feedback)} feedback entries")
    print(f"  - {len(referrals)} referrals")

    client.close()


if __name__ == "__main__":
    asyncio.run(seed())
