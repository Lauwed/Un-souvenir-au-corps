/* ===== LIBRARIES ===== */
#include <SD.h>
// Body temperature
#include <OneWire.h>
#include <DallasTemperature.h>

/* ===== CONSTANTS ===== */
// Heart rate
#define SAMP_SIZE 5
#define RISE_THRESHOLD 5

File f;

/* ===== PIN VARIABLES ===== */
int tempPin = 5;
int heartPin = 0;
int movPin = 8;
int soundPin = 1;

/* ===== HEART RATE VARIABLES ===== */
float reads[SAMP_SIZE], sum,
      last, reader, start,
      first, second, third,
      before, printValue;
long int now, ptr, lastBeat;
bool rising;
int risingCount, n;

/* ===== BODY TEMPERATURE VARIABLES ===== */
OneWire oneWire(tempPin);
DallasTemperature tempSensor(&oneWire);
float tempValue;

/* ===== MOVEMENT VARIABLES ===== */
int movValue;

void setup() {
  /* ===== SERIAL START ===== */
  Serial.begin(9600);

  /* ===== MOVEMENT BEGIN ===== */
  pinMode(movPin, INPUT);

  /* ===== TEMPERATURE BEGIN ===== */
  tempSensor.begin();

  /* ===== VARIABLES INITIALIZATION ===== */
  // Heart rate
  for(int i = 0; i < SAMP_SIZE; i++) {
    reads[i] = 0;
  }
  sum = 0;
  ptr = 0;
  // Body tempareture
  tempValue = 0;
  // Movement
  movValue = 0;
}

void loop() {
  n = 0;
  start = millis();
  reader = 0.;

  // Last 20ms
  // Take inputs during 20ms and sum them
  do {
    reader += analogRead(heartPin);
    n++;
    now = millis();
  } while(now < start + 10);

  // Do an average of the last heart beats taken
  // to create smooth datas
  reader /= n; // Take an average of the values
  sum -= reads[ptr]; // Substract the oldest reading from the sum
  sum += reader;
  reads[ptr] = reader;
  last = sum / SAMP_SIZE;

  // If the curve begins to rise
  if(last > before) {
    risingCount ++;

    // While the curve is rising (limited by the
    // const RISE_THRESHOLD
    // The Serial prints the output every 20ms
    if(!rising && risingCount > RISE_THRESHOLD) {
      rising = true;
      first = millis() - lastBeat;
      lastBeat = millis();
      printValue = 60000. / (0.4*first + 0.3*second + 0.3*third);
      third = second;
      second = first;

      /* ==== BODY TEMPERATURE ===== */
      tempSensor.requestTemperatures();
      tempValue = tempSensor.getTempCByIndex(0);

      /* ===== SERIAL PLOT PRINT ===== */
      Serial.print(printValue);
      Serial.print("\t");
      Serial.print(tempValue);
      Serial.print("\t");
      Serial.print(analogRead(soundPin));
      Serial.print("\t");

      /* ===== WRITE IN THE FILE ===== */
      if(f) {
        f.write("h");
        f.write(printValue);
      }
    }
  }

  // When the curve isn't rising
  else {
    rising = false;
    risingCount = 0;
  }

  before = last;

  ptr++; // Update the index of the array
  ptr %= SAMP_SIZE; // it restarts at 0 when needed

  /* ===== MOVEMENT ===== */
  if(digitalRead(movPin) == HIGH) {
    movValue = 100;
  }
  else {
    movValue = 0;
  }
  Serial.println(movValue);
}
