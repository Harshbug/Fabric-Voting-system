from datetime import date
from django.core.management.base import BaseCommand
from voting.models import Party, ElectionSettings


PARTIES = [
    {
        "name": "Progress Alliance",
        "short_name": "PA",
        "description": "Focus on innovation and infrastructure.",
        "color": "#2563eb",
        "leader": "Alex Morgan",
        "manifesto": "Green energy;Education reform;Digital infrastructure",
        "icon": "trending-up",
    },
    {
        "name": "Unity Coalition",
        "short_name": "UC",
        "description": "Community-first policies and healthcare.",
        "color": "#16a34a",
        "leader": "Jordan Lee",
        "manifesto": "Universal healthcare;Local jobs;Housing support",
        "icon": "groups",
    },
    {
        "name": "Liberty Front",
        "short_name": "LF",
        "description": "Economic freedom and transparent governance.",
        "color": "#dc2626",
        "leader": "Sam Rivera",
        "manifesto": "Tax transparency;Small business grants;Open data",
        "icon": "balance",
    },
]


class Command(BaseCommand):
    help = "Seed demo parties and election settings for the referendum UI"

    def handle(self, *args, **options):
        for data in PARTIES:
            Party.objects.update_or_create(
                short_name=data["short_name"],
                defaults=data,
            )

        ElectionSettings.objects.get_or_create(
            defaults={
                "election_name": "Fabric Referendum 2026",
                "election_date": date.today(),
                "total_voters": 100,
                "is_active": True,
            },
        )

        self.stdout.write(self.style.SUCCESS("Demo parties and election settings ready."))
