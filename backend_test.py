#!/usr/bin/env python3

import requests
import json
import sys
from datetime import datetime

class SourceRankAPITester:
    def __init__(self, base_url="https://recruiter-hub-48.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}" if endpoint else f"{self.base_url}/"
        
        if not headers:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            
            print(f"Response Status: {response.status_code}")
            print(f"Response: {response.text[:200]}...")

            success = response.status_code == expected_status
            
            result = {
                "test_name": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": response.status_code,
                "success": success,
                "response_text": response.text[:500] if response.text else "",
            }
            
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    result["response_data"] = response_data
                    return success, response_data
                except:
                    return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                result["error"] = f"Expected {expected_status}, got {response.status_code}"
                
            self.test_results.append(result)
            return success, {}

        except requests.exceptions.Timeout:
            error_msg = "Request timeout (10s)"
            print(f"❌ Failed - {error_msg}")
            result = {
                "test_name": name,
                "success": False,
                "error": error_msg
            }
            self.test_results.append(result)
            return False, {}
        except Exception as e:
            error_msg = f"Error: {str(e)}"
            print(f"❌ Failed - {error_msg}")
            result = {
                "test_name": name,
                "success": False,
                "error": error_msg
            }
            self.test_results.append(result)
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        return self.run_test(
            "Root API Endpoint",
            "GET", 
            "",
            200
        )

    def test_health_endpoint(self):
        """Test the health check endpoint"""
        return self.run_test(
            "Health Check",
            "GET",
            "health",
            200
        )

    def test_status_creation(self):
        """Test creating a status check"""
        return self.run_test(
            "Create Status Check",
            "POST",
            "status",
            200,
            data={"client_name": "test_client"}
        )

    def test_status_retrieval(self):
        """Test retrieving status checks"""
        return self.run_test(
            "Get Status Checks", 
            "GET",
            "status",
            200
        )

    def test_chat_endpoint(self):
        """Test the chat endpoint"""
        return self.run_test(
            "Chat Endpoint",
            "POST",
            "chat",
            200,
            data={"job_id": "job-001", "message": "Test chat message"}
        )

def main():
    print("=" * 60)
    print("SourceRank API Backend Testing")
    print("=" * 60)
    
    tester = SourceRankAPITester()
    
    # Run all tests
    print("\n🚀 Starting backend API tests...")
    
    # Test 1: Root endpoint
    tester.test_root_endpoint()
    
    # Test 2: Health check
    tester.test_health_endpoint()
    
    # Test 3: Create status
    tester.test_status_creation()
    
    # Test 4: Get status
    tester.test_status_retrieval()
    
    # Test 5: Chat endpoint
    tester.test_chat_endpoint()
    
    # Print final results
    print("\n" + "=" * 60)
    print(f"📊 FINAL RESULTS: {tester.tests_passed}/{tester.tests_run} tests passed")
    print("=" * 60)
    
    if tester.tests_passed < tester.tests_run:
        print("\n❌ Some tests failed:")
        for result in tester.test_results:
            if not result.get("success", False):
                print(f"  - {result['test_name']}: {result.get('error', 'Unknown error')}")
    else:
        print("\n✅ All backend API tests passed!")
    
    # Save detailed test results
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump({
            "tests_run": tester.tests_run,
            "tests_passed": tester.tests_passed,
            "success_rate": f"{(tester.tests_passed/tester.tests_run)*100:.1f}%",
            "test_results": tester.test_results,
            "timestamp": datetime.now().isoformat()
        }, f, indent=2)
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())