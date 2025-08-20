import subprocess
import os
from django.utils import timezone
from datetime import timedelta
import requests
import tarfile

def createBackupBD():
    
    stdout = subprocess.run(["pipenv", "run" ,"python", "/api/manage.py","dbbackup"], check=True, capture_output=True, text=True).stdout

    # If list folder is major 30 remove older file
    list_of_files = os.listdir('/api/backups')
    
    if len(list_of_files) >= 30:
        full_path_list = [os.path.join('/api/backups', f) for f in list_of_files]
        full_path_list.sort(key=os.path.getctime)
        os.remove(full_path_list[0])

def updateGeoipFile():
    downloadDir='/api/geoip2'
    geoipKey = os.environ.get('GEOIP2_KEY')
    url = f'https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-Country&license_key={geoipKey}&suffix=tar.gz'

    # Make a HEAD request to get the file header information
    response = requests.head(url)

    # Get the file name from the Content-Disposition header
    content_disposition = response.headers.get('Content-Disposition')
    remote_file_name = content_disposition.split('filename=')[1] if 'filename=' in content_disposition else 'GeoLite2-Country.tar.gz'

    local_file_path = os.path.join(downloadDir, remote_file_name)

    # If the file does not exist locally, download and extract it
    if not os.path.isfile(local_file_path):
        # Check if the directory exists, if not create it
        if not os.path.exists(downloadDir):
            os.makedirs(downloadDir)

        download_and_extract(downloadDir, url, remote_file_name)



def download_and_extract(download_dir, url, file_name):
    # Download the file
    response = requests.get(url, stream=True)
    file_path = os.path.join(download_dir, file_name)

    # Write the content of the response to a file
    with open(file_path, 'wb') as file:
        for chunk in response.iter_content(chunk_size=128):
            file.write(chunk)

    # Extract the content of the tar file
    with tarfile.open(file_path, 'r:gz') as tar:
        for member in tar.getmembers():
            if member.isreg() and member.name.endswith('GeoLite2-Country.mmdb'):
                member.name = os.path.basename(member.name)  # remove the path by reset it
                tar.extract(member, download_dir)



        


