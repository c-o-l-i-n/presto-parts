from flask import Flask, request
from separate_song_parts import seperate_song_parts
from generate_instrument_parts_and_master import generate_instrument_parts_and_master

app = Flask(__name__)

@app.route('/separate', methods=['POST'])
def separate():
  output_folder = seperate_song_parts(request.form['pdf-source-path'], request.form['parts-list'], request.form['song-title'])
  return f'Seperated PDFs created in folder: {output_folder}'

@app.route('/generate', methods=['POST'])
def generate():
  output_folder = generate_instrument_parts_and_master(request.form['song-list'], request.form['song-folders-location'], request.form['parts-list'], request.form['collection-name'])
  return f'Intrument Part PDFs and Master PDF created in folder: {output_folder}'

if __name__ == '__main__':
  app.run(debug=True, port=14161)
