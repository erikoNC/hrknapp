#include <Wire.h>
#include <LCD.h>
#include <LiquidCrystal_I2C.h>

#include <FirmataDefines.h>
#include <FirmataConstants.h>
#include <Boards.h>
#include <Firmata.h>
#include <FirmataMarshaller.h>
#include <FirmataParser.h>

#include <require_cpp11.h>
#include <MFRC522.h>
#include <deprecated.h>
#include <MFRC522Extended.h>

#define SS_PIN 10
#define RST_PIN 9

// Create MFRC522 instance
MFRC522 rfid(SS_PIN, RST_PIN);

// RFID tags
byte tags[][4] = {
  {0x46, 0x03, 0x25, 0xD9},
  {0xB5, 0x41, 0x64, 0x67}
};

// LCD
LiquidCrystal_I2C lcd(0x27,2,1,0,4,5,6,7); // 0x27 is the I2C bus address for an unmodified backpack

// Piezo & Button
const int piezo = 3;
const int button = 2;

// Other
const unsigned long AUTHORIZATION_EXPIRE_TIME = 20000;
unsigned long timeAuthorized;

unsigned long currentTime = 0;
unsigned long pastTime = 0;
unsigned int seconds = 0;
bool authorized = false;

void setup() {
  // Setup serial communcation with host
  Serial.begin(9600); // Initialize serial communication with the host
  SPI.begin();        // Init SPI bus

  // Setup RFID
  rfid.PCD_Init(); // Init MFRC522 card
  Serial.println("Scan PICC to see UID and type");

  // Setup LCD
  lcd.begin(16,2);
  lcd.setBacklightPin(3, POSITIVE);
  lcd.setBacklight(HIGH);

  pinMode(piezo, OUTPUT);
  pinMode(button, INPUT);
}

void loop() {
  currentTime = millis();
  unsigned long timeSinceAuthorization = timeAuthorized + AUTHORIZATION_EXPIRE_TIME;
  unsigned long timePassed = currentTime - pastTime;
  
  if (authorized && (timePassed >= 1000)) {
    seconds++;
    pastTime = currentTime;
    unsigned long timeRemaining = (AUTHORIZATION_EXPIRE_TIME / 1000) - seconds;
    printString(String(timeRemaining), 1);
  }
  
  if (currentTime > timeSinceAuthorization) {
    lcd.clear();
    authorized = false;
    seconds = 0;
  }

  if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
    Serial.print("Reading tag:");
    printHex(rfid.uid.uidByte, rfid.uid.size); 

    if (!authorized) {
      if (isAuthorized()) {
        authorized = true;
        timeAuthorized = millis();
        printString("Authorized :)", 0);
        playAuthorizedSound();
        Serial.println(" is authorized!");
      } else {
        authorized = false;
        printString("Unauthorized :/", 0);
        playUnauthorizedSound();
        Serial.println(" is not authorized!");
      } 
    }
  }

  int buttonState = digitalRead(button);
  if (buttonState == HIGH && authorized) {
    Serial.println("User is authorized to perform action"); 
    Firmata.sendString("ACTION_CREATE_POST");
  }
}

bool isAuthorized() {
  int numberOfTags = sizeof(tags) / sizeof(tags[0]);
  for (int i = 0; i < numberOfTags; i++) {
    if (rfid.uid.uidByte[0] == tags[i][0] &&
    rfid.uid.uidByte[1] == tags[i][1] &&
    rfid.uid.uidByte[2] == tags[i][2] &&
    rfid.uid.uidByte[3] == tags[i][3]) {
      return true;
    }
  }
  return false;
}

void printHex(byte *buffer, byte bufferSize) {
  for (byte i = 0; i < bufferSize; i++) {
    Serial.print(buffer[i] < 0x10 ? " 0" : " ");
    Serial.print(buffer[i], HEX);
  }
}

void printString(String text, int row) {
  for (int i = 15; i > sizeof(text); i--) {
    lcd.print(" ");
  }
  
  lcd.setCursor(0, row);
  lcd.print(text);
}

void playUnauthorizedSound() {
  tone(piezo, 1000);
  delay(500);
  noTone(piezo);
  delay(500);
}

void playAuthorizedSound() {
  tone(piezo, 1000);
  delay(50);
  tone(piezo, 1250);
  delay(50);
  tone(piezo, 1500);
  delay(100);
  noTone(piezo);
  delay(500);
}

