from subprocess import Popen

while True:
    print("starting")
    p = Popen("python " + "twitterStream.py", shell=True)
    p.wait()