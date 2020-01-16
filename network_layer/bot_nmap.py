import nmap

nmScan  = nmap.PortScanner()
####     return nmScan.scan(hosts='192.168.36.0/24',arguments='-n -sP -PE -PA21,23,80,3389')

def getPorts(ip):
    return nmScan.scan(ip,'0-1023')

