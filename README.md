# Öffimonitor

Display the Wiener Linien timetable for nearby bus/tram/subway lines on a
screen in the Metalab Hauptraum.

Written in Javascript for use on a Raspberry Pi in a CSS3 capable browser in Kiosk mode.

## Usage

1. Run npm install
2.  Move ```server/settings.example.js``` to ```server/settings.js``` and add your API key and change the listen port and other settings.
3.  Change the walktimes in ```site/settings.js``` according to your needs (you can also choose to use a local JSON file as input here for client side testing)
4.  Run ```node server/httpd.js```
5.  Open Öffimonitor in a browser of your choice.

Happy hacking!

### Station ids (WL RBL Data)

see https://till.mabe.at/rbl/

### Weather forecast

See settings.example.js and add weather and forecast api_urls:
```
weather: 'https://api.openweathermap.org/data/2.5/weather?id=CITY_ID&appid=API_KEY&units=metric',
forecast: 'https://api.openweathermap.org/data/2.5/forecast?id=CITY_ID&appid=API_KEY&units=metric'
```

Parameter    | where to get it
------------ | -------------
**API_KEY**  | register at www.openweathermap.org for a free API key and enter this in settings.js
**CITY_ID**  | Go to www.openweathermap.org and search for your city, you will be redirected to a URL containing the City ID, e.g. https://openweathermap.org/city/2761369 for Vienna, use 2761369 as CITY_ID in your api_urls

**If either of the two URLs is missing, weather forecast will be disabled.**

TODO: Weather forecast is currently styled using a hardcoded css link, if the graphic seems to be not visible check the referenced .css in weather.svg

### Weather icons

icons from https://github.com/erikflowers/weather-icons

they can be combined to a single file using combine.sh

### Theme support

Enter the name of the appropriate folder for the css and assets in the ```server/settings.js``` file. It should be located under ````site/themes```.
Contained in the repository are multiple themes:
- ```metalab```: Design as used by metalab
- ```nook```: Simplified design for use on a nook simple touch eInk Reader, black and white only
- ```porz```: green/yellow theme
- ```fsinf```: fsinf theme

### Debugging

Öffimonitor by default logs HTTP requests but no further  messages while running. It uses https://github.com/visionmedia/debug for logging.
The DEBUG environment variable is used to enable these based on space or comma-delimited names. Here are some examples:
```bash
DEBUG=server:*
DEBUG=*
DEBUG=server:httpd server:api
```

#### Save debug output to a file

You can save all debug statements to a file by piping them.
Example:
```bash
$ DEBUG_FD=3 server/httpd.js 3> debug.log
```

### Start from systemd
(Taken from https://rocketeer.be/articles/deploying-node-js-with-systemd/)

Copy the provided script init-script/oeffimonitor.service to /etc/systemd/system/ **and adjust paths and user in the script**.
Then the Öffimonitor can be started using the systemd:

```bash
# systemctl start oeffimonitor
```

Systemd will monitor the node process and restart the server as appropriate


## Client installation (e.g. on a Raspberry Pi)

```
# install required packages
apt install xserver-xorg-legacy x11-xserver-utils xinit chromium openbox

# copy startup files
cp init-script/xinitrc /home/pi/.xinitrc
cp init-script/oeffimonitor-client.service /etc/systemd/system/oeffimonitor-client.service

# alternatively: surf -F -d -K -p https://oeffi.fsinf.at/news/

# xinit needs access to tty
usermod -aG tty pi
```

/etc/X11/Xwrapper.config needs to be modified:

```
allowed_users=anybody
needs_root_rights=yes
```

### start oeffimonitor-client

```
# reload systemd and enable oeffimonitor-client
systemctl daemon-reload
systemctl enable oeffimonitor-client.service
systemctl start oeffimonitor-client.service
```

to rotate the screen in a raspberry pi see option display\_rotate in /boot/config.txt

# for newer raspios:

create .config/autostart/oeffimonitor.desktop

[Desktop Entry]
Type=Application
Name=Oeffimonitor
Exec=/usr/bin/surf -F -d -K -p https://oeffi.fsinf.at/news/
Terminal=false
