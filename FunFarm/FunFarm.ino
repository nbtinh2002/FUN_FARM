#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>
#include <DHT.h>

#define WIFI_SSID "IoT Lab"
#define WIFI_PASSWORD "IoT@123456"
#define DATABASE_URL "smart-home-ef536-default-rtdb.firebaseio.com" //URL firebase
#define LED D1
#define CALL D2
#define MQ2 A0 
#define DHTPIN 14  //chan D5
#define DHTTYPE DHT11

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

DHT dht(DHTPIN, DHTTYPE);
bool Den = false;
bool Chuong = false;
unsigned long sendDataPrevMillis = 0;
float h,t;
int mq2;
void setup()
{
  Serial.begin(115200);
  pinMode(LED, OUTPUT);
  pinMode(CALL, OUTPUT);
  pinMode(MQ2, OUTPUT);
  digitalWrite(LED, LOW);
  digitalWrite(CALL, HIGH);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(300);
  }

  dht.begin();
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  // Serial.printf("Firebase Client v%s\n\n", FIREBASE_CLIENT_VERSION);

  config.database_url = DATABASE_URL;
  config.signer.test_mode = true;
  Firebase.reconnectNetwork(true);
  fbdo.setBSSLBufferSize(4096, 1024);
  Firebase.begin(&config, &auth);
}

void loop()
{
  h = dht.readHumidity();
  t = dht.readTemperature();
  mq2 = analogRead(MQ2);

  if (isnan(h) || isnan(t)|| isnan(mq2)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }


  if (millis() - sendDataPrevMillis > 2000 )
  {
    sendDataPrevMillis = millis();
    Serial.printf("Nhiet do: %f°C \n", t);
    Serial.printf("Set float... %s\n", Firebase.setFloat(fbdo, "/HN/Nhietdo", t) ? "ok" : fbdo.errorReason().c_str());
    Serial.printf("Do am: %f \n", h);
    Serial.printf("Set float... %s\n", Firebase.setFloat(fbdo, "/HN/Doam", h) ? "ok" : fbdo.errorReason().c_str());
    Serial.printf("Do pH: %f \n", mq2);
    Serial.printf("Set float... %s\n", Firebase.setFloat(fbdo, "/HN/Khigas", mq2) ? "ok" : fbdo.errorReason().c_str());
  }
  Serial.printf("Set bool... %s\n", Firebase.getBool(fbdo, F("/Control/Den"), &Den) ? "ok" : fbdo.errorReason().c_str());
  Serial.printf("Set bool... %s\n", Firebase.getBool(fbdo, F("/Control/Chuongbao"), &Chuong) ? "ok" : fbdo.errorReason().c_str());

  if(Den){
      digitalWrite(LED, HIGH);
      Serial.printf("Lamp: ON\n");
  }
  else {
      digitalWrite(LED, LOW);
      Serial.printf("Lamp: OFF\n");
  }
    if(!Chuong){
      analogWrite(CALL, 255);
      Serial.printf("Chuong: OFF\n");
  }
  else {
      analogWrite(CALL, 250);
      Serial.printf("Chuong: ON\n");
  }
  // if(!Chuong){
  //     digitalWrite(CALL, HIGH);
  //     Serial.printf("Chuong: OFF\n");
  // }
  // else {
  //     digitalWrite(CALL, LOW);
  //     Serial.printf("Chuong: ON\n");
  // }
}