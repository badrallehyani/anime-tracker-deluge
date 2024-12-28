import os, json
from threading import Thread

from server.app import get_flask_app
from tracker_stuff.app import get_tracker_app

# Load Configurations
conf_file_name = os.path.join(os.path.dirname(__file__), 'conf.json')
conf: dict = json.load(open(conf_file_name, 'r'))

react_server_url        = conf.get('react_server_url')
python_server_host      = conf.get('python_server_host')
python_server_port      = conf.get("python_server_port")

# Create Tracker
tracker = get_tracker_app()

# Create Flask App
flask_app = get_flask_app(tracker, react_server_url)

flask_thread = Thread(target = flask_app.run, args = (python_server_host, python_server_port, False))
tracker_thread = Thread(target = tracker.run_loop)

flask_thread.start()
tracker_thread.start()

flask_thread.join()
tracker_thread.join()
