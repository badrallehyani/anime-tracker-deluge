import logging

from flask import Flask, request
from flask_cors import CORS, cross_origin
from threading import Lock

from .flask_routes import create_main_routes_bp
from tracker_stuff.tracker import Tracker

def get_flask_app(t: Tracker, react_server_url: str) -> Flask:
    flask_app = Flask(__name__)
    main_routes_bp = create_main_routes_bp(t)
    
    CORS(flask_app, origins =[
        react_server_url
    ])
    
    flask_app.register_blueprint(main_routes_bp)
    
    # disabling werzeug (flask logger) propagation
    flask_logger = logging.getLogger('werkzeug')
    flask_logger.propagate = False
    
    # giving it a seperate file
    flask_logger.addHandler(
        logging.FileHandler('flask.log', mode='a')
    )
    
    return flask_app