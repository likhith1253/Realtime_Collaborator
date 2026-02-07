import urllib.request
import json
import urllib.error

url = "http://localhost:8000/ai/chat"
name = "Direct AI Service"

print(f"Testing {name} at {url}...")
try:
    data = json.dumps({"prompt": "Hello", "document_content": "test"}).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    
    with urllib.request.urlopen(req, timeout=5) as response:
        status = response.getcode()
        body = response.read().decode('utf-8')
        print(f"SUCCESS: Status {status}")
        print(f"Response: {body}")
        
except urllib.error.HTTPError as e:
    print(f"FAILURE: Status {e.code}")
    print(f"Body: {e.read().decode('utf-8')}")
except Exception as e:
    print(f"ERROR: {str(e)}")
