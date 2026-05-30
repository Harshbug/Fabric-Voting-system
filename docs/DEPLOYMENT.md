# Deployment Guide

## Local development (recommended)

1. Host: Fabric test-network via `scripts/start-all`  
2. Host: `fabric_service`, Django, Vite dev server  

Lowest friction for learning and debugging chaincode.

## Docker Compose (application only)

```bash
docker compose -f deploy/docker-compose.yml up --build
```

**Requirements before Compose:**

- Network running on host  
- `config/connection-org1.json` and `fabric_service/wallet/` populated  
- `FABRIC_DISCOVERY_AS_LOCALHOST=true` for gateway container  

Frontend image bakes `VITE_API_BASE_URL`; rebuild if API URL changes.

## Production considerations

| Area | Demo | Production direction |
|------|------|----------------------|
| Identities | Shared admin | Per-voter or per-org identities, HSM |
| Network | test-network | RAFT orderers, multi-org, HA peers |
| Chaincode | Go on channel | Versioning, upgrade policies |
| API auth | Open | OAuth2 / API keys / mTLS |
| Secrets | Local wallet | Vault, K8s secrets |
| Frontend | Static nginx | CDN + TLS termination |

## Scaling

- **Peers** — horizontal peer nodes per org  
- **Orderers** — cluster for crash fault tolerance  
- **Gateway** — stateless replicas behind load balancer (each needs wallet access)  
- **Django** — horizontal with shared DB (PostgreSQL)  

## Kubernetes (outline)

- Fabric: Operator-Fabric or Helm charts for peers/orderers  
- Apps: Deployments for gateway + API; Ingress for UI  
- Jobs: chaincode upgrade pipelines  

## VPS quick path

1. Install Docker, Go, Node, Python  
2. Clone repo + run `start-all.sh`  
3. `systemd` units for gateway + gunicorn + nginx  
4. Firewall: expose only 443/nginx, not peer ports  

## Security checklist

- [ ] Rotate `DJANGO_SECRET_KEY`  
- [ ] `DEBUG=False`  
- [ ] Restrict `ALLOWED_HOSTS` and CORS  
- [ ] Do not commit wallet or connection profiles with prod certs  
- [ ] TLS on public API  
