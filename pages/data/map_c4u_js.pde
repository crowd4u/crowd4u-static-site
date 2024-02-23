//map_c4u_0916.pde
//Processing.js
//LastUpdate:2013.09.20
//Contact: momy.og at gmail

String japanMap = "/img/mapG_black.png";
String spring = "/img/spring.png";
String summer = "/img/summer.png";
String autumn = "/img/autumn.png";
String winter = "/img/winter.png";
String C4Uicon = "/img/icon_b.png";

PImage mapImage;
PImage[] seasonImage = new PImage[4];
PImage icon;

PFont timeFont, dropFont;

int totalCount =48;
Place[] places;
int placeCount = 0;
Drop[] drops;
int dropCount = 0;

PauseEffect pauseEffect = new PauseEffect();

boolean playFlag = false;
boolean textOn;
boolean startFade, endFade, endFlag;

//size: mapA 
//46.038923,127.573242 -> -538523.886223, 5186760.55443
//29.835879,146.821289 -> 1062863.40809, 3314856.53891
float minX = -657530.389055;
float maxX = 1004917.13111;
float minY = 3455575.39699;
float maxY = 5111077.06178;

float mapWidth = 650; // mapsize:600 move:+50
float mapHeight = 620; // mapsize:600 move:+20
float fieldW = 700;
float fieldH = 700;

float setA, setB; //the lower: borderLine 500acts/1000acts

int drawNum=24; // スペック調整
int beginning=0;
int conclusion;
int j;

color bgDef = color(0, 0, 0); //default bgcolor

color[] setColor= { //seasonColor
  #FFFFFF, #FF82D0, #829BFF, #FBB03B
    //#A7FF82
};
color[] defColor= { //crowd4U LogoColor
  #D551BD, #5181D5, #8CC856, #D59851, #D551BD
};

//Class: Drop
int seasonFadeCount;
boolean lastMonthFade = false;
float actDay, actX, actY;

void setup() {
  size(700, 700);
  colorMode(RGB, 255, 255, 255);
  background(bgDef);
  smooth();
  timeFont = createFont("cursive", 32);
  dropFont = createFont("sans-serif", 32);
  //sans-serif,serif,monospace,fantasy,cursive

  icon = loadImage(C4Uicon);

  mapImage = loadImage(japanMap);
  image(mapImage, 50, 20);

  seasonImage[0]=loadImage(winter);
  seasonImage[1]=loadImage(spring);
  seasonImage[2]=loadImage(summer);
  seasonImage[3]=loadImage(autumn);

  readData();
  fill(0);
  noStroke();
  rect(0, mapHeight, fieldW-10, fieldH);

  setA = fieldH - actLine(500);
  setB = fieldH - actLine(1000);

  drops[0].setDrop();
  for (int i=1; i<dropCount; i++) {
    drops[i].setDrop();
  }
  noLoop();
  launch();
}

void launch() {
  j=0;
  conclusion = 0;
  endFade = false;
  endFlag = false;
  startFade = true;
  textOn = true;
  actDay = 0;
  actX = 5;
  actY = 0;
  for (int i=0; i<dropCount; i++) {
    drops[i].launch();
  }
}

public void draw() {
  if (startFade&&!endFade) {
    if (beginning==0) {
      pauseEffect.start();
      beginning++;
    }
    else if (beginning<124) {
      noStroke();
      smooth();
      rectMode(CORNER);

      fill(bgDef, beginning);
      rect(0, 0, fieldW-10, mapHeight);

      image(icon, 510, 575);
      image(mapImage, 50, 20);
      drops[j].seasonFade();
      drops[j].callCalendar();

      fill(bgDef, 255-beginning*2);
      rect(0, 0, width, mapHeight);

      if (beginning*6 < fieldW) {
        strokeWeight(1);
        stroke(100, 200);
        point(beginning*6, setA);
        point(beginning*6, setB);
      }
      beginning++;
    }
    else {
      fill(200, 100);
      textSize(8);
      textAlign(LEFT);
      text("500", 0, setA);
      text("1000", 0, setB);
      text("acts/day", 0, mapHeight+10);

      startFade = false;
    }
  }
  if (!startFade&&!endFade) {                  //startFade=endFade=false
    fade();
    drops[j].dailyDraw();
    for (int i=0; i < drawNum; i++) {
      if (i+j<dropCount) {
        drops[i+j].draw();
      }
      else {
        endFade = true;
        break;
      }
    }
    j++;
  }
  if (!startFade&&endFade) {                           //endFade=true
    if (conclusion<200) {
      noStroke();
      smooth();
      fill(0, 10);
      rectMode(CORNER);
      rect(0, 0, conclusion*width/100, height);
      conclusion++;
    }
    else {
      endFlag = true;
      noLoop();
      pauseEffect.endAndLoop();
    }
  }
}

