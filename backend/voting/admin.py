from django.contrib import admin
from .models import Party, Vote, ElectionSettings

@admin.register(Party)
class PartyAdmin(admin.ModelAdmin):
    list_display = ['name', 'short_name', 'leader', 'color', 'created_at']
    search_fields = ['name', 'leader']
    list_filter = ['created_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'short_name', 'leader')
        }),
        ('Visual Design', {
            'fields': ('color', 'icon')
        }),
        ('Details', {
            'fields': ('description', 'manifesto')
        }),
    )


@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    list_display = ['voter_id', 'party', 'timestamp']
    list_filter = ['party', 'timestamp']
    search_fields = ['voter_id']
    readonly_fields = ['timestamp']
    
    def has_add_permission(self, request):
        # Prevent manual vote addition through admin
        return False


@admin.register(ElectionSettings)
class ElectionSettingsAdmin(admin.ModelAdmin):
    list_display = ['election_name', 'election_date', 'total_voters', 'is_active']
    
    def has_add_permission(self, request):
        # Only allow one settings object
        return not ElectionSettings.objects.exists()
