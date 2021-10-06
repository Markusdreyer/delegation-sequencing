from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse
import json
import controller
from controller import parse_model

class RequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        self.send_response(200)
        self.end_headers()
        self.wfile.write(json.dumps({
            'method': self.command,
            'path': self.path,
            'real_path': parsed_path.query,
            'query': parsed_path.query,
            'request_version': self.request_version,
            'protocol_version': self.protocol_version
        }).encode())
        return

    def do_POST(self):
        print("In post", self.headers)
        content_len = int(self.headers.get('content-length'))
        post_body = self.rfile.read(content_len)
        changes = json.loads(post_body)
        print(f"changes {changes['body']}")
        trace = controller.generate_initial()
        new_model = controller.revise_model(trace, changes['body'])
        parsed_model = parse_model(new_model)
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps({
            "model": parsed_model}
            ).encode())
        return

if __name__ == '__main__':
    server = HTTPServer(('localhost', 8080), RequestHandler)
    print('Starting server at http://localhost:8080')
    #controller.run()
    server.serve_forever()
