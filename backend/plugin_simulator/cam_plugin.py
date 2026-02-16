import requests

BASE_URL = "http://localhost:8000"


def simulate_plugin():
    print(f"Connecting to {BASE_URL}...")

    # 1. Check health
    try:
        resp = requests.get(f"{BASE_URL}/health")
        print(f"Health check: {resp.json()}")
    except Exception as e:
        print(f"Failed to connect: {e}")
        return

    # 2. Create a new configuration
    config_data = {
        "machine_id": "M001",
        "material": "AL-6061",
        "tool_diameter": 12.0,
        "feed_rate": 1500.0,
        "spindle_speed": 10000,
    }

    print(f"\nCreating configuration: {config_data}")
    resp = requests.post(f"{BASE_URL}/config/", json=config_data)
    if resp.status_code == 200:
        config = resp.json()
        print(f"Created config ID: {config['id']}")
        config_id = config["id"]
    else:
        print(f"Failed to create config: {resp.text}")
        return

    # 3. Request validation
    print(f"\nRequesting validation for config {config_id}...")
    resp = requests.post(f"{BASE_URL}/validate/", json={"config_id": config_id})
    validation = resp.json()
    print(f"Validation result: Is Valid? {validation['is_valid']}")
    if validation["warnings"]:
        print(f"Warnings: {validation['warnings']}")

    # 4. Request recommendation
    print("\nRequesting recommendation for similar job...")
    rec_req = {
        "machine_id": "M001",
        "material": "AL-6061",
        "tool_diameter": 12.5,  # Slightly different tool
    }
    resp = requests.post(f"{BASE_URL}/recommend/", json=rec_req)
    recommendation = resp.json()

    if recommendation["recommended_config"]:
        rec_id = recommendation["recommended_config"]["id"]
        print(f"Recommended config ID: {rec_id} (Model: {recommendation['model_version']})")
    else:
        print("No recommendation found (expected for first run or no history)")


if __name__ == "__main__":
    simulate_plugin()
