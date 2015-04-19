var activeLight = 0;
var UI = require('ui');
var Vector2 = require('vector2');
var Vibe = require('ui/vibe');
var name = "pebblingforhue";
var apir = new XMLHttpRequest();

var connect_window = new UI.Window({
    fullscreen: true
});

var connecting_window_format = new UI.Rect({
    size: new Vector2(144, 168),
    backgroundColor: 'white'
});

var connecting_text = new UI.Text({
    position: new Vector2(0, 100),
    size: new Vector2(144, 144),
    text: 'CONNECTING...',
    font: 'gothic-18-bold',
    textAlign: 'center',
    color: 'black'
});

var connecting_instructions = new UI.Text({
    position: new Vector2(0, 120),
    size: new Vector2(144, 144),
    text: 'Press link button',
    font: 'gothic-18',
    textAlign: 'center',
    color: 'black'
});

//Creating image
var connecting_image = new UI.Image({
    position: new Vector2(60, 40),
    size: new Vector2(20, 40),
    image: 'images/single-bulb-standby.png'
});

connect_window.add(connecting_window_format);
connect_window.add(connecting_image);
connect_window.add(connecting_text);
connect_window.show();

console.log("CONNECTING WINDOW SHOWN");

// upnp network url URL
var upnpUrl = 'https://www.meethue.com/api/nupnp';

// Make the request
var xhreq = new XMLHttpRequest();
xhreq.open("GET", upnpUrl, false);
xhreq.send();
console.log(xhreq.responseText);
var getIp = xhreq.responseText;
console.log("GOTTEN IP");
//pulling IP from response
var lastIndex = getIp.indexOf('internalipaddress":"') + 20;

var ip = getIp.slice(lastIndex, -3);

//bridge URL constructed
var bUrl = "http://" + ip + "/api/";

//Test for existing user
var userJson;

function reqUserTest() {
    apir.open("GET", bUrl + name, false);
    apir.send();
    userJson = apir.responseText;
}

reqUserTest();

//setting request URL
var reqUrl = bUrl + name + "/";

//loading window

var connected_window_format = new UI.Rect({
    size: new Vector2(144, 168),
    backgroundColor: 'white'
});

var connected_text = new UI.Text({
    position: new Vector2(0, 100),
    size: new Vector2(144, 144),
    text: 'CONNECTED',
    font: 'gothic-18-bold',
    textAlign: 'center',
    color: 'black'
});

var connected_ip = new UI.Text({
    position: new Vector2(0, 120),
    size: new Vector2(144, 144),
    text: ip,
    font: 'gothic-18',
    textAlign: 'center',
    color: 'black'
});

//Creating image
var connected_image = new UI.Image({
    position: new Vector2(60, 40),
    size: new Vector2(20, 40),
    image: 'images/single-bulb-active.png'
});
console.log("Connection in memory");

function createUser() {
    apir.open("POST", bUrl, false);
    apir.send('{"devicetype":"pebble#huefor","username":"pebblingforhue"}');
}

console.log("createUser in mem");

var brightness_window = new UI.Window();

apir.open("GET", reqUrl + 'lights/2', false);
apir.send();

console.log("req sent");

var state_response = apir.responseText;
console.log(state_response);

var firstIndex_brightness = state_response.indexOf(',"bri":') + 7;
console.log(firstIndex_brightness);
var secondIndex_brightness = state_response.indexOf(',"hue":');

console.log("index of complete");

var brightness = state_response.slice(firstIndex_brightness, secondIndex_brightness);
console.log("BRIGHTNESS: " + brightness);
var brightnessInt = parseInt(brightness);
console.log(brightnessInt);

if (brightnessInt%10 !== 0){
    brightnessInt -= brightnessInt%10;
}

//CREATING FORMAT FOR BRIGHTNESS
var brightness_window_format = new UI.Rect({
    size: new Vector2(144, 168),
    backgroundColor: 'white'
});

//Creating image
var up_arrow = new UI.Image({
  position: new Vector2(105, 10),
  size: new Vector2(20, 40),
  image: 'images/ui-arrow-up.png'
});

//ADDING LIVE BRIGHTNESS INFORMATION
var current_brightness = new UI.Text({
    textAlign: 'center',
    position: new Vector2(0, 60),
    size: new Vector2(144, 144),
    text: "Brightness: " + brightnessInt,
    font: 'gothic-24-bold',
    color: 'black'
});

