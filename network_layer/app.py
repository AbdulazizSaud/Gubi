from flask import Flask
import bot_nmap as botmap
import json


app = Flask(__name__)


@app.route('/nmap/<ip>',methods=['GET'])
def nmap(ip):
    return json.dumps(botmap.getPorts(ip))



app.run(host='0.0.0.0',use_reloader=False)

