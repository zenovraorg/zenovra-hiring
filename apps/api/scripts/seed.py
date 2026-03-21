"""Seed MongoDB with demo data for Zenovra Hiring Platform."""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os

MONGODB_URL = os.environ.get("MONGODB_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("MONGODB_DB_NAME", "hiring")


async def seed():
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DB_NAME]

    # Clear existing data
    for col in await db.list_collection_names():
        await db[col].drop()

    print("Seeding organizations...")
    await db.organizations.insert_one({
        "_id": "org1",
        "name": "Zenovra Tech",
        "slug": "zenovra-tech",
        "domain": "zenovra.org",
        "industry": "Technology",
        "size": "200-500",
        "settings": {
            "branding": {"primary_color": "#6366f1"},
            "hiring": {"require_job_approval": True, "require_offer_approval": True},
        },
        "created_at": datetime(2024, 1, 1).isoformat(),
        "updated_at": datetime(2024, 1, 1).isoformat(),
    })

    print("Seeding departments...")
    departments = [
        {"_id": "dept1", "org_id": "org1", "name": "Engineering"},
        {"_id": "dept2", "org_id": "org1", "name": "Product"},
        {"_id": "dept3", "org_id": "org1", "name": "Design"},
        {"_id": "dept4", "org_id": "org1", "name": "Sales"},
        {"_id": "dept5", "org_id": "org1", "name": "Marketing"},
        {"_id": "dept6", "org_id": "org1", "name": "People & Talent"},
    ]
    await db.departments.insert_many(departments)

    print("Seeding locations...")
    locations = [
        {"_id": "loc1", "org_id": "org1", "name": "San Francisco HQ", "city": "San Francisco", "state": "CA", "country": "US", "is_remote": False},
        {"_id": "loc2", "org_id": "org1", "name": "New York Office", "city": "New York", "state": "NY", "country": "US", "is_remote": False},
        {"_id": "loc3", "org_id": "org1", "name": "Remote", "country": "US", "is_remote": True},
        {"_id": "loc4", "org_id": "org1", "name": "London Office", "city": "London", "country": "UK", "is_remote": False},
    ]
    await db.locations.insert_many(locations)

    print("Seeding users...")
    users = [
        {"_id": "u1", "email": "sarah.chen@zenovra.com", "display_name": "Sarah Chen", "firebase_uid": "fb1", "is_active": True, "created_at": "2024-01-15T00:00:00Z", "updated_at": "2024-01-15T00:00:00Z"},
        {"_id": "u2", "email": "marcus.johnson@zenovra.com", "display_name": "Marcus Johnson", "firebase_uid": "fb2", "is_active": True, "created_at": "2024-02-01T00:00:00Z", "updated_at": "2024-02-01T00:00:00Z"},
        {"_id": "u3", "email": "priya.patel@zenovra.com", "display_name": "Priya Patel", "firebase_uid": "fb3", "is_active": True, "created_at": "2024-02-10T00:00:00Z", "updated_at": "2024-02-10T00:00:00Z"},
        {"_id": "u4", "email": "james.wilson@zenovra.com", "display_name": "James Wilson", "firebase_uid": "fb4", "is_active": True, "created_at": "2024-03-01T00:00:00Z", "updated_at": "2024-03-01T00:00:00Z"},
        {"_id": "u5", "email": "lisa.nakamura@zenovra.com", "display_name": "Lisa Nakamura", "firebase_uid": "fb5", "is_active": True, "created_at": "2024-03-15T00:00:00Z", "updated_at": "2024-03-15T00:00:00Z"},
    ]
    await db.users.insert_many(users)

    print("Seeding memberships...")
    memberships = [
        {"_id": "m1", "user_id": "u1", "org_id": "org1", "role": "org_admin", "is_active": True, "joined_at": "2024-01-15T00:00:00Z"},
        {"_id": "m2", "user_id": "u2", "org_id": "org1", "role": "hiring_manager", "department_id": "dept1", "is_active": True, "joined_at": "2024-02-01T00:00:00Z"},
        {"_id": "m3", "user_id": "u3", "org_id": "org1", "role": "recruiter", "is_active": True, "joined_at": "2024-02-10T00:00:00Z"},
        {"_id": "m4", "user_id": "u4", "org_id": "org1", "role": "hiring_manager", "department_id": "dept4", "is_active": True, "joined_at": "2024-03-01T00:00:00Z"},
        {"_id": "m5", "user_id": "u5", "org_id": "org1", "role": "recruiter", "is_active": True, "joined_at": "2024-03-15T00:00:00Z"},
    ]
    await db.memberships.insert_many(memberships)

    default_stages = [
        {"id": "ps1", "name": "Applied", "order": 0, "type": "sourced", "color": "#6366f1"},
        {"id": "ps2", "name": "Phone Screen", "order": 1, "type": "screening", "color": "#8b5cf6"},
        {"id": "ps3", "name": "Technical Interview", "order": 2, "type": "interview", "color": "#0ea5e9"},
        {"id": "ps4", "name": "Onsite", "order": 3, "type": "interview", "color": "#06b6d4"},
        {"id": "ps5", "name": "Offer", "order": 4, "type": "offer", "color": "#10b981"},
        {"id": "ps6", "name": "Hired", "order": 5, "type": "hired", "color": "#22c55e"},
    ]

    print("Seeding jobs...")
    jobs = [
        {"_id": "j1", "org_id": "org1", "title": "Senior Frontend Engineer", "slug": "senior-frontend-engineer", "department_id": "dept1", "location_id": "loc1", "hiring_manager_id": "u2", "recruiter_id": "u1", "status": "open", "employment_type": "full_time", "experience_level": "senior", "description": "We are looking for a Senior Frontend Engineer to join our product team.", "requirements": ["5+ years React/TypeScript", "Experience with design systems", "Strong CSS/animation skills"], "nice_to_haves": ["GraphQL experience"], "compensation": {"min_salary": 180000, "max_salary": 240000, "currency": "USD", "equity": "0.05% - 0.15%"}, "pipeline_stages": default_stages, "headcount": 2, "filled_count": 0, "candidate_count": 18, "is_remote": False, "is_published": True, "is_deleted": False, "created_at": "2024-08-28T00:00:00Z", "updated_at": "2024-09-15T00:00:00Z"},
        {"_id": "j2", "org_id": "org1", "title": "Product Manager — Growth", "slug": "product-manager-growth", "department_id": "dept2", "location_id": "loc3", "hiring_manager_id": "u3", "recruiter_id": "u1", "status": "open", "employment_type": "full_time", "experience_level": "senior", "description": "Lead our growth product initiatives.", "requirements": ["4+ years product management", "Data-driven decision making"], "nice_to_haves": ["B2B SaaS experience"], "compensation": {"min_salary": 160000, "max_salary": 220000, "currency": "USD"}, "pipeline_stages": default_stages, "headcount": 1, "filled_count": 0, "candidate_count": 24, "is_remote": True, "is_published": True, "is_deleted": False, "created_at": "2024-09-05T00:00:00Z", "updated_at": "2024-09-18T00:00:00Z"},
        {"_id": "j3", "org_id": "org1", "title": "Staff Backend Engineer", "slug": "staff-backend-engineer", "department_id": "dept1", "location_id": "loc1", "hiring_manager_id": "u4", "recruiter_id": "u5", "status": "open", "employment_type": "full_time", "experience_level": "lead", "description": "Design and build scalable distributed systems.", "requirements": ["8+ years backend experience", "Python/Go expertise", "Distributed systems"], "nice_to_haves": ["MongoDB at scale"], "compensation": {"min_salary": 220000, "max_salary": 300000, "currency": "USD", "equity": "0.10% - 0.25%"}, "pipeline_stages": default_stages, "headcount": 1, "filled_count": 0, "candidate_count": 12, "is_remote": False, "is_published": True, "is_deleted": False, "created_at": "2024-09-10T00:00:00Z", "updated_at": "2024-09-20T00:00:00Z"},
        {"_id": "j4", "org_id": "org1", "title": "Senior Product Designer", "slug": "senior-product-designer", "department_id": "dept3", "location_id": "loc3", "hiring_manager_id": "u3", "recruiter_id": "u1", "status": "open", "employment_type": "full_time", "experience_level": "senior", "description": "Shape the design direction of our platform.", "requirements": ["5+ years product design", "Figma expertise", "B2B SaaS portfolio"], "nice_to_haves": ["Motion design"], "compensation": {"min_salary": 165000, "max_salary": 210000, "currency": "USD"}, "pipeline_stages": default_stages, "headcount": 1, "filled_count": 0, "candidate_count": 31, "is_remote": True, "is_published": True, "is_deleted": False, "created_at": "2024-09-01T00:00:00Z", "updated_at": "2024-09-16T00:00:00Z"},
        {"_id": "j5", "org_id": "org1", "title": "Enterprise Account Executive", "slug": "enterprise-ae", "department_id": "dept4", "location_id": "loc2", "hiring_manager_id": "u4", "recruiter_id": "u5", "status": "open", "employment_type": "full_time", "experience_level": "senior", "description": "Drive enterprise sales.", "requirements": ["5+ years enterprise sales", "$1M+ quota attainment"], "nice_to_haves": ["HR tech experience"], "compensation": {"min_salary": 140000, "max_salary": 180000, "currency": "USD", "bonus": "OTE $300K-$400K"}, "pipeline_stages": default_stages, "headcount": 3, "filled_count": 1, "candidate_count": 15, "is_remote": False, "is_published": True, "is_deleted": False, "created_at": "2024-08-15T00:00:00Z", "updated_at": "2024-09-14T00:00:00Z"},
    ]
    await db.job_requisitions.insert_many(jobs)

    print("Seeding candidates...")
    candidates = [
        {"_id": "c1", "org_id": "org1", "first_name": "Alex", "last_name": "Rivera", "email": "alex.rivera@email.com", "headline": "Senior Frontend Engineer at Meta", "location": "San Francisco, CA", "source": "linkedin", "skills": ["React", "TypeScript", "GraphQL", "Node.js"], "experience_years": 7, "current_company": "Meta", "current_title": "Senior Frontend Engineer", "owner_id": "u1", "is_deleted": False, "created_at": "2024-09-02T00:00:00Z", "updated_at": "2024-09-15T00:00:00Z"},
        {"_id": "c2", "org_id": "org1", "first_name": "Jordan", "last_name": "Kim", "email": "jordan.kim@email.com", "headline": "Staff Engineer at Stripe", "location": "New York, NY", "source": "referral", "skills": ["Python", "Go", "Distributed Systems", "PostgreSQL"], "experience_years": 10, "current_company": "Stripe", "current_title": "Staff Engineer", "owner_id": "u5", "is_deleted": False, "created_at": "2024-09-05T00:00:00Z", "updated_at": "2024-09-18T00:00:00Z"},
        {"_id": "c3", "org_id": "org1", "first_name": "Maya", "last_name": "Thompson", "email": "maya.t@email.com", "headline": "Product Designer at Figma", "location": "Remote", "source": "careers_page", "skills": ["Figma", "Design Systems", "Prototyping"], "experience_years": 6, "current_company": "Figma", "current_title": "Senior Product Designer", "owner_id": "u1", "is_deleted": False, "created_at": "2024-09-06T00:00:00Z", "updated_at": "2024-09-16T00:00:00Z"},
        {"_id": "c4", "org_id": "org1", "first_name": "Chen", "last_name": "Wei", "email": "chen.wei@email.com", "headline": "Product Manager at Notion", "location": "San Francisco, CA", "source": "direct", "skills": ["Product Strategy", "Growth", "Analytics", "SQL"], "experience_years": 5, "current_company": "Notion", "current_title": "Senior PM — Growth", "owner_id": "u1", "is_deleted": False, "created_at": "2024-09-10T00:00:00Z", "updated_at": "2024-09-17T00:00:00Z"},
        {"_id": "c5", "org_id": "org1", "first_name": "Aisha", "last_name": "Okafor", "email": "aisha.o@email.com", "headline": "Frontend Engineer at Vercel", "location": "London, UK", "source": "linkedin", "skills": ["React", "Next.js", "TypeScript", "CSS"], "experience_years": 5, "current_company": "Vercel", "current_title": "Frontend Engineer", "owner_id": "u1", "is_deleted": False, "created_at": "2024-09-08T00:00:00Z", "updated_at": "2024-09-14T00:00:00Z"},
        {"_id": "c6", "org_id": "org1", "first_name": "David", "last_name": "Park", "email": "david.park@email.com", "headline": "Enterprise AE at Salesforce", "location": "New York, NY", "source": "agency", "skills": ["Enterprise Sales", "Consultative Selling", "Salesforce"], "experience_years": 8, "current_company": "Salesforce", "current_title": "Enterprise Account Executive", "owner_id": "u5", "is_deleted": False, "created_at": "2024-09-01T00:00:00Z", "updated_at": "2024-09-12T00:00:00Z"},
    ]
    await db.candidates.insert_many(candidates)

    print("Seeding applications...")
    applications = [
        {"_id": "a1", "candidate_id": "c1", "job_id": "j1", "org_id": "org1", "stage_id": "ps3", "status": "interviewing", "applied_at": "2024-09-02T00:00:00Z", "moved_at": "2024-09-10T00:00:00Z", "source": "linkedin"},
        {"_id": "a2", "candidate_id": "c2", "job_id": "j3", "org_id": "org1", "stage_id": "ps4", "status": "interviewing", "applied_at": "2024-09-05T00:00:00Z", "moved_at": "2024-09-14T00:00:00Z", "source": "referral"},
        {"_id": "a3", "candidate_id": "c3", "job_id": "j4", "org_id": "org1", "stage_id": "ps2", "status": "screening", "applied_at": "2024-09-06T00:00:00Z", "moved_at": "2024-09-08T00:00:00Z", "source": "careers_page"},
        {"_id": "a4", "candidate_id": "c4", "job_id": "j2", "org_id": "org1", "stage_id": "ps3", "status": "interviewing", "applied_at": "2024-09-10T00:00:00Z", "moved_at": "2024-09-15T00:00:00Z", "source": "direct"},
        {"_id": "a5", "candidate_id": "c5", "job_id": "j1", "org_id": "org1", "stage_id": "ps1", "status": "new", "applied_at": "2024-09-08T00:00:00Z", "moved_at": "2024-09-08T00:00:00Z", "source": "linkedin"},
        {"_id": "a6", "candidate_id": "c6", "job_id": "j5", "org_id": "org1", "stage_id": "ps5", "status": "offer", "applied_at": "2024-09-01T00:00:00Z", "moved_at": "2024-09-16T00:00:00Z", "source": "agency"},
    ]
    await db.applications.insert_many(applications)

    print("Seeding interviews...")
    interviews = [
        {"_id": "i1", "application_id": "a1", "org_id": "org1", "title": "Technical Interview — Frontend", "type": "technical", "status": "scheduled", "scheduled_at": "2024-09-22T14:00:00Z", "duration_minutes": 60, "meeting_link": "https://meet.google.com/abc-defg-hij", "interviewers": [{"user_id": "u2", "role": "lead", "feedback_submitted": False}], "created_at": "2024-09-15T00:00:00Z"},
        {"_id": "i2", "application_id": "a2", "org_id": "org1", "title": "Onsite — System Design", "type": "technical", "status": "scheduled", "scheduled_at": "2024-09-23T10:00:00Z", "duration_minutes": 90, "location": "San Francisco HQ", "interviewers": [{"user_id": "u4", "role": "lead", "feedback_submitted": False}, {"user_id": "u2", "role": "participant", "feedback_submitted": False}], "created_at": "2024-09-16T00:00:00Z"},
        {"_id": "i3", "application_id": "a4", "org_id": "org1", "title": "Product Sense Interview", "type": "behavioral", "status": "completed", "scheduled_at": "2024-09-18T11:00:00Z", "duration_minutes": 45, "meeting_link": "https://meet.google.com/xyz-uvwx-yz", "interviewers": [{"user_id": "u3", "role": "lead", "feedback_submitted": True}], "created_at": "2024-09-14T00:00:00Z"},
    ]
    await db.interviews.insert_many(interviews)

    print("Seeding offers...")
    offers = [
        {"_id": "o1", "application_id": "a6", "org_id": "org1", "status": "sent", "title": "Enterprise Account Executive", "department": "Sales", "start_date": "2024-10-15", "base_salary": 160000, "currency": "USD", "bonus": 200000, "benefits": ["Health/Dental/Vision", "401k match", "Unlimited PTO", "Home office stipend"], "approvals": [{"approver_id": "u4", "status": "approved", "decided_at": "2024-09-15T00:00:00Z"}], "version": 1, "expires_at": "2024-09-30T00:00:00Z", "created_at": "2024-09-14T00:00:00Z", "updated_at": "2024-09-16T00:00:00Z"},
    ]
    await db.offers.insert_many(offers)

    print("Seeding notifications...")
    notifications = [
        {"_id": "n1", "user_id": "u1", "org_id": "org1", "type": "application", "title": "New Application", "message": "Aisha Okafor applied for Senior Frontend Engineer", "link": "/candidates/c5", "is_read": False, "created_at": "2024-09-18T10:00:00Z"},
        {"_id": "n2", "user_id": "u1", "org_id": "org1", "type": "interview", "title": "Interview Scheduled", "message": "Technical interview with Alex Rivera is scheduled for Sep 22", "link": "/interviews", "is_read": False, "created_at": "2024-09-17T15:00:00Z"},
        {"_id": "n3", "user_id": "u1", "org_id": "org1", "type": "offer", "title": "Offer Sent", "message": "Offer sent to David Park for Enterprise AE position", "link": "/offers/o1", "is_read": True, "created_at": "2024-09-16T09:00:00Z"},
    ]
    await db.notifications.insert_many(notifications)

    print("Seeding activity logs...")
    activity_logs = [
        {"_id": "al1", "org_id": "org1", "actor_id": "u1", "action": "moved_stage", "entity_type": "application", "entity_id": "a1", "metadata": {"from": "Phone Screen", "to": "Technical Interview", "candidate": "Alex Rivera"}, "created_at": "2024-09-18T11:30:00Z"},
        {"_id": "al2", "org_id": "org1", "actor_id": "u5", "action": "sent_offer", "entity_type": "offer", "entity_id": "o1", "metadata": {"candidate": "David Park", "job": "Enterprise AE"}, "created_at": "2024-09-16T14:00:00Z"},
        {"_id": "al3", "org_id": "org1", "actor_id": "u3", "action": "submitted_feedback", "entity_type": "scorecard", "entity_id": "sc1", "metadata": {"candidate": "Chen Wei", "rating": "Strong Yes"}, "created_at": "2024-09-15T16:30:00Z"},
    ]
    await db.activity_logs.insert_many(activity_logs)

    print(f"\nDone! Seeded database '{DB_NAME}' with demo data.")
    print(f"  - 1 organization")
    print(f"  - 6 departments")
    print(f"  - 4 locations")
    print(f"  - 5 users")
    print(f"  - 5 memberships")
    print(f"  - 5 jobs")
    print(f"  - 6 candidates")
    print(f"  - 6 applications")
    print(f"  - 3 interviews")
    print(f"  - 1 offer")
    print(f"  - 3 notifications")
    print(f"  - 3 activity logs")

    client.close()


if __name__ == "__main__":
    asyncio.run(seed())