//ADDING NEW BRIGHTNESS INFORMATION
/*
    var new_brightness = new UI.Text({
        textAlign: 'center',
        position: new Vector2(0, 60),
        size: new Vector2(144, 144),
        text: "Brightness: " + brightnessInt,
        font: 'gothic-24-bold',
        color: 'black'
    });
*/

var new_brightness;

//Creating image
var down_arrow = new UI.Image({
  position: new Vector2(105, 100),
  size: new Vector2(20, 40),
  image: 'images/ui-arrow-down.png'
});

brightness_window.add(brightness_window_format);
brightness_window.add(up_arrow);
brightness_window.add(current_brightness);
brightness_window.add(down_arrow);

var power_select = [{
    title: "ON",
}, {
    title: "OFF",
}];
var power = new UI.Menu({
    sections: [{
        title: 'Power',
        items: power_select
    }]
});

var mainMenu = new UI.Menu({
    sections: [{
        title: 'Pebbling for Hue',
        items: [{
            title: "Power",
          icon: 'images/power_icon.png'
        }, {
            title: "Colour",
          icon: 'images/colour_icon.png'
        }, {
            title: "Brightness",
          icon: 'images/brightness_icon.png'
        }, {
            title: "Presets",
          icon: 'images/presets_icon.png'
        }]
    }]
});


var colour_select = [{
    title: "Red",
}, {
    title: "Orange",
}, {
    title: "Yellow",
}, {
    title: "Green",
}, {
    title: "Blue",
}, {
    title: "Lime",
}, {
    title: "Pink",
}];

var preset_select = [{
    title: "Reading",
}, {
    title: "Relax",
}, {
    title: "Concentrate",
}, {
    title: "Energize",
}];

var colour = new UI.Menu({
    sections: [{
        title: 'Colour',
        items: colour_select
    }]
});

var presetMenu = new UI.Menu({
    sections: [{
        title: 'Presets',
        items: preset_select
    }]
});

function increase_brightness() {
    if(brightnessInt <= 244){ 
        brightnessInt += 10;
    }
    else{
        console.log("too high");
    }
    console.log("BRIGHTNESS:" + brightnessInt);
    apir.open("PUT", reqUrl + 'lights/' + activeLight + '/state', false);
    apir.send('{"on":true,"sat":254,"bri":' + brightnessInt + '}');
    
    //ADDING NEW BRIGHTNESS INFORMATION
    new_brightness = new UI.Text({
        textAlign: 'center',
        position: new Vector2(0, 60),
        size: new Vector2(144, 144),
        text: "Brightness: " + brightnessInt,
        font: 'gothic-24-bold',
        color: 'black'
    });
    brightness_window.add(new_brightness);
    brightness_window.show();
}

function decrease_brightness() {
    if (brightnessInt >= 11){
        brightnessInt -= 10;}
    else{
        console.log("TOO LOW");
    }
    console.log("BRIGHTNESS:" + brightnessInt);
    apir.open("PUT", reqUrl + 'lights/' + activeLight + '/state', false);
    apir.send('{"on":true,"sat":254,"bri":' + brightnessInt + '}');
  
    //ADDING NEW BRIGHTNESS INFORMATION
    new_brightness = new UI.Text({
        textAlign: 'center',
        position: new Vector2(0, 60),
        size: new Vector2(144, 144),
        text: "Brightness: " + brightnessInt,
        font: 'gothic-24-bold',
        color: 'black'
    });
  
    brightness_window.add(new_brightness);
    brightness_window.show();

}

function changeBrightness(){
        
    brightness_window.show();
  
    //increase brightness
    brightness_window.on('click', 'up', function (e) {
        brightness_window.remove(current_brightness);
        brightness_window.remove(new_brightness);
        increase_brightness();
    });

    //decrease brightness
    brightness_window.on('click', 'down', function (e) {
        brightness_window.remove(current_brightness);
        brightness_window.remove(new_brightness);
        decrease_brightness();
    });
}

var lightAmount = 0;
var lightID = 1;

console.log("ADDED UI IN MEMORY");
connect_window.add(connecting_instructions);
connect_window.show();
console.log("READY FOR LINK");

function userConnection() {
    if (userJson.indexOf("error") === 3) { //no user
        setTimeout(userConnection, 2500);
        createUser();
        reqUserTest();
        console.log("NO USER");
    } else {
        console.log("CONNECTED");
        Vibe.vibrate('short');
        connect_window.remove(connecting_window_format);
        connect_window.remove(connecting_image);
        connect_window.remove(connecting_text);
        connect_window.add(connected_window_format);
        connect_window.add(connected_image);
        connect_window.add(connected_text);
        connect_window.add(connected_ip);
        connect_window.show();
        setTimeout(function () {
            mainMenu.show();
            setTimeout(connect_window.hide(), 1000);
        }, 1500);
        console.log("SHOWING MAIN MENU MAYBE");
    }
}
userConnection();

