from rest_framework import serializers
from .models import Party, Vote, ElectionSettings

class PartySerializer(serializers.ModelSerializer):
    manifesto_list = serializers.SerializerMethodField()
    vote_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Party
        fields = ['id', 'name', 'short_name', 'description', 'color', 
                  'leader', 'manifesto', 'manifesto_list', 'icon', 'vote_count']
    
    def get_manifesto_list(self, obj):
        return obj.get_manifesto_list()
    
    def get_vote_count(self, obj):
        return obj.votes.count()


class VoteSerializer(serializers.ModelSerializer):
    party_name = serializers.CharField(source='party.name', read_only=True)
    
    class Meta:
        model = Vote
        fields = ['id', 'party', 'party_name', 'voter_id', 'timestamp']
        read_only_fields = ['timestamp']


class ElectionSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElectionSettings
        fields = '__all__'
