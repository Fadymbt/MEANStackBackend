import requests
import sys

url = str(sys.argv[1])
r = requests.get(url, allow_redirects=True)

lines = r.text.split("\n")

for i in range(len(lines)):
      lines[i] = lines[i] + "\n"

lines_string = ''.join(map(str, lines))
lines_string = lines_string.replace("'", "")

print(lines_string)
# print(lines_string.encode("unicode_escape").decode("utf-8"))