void mousePressed() {
  if (!endFlag) {
    playFlag = !playFlag;
    if (playFlag) {
      loop();
    } 
    else {
      noLoop();
      pauseEffect.draw();
    }
  }
  else {
    playFlag = true;
    beginning = 1;
    launch();
    loop();
  }
}

float TX(float x) {
  return map(x, minX, maxX, 50, mapWidth-50);
}

float TY(float y) {
  return map(y, minY, maxY, mapHeight-20, -20);
}

void readData() {
  new Slurper();
}

Drop parseDrop(String dataLine) {
  //data2.csv: "id","date","time","code"
  //    int id = int(words[0]);
  String words[] = split(dataLine, ",");

  //date分割　"2012-10-28" -> year, month, day
  String date = words[0];
  String dates[] = split(date, "-");
  int year = int(dates[0]);
  int month = int(dates[1]);
  int day = int(dates[2]);

  //time分割 "00:00" -> hour,min
  String time = words[1];
  String times[] = split(time, ":");
  int hour = int(times[0]);
  int id = int(words[2]);

  float x = id == 0 ? null : places[id-1].x;
  float y = id == 0 ? null : places[id-1].y;
  int actNum = int(words[3]);
  return new Drop(x, y, year, month, day, hour, actNum);
}

Place parsePlace(String line) {
  //pref_latlong.csv: "code","prefecture","lat","lon"
  //pref_xy.csv: "code","prefecture","x","y"
  String words[] = split(line, ",");

  int id = int(words[0]);
  String pref = words[1];
  float x = float(words[2]);
  float y = float(words[3]);

  return new Place(id, x, y, pref);
}

void fade() {
  noStroke();
  smooth();

  //1: background_mapfield
  fill(bgDef, 100);
  rectMode(CORNER);
  rect(0, 0, fieldW-10, mapHeight);

  image(icon, 510, 575);
  image(mapImage, 50, 20);
}

int rndNextInt(int max) {
  return Math.floor( Math.random() * max);
}

int actConverse(int actNum) {
  if (actNum == 0) {
    return 0;
  }
  else {
    return 10+int(actNum)*(2/5);
  }
}

float actLine(int actNum) {
  return actNum*(2/50);
}

class Drop {
  int id;
  float x, y, targetX, targetY, moveX, moveY, incX, incY, r;
  String pref, date, time, year, month, day, mld;
  int rad, hour;
  int drawCount, actNum;
  int seasonNum, xx, yy, bright;
  int textWeight, textWeight;
  boolean lastDay;
  boolean goodAct, greatAct;

