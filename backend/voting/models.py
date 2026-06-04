from django.db import models
from django.core.validators import MinValueValidator


# schema definition
class Party(models.Model):
    name = models.CharField(max_length=200)
    short_name = models.CharField(max_length=50)
    description = models.TextField()
    color = models.CharField(max_length=7, default='#000000')  # Hex color
    leader = models.CharField(max_length=200)
    manifesto = models.TextField(help_text="Separate policies with semicolon (;)")
    icon = models.CharField(max_length=50, default='account-balance')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "Parties"
        ordering = ['name']
    
    def __str__(self):
        return self.name
    
    def get_manifesto_list(self):
        """Convert manifesto string to list"""
        return [item.strip() for item in self.manifesto.split(';') if item.strip()]


class Vote(models.Model):
    party = models.ForeignKey(Party, on_delete=models.CASCADE, related_name='votes')
    voter_id = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']
        unique_together = ['voter_id']  # One vote per voter
    
    def __str__(self):
        return f"{self.voter_id} voted for {self.party.name}"


class ElectionSettings(models.Model):
    election_name = models.CharField(max_length=200, default="General Election 2025")
    election_date = models.DateField()
    total_voters = models.IntegerField(default=10, validators=[MinValueValidator(1)])
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name_plural = "Election Settings"
    
    def __str__(self):
        return self.election_name
