"""
Backend API Tests for Teams 24 Careers Job Board
Tests: Health check, Jobs API, Applications API
"""
import pytest
import requests
import os

# Use localhost since this is a Next.js app with API routes
BASE_URL = "http://localhost:3000"


class TestHealthCheck:
    """Health check endpoint tests"""
    
    def test_health_endpoint_returns_200(self):
        """Test that health endpoint returns 200 status"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        
    def test_health_endpoint_returns_healthy_status(self):
        """Test that health endpoint returns healthy status"""
        response = requests.get(f"{BASE_URL}/api/health")
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data
        assert data["service"] == "Teams 24 Careers API (Next.js)"


class TestJobsAPI:
    """Jobs API endpoint tests"""
    
    def test_get_jobs_returns_200(self):
        """Test that GET /api/jobs returns 200 status"""
        response = requests.get(f"{BASE_URL}/api/jobs")
        assert response.status_code == 200
        
    def test_get_jobs_returns_list(self):
        """Test that GET /api/jobs returns a list"""
        response = requests.get(f"{BASE_URL}/api/jobs")
        data = response.json()
        assert isinstance(data, list)
        
    def test_get_jobs_returns_job_data(self):
        """Test that jobs have required fields"""
        response = requests.get(f"{BASE_URL}/api/jobs")
        data = response.json()
        
        if len(data) > 0:
            job = data[0]
            # Check required fields
            assert "id" in job
            assert "title" in job
            assert "type" in job
            assert "location" in job
            assert "status" in job
            assert "description" in job
            
    def test_get_jobs_excludes_mongodb_id(self):
        """Test that MongoDB _id is excluded from response"""
        response = requests.get(f"{BASE_URL}/api/jobs")
        data = response.json()
        
        if len(data) > 0:
            job = data[0]
            assert "_id" not in job
            
    def test_create_job_returns_201(self):
        """Test that POST /api/jobs creates a new job"""
        new_job = {
            "title": "TEST_QA Engineer",
            "type": "full-time",
            "salaryMin": "$80k",
            "salaryMax": "$120k",
            "location": "Remote",
            "description": "Test job description",
            "requirements": ["Python", "Selenium"],
            "responsibilities": ["Write tests", "Review code"],
            "status": "draft"
        }
        
        response = requests.post(f"{BASE_URL}/api/jobs", json=new_job)
        assert response.status_code == 201
        
        data = response.json()
        assert data["title"] == "TEST_QA Engineer"
        assert data["type"] == "full-time"
        assert "id" in data
        assert "_id" not in data


class TestApplicationsAPI:
    """Applications API endpoint tests"""
    
    def test_get_applications_returns_200(self):
        """Test that GET /api/applications returns 200 status"""
        response = requests.get(f"{BASE_URL}/api/applications")
        assert response.status_code == 200
        
    def test_get_applications_returns_list(self):
        """Test that GET /api/applications returns a list"""
        response = requests.get(f"{BASE_URL}/api/applications")
        data = response.json()
        assert isinstance(data, list)
        
    def test_get_applications_returns_application_data(self):
        """Test that applications have required fields"""
        response = requests.get(f"{BASE_URL}/api/applications")
        data = response.json()
        
        if len(data) > 0:
            app = data[0]
            # Check required fields
            assert "id" in app
            assert "name" in app
            assert "email" in app
            assert "status" in app
            assert "position" in app
            
    def test_get_applications_excludes_mongodb_id(self):
        """Test that MongoDB _id is excluded from response"""
        response = requests.get(f"{BASE_URL}/api/applications")
        data = response.json()
        
        if len(data) > 0:
            app = data[0]
            assert "_id" not in app
            
    def test_get_applications_with_job_filter(self):
        """Test filtering applications by jobId"""
        # First get all applications to find a valid jobId
        response = requests.get(f"{BASE_URL}/api/applications")
        data = response.json()
        
        if len(data) > 0:
            job_id = data[0].get("jobId")
            if job_id:
                filtered_response = requests.get(f"{BASE_URL}/api/applications?jobId={job_id}")
                assert filtered_response.status_code == 200
                filtered_data = filtered_response.json()
                # All returned applications should have the same jobId
                for app in filtered_data:
                    assert app.get("jobId") == job_id
                    
    def test_create_application_returns_201(self):
        """Test that POST /api/applications creates a new application"""
        # First get a valid job ID
        jobs_response = requests.get(f"{BASE_URL}/api/jobs")
        jobs = jobs_response.json()
        
        if len(jobs) > 0:
            job_id = jobs[0]["id"]
            
            new_application = {
                "jobId": job_id,
                "name": "TEST_John Tester",
                "email": "test.john@example.com",
                "phone": "+1 555-0199",
                "position": jobs[0]["title"],
                "resumeUrl": "/resumes/test-john.pdf",
                "linkedIn": "linkedin.com/in/johntester",
                "portfolio": "johntester.dev",
                "coverLetter": "I am excited to apply for this position...",
                "experience": "5 years"
            }
            
            response = requests.post(f"{BASE_URL}/api/applications", json=new_application)
            assert response.status_code == 201
            
            data = response.json()
            assert data["name"] == "TEST_John Tester"
            assert data["email"] == "test.john@example.com"
            assert data["status"] == "new"
            assert "id" in data
            assert "_id" not in data


class TestDataIntegrity:
    """Tests for data integrity and persistence"""
    
    def test_jobs_count_matches_seeded_data(self):
        """Test that jobs count is reasonable (seeded data)"""
        response = requests.get(f"{BASE_URL}/api/jobs")
        data = response.json()
        # Should have at least the seeded jobs
        assert len(data) >= 4
        
    def test_applications_count_matches_seeded_data(self):
        """Test that applications count is reasonable (seeded data)"""
        response = requests.get(f"{BASE_URL}/api/applications")
        data = response.json()
        # Should have at least the seeded applications
        assert len(data) >= 5
        
    def test_job_status_values_are_valid(self):
        """Test that job status values are valid"""
        valid_statuses = ['draft', 'published', 'paused', 'closed', 'archived']
        response = requests.get(f"{BASE_URL}/api/jobs")
        data = response.json()
        
        for job in data:
            if "status" in job:
                assert job["status"] in valid_statuses, f"Invalid status: {job['status']}"
                
    def test_application_status_values_are_valid(self):
        """Test that application status values are valid"""
        valid_statuses = ['new', 'screening', 'interview_scheduled', 'interview_complete', 
                         'offer_pending', 'hired', 'rejected', 'on_hold']
        response = requests.get(f"{BASE_URL}/api/applications")
        data = response.json()
        
        for app in data:
            if "status" in app:
                assert app["status"] in valid_statuses, f"Invalid status: {app['status']}"


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
