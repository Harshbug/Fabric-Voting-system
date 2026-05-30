from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"parties", views.PartyViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("health/", views.health, name="health"),
    path("vote/", views.cast_vote, name="cast_vote"),
    path("results/", views.get_results, name="get_results"),
    path("voter/<str:voter_id>/status/", views.check_voter_status, name="voter_status"),
    path("election-info/", views.get_election_info, name="election_info"),
]