  public Drop(float x, float y, int year, int month, int day, int hour, int actNum) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.year = year;
    this.month = month;
    this.day = day;
    this.hour = hour;
    this.actNum = actNum;
  }

  void setDrop() {
    xx = (int)TX(x)+rndNextInt(10);
    yy = (int)TY(y)+rndNextInt(10);
    targetX = xx+rndNextInt(100)-50;
    targetY = yy+rndNextInt(100)-50;

    incX = float((targetX-xx)/drawNum);
    incY = float((targetY-yy)/drawNum);

    bright = 20;
    rad = actConverse(actNum);

    seasonNum = int(month/3);
    if (seasonNum==4) {
      seasonNum=0;
    }
    mld = monthLastDay();
    lastDay = false;
    goodAct = greatAct = false;

    if (50 < actNum && actNum <= 100) {
      goodAct = true;
    }
    if (100 < actNum) {
      greatAct = true;
    }
  }

  void launch() {
    moveX = xx;
    moveY = yy;
    drawCount = 0;
    r=3;
  }

  void draw() {
    noStroke();
    if (rad!=0) {
      if (goodAct) {
        fill(255, 255, 0, bright);
        textFont(dropFont, r);
        text("★", moveX, moveY);
      }
      else if (greatAct) {
        fill(255, 0, 100, bright);
        textFont(dropFont, r+15);
        text("❤", moveX, moveY);
      }
      else {
        fill(setColor[seasonNum], bright);
        ellipse(moveX, moveY, r, r);
      }

      if (lastMonthFade) { //with: switching seasonImage
        circleFade();
      }

      brightMaths();
      moveX+=incX;
      moveY+=incY;
      drawCount++;
    }
  }

  void brightMaths() {
    if (drawCount<int(drawNum/2)) {
      bright+=200/drawNum;
      if (r < rad) {
        r+=3;
      }
    }
    else {
      bright-=200/drawNum;
      if (!goodAct && !greatAct) {
        r--;
      }
      else {
        r+=2;
      }
    }
  }
  /*
  void brightMaths() {
   if (drawCount<int(drawNum/2)) {
   bright+=200/drawNum;
   }
   else {
   bright-=200/drawNum;
   }
   r+=3;
   }
   */

  int monthLastDay() {
    switch(month) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      return 31;
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
    case 2:
      return 28;
    }
  }

  void circleFade() {
    if (seasonFadeCount < 800) {
      noFill();
      stroke(255, 10);
      strokeWeight(10);
      ellipse(0, 0, seasonFadeCount, seasonFadeCount);
      strokeWeight(1);
      ellipse(0, 0, seasonFadeCount*0.9, seasonFadeCount*0.9);
      ellipse(0, 0, seasonFadeCount*1.1, seasonFadeCount*1.1);
      seasonFadeCount++;
    }
    else {
      lastMonthFade = false;
    }
  }



  void dailyDraw() {
    if (day == mld) {
      lastDay = true;
      if (month%3 == 2) {
        seasonFadeCount = 0;
        lastMonthFade = true;
      }
    }
    message();
    seasonFade();
    callCalendar();
    graph();
  }

  void message() {
    smooth();
    textAlign(LEFT);
    textFont(timeFont);
    textSize(20);
    fill(255, 0, 100, 100);
    text("❤", 550, 350);
    fill(255, 255, 0, 100);
    text("★", 550, 400);
    fill(255, 100);
    textSize(10);
    text("100 acts over /hour", 552, 365);
    text("50 acts over /hour", 552, 415);
  }

  void seasonFade() {
    //2: corner_seasonImage
    image(seasonImage[seasonNum], 0, 0, 400, 400);

    //3: SideBar 
    noStroke();
    fill(setColor[seasonNum], 20);
    rect(fieldW-10, 0, fieldW, fieldH);
  }

  void callCalendar() {
    if (day==1) {
      textOn = true; //Draw text:"Month" in graph();
    }

    textAlign(CENTER);
    //draw:year
    fill(255, 150);
    pushMatrix();
    rotate(-1*PI/4);
    textFont(timeFont, 100);
    text(year, 0, 160);
    popMatrix();

    //draw:month
    fill(255, 200);
    pushMatrix();
    rotate(-1*PI/4);
    textFont(timeFont, 200);
    text(month, 0, 300);
    popMatrix();

    //draw:day
    pushMatrix();
    for (int i=0; i<9; i++) {
      int drawDay = day+4-i;
      if (drawDay<=0) {
        drawDay=mld+drawDay;
      }
      if (drawDay>mld) {
        drawDay=drawDay-mld;
      }

      if (i<4) {
        fill(255, 50+i*30);
        textFont(timeFont, 10+i*3);
      }
      else if (i==4) {
        fill(255);
        textFont(timeFont, 25);
      }
      else {
        fill(255, 140-(i-5)*30);
        textFont(timeFont, 20-(i-4)*3);
      }
      text(drawDay, 0, 360);
      rotate(-1*PI/16);
    }
    popMatrix();
  }

  void graph() {
    if (actDay == day) { //日付順に整列済みのデータ
      actY += actNum;
    }
    else {
      actY = actLine(actY);
      stroke(100);
      line(actX, fieldH, actX, fieldH-actY);
      actX += 2;
      actY = 0;
      actDay = day;
    }

    if (lastDay && textOn) {
      textWeight = 20 + 15*rndNextInt(4);
      textAlpha = 50 + 20*rndNextInt(5);

      textAlign(RIGHT);
      fill(setColor[seasonNum], textAlpha);
      textFont(timeFont, textWeight);
      text(month, actX, fieldH);

      textOn = false;
    }
  }
}

