from mmpc.models import deniedGeoip
from django.http import HttpResponseForbidden
from urllib.parse import urlparse
from os import environ
import geoip2.database

allowed_domains = environ.get('DJANGO_ALLOWED_DOMAINS_REFERER').split(',')
allowed_hosts = environ.get('DJANGO_ALLOWED_HOSTS_REFERER').split(',')


class IpFilterMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        domain = request.META.get('HTTP_ORIGIN')
        host = request.META.get('HTTP_HOST')

        if host in allowed_hosts or any(
                allowed_domain == urlparse(domain).netloc for allowed_domain in allowed_domains):
            http_x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            if http_x_forwarded_for is not None:
                request.META['IP_ORIGIN'] = http_x_forwarded_for.split(",")[-1].strip()
            else:
                request.META['IP_ORIGIN'] = request.META.get('REMOTE_ADDR')

            response = self.get_response(request)
            return response
        else:
            return HttpResponseForbidden('Unauthorized access')


class AllowCountryMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.reader = geoip2.database.Reader('/api/geoip2/GeoLite2-Country.mmdb')
        self.allowed_countries = ['ES', 'AT']
        self.geoip2_status = environ.get('GEOIP2_STATUS')

    def __call__(self, request):
        if self.geoip2_status == 'start':
            ip = request.META.get('IP_ORIGIN', '')
            try:
                response = self.reader.country(ip)
                if response.country.iso_code not in self.allowed_countries:
                    newDeniedGeoip = deniedGeoip(
                        ip=ip,
                        country=response.country.iso_code,
                        user_agent=request.META.get('HTTP_USER_AGENT', '')
                    )
                    newDeniedGeoip.save()
                    poolBoot.apply_async(sendMessageBot,
                                         [f'Unauthorized access country {ip} - {response.country.iso_code}', 'login'])
                    return HttpResponseForbidden('Unauthorized access C')
            except geoip2.errors.AddressNotFoundError:
                pass

        return self.get_response(request)
