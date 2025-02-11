import json
from flask import Blueprint, request

from tracker_stuff.tracker import Tracker


def create_main_routes_bp(t: Tracker):

    main_routes_bp = Blueprint('main_routes_bp', __name__)

    # GET
    @main_routes_bp.route('/get_logs', methods = ['GET'])
    def get_logs():
        return t.get_logs()
    
    @main_routes_bp.route('/get_updates_info', methods = ['GET'])
    def get_updates_info():
        return t.get_updates_info()

    @main_routes_bp.route('/get_recent', methods = ['GET'])
    def get_recent():
        return t.get_recent()
    
    @main_routes_bp.route('/get_data', methods = ['GET'])
    def get_data():
        return t.get_data()

    @main_routes_bp.route('/get_animes', methods = ['GET'])
    def get_animes():
        return t.get_data()

    

    # POST
    @main_routes_bp.route('/clear_logs', methods = ['POST'])
    def clear_logs():
        t.clear_logs()
        return "Ok"

    @main_routes_bp.route('/refresh', methods = ['POST'])
    def refresh():
        return json.dumps(t.download_new(), default=vars)

    @main_routes_bp.route('/clear_recent', methods = ['POST'])
    def clear_recent():
        return t.clear_recent()
    
    @main_routes_bp.route('/add_anime', methods = ['POST'])
    def add_anime():
        if not request.is_json:
            return "invalid json"

        data = request.get_json()

        name = data.get('name')
        keyword = data.get('keyword')
        submitter = data.get('submitter')
        path = data.get('path')

        if not all([name, keyword, path, submitter]):
            return "missing data (should be: name, keyword, submitter, path)"

        return json.dumps(t.add_anime(name, keyword, submitter, path))

    @main_routes_bp.route('/remove_anime', methods = ['POST'])
    def remove_anime():
        if not request.is_json:
            return "invalid json"

        data = request.get_json()

        name = data.get('name')

        if not all([name]):
            return "missing data (should be: name)"

        return json.dumps(t.remove_anime(name))
    
    @main_routes_bp.route('/edit_anime', methods = ['POST'])
    def edit_anime():
        if not request.is_json:
            return "invalid json"

        data: dict = request.get_json()

        old_name = data.get('old_name')
        new_name = data.get('new_name')
        keyword = data.get('keyword')
        submitter = data.get('submitter')
        path = data.get('path')

        if not all([old_name, new_name, keyword, submitter, path]):
            return "missing data (should be: old_name, new_name, keyword, submitter, path)"

        return json.dumps(t.edit_anime(old_name, new_name, keyword, submitter, path))



    return main_routes_bp