class PauseEffect {
  int pauseSizeX = 80;
  int pauseSizeY = 80;
  int pauseStickSizeX = 10;
  int pauseStickSizeY = 40;
  int pauseStickSpace = 10;
  int pauseStickCorner = 2;

  void draw() {
    noStroke();
    fill(#CDCDCD, 200);
    rect(0, 0, fieldW, mapHeight);

    // pause button
    int pauseX = (fieldW / 2) - (pauseSizeX / 2);
    int pauseY = (fieldH / 2) - (pauseSizeY / 2) + 20;
    int pauseStickLX = pauseX + (pauseSizeX - (pauseStickSizeX * 2 + pauseStickSpace)) / 2;
    int pauseStickLY = pauseY + (pauseSizeY - pauseStickSizeY) / 2;

    noStroke();
    fill(#777777, 200);
    rect(pauseX, pauseY, pauseSizeX, pauseSizeY, 10);

    noStroke();
    fill(#FFFFFF, 200);
    rect(pauseStickLX, pauseStickLY, pauseStickSizeX, pauseStickSizeY, pauseStickCorner);
    noStroke();
    fill(#FFFFFF, 200);
    rect(pauseStickLX + pauseStickSizeX + pauseStickSpace, pauseStickLY, pauseStickSizeX, pauseStickSizeY, pauseStickCorner);

    // message
    fill(#333333);
    textFont(timeFont, 20);   
    textAlign(CENTER);
    text("Please click here to start it.", width/2, height/3+70);
  }

  void start() {
    noStroke();
    fill(0);
    rect(0, 0, width, height);
    // start triangle
    int pauseX = (width / 2) - (pauseSizeX / 2);
    int pauseY = (height / 2) - (pauseSizeY / 2) + 20;
    int startXa = (width/2) - 18;
    int startXb = (width/2) + 22;
    int startYa = (height/2) - 2;
    int startYb = (height/2) + 42;
    int startYc = (height/2) + 22;

    noStroke();
    fill(#555555);
    rect(pauseX, pauseY, pauseSizeX, pauseSizeY, 10);

    fill(#FFFFFF, 200);
    triangle(startXa, startYa, startXb, startYc, startXa, startYb);
    for (int i=0; i<20; i++) {
      stroke(defColor[rndNextInt(4)],30);
      strokeWeight(rndNextInt(30)*10);
      point(i*50, height/2);
      
      stroke(defColor[rndNextInt(4)], 100);
      strokeWeight(2+rndNextInt(10)*3);
      point(i*50, height/5);
      point(i*50, 4*height/5);
    }
    fill(200);
    textFont(timeFont, 20);
    textAlign(CENTER);
    text("Please click here to start this Crowd4U tracks.", width/2, height/3+70);
  }

  void endAndLoop() {

    // start circle
    int pauseX = (width / 2) - (pauseSizeX / 2);
    int pauseY = (height / 2) - (pauseSizeY / 2) + 20;
    int loopCenterX = (width/2);
    int loopCenterY = (height/2) + 20;

    noStroke();
    fill(#555555);
    rect(pauseX, pauseY, pauseSizeX, pauseSizeY, 10);

    fill(255, 200);
    ellipse(loopCenterX, loopCenterY, 60, 60);
    fill(#555555);
    ellipse(loopCenterX, loopCenterY, 40, 40);
    fill(200);
    textFont(timeFont, 20);
    textAlign(CENTER);
    text("ONCE MORE", width/2, height/3+70);
  }
}

class Place {

  int id;
  String pref;
  float x, y;
  int rad;

  public Place(int id, float x, float y, String pref) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.pref = pref;
  }
}
class Slurper {
  Slurper() {
    String prefs[] = loadStrings("/data/pref_xy.csv");
    places = new Place[totalCount];

    String data[] = loadStrings("/data/dataA2.csv");
    drops = new Drop[100000];

    for (int i = 1; i < prefs.length; i++) {
      places[placeCount] = parsePlace(prefs[i]);
      placeCount++;
    }

    for (int j = 1; j < data.length; j++) {
      drops[dropCount]=parseDrop(data[j]);
      dropCount++;
    }
  }
}

