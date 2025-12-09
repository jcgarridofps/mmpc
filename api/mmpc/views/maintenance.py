from django.http import JsonResponse
from maintenance_mode.core import get_maintenance_mode


def maintenance_status(request):
    is_maintenance_mode = get_maintenance_mode()
    return JsonResponse({'isMaintenanceMode': is_maintenance_mode})
