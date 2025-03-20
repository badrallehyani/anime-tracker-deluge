import os, json

from .deluge_client import MyDelugeClient
from .tracker import Tracker

def get_good_path(filename):
    return os.path.join( os.path.dirname(__file__), filename )
    
# Load Configurations
conf_file_name = get_good_path('conf.json')
conf: dict = json.load(open(conf_file_name, 'r'))

sleep_between_animes    = int(conf.get('sleep_between_animes'))
sleep_between_updates   = int(conf.get('sleep_between_updates'))

deluge_host             = conf.get("deluge_host")
deluge_port             = conf.get("deluge_port", 8112)
deluge_password         = conf.get("deluge_password", "deluge")


# Creating The Downloader
downloader = MyDelugeClient(deluge_host, port = deluge_port)
downloader.login("deluge")

def send_to_downloader(torrent_urls, path):
    downloader.add_download(torrent_urls, path)

# Create Tracker
tracker_data_file_name = get_good_path("tracker_data.json")
tracker_recent_file_name = get_good_path("recent.json")

def get_tracker_app():
    
    tracker = Tracker(
        tracker_data_file_name,
        tracker_recent_file_name,
        send_to_downloader,
        sleep_between_animes = sleep_between_animes,
        sleep_between_updates = sleep_between_updates,
    )
    
    return tracker