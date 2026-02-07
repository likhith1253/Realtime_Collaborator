import urllib.request
import json
import urllib.error

def test_endpoint(url, name):
    print(f"Testing {name} at {url}...")
    try:
        data = json.dumps({"prompt": "Hello", "document_content": "test"}).encode('utf-8')
        req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
        
        with urllib.request.urlopen(req, timeout=5) as response:
            status = response.getcode()
            body = response.read().decode('utf-8')
            print(f"Status: {status}")
            print(f"Response: {body}")
            
            if status == 200:
                print(f"SUCCESS: {name} is working.")
            else:
                print(f"FAILURE: {name} returned status {status}.")
            
    except urllib.error.HTTPError as e:
        print(f"FAILURE: {name} returned error {e.code}.")
        print(f"Body: {e.read().decode('utf-8')}")
    except Exception as e:
        print(f"ERROR: Could not connect to {name}. {str(e)}")

print("--- DIAGNOSTIC START ---")

# 1. Test Direct Connection to AI Service
test_endpoint("http://localhost:8000/ai/chat", "Direct AI Service")

# 2. Test Connection via API Gateway
test_endpoint("http://localhost:3009/ai/chat", "API Gateway")

# 3. Test Stale Endpoint
test_endpoint("http://localhost:8000/chat", "Direct AI Service (Stale Path?)")

print("--- DIAGNOSTIC END ---")
