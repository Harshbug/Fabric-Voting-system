from django.test import TestCase
from unittest.mock import patch
from voting.models import Party


class CastVoteTests(TestCase):
    def setUp(self):
        Party.objects.create(
            name="Test Party",
            short_name="TP",
            description="Test",
            color="#000000",
            leader="Leader",
            manifesto="Policy",
        )

    @patch("voting.views.query_chaincode", return_value="false")
    @patch("voting.views.invoke_chaincode", return_value="")
    def test_cast_vote_success(self, _invoke, _query):
        from django.test import Client

        client = Client()
        party = Party.objects.first()
        res = client.post(
            "/api/vote/",
            {"voter_id": "voter-test", "party_id": party.id},
            content_type="application/json",
        )
        self.assertEqual(res.status_code, 201)
