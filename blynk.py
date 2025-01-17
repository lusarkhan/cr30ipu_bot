#!/bin/python

//please change INFLUXDBIP,DATABASENAME,IPADRESSBLYNK,ENTERATUHTOKEN

from urllib2 import Request, urlopen
from influxdb import InfluxDBClient


import influxdb_client, os, time
from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS

token = os.environ.get("vupbYWZ9s94KFOJ22huYRoNXqos_Mw8gUAXuCUOgWOCG7a4bzI-t1q-9eal0_wKR6_JJkJq-c7M38rWFMpNNpw==")
org = "IT"
url = "http://94.131.111.74:8086"

write_client = influxdb_client.InfluxDBClient(url=url, token=token, org=org)
client = InfluxDBClient(url=url, database='blynk', token=token)

bucket="blynk"

write_api = client.write_api(write_options=SYNCHRONOUS)

P = str(2)
request = Request('http://193.150.33.31:8080/wllzmq24Nr0dmmMvDxIMwKSSINfN5Uqf/get/V%s' % P)
response_body = urlopen(request).read()
response = response_body[2:-2]
print response
measurement = [
    {
        "measurement": "V%s" % P,
            "tags" : {
                "machine": "silvia"
            },
            "fields" : {
                "value": response
            }
    }
]
        
client.write_points(measurement) 
time.sleep(10)
