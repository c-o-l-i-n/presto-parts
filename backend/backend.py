from flask import Flask
app = Flask(__name__)

@app.route('/test')
def hello():
  return 'You did it'

if __name__ == '__main__':
  app.run()
