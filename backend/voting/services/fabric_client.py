"""
HTTP client for the Node.js Fabric gateway (fabric_service).
Django stays off the Fabric SDK; the gateway holds wallet + gRPC details.
"""
import os
import logging
import requests

logger = logging.getLogger(__name__)

FABRIC_SERVICE_URL = os.environ.get(
    "FABRIC_SERVICE_URL", "http://localhost:5000"
).rstrip("/")
REQUEST_TIMEOUT = int(os.environ.get("FABRIC_REQUEST_TIMEOUT", "30"))


class FabricServiceError(Exception):
    def __init__(self, message, status_code=None):
        super().__init__(message)
        self.status_code = status_code


def _post(path, payload):
    url = f"{FABRIC_SERVICE_URL}{path}"
    try:
        response = requests.post(
            url, json=payload, timeout=REQUEST_TIMEOUT
        )
    except requests.RequestException as exc:
        logger.exception("Fabric service unreachable")
        raise FabricServiceError(
            f"Fabric gateway unavailable at {FABRIC_SERVICE_URL}"
        ) from exc

    try:
        data = response.json()
    except ValueError:
        data = {}

    if response.status_code >= 400:
        raise FabricServiceError(
            data.get("error", response.text or "Fabric error"),
            status_code=response.status_code,
        )

    return data


def fabric_health():
    try:
        r = requests.get(
            f"{FABRIC_SERVICE_URL}/health", timeout=5
        )
        return r.status_code == 200, r.json() if r.ok else {}
    except requests.RequestException:
        return False, {}


def query_chaincode(fcn, args=None):
    data = _post("/query", {"fcn": fcn, "args": args or []})
    return data.get("result", "")


def invoke_chaincode(fcn, args):
    data = _post("/invoke", {"fcn": fcn, "args": args})
    return data.get("result", "")
