import os, json, time
from threading import Lock

import logging
log_file_name = os.path.join( os.path.dirname(__file__), 'log.log' )
logging.basicConfig(filename=log_file_name, format='%(asctime)s - %(message)s', level=logging.INFO)

from .nyaasi import Nyaasi, NyaasiResult


class Tracker:
    def __init__(self,
                 data_file_name,
                 recent_file_name,
                 send_to_downloader,
                 sleep_between_animes = 15,
                 sleep_between_updates = 1800,
        ):
        
        self.data_file_name = data_file_name
        self.recent_file_name = recent_file_name
        self.send_to_downloader = send_to_downloader
        self.sleep_between_animes = sleep_between_animes
        self.sleep_between_updates = sleep_between_updates

        self.last_update = -1
        self.next_update = -1
        self.lock = Lock()
        
    def get_logs(self):
        return open(log_file_name, "r").read()
    def clear_logs(self):
        return open(log_file_name, "w").write("")


    def get_updates_info(self):
        with self.lock:
            return {
                'last_update': self.last_update,
                'next_update': self.next_update
            }

    def run_loop(self):
        while True:
            self.download_new()
            print("Sleeping..")
            with self.lock:
                self.last_update = int(time.time())
                self.next_update = int(self.last_update + self.sleep_between_updates)
            
            time.sleep(self.sleep_between_updates)

    # RECENT.JSON
    def add_to_recent(self, files: list[tuple[dict, NyaasiResult]]):
        recent = self.get_recent()
        files_names = [
            {
                "ID": file[1].ID,
                "name": file[1].name,
                "timestamp": file[1].date.get("timestamp")
            }
            for file in files
        ]
        
        recent.extend(files_names)
        self.update_recent(recent)
        return recent

    def get_recent(self) -> list[str]:
        return json.load(open(self.recent_file_name, 'r'))
    
    def update_recent(self, files_list):
        open(self.recent_file_name, 'w').write(json.dumps(files_list))
        return True

    def clear_recent(self):
        data = []
        open(self.recent_file_name, 'w').write(json.dumps(data))
        return {'status': 'ok'}

    # DATA.JSON
    def add_anime(self, name, keyword, submitter, path) -> dict:
        # returns the new data
        
        data = self.get_data()
        
        for anime in data.get("anime_list"):
            if(anime.get("name") == name):
                return {
                    "ok": False, 
                    "message": f"Anime {name} already exists",
                    "anime_list": data.get("anime_list")
                }
        
        new_anime_list = data.get("anime_list")
        
        
        new_anime_list.append({
            "name": name,
            "keyword": keyword,
            "submitter": submitter,
            "done": [],
            "path": path
        })

        data.update({"anime_list": new_anime_list})
        self.update_data_file(data)

        return {
            "ok": True, 
            "message": f"Added {name}",
            "anime_list": data.get("anime_list")
        }

    def remove_anime(self, name):
        data = self.get_data()
        
        new_anime_list = [i for i in data.get('anime_list') if i.get('name') != name]
        
        data.update({"anime_list": new_anime_list})
        self.update_data_file(data)

        return {
            "ok": True, 
            "message": f"Removed {name}",
            "anime_list": data.get("anime_list")
        }
    
    def edit_anime(self, old_name, new_name, keyword, submitter, path):
        data = self.get_data()
        
        anime_list: list[dict] = data.get("anime_list")
        
        for anime in data.get("anime_list"):
            if(anime.get("name") == new_name):
                return {
                    "ok": False, 
                    "message": f"Anime {new_name} already exists",
                    "anime_list": data.get("anime_list")
                }
        
        for anime in anime_list:
            if(anime.get("name") == old_name):
                anime.update(
                    {
                        "name": new_name, 
                        "keyword": keyword, 
                        "submitter": submitter, 
                        "path": path
                        # "done": done
                    })
                break
            
        data.update({"anime_list": anime_list})
        self.update_data_file(data)
        
        return {
                "ok": True, 
                "message": f"Updated {old_name} to {new_name}",
                "anime_list": data.get("anime_list")
        }

    def get_data(self) -> dict:
        return json.load(open(self.data_file_name, 'r'))
    
    def update_data_file(self, data):
        open(self.data_file_name, 'w').write(json.dumps(data))
        
        
    def get_new(self):
        data = self.get_data()
        anime_list: list[dict] = data.get("anime_list")
        new_files: list[tuple[dict, NyaasiResult]] = []
        
        # store failed stuff
        failed_animes: list[dict] = []
        
        for anime in anime_list:
            name, keyword, submitter, done, path = (
                anime.get("name"), anime.get("keyword"),
                anime.get("submitter"), anime.get("done"),
                anime.get("path")
            )
            
            print(f"Processing {name}")
            
            # Search for episodes using keyword and submitter name
            try:
                result: list[NyaasiResult] = Nyaasi.searchByUser(keyword, submitter)
            except:
                print("Failed")
                failed_animes.append(anime)
                continue
            
            # get the results if that page is not in done stuff
            missing: list[tuple[dict, NyaasiResult]] = [ (anime, i) for i in result if i.URL not in done ]
            new_files.extend(missing)
            
            
            time.sleep(self.sleep_between_animes)
            
        return new_files
            

    def download_new(self):
        '''
        Gets New file using self.get_new() 
        then iterates over the files and 
        attempt to download them using self.send_to_downloader
        returns: list[tuple[dict, NyaasiResult]]
        '''

        new_files = self.get_new()

        success_files: list[tuple[dict, NyaasiResult]] = []
        
        for file in new_files:
            anime, result = file
            
            path = anime.get("path")
            torrent_file_url = result.links.get("torrent_file")
            
            try:
                self.send_to_downloader(torrent_file_url, path)
            except:
                print("Failed Adding")
                continue
            
            success_files.append(file)
        
        self.update_data(success_files)
        self.add_to_recent(success_files)
        return success_files
            
            
    def update_data(self, successful_files: list[tuple[dict, NyaasiResult]]):
        anime_list: list[dict] = self.get_data().get("anime_list")
        anime_names: list[str] = [anime.get("name") for anime in anime_list] 
        
        for file in successful_files:
            anime, result = file 
            
            # get the anime index of the new file
            anime_index = anime_names.index(anime.get("name"))
            
            # get the done urls of the anime
            already_done: list[str] = anime_list[anime_index].get("done")
            
            # add the new (page and not torrent) url to the done urls
            already_done.append(result.URL)
            
            # update the done urls
            anime_list[anime_index].update({"done": already_done})
        
        self.update_data_file({
            "anime_list": anime_list
        })