import json
import logging

from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Count

from .models import Party, ElectionSettings
from .serializers import PartySerializer, ElectionSettingsSerializer
from .services.fabric_client import (
    fabric_health,
    invoke_chaincode,
    query_chaincode,
    FabricServiceError,
)

logger = logging.getLogger(__name__)


class PartyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Party.objects.all()
    serializer_class = PartySerializer


@api_view(["GET"])
def health(request):
    ok, fabric_info = fabric_health()
    return Response({
        "status": "ok",
        "fabric_gateway": "up" if ok else "down",
        "fabric": fabric_info,
    })


@api_view(["POST"])
def cast_vote(request):
    voter_id = (request.data.get("voter_id") or "").strip()
    party_id = request.data.get("party_id")

    if not voter_id or party_id is None:
        return Response(
            {"error": "voter_id and party_id are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not Party.objects.filter(id=party_id).exists():
        return Response({"error": "Party not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        has_voted = query_chaincode("HasVoted", [voter_id])
        if has_voted == "true":
            return Response(
                {"error": "Voter has already voted"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        invoke_chaincode("CastVote", [voter_id, str(party_id)])
    except FabricServiceError as exc:
        logger.warning("cast_vote fabric error: %s", exc)
        code = status.HTTP_502_BAD_GATEWAY
        if exc.status_code and 400 <= exc.status_code < 500:
            code = status.HTTP_400_BAD_REQUEST
        return Response({"error": str(exc)}, status=code)

    return Response(
        {
            "message": "Vote cast successfully",
            "voter_id": voter_id,
            "party_id": party_id,
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET"])
def get_results(request):
    try:
        raw = query_chaincode("GetResults", [])
        counts = json.loads(raw) if raw else {}
    except (FabricServiceError, json.JSONDecodeError) as exc:
        logger.warning("get_results error: %s", exc)
        return Response(
            {"error": "Could not fetch blockchain results"},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    parties = Party.objects.all()
    results = []
    total_votes = sum(int(v) for v in counts.values())

    for party in parties:
        votes = int(counts.get(str(party.id), 0))
        results.append({
            "id": party.id,
            "name": party.name,
            "short_name": party.short_name,
            "color": party.color,
            "votes": votes,
            "percentage": round((votes / total_votes) * 100, 1) if total_votes else 0,
        })

    return Response({"results": results, "total_votes": total_votes})


@api_view(["GET"])
def check_voter_status(request, voter_id):
    try:
        has_voted = query_chaincode("HasVoted", [voter_id]) == "true"
    except FabricServiceError as exc:
        return Response({"error": str(exc)}, status=status.HTTP_502_BAD_GATEWAY)

    return Response({"voter_id": voter_id, "has_voted": has_voted})


@api_view(["GET"])
def get_election_info(request):
    settings = ElectionSettings.objects.first()
    if settings:
        return Response(ElectionSettingsSerializer(settings).data)

    return Response({
        "election_name": "Fabric Referendum",
        "total_voters": 100,
        "is_active": True,
    })