console.log("main menu SHOULD BE DISPLAYING");


function getLights(){
    apir.open("GET", reqUrl + "lights/" + lightID, false);
    apir.send();
    var returned = apir.responseText;
    console.log(returned);
    if (returned.indexOf("error") === 3) {
        console.log("NO LIGHT");
    }
    else {
        console.log("NO ERROR");
        var startIndex = returned.indexOf('reachable":') + 11;
        var endIndex = returned.indexOf('}, "type"');
        console.log(returned.slice(startIndex, endIndex));
        if(returned.slice(startIndex, endIndex) === "false"){
            console.log("NOT REACHABLE");
        }
        else{
            console.log("LIGHT");
            lightAmount++;
            lightID++;
            getLights();
        }
    } 
}
getLights();
console.log("GOTTEN AMOUNT OF LIGHTS:" + lightAmount);

var lightMenuItems = [];
    

var lightMenu = new UI.Menu({
    sections: [{
        title: 'Lights Connected',
        items: lightMenuItems
    }]
});

for(var currentLightId = 1; currentLightId <= lightAmount; currentLightId++){
  lightMenuItems.push({title: currentLightId.toString(), icon:'images/light_icon.png'});
}

var hue_code_reference = [];



mainMenu.on("select", function (event) {
    console.log("checking colour click");
    if (event.item.title === "Colour") {
        lightMenu.show();
        lightMenu.on("select", function(lightColourEvent){
            activeLight = lightColourEvent.item.title;
            colour.show();
            colour.on('select', function (colourEvent) {
                hue_code_reference["Red"] = "65280";
                hue_code_reference["Orange"] = "5500";
                hue_code_reference["Yellow"] = "15750";
                hue_code_reference["Green"] = "25500";
                hue_code_reference["Blue"] = "46920";
                hue_code_reference["Lime"] = "36210";
                hue_code_reference["Pink"] = "56100";
                var colour_selected = colourEvent.item.title;
                var hue_code = hue_code_reference[colour_selected];
                apir.open("PUT", reqUrl + 'lights/' + activeLight + '/state', false);
                apir.send('{"on":true,"hue":' + hue_code + '}');
                console.log(apir.responseText);
                

            });
            colour.on("hide", function(){
              colour.hide();
            });
          
        });
    }
    else if(event.item.title === "Power") {
        console.log("Checking power click");
        
        lightMenu.show();
        lightMenu.on("select", function(lightPowerEvent){
            activeLight = lightPowerEvent.item.title;
            power.show();
            power.on('select', function (powerEvent) {
    
                var power_item = powerEvent.item.title;
                if (power_item === "ON") {
                    apir.open("PUT", reqUrl + 'lights/' + activeLight + '/state');
                    apir.send('{"on":true}');
                    console.log(apir.responseText);
                } else {
                    apir.open("PUT", reqUrl + 'lights/' + activeLight + '/state');
                    apir.send('{"on":false}');
                    console.log(apir.responseText);
                }
               
            });
          power.on("hide", function(){
            power.hide();
          });
        });
    } 
    else if (event.item.title === "Brightness") {
        console.log("checking brightness click");
        lightMenu.show();
        lightMenu.on("select", function(brightnessEvent){
            activeLight = brightnessEvent.item.title;
            changeBrightness();        
        });
    }
    
    else if (event.item.title === "Presets") {
        console.log("Presets menu entered");
        lightMenu.show();
        lightMenu.on("select", function(lightPresetsEvent){
            activeLight = lightPresetsEvent.item.title;
            presetMenu.show();
            presetMenu.on('select', function (preset_select) {
                hue_code_reference["Reading"] = "13088";
                hue_code_reference["Relax"] = "15329";
                hue_code_reference["Concentrate"] = "33849";
                hue_code_reference["Energize"] = "34495";
                var preset_selected = preset_select.item.title;
                var preset_hue_code = hue_code_reference[preset_selected];
                apir.open("PUT", reqUrl + 'lights/' + activeLight + '/state', false);
                apir.send('{"on":true,"hue":' + preset_hue_code + '}');
                console.log(apir.responseText);
                
            });
          presetMenu.on("hide", function(){
            presetMenu.hide();
          });
        });
    }
});
