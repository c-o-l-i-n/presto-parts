from flask import Flask, request
from separate_song_parts import seperate_song_parts

app = Flask(__name__)

@app.route('/separate', methods=['POST'])
def separate():
  output_folder = seperate_song_parts(request.form['pdf-source-path'], request.form['parts-list'], request.form['song-title'])
  return f'Seperated PDFs created in folder: {output_folder}'

if __name__ == '__main__':
  app.run(debug=True)
