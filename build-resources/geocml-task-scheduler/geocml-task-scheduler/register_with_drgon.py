from task_logger  import log
import bs4 as bs
import os
import requests

def register_with_drgon():
    host = os.environ["DRGON_HOST"]
    api_key = os.environ["DRGON_API_KEY"]

    if host == "" or api_key == "":
        log("Host or API key not found, can't register this deployment with DRGON.")
        return 0

    res = requests.get("http://geocml-server/cgi-bin/qgis_mapserv.fcgi?SERVICE=WFS&VERSION=1.3.0&REQUEST=GetCapabilities")
    xml = bs.BeautifulSoup(res.text, "html.parser")
    abstract = xml.find("ows:abstract", text=lambda text: isinstance(text, bs.CData)).string.strip()
    title = xml.find("ows:title").text
    url = "https://google.com"  # TODO: make this dynamic
    owner = xml.find("ows:individualname").text
    keywords = xml.find("ows:keywords").find_all("ows:keyword")
    tags = ""
    for keyword in keywords:
        tags += f"{keyword.text},"
    tags = tags[:-1]

    res = requests.post(f"{host}/registry", json={
        "title": title,
        "description": abstract,
        "url": url,
        "owner": owner,
        "tags": tags,
        "key": api_key
    })

    if res.json()["message"] != "Done.":
        log(f"Failed to register deployment with DRGON: {res.json()['message']}")
