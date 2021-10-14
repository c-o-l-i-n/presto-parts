from flask import Flask, request
import json
import logging.config
from separate_song_parts import seperate_song_parts
from generate_instrument_parts_and_master import generate_instrument_parts_and_master


logging.config.dictConfig({
  'version': 1,
  'formatters': {'default': {
    'format': '[%(asctime)s] %(levelname)s in %(module)s: %(message)s',
  }},
  'handlers': {
    'info': {
      'level': 'INFO',
      'class': 'logging.StreamHandler',
      'stream': 'ext://sys.stdout',
      'formatter': 'default'
    },
    'error': { 
      'level': 'ERROR',
      'class': 'logging.StreamHandler',
      'stream': 'ext://sys.stderr',
      'formatter': 'default',
    },
  },
  'root': {
    'level': 'INFO',
    'handlers': ['info', 'error']
  }
})


app = Flask(__name__)


@app.route('/separate', methods=['POST'])
def separate():
  data = json.loads(request.data)
  output_folder = seperate_song_parts(data['pdf-source-path'], data['parts-list'], data['song-title'])
  return f'Seperated PDFs created in folder: {output_folder}'


@app.route('/generate', methods=['POST'])
def generate():
  data = json.loads(request.data)
  output_folder = generate_instrument_parts_and_master(data['song-list'], data['song-folders-location'], data['parts-list'], data['collection-name'])
  return f'Intrument Part PDFs and Master PDF created in folder: {output_folder}'


if __name__ == '__main__':
  app.run(port=14161)
